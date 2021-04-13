import { DownexcelService } from '@service/downexcel.service';
import { FactInterface } from './../../../../service/mrr-sdk/models/Fact';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PicturereportService } from './picturereport.service';
import { Component, OnInit } from '@angular/core';
import { Utils } from 'app/dfq/utils';
import { forkJoin, of, Subject } from 'rxjs';
import { FileService } from '@service/file.service';
import { ModelResultInterface } from '@service/mrr-sdk';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SigningService } from '../../signing/signing.service';
import { MailInterface } from '@service/dfi-sdk';
import { PictureanalyseService } from '../pictureanalyse/pictureanalyse.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pictureanalysereport',
  templateUrl: './pictureanalysereport.component.html',
  styleUrls: ['./pictureanalysereport.component.scss']
})
export class PictureanalysereportComponent implements OnInit {

  // modal
  isVisibleDetails = false;
  isVisibleSignItems = false;
  itemDetailsData = [];
  signItems = [];

  typeShow = true;
  queryShow = false;
  showTable = false;
  afterSave = false;
  afterSubmit = false;

  dataSet = [];

  category = [];
  categorys = ['New', 'Unique', 'Difficult', 'Different'];
  owner = [];
  isVisiblePic = false;
  imageUrl: string;

  modelResultId: any;

  ifShow: boolean;
  factDatas = [];

  isSaveVisible = false;
  isSubmitVisible = false;

  green = [];
  yellow = [];
  red = [];
  modelResultStatus: any;
  projectName: any;
  url: any;
  rdMail: any;
  rdUserId: any;
  sqmUserId: any;
  site: any;
  flowFormMappingId: any;
  product: any;
  projectCode: any;
  plant;
  reportShow = true;
  customer: any;
  factGro: Array<any> = [];
  loading = false;
  transNotice = {};
  constructor(
    private pictureReportService: PicturereportService,
    private fileService: FileService,
    private downExcelService: DownexcelService,
    private modalService: NzModalService,
    private signingService: SigningService,
    private message: NzMessageService,
    private pictureAnalyseService: PictureanalyseService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.nudd-notSign', 'mrr.nudd-notRFQ']).subscribe(res => {
      this.transNotice['notSign'] = res['mrr.nudd-notSign'];
      this.transNotice['notRFQ'] = res['mrr.nudd-notRFQ'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.nudd-notSign', 'mrr.nudd-notRFQ']).subscribe(res => {
        this.transNotice['notSign'] = res['mrr.nudd-notSign'];
        this.transNotice['notRFQ'] = res['mrr.nudd-notRFQ'];
      });
    });
    if (location.pathname.includes('report/pictureanalysereport')) {
      this.reportShow = false;
    }
  }

  downloadLL(fileName) {
    this.fileService.downloadMRRFile('lessonlearned', fileName);
  }

  showDetails(designItemName, part, dimension) {
    this.itemDetailsData = this.factDatas.filter(res => res['designItemName'] === designItemName && res['partName'] === part && res['dimensionName'] === dimension);
    this.isVisibleDetails = true;
  }

  isVisible(data) {
    this.isVisibleDetails = data;
  }

  signData(data) {
    this.signItems = data;
    this.isVisibleSignItems = true;
  }

  isSign(data) {
    this.isVisibleSignItems = data;
  }

  pCode(event) {
    this.projectCode = event;
  }

  async menu(event) {
    // 判斷是否是rfq機種
    if (event[6] === undefined) {
      this.customer = event[7];
      this.plant = event[8];
    } else {
      this.customer = event[8];
      this.plant = event[9];
    }
    this.afterSubmit = false;
    // projectname, 產品別, Site, modelResultId, url, RDID, rfqProjectId
    this.product = event[1];
    this.projectName = event[0];
    this.url = event[4];
    this.rdUserId = event[5];
    this.site = event[2];
    this.loading = true;
    this.showTable = false;
    const result = await this.pictureReportService.getWorkflowFormMappingId(`${this.plant}_${this.customer}_${this.product}`).toPromise().then(res => {
      this.flowFormMappingId = res[0]['id'];
    }).catch(err => {
      this.loading = false;
      this.message.create('error', this.transNotice['notSign']);
      return err;
    });
    if (result) { return; }
    // "model", "product", "site"
    if (event[0] && event[1] && event[2]) {
      this.dataSet.length = 0;
      this.pictureReportService.getFact(event[2], event[0]).subscribe(res => {
        this.factDatas = res[0]['modelResults'][0]['facts'];
        this.modelResultId = res[0]['modelResults'][0].id;
        this.modelResultStatus = res[0]['modelResults'][0].status;
        // RFQ机种 要先完成3D 再完成2D
        if (event[6] !== undefined) {
          this.pictureReportService.getFact(event[2], event[7]).subscribe(async reso => {
            let has3D = false;
            if (reso[0]['modelResults'][0]['facts'].length > 0) {
              // 检查是否有3D
              for (let index = 0; index < res[0]['modelResults'][0]['facts'].length; index++) {
                const element = res[0]['modelResults'][0]['facts'][index];
                if (element.dimensionName === '3D') {
                  has3D = true;
                }
              }
              // 添加BA前机种FACT?料
              for (let d = 0; d < reso[0]['modelResults'][0]['facts'].filter(item => item.dimensionName === '3D').length; d++) {
                if (!has3D) {
                  reso[0]['modelResults'][0]['facts'][d].id = null;
                  reso[0]['modelResults'][0]['facts'][d].modelResultId = this.modelResultId;
                  delete reso[0]['modelResults'][0]['facts'][d]['workflow'];
                  delete reso[0]['modelResults'][0]['facts'][d]['id'];
                  const facts: FactInterface = reso[0]['modelResults'][0]['facts'][d];
                  await this.pictureAnalyseService.upsertFact(facts).toPromise().then(
                    async ree => {
                      if (facts.factRisks.length > 0) {
                        for (let index = 0; index < facts.factRisks.length; index++) {
                          const element = facts.factRisks[index];
                          delete element['id'];
                          await this.pictureAnalyseService.upsertFactRisk(element).toPromise();
                        }
                      }
                    }
                  );
                }
                if (d === reso[0]['modelResults'][0]['facts'].length - 1) {
                  const siteModel = await this.pictureReportService.getFact(event[2], event[0]).toPromise();
                  // 报表区分显示fact内容
                  if (this.reportShow) {
                    this.factGro = siteModel[0]['modelResults'][0]['facts'].filter(item => item.dimensionName === '2D');
                  } else {
                    this.factGro = siteModel[0]['modelResults'][0]['facts'];
                  }
                  const dimensionGroup = Utils.groupBy(this.factGro, 'dimensionName');
                  for (const partGroup in dimensionGroup) {
                    if (partGroup === '2D') {
                      const partGroup2D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                      for (const part in partGroup2D) {
                        if (part) {
                          const itemGroup2D = Utils.groupBy(partGroup2D[part], 'designItemName');
                          for (const item in itemGroup2D) {
                            if (item) {
                              const highLevel = itemGroup2D[item];
                              let max = [];
                              max = this.getHighLevel(highLevel, max);
                              max['modelResult'] = res[0]['modelResults'][0].status;
                              this.dataSet.push(max);
                            }
                          }
                        }
                      }
                    } else {
                      const partGroup3D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                      for (const part in partGroup3D) {
                        if (part) {
                          const itemGroup3D = Utils.groupBy(partGroup3D[part], 'designItemName');
                          for (const item in itemGroup3D) {
                            if (item) {
                              const highLevel = itemGroup3D[item];
                              let max = [];
                              max = this.getHighLevel(highLevel, max);
                              max['modelResult'] = res[0]['modelResults'][0].status;
                              this.dataSet.push(max);
                            }
                          }
                        }
                      }
                    }
                  }
                  for (let index = 0; index < this.dataSet.length; index++) {
                    if (this.dataSet[index].factRisks.length !== 0) {
                      for (let j = 0; j < this.dataSet[index].factRisks.length; j++) {
                        if (this.dataSet[index].factRisks[j].name === '技術風險') {
                          this.dataSet[index].first = this.dataSet[index].factRisks[j].level;
                        } else if (this.dataSet[index].factRisks[j].name === '規格是否可以完成') {
                          this.dataSet[index].second = this.dataSet[index].factRisks[j].level;
                        } else if (this.dataSet[index].factRisks[j].name === '流程風險') {
                          this.dataSet[index].third = this.dataSet[index].factRisks[j].level;
                        } else if (this.dataSet[index].factRisks[j].name === '供應鏈') {
                          this.dataSet[index].fourth = this.dataSet[index].factRisks[j].level;
                        }
                      }
                    } else {
                      this.dataSet[index].first = this.dataSet[index].riskLevel / 4;
                      this.dataSet[index].second = this.dataSet[index].riskLevel / 4;
                      this.dataSet[index].third = this.dataSet[index].riskLevel / 4;
                      this.dataSet[index].fourth = this.dataSet[index].riskLevel / 4;
                    }
                  }
                  this.getLesson();
                }
              }
            } else if (event[10]) {
              // 存在nuddRfqIgnore 表裡的產品不檢查3D
              if (res.length !== 0) {
                const fact = res[0]['modelResults'][0]['facts'];
                const dimensionGroup = Utils.groupBy(fact, 'dimensionName');
                for (const partGroup in dimensionGroup) {
                  if (partGroup === '2D') {
                    const partGroup2D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                    for (const part in partGroup2D) {
                      if (part) {
                        const itemGroup2D = Utils.groupBy(partGroup2D[part], 'designItemName');
                        for (const item in itemGroup2D) {
                          if (item) {
                            const highLevel = itemGroup2D[item];
                            let max = [];
                            max = this.getHighLevel(highLevel, max);
                            max['modelResult'] = res[0]['modelResults'][0].status;
                            this.dataSet.push(max);
                          }
                        }
                      }
                    }
                  } else {
                    const partGroup3D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                    for (const part in partGroup3D) {
                      if (part) {
                        const itemGroup3D = Utils.groupBy(partGroup3D[part], 'designItemName');
                        for (const item in itemGroup3D) {
                          if (item) {
                            const highLevel = itemGroup3D[item];
                            let max = [];
                            max = this.getHighLevel(highLevel, max);
                            max['modelResult'] = res[0]['modelResults'][0].status;
                            this.dataSet.push(max);
                          }
                        }
                      }
                    }
                  }
                }
                for (let index = 0; index < this.dataSet.length; index++) {
                  if (this.dataSet[index].factRisks.length !== 0) {
                    for (let j = 0; j < this.dataSet[index].factRisks.length; j++) {
                      if (this.dataSet[index].factRisks[j].name === '技術風險') {
                        this.dataSet[index].first = this.dataSet[index].factRisks[j].level;
                      } else if (this.dataSet[index].factRisks[j].name === '規格是否可以完成') {
                        this.dataSet[index].second = this.dataSet[index].factRisks[j].level;
                      } else if (this.dataSet[index].factRisks[j].name === '流程風險') {
                        this.dataSet[index].third = this.dataSet[index].factRisks[j].level;
                      } else if (this.dataSet[index].factRisks[j].name === '供應鏈') {
                        this.dataSet[index].fourth = this.dataSet[index].factRisks[j].level;
                      }
                    }
                  } else {
                    this.dataSet[index].first = this.dataSet[index].riskLevel / 4;
                    this.dataSet[index].second = this.dataSet[index].riskLevel / 4;
                    this.dataSet[index].third = this.dataSet[index].riskLevel / 4;
                    this.dataSet[index].fourth = this.dataSet[index].riskLevel / 4;
                  }
                }
                this.getLesson();
              }
            } else {
              this.loading = false;
              this.message.create('error', this.transNotice['notRFQ']);
              return;
            }
          });
        } else {
          // BA机种
          if (res.length !== 0) {
            const fact = res[0]['modelResults'][0]['facts'];
            const dimensionGroup = Utils.groupBy(fact, 'dimensionName');
            for (const partGroup in dimensionGroup) {
              if (partGroup === '2D') {
                const partGroup2D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                for (const part in partGroup2D) {
                  if (part) {
                    const itemGroup2D = Utils.groupBy(partGroup2D[part], 'designItemName');
                    for (const item in itemGroup2D) {
                      if (item) {
                        const highLevel = itemGroup2D[item];
                        let max = [];
                        max = this.getHighLevel(highLevel, max);
                        max['modelResult'] = res[0]['modelResults'][0].status;
                        this.dataSet.push(max);
                      }
                    }
                  }
                }
              } else {
                const partGroup3D = Utils.groupBy(dimensionGroup[partGroup], 'partName');
                for (const part in partGroup3D) {
                  if (part) {
                    const itemGroup3D = Utils.groupBy(partGroup3D[part], 'designItemName');
                    for (const item in itemGroup3D) {
                      if (item) {
                        const highLevel = itemGroup3D[item];
                        let max = [];
                        max = this.getHighLevel(highLevel, max);
                        max['modelResult'] = res[0]['modelResults'][0].status;
                        this.dataSet.push(max);
                      }
                    }
                  }
                }
              }
            }
            for (let index = 0; index < this.dataSet.length; index++) {
              if (this.dataSet[index].factRisks.length !== 0) {
                for (let j = 0; j < this.dataSet[index].factRisks.length; j++) {
                  if (this.dataSet[index].factRisks[j].name === '技術風險') {
                    this.dataSet[index].first = this.dataSet[index].factRisks[j].level;
                  } else if (this.dataSet[index].factRisks[j].name === '規格是否可以完成') {
                    this.dataSet[index].second = this.dataSet[index].factRisks[j].level;
                  } else if (this.dataSet[index].factRisks[j].name === '流程風險') {
                    this.dataSet[index].third = this.dataSet[index].factRisks[j].level;
                  } else if (this.dataSet[index].factRisks[j].name === '供應鏈') {
                    this.dataSet[index].fourth = this.dataSet[index].factRisks[j].level;
                  }
                }
              } else {
                this.dataSet[index].first = this.dataSet[index].riskLevel / 4;
                this.dataSet[index].second = this.dataSet[index].riskLevel / 4;
                this.dataSet[index].third = this.dataSet[index].riskLevel / 4;
                this.dataSet[index].fourth = this.dataSet[index].riskLevel / 4;
              }
            }
            this.getLesson();
          }
        }

        // 取rdMail
        this.pictureReportService.getNuddUsers(`${this.plant}_${this.customer}_${this.product}`, 'NUDD001').subscribe(resd => {
          if (resd[0]['workflowFormMappings'][0]['workflowSignatories'].filter(reso => reso.stageDesc === 'RD').length !== 0) {
            this.rdUserId = resd[0]['workflowFormMappings'][0]['workflowSignatories'].find(reso => reso.stageDesc === 'RD').picId;
            this.pictureAnalyseService.findUserById(this.rdUserId).subscribe(reso => {
              this.rdMail = reso['email'];
            });
          } else {
            this.pictureAnalyseService.findUserById(this.rdUserId).subscribe(reso => {
              this.rdMail = reso['email'];
            });
          }
          // 獲取sqm工號
          this.sqmUserId = resd[0]['workflowFormMappings'][0]['workflowSignatories'].find(reso => reso.stageDesc === 'SQM').picId;
        });
      });
    }
  }

  getLesson() {
    this.green.length = 0;
    this.yellow.length = 0;
    this.red.length = 0;
    const dataSetArray = [];
    if (this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20).length !== 0) {
      for (let index = 0; index < this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20).length; index++) {
        if (this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20)[index].designItemName && this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20)[index].processType !== 'Other') {
          const itemCode = this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20)[index].designItemName.substr(-5, 4);
          const obsFact = this.pictureReportService.getLessonLearned(itemCode).pipe(
            switchMap(
              (res => {
                this.dataSet.filter(reso => reso.riskLevel >= 16 && reso.riskLevel <= 20)[index].lessonLearned = res;
                return of(this.dataSet.filter(reso => reso.riskLevel >= 16 && reso.riskLevel <= 20)[index]);
              }
              )
            ));
          dataSetArray.push(obsFact);
        } else {
          dataSetArray.push(of('other'));
        }
      }
      forkJoin(dataSetArray).subscribe(
        () => {
          this.green = this.dataSet.filter(res => res.riskLevel >= 4 && res.riskLevel <= 11);
          this.yellow = this.dataSet.filter(res => res.riskLevel >= 12 && res.riskLevel <= 15);
          this.red = this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20);
          this.dataSet = this.red.concat(this.yellow).concat(this.green);
          this.dataSet = this.dataSet.slice();
          this.loading = false;
          this.showTable = true;
        }
      );
    } else {
      this.green = this.dataSet.filter(res => res.riskLevel >= 4 && res.riskLevel <= 11);
      this.yellow = this.dataSet.filter(res => res.riskLevel >= 12 && res.riskLevel <= 15);
      this.red = this.dataSet.filter(res => res.riskLevel >= 16 && res.riskLevel <= 20);
      this.dataSet = this.red.concat(this.yellow).concat(this.green);
      this.dataSet = this.dataSet.slice();
      this.loading = false;
      this.showTable = true;
    }
  }

  private getHighLevel(highLevel: any, max: any[]) {
    if (highLevel.length === 1) {
      max = highLevel[0];
    } else {
      let mx = highLevel[0].riskLevel;
      max = highLevel[0];
      for (let i = 0; i < highLevel.length; i++) {
        if (mx < highLevel[i].riskLevel) {
          mx = highLevel[i].riskLevel;
          max = highLevel[i];
        }
      }
    }
    return max;
  }

  download() {
    const table = document.getElementById('allReport');
    this.downExcelService.exportTableAsExcelFile(table, 'report');
  }

  save() {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.afterSave = true;
        for (const cate in this.category) {
          if (cate) {
            const factCategory: FactInterface = {
              category: this.category[cate]
            };
            this.pictureReportService.updateFact(cate, factCategory).subscribe();
          }
        }
        for (const own in this.owner) {
          if (own) {
            const factOwner: FactInterface = {
              owner: this.owner[own]
            };
            this.pictureReportService.updateFact(own, factOwner).subscribe();
          }
        }
        this.isSaveVisible = true;
        setTimeout(() => {
          this.isSaveVisible = false;
        }, 3000);
      }
    });
  }

  submit() {
    this.modalService.confirm({
      nzTitle: '<i>Submit Alert</i>',
      nzContent: '<b>Do you Want to Submit?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.afterSubmit = true;
        const modelResult: ModelResultInterface = {
          status: '1'
        };
        if (this.dataSet.filter(dat => dat.riskLevel >= 16 && dat.riskLevel <= 20 && dat.workflowId === null).length !== 0) {
          this.dataSet.filter(dat => dat.riskLevel >= 16 && dat.riskLevel <= 20 && dat.workflowId === null).forEach((data, idx) => {
            // 添加WorkFlow
            this.pictureReportService.addWorkFlow({
              remark: this.projectCode,
              desc: data.designItemName,
              current: 0,
              status: '0',
              factId: data.id,
              workflowFormMappingId: this.flowFormMappingId,
              routingParameter: `?site=${this.site}&plant=${this.plant}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`
            }).subscribe(
              res => {
                // 修改FactWorkFlow id
                this.pictureReportService.upsertFactWorkFlowId({
                  id: data.id,
                  workflowId: res.id
                }).subscribe();
                // 添加WorkFlowSign RD
                this.pictureReportService.addWorkFlowSign({
                  userId: this.rdUserId,
                  role: 'RD',
                  previousWorkflowSignId: null,
                  nextWorkflowSignId: null,
                  workflowId: res.id
                }).subscribe(
                  RDRes => {
                    // 修改WorkFlow current 綁定 RD.ID
                    this.pictureReportService.upsertWorkFlow(res.id, { 'current': RDRes.id }).subscribe();
                    // 添加GSQM WorkFlowSign
                    this.pictureReportService.addWorkFlowSign({
                      userId: this.sqmUserId,
                      role: 'SQM',
                      previousWorkflowSignId: RDRes.id,
                      nextWorkflowSignId: null,
                      workflowId: res.id
                    }).subscribe(
                      SQMRes => {
                        // 添加RD WorkFlowSign nextWorkflowSignId 為 SQMRes
                        this.pictureReportService.upsertWorkFlowSign(RDRes.id, {
                          userId: this.rdUserId,
                          role: 'RD',
                          previousWorkflowSignId: null,
                          nextWorkflowSignId: SQMRes.id,
                          workflowId: res.id
                        }).subscribe(
                          RES => {
                            if (idx === this.dataSet.filter(dat => dat.riskLevel >= 16 && dat.riskLevel <= 20 && dat.workflowId === null).length - 1) {
                              this.pictureReportService.updateModelResult(this.modelResultId, modelResult).subscribe(R => {
                                const mail: MailInterface = {
                                  subject: '[' + this.projectName + ']' + 'Nudd notification',
                                  content: '[' + this.projectName + ']NUDD need you judge(risk item),please review it.<br>Link <a href="' + this.url + '">MRR NUDD system</a> for detail information(需使用Google Chrome登陸)',
                                  sender: 'dfi@wistron.com',
                                  receiver: this.rdMail
                                };
                                this.signingService.createMail(mail).subscribe(reso => {
                                  this.modelResultStatus = '1';
                                  this.isSubmitVisible = true;
                                  setTimeout(() => {
                                    this.isSubmitVisible = false;
                                  }, 3000);
                                });
                              });
                            }
                          }
                        );
                      });
                  });
              });
          });
        } else {
          this.pictureReportService.updateModelResult(this.modelResultId, { status: '2' }).subscribe(R => {
            this.modelResultStatus = '1';
            this.isSubmitVisible = true;
            setTimeout(() => {
              this.isSubmitVisible = false;
            }, 3000);
          });
        }
      }
    });
  }

  handleCancel() {
    this.isVisiblePic = false;
  }

  clickEventHandler(data) {
    this.imageUrl = data;
    this.isVisiblePic = true;
  }
}
