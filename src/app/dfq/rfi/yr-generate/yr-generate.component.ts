import { map } from 'rxjs/operators';
import { YrGenerateService } from './yr-generate.service';
import { DownexcelService } from '@service/downexcel.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YrQueryService } from './query-form/yr-query.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { WorkflowApi } from '@service/dfc_sdk/sdk';
import { BaseDataSigningService } from '../signing/base-data-signing/base-data-signing.service';
import { MailInterface, WorkflowSignApi } from '@service/dfi-sdk';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { PercentPipe } from 'app/shared/percent.pipe';
import { ModelMaterialApi } from '@service/dfq_sdk/sdk';
import { MemberApi } from '@service/dfc_sdk/sdk/services/custom/Member';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-yr-generate',
  templateUrl: './yr-generate.component.html',
  styleUrls: ['./yr-generate.component.scss']
})
export class YrGenerateComponent implements OnInit {

  showAll = false;

  blankModalShow = false;
  changeCompareShow = false;
  motherboardDetailShow = false;
  yrCompareShow = false;
  motherboardAddShow = false;

  tableShow = false;
  pageSize = 10;

  targetYrOptions;

  // editCache: { [key: string]: any } = {};
  editCache = {
    edit: Boolean,
    data: {}
  };
  plants: any;
  bus: any;
  // 产品别
  modelTypes: any;
  modelMaterials = [];
  status = [{ label: 'Close', value: 2 },
  { label: 'Ongoing', value: 1 },
  { label: 'Open', value: 0 }];
  designYield: number;
  changeYield: number;
  bestTotalYield: number;
  plant: any;
  customer: any;
  product: any;
  materialDetails: any;
  yrCompareMaterialId: any;
  similarModel: any;
  projectName: any;
  materialName: any;
  changeCompareMaterialId: any;
  blankModalMaterialId: any;
  blankmaterialDetails: any;
  blankModalMaterialName: any;
  plantMatch: any;
  userId: string;
  dfcData = [];
  finish = false;
  mbId: any;
  hasMb: boolean;
  projectCode: any;
  mbMaterialId: any;
  allClose = false;
  sendLoading = false;
  sendEnable = true;
  enableProduce: boolean;
  showData: any[];
  chartLoading = false;
  downing = false;
  mbYrEditId: any;
  mbDiscussionId: any;
  showEdit = true;
  current: any;
  id: any;
  picId;
  picEmail;
  changePicName;
  picData;
  param;
  deleteShow: Boolean = true;
  subscribeScoll: any;
  // table sort param
  sortName: string | null = null;
  sortValue: string | null = null;
  filterMaterial = [];
  filterDueday = [];
  filterPic = [];
  searchPic: string[] = [];
  searchDueday: string[] = [];
  searchMaterial: string[] = [];
  showSelect = false;
  searchValue: any;
  closeSearch = false;
  // i18n
  trans: Object = {};
  destroy$ = new Subject();

  constructor(
    private memberService: MemberApi,
    private meetingReviewTestService: MeetingReviewTestService,
    private downExcelService: DownexcelService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private yrGenerateService: YrGenerateService,
    private yrQueryService: YrQueryService,
    private dfcWorkflowService: WorkflowApi,
    private message: NzMessageService,
    private baseDataSigningService: BaseDataSigningService,
    private workflowService: WorkflowApi,
    private workflowSignService: WorkflowSignApi,
    private router: ActivatedRoute,
    private modelMaterialService: ModelMaterialApi,
    private ref: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService,
  ) {
    this.plants = this.route.snapshot.data['plantsResolver'];
    this.bus = this.route.snapshot.data['busResolver'];
    this.modelTypes = this.route.snapshot.data['productsResolver'];
  }

  ngOnInit() {
    this.userId = localStorage.getItem('$DFI$userID');
    // 初始化I18N;
    this.translate.get(['dfq.no-match', 'dfq.unmaintained-yield', 'dfq.rfi-analysis-chart', 'dfq.rfi-rd-design-yield', 'dfq.rfi-system-push-yield', 'dfq.rfi-best-yield-combination']).subscribe(res => {
      this.trans['noMatch'] = res['dfq.no-match'];
      this.trans['unmaintainedYield'] = res['dfq.unmaintained-yield'];
      this.trans['analysisChart'] = res['dfq.rfi-analysis-chart'];
      this.trans['designYield'] = res['dfq.rfi-rd-design-yield'];
      this.trans['pushYield'] = res['dfq.rfi-system-push-yield'];
      this.trans['bestYield'] = res['dfq.rfi-best-yield-combination'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.no-match', 'dfq.unmaintained-yield', 'dfq.rfi-analysis-chart', 'dfq.rfi-rd-design-yield', 'dfq.rfi-system-push-yield', 'dfq.rfi-best-yield-combination']).subscribe(res => {
        this.trans['noMatch'] = res['dfq.no-match'];
        this.trans['unmaintainedYield'] = res['dfq.unmaintained-yield'];
        this.trans['analysisChart'] = res['dfq.rfi-analysis-chart'];
        this.trans['designYield'] = res['dfq.rfi-rd-design-yield'];
        this.trans['pushYield'] = res['dfq.rfi-system-push-yield'];
        this.trans['bestYield'] = res['dfq.rfi-best-yield-combination'];
      });
    });
    this.router.queryParams.subscribe(param => {
      this.param = param;
      if (param['model'] && param['sitePlantName'] && param['bu'] && param['product']) {
        this.plants = param['sitePlantName'];
        this.bus = param['bu'];
        this.modelTypes = param['product'];
        this.projectName = param['model'];
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['sitePlant'] && params['projectName']) {
        this.plant = params['sitePlant'];
        this.product = params['product'];
        this.projectName = params['projectName'];
        this.projectCode = params['projectCode'];
        this.queryFrom({});
      }
    });
  }

  searMaterial() {
    if (this.closeSearch) {
      return;
    }
    this.showSelect = true;
  }

  tableSort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter(searchMaterial: string[], searchPic: string[], searchDueday: string[]): void {
    this.searchMaterial = searchMaterial;
    this.searchPic = searchPic;
    this.searchDueday = searchDueday;
    this.search();
  }

  reset(): void {
    this.searchValue = '';
    this.showSelect = false;
    this.closeSearch = true;
    setTimeout(() => {
      this.closeSearch = false;
    }, 1000);
    this.search();
  }

  search(): void {
    /** filter data **/
    const data = this.modelMaterials.filter(item => this.searchDueday && this.searchDueday.length ? this.searchDueday.includes(item.duedate) : true).
      filter(item => this.searchMaterial && this.searchMaterial.length ? this.searchMaterial.includes(item.materialName) : true).
      filter(item => this.searchPic && this.searchPic.length ? this.searchPic.includes(item.pic) : true).filter(item => this.searchValue ? item.materialName === this.searchValue : true);
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.showData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] !== null ? (b[this.sortName] !== null ? (a[this.sortName] > b[this.sortName]
            ? 1
            : -1) : 1) : -1
          : b[this.sortName] !== null ? (a[this.sortName] !== null ? (b[this.sortName] > a[this.sortName]
            ? 1
            : -1) : 1) : -1
      );
      this.showData = this.showData.slice();
    } else {
      this.showData = data;
      this.showData = this.showData.slice();
    }
  }

  select(userData) {
    // 未選擇pic時，回傳的都是數組類型；選擇了指定的pic，回傳的是json
    if (!userData.length) {
      this.changePicName = userData['Name'];
      this.picId = userData['EmpID'];
      this.picEmail = userData['Email'];
    } else {
      this.changePicName = userData[0]['Name'];
      this.picId = userData[0]['EmpID'];
      this.picEmail = userData[0]['Email'];
    }
  }

  sendSign() {
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { },
      nzOnOk: async () => {
        this.yrGenerateService.getFlowStatusByDes('RFI良率生成:' + this.projectName).subscribe(reed => {
          if (reed.length !== 0 && reed.find(item => item['status'] == 0)) {
            this.message.create('warning', '正在簽核中! It is being signed off!');
            return;
          }
          let finish = true;
          this.yrGenerateService.getModelMaterial(this.projectName, this.plant).subscribe(async res => {
            for (let m = 0; m < res.length; m++) {
              if (res[m]['status'] === 0 || res[m]['status'] === 1) {
                finish = false;
              }
            }
            if (!finish) {
              this.message.create('warning', 'Not all Closed!');
              return;
            }
            this.sendLoading = true;
            await this.yrGenerateService.getSigner(this.plant.split('-')[0] + '_' + this.product).toPromise().then(async resd => {
              if (resd.length === 0 || resd[0]['workflowFormMappings'].length === 0 || resd[0]['workflowFormMappings'][0]['workflowSignatories'].length === 0) {
                this.message.create('error', '請先維護簽核人員信息!Please maintain the approving personnel information first!');
                this.sendLoading = false;
                return;
              }
              const list = [];
              for (let index = 0; index < resd[0]['workflowFormMappings'][0]['workflowSignatories'].length; index++) {
                list.push({ empID: resd[0]['workflowFormMappings'][0]['workflowSignatories'][index]['picId'], role: resd[0]['workflowFormMappings'][0]['workflowSignatories'][index]['stageDesc'] });
              }
              for (let j = 0; j < this.modelMaterials.length; j++) {
                if (this.modelMaterials[j].workflowId) {
                  if (this.modelMaterials[j]['workflow'][0]['status'] == 2) {
                    this.current = this.modelMaterials[j]['workflow'][0]['workflowSigns'].find(item => !item['previousWorkflowSignId'])['id'];
                    this.id = this.modelMaterials[j]['workflow'][0]['workflowSigns'].find(item => !item['previousWorkflowSignId'])['workflowId'];
                    // const id = red.find(item => !item['isAgree']);
                    for (let k = 0; k < this.modelMaterials[j]['workflow'][0]['workflowSigns'].length; k++) {
                      // 异步处理
                      await this.workflowSignService.patchAttributes(this.modelMaterials[j]['workflow'][0]['workflowSigns'][k]['id'], {
                        isAgree: null,
                        comment: null
                      }).toPromise().then(ree => {
                        if (k === this.modelMaterials[j]['workflow'][0]['workflowSigns'].length - 1) {
                          this.workflowService.patchAttributes(this.id, {
                            status: 0,
                            current: this.current
                          }).subscribe();
                        }
                      });
                    }
                    if (j === this.modelMaterials.length - 1) {
                      this.sendEnable = false;
                      this.sendLoading = false;
                      this.message.create('success', 'Successfully sent!');
                    }
                  } else {
                    if (j === this.modelMaterials.length - 1) {
                      this.sendEnable = false;
                      this.sendLoading = false;
                      this.message.create('success', 'Successfully sent!');
                    }
                  }
                } else {
                  // by物料增加签核flow
                  this.dfcWorkflowService.CreateNewSigningFlow('RFI良率生成:' + this.projectName, list, resd[0]['workflowFormMappings'][0]['id']).subscribe(res => {
                    this.baseDataSigningService.updateworkflow(res['data']['id'], {
                      routingParameter: `?sitePlant=${this.plant}&projectName=${this.projectName}`,
                      createBy: this.userId,
                      createOn: new Date()
                    }).subscribe();
                    this.yrGenerateService.updateModelMaterial(this.modelMaterials[j]['id'], {
                      workflowId: res['data']['id']
                    }).subscribe(ree => {
                      if (j === this.modelMaterials.length - 1) {
                        this.sendLoading = false;
                        this.sendEnable = false;
                        this.message.create('success', 'Successfully sent!');
                        this.yrGenerateService.getFirstFlowSignByFlowId(res['data']['id']).subscribe(async rd => {
                          let mails = '';
                          for (let k = 0; k < rd.length; k++) {
                            await this.yrGenerateService.findUserById(rd[k]['userId']).toPromise().then(reso => {
                              mails += reso['email'] + ';';
                            });
                          }
                          const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.plant}&projectName=${this.projectName}`;
                          const notice: MailInterface = {
                            subject: '【DFQ系統提醒】DFQ目標良率簽核',
                            content: 'Dear Sir:<br>' + this.customer + '客戶' + this.projectName + '機種目標良率預測已完成並啟動簽核，請登陸DFQ系統及時簽核.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                            sender: 'dfi@wistron.com',
                            receiver: mails
                          };
                          this.meetingReviewTestService.createMail(notice).subscribe();
                        });
                      }
                    });
                  });
                }

              }
            });
          });
        });
      }
    });
  }

  queryFrom(form) {
    this.tableShow = false;
    this.plant = form.plant;
    this.customer = form.customer;
    this.product = form.product;
    this.similarModel = form.similarModel;
    this.projectName = form.projectName;
    this.projectCode = form.projectCode;
    this.plantMatch = form.plantMatch;
    this.mbId = form.mbId;
    this.yrQueryService.getDfcFactors(this.projectName, this.plant.split('-')[1]).subscribe(async resu => {
      this.dfcData = resu;
    }, err => {
      this.message.create('warning', 'DFC no data!');
      return;
    });
    this.yrGenerateService.getChartData(this.plant.split('-')[0], this.plant.split('-')[1], this.projectName, this.product).subscribe(ree => {
      if (ree.length !== 0) {
        this.designYield = ree[0]['originalYieldRate'];
        this.changeYield = ree[0]['improvedYieldRate'];
        this.getTableData(this.projectName);
      }
    });
  }

  getChartData(analysisChart, designYield, pushYield, bestYield) {
    this.targetYrOptions = {};
    this.yrGenerateService.getChartData(this.plant.split('-')[0], this.plant.split('-')[1], this.projectName, this.product).subscribe(ree => {
      if (ree.length !== 0) {
        this.designYield = ree[0]['originalYieldRate'];
        this.changeYield = ree[0]['improvedYieldRate'];
        this.targetYrOptions = {
          title: [{
            text: this.projectName + analysisChart,
            x: 'center',
            textStyle: {
              color: 'rgb(0, 102, 255)',
              fontWeight: 'bold',
              fontSize: 16
            }
          },
          {
            text: `Plant:${this.plant}\nCustomer:${this.customer}\nProduct:${this.product}`,
            x: '80%',
            textStyle: {
              color: 'rgb(0, 102, 255)',
              fontWeight: 'bold',
              fontSize: 16
            }
          }
          ],
          xAxis: [{
            type: 'category',
            splitLine: { show: false },
            axisLabel: {
              show: true,
              // rotate: 315
              fontSize: 14
            },
            data: [designYield, pushYield, bestYield]
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %'
            },
            show: true,
            max: 100
          }],
          series: [
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  color: function (params) {
                    // build a color map as your need.
                    const colorList = [
                      'rgb(0, 102, 255)', 'rgb(0, 102, 255)', 'rgba(245,201,16,1)'
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: { show: true, position: 'inside', formatter: '{c} %' }
                },
              },
              data: [(new PercentPipe().transform(this.designYield)).split('%')[0], (new PercentPipe().transform(this.changeYield)).split('%')[0], (new PercentPipe().transform(this.bestTotalYield)).split('%')[0]],
              barWidth: 80,
            }
          ]
        };
      }
    });
  }

  getTableData(model) {
    this.showData = [];
    this.finish = true;
    this.yrGenerateService.getModelMaterial(model, this.plant).subscribe(async res => {
      this.modelMaterials = res;
      for (let m = 0; m < this.modelMaterials.length; m++) {
        this.workflowService.find({
          where: {
            id: this.modelMaterials[m].workflowId
          },
          include: {
            relation: 'workflowSigns'
          }
        }).pipe(map(resd => {
          this.modelMaterials[m]['workflow'] = resd;
        })).subscribe();

        if (this.modelMaterials[m].status === 0 || this.modelMaterials[m].status === 1) {
          this.finish = false;
        }
      }
      if (this.finish) {
        this.yrGenerateService.getFlowStatusByDes('RFI良率生成:' + this.projectName).subscribe(reed => {
          this.sendEnable = true;
          if (reed.length !== 0 && reed.find(item => item['status'] != 2)) {
            this.sendEnable = false;
          }
        });
      }
      // 工时计算
      for (let index = 0; index < this.modelMaterials.length; index++) {
        this.modelMaterials[index]['indexId'] = index;
        if (this.modelMaterials[index]['yieldRate'] || this.modelMaterials[index]['yieldRate'] == 0) {
          await this.yrGenerateService.getPreFactors(this.modelMaterials[index].id).toPromise().then(reso => {
            this.modelMaterials[index].workHour = 0;
            if (reso.length !== 0) {
              this.modelMaterials[index].isBlank = false;
              for (let k = 0; k < reso.length; k++) {
                if (this.dfcData.length !== 0) {
                  const dat = this.dfcData.find(item => item.Material === this.modelMaterials[index].material.name &&
                    item.Factor === reso[k]['factor']['factorType'].name &&
                    item.FactorDetailActural === reso[k]['factor'].name);
                  if (dat && dat.hasOwnProperty('CostTimeActural')) {
                    this.modelMaterials[index].workHour += dat.CostTimeActural;
                  }
                }
              }
            } else {
              this.modelMaterials[index].isBlank = true;
            }
            if (index === this.modelMaterials.length - 1) {
              this.updateEditCache();
            }
          });
        } else {
          this.modelMaterials[index]['workHour'] = 0;
          if (index === this.modelMaterials.length - 1) {
            this.updateEditCache();
          }
        }

      }
    });
  }

  startEdit(indexId: string): void {
    // 編輯時，傳pic工號
    this.picData = this.editCache[indexId].data['pic'];
    this.showEdit = false;
    if (this.editCache[indexId].data.id !== this.editCache[indexId].data.originalId) {
      this.editCache[indexId].data.yieldRate = this.editCache[indexId].data.yieldRate * 100;
      this.editCache[indexId].edit = true;
    } else {
      this.editCache[indexId].data.originalYieldRate = this.editCache[indexId].data.originalYieldRate * 100;
      this.editCache[indexId].edit = true;
    }
  }

  cancelEdit(indexId: string): void {
    this.showEdit = true;
    if (this.editCache[indexId].data.id !== this.editCache[indexId].data.originalId) {
      this.editCache[indexId].data.yieldRate = this.numDiv(this.editCache[indexId].data.yieldRate, 100);
    } else {
      this.editCache[indexId].data.originalYieldRate = this.numDiv(this.editCache[indexId].data.originalYieldRate, 100);
    }
    const index = this.modelMaterials.findIndex(item => item.indexId === indexId);
    this.editCache[indexId] = {
      data: { ...this.modelMaterials[index] },
      edit: false
    };
  }

  saveEdit(indexId: string): void {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.cancelEdit(indexId);
      },
      nzOnOk: async () => {
        if (this.editCache[indexId].data.discussion && this.editCache[indexId].data.discussion.length >= 100) {
          this.message.create('error', '字數超過限定!The number of words exceeds the limit!');
          return;
        }
        this.yrGenerateService.getDiscussionByMId(this.editCache[indexId].data.id).subscribe(discus => {
          if (discus['status'] != 2) {
            const index = this.modelMaterials.findIndex(item => item.indexId === indexId);
            const myDate = new Date(this.editCache[indexId].data.duedate);
            if (this.editCache[indexId].data.duedate) {
              this.editCache[indexId].data.duedate = myDate.toLocaleDateString();
            }
            if (this.editCache[indexId].data.status != 2) {
              // 保存修改自動狀態變為1
              this.editCache[indexId].data.status = 1;
            }
            this.allClose = true;
            if (this.editCache[indexId].data.material.name !== 'MB' && this.editCache[indexId].data.id !== this.editCache[indexId].data.originalId) {
              if (((this.editCache[indexId].data.yieldRate / 100) !== this.editCache[indexId].data.originalYieldRate) && !this.editCache[indexId].data.discussion) {
                this.message.create('error', '請填寫討論結果! Please fill in the discussion results!');
                this.allClose = false;
                return;
              }
              for (const key in this.editCache) {
                if (this.editCache.hasOwnProperty(key) && key !== 'data' && key !== 'edit') {
                  const data = this.editCache[key].data;
                  if (data['status'] == 0 || data['status'] == 1) {
                    this.allClose = false;
                  }
                }
              }
              this.yrGenerateService.getFlowStatusByDes('RFI良率生成:' + this.projectName).subscribe(reed => {
                // [0]['status'] != 2
                if (reed.length !== 0 && reed.find(item => item['status'] == 2) && this.allClose == true) {
                  this.sendEnable = true;
                }
              });
              // 最新資料添加最優良率
              if (this.editCache[indexId].data.status == 2) {
                this.yrGenerateService.updateModelMaterial(this.editCache[indexId].data['id'], {
                  bestYieldRate: (new PercentPipe().transform(this.editCache[indexId].data['bestYield'])).split('%')[0] / 100
                }).subscribe();
              }
              // this.modelMaterials[index].yieldRate == this.editCache[indexId].data.yieldRate ? this.editCache[indexId].data.yieldRate :
              this.yrGenerateService.updateModelMaterial(this.editCache[indexId].data.id, {
                yieldRate: (new PercentPipe().transform(this.numDiv(this.editCache[indexId].data.yieldRate, 100))).split('%')[0] / 100
              }).subscribe(re => {
                this.editCache[indexId].data.yieldRate = (new PercentPipe().transform(this.numDiv(this.editCache[indexId].data.yieldRate, 100))).split('%')[0] / 100;
                this.editCache[indexId].data.pic = this.picId;
                if (this.editCache[indexId].data.stauts != 0) {
                  this.enableProduce = false;
                }
                this.yrGenerateService.updateDiscussion(this.editCache[indexId].data.discussionId, this.editCache[indexId].data).subscribe(res => {
                  this.editCache[indexId].edit = false;
                  Object.assign(this.modelMaterials[index], this.editCache[indexId].data);
                  this.getChartData(
                    this.trans['analysisChart'],
                    this.trans['designYield'],
                    this.trans['pushYield'],
                    this.trans['bestYield']);
                  // this.getTableData(this.projectName);
                });
              });
            } else {
              for (const key in this.editCache) {
                if (this.editCache.hasOwnProperty(key) && key !== 'data' && key !== 'edit') {
                  const data = this.editCache[key].data;
                  if (data['status'] == 0 || data['status'] == 1) {
                    this.allClose = false;
                  }
                }
              }
              this.yrGenerateService.getFlowStatusByDes('RFI良率生成:' + this.projectName).subscribe(reed => {
                if (reed.length !== 0 && reed.find(item => item['status'] == 2) && this.allClose == true) {
                  this.sendEnable = true;
                }
              });

              if (this.editCache[indexId].data.status == 2) {
                if (this.editCache[indexId].data['material']['name'] === 'MB') {
                  this.yrGenerateService.updateModelMaterial(this.editCache[indexId].data['id'], {
                    bestYieldRate: (new PercentPipe().transform(this.editCache[indexId].data['bestYield'])).split('%')[0] / 100
                  }).subscribe();
                }
              }
              // this.modelMaterials[index].originalYieldRate == this.editCache[indexId].data.originalYieldRate ? this.editCache[indexId].data.originalYieldRate :
              this.yrGenerateService.updateModelMaterial(this.editCache[indexId].data.id, {
                yieldRate: (new PercentPipe().transform(this.numDiv(this.editCache[indexId].data['originalYieldRate'], 100))).split('%')[0] / 100
              }).subscribe(ree => {
                this.editCache[indexId].data.originalYieldRate = (new PercentPipe().transform(this.numDiv(this.editCache[indexId].data['originalYieldRate'], 100))).split('%')[0] / 100;
                // this.editCache[indexId].data.yieldRate = this.editCache[indexId].data.originalYieldRate;
                this.editCache[indexId].data.pic = this.picId;
                if (this.editCache[indexId].data.stauts != 0) {
                  this.enableProduce = false;
                }
                this.yrGenerateService.updateDiscussion(this.editCache[indexId].data.discussionId, this.editCache[indexId].data).subscribe(res => {
                  this.editCache[indexId].edit = false;
                  Object.assign(this.modelMaterials[index], this.editCache[indexId].data);
                  this.getChartData(this.trans['analysisChart'],
                    this.trans['designYield'],
                    this.trans['pushYield'],
                    this.trans['bestYield']);
                  // this.getTableData(this.projectName);
                });
              }
              );
            }
          } else {
            this.message.create('error', '該物料已被Closed!The material has been closed!');
            return;
          }
          this.showEdit = true;
        });
        // 保存時，判斷pic是否有變更，有就發郵件通知自己和指定的pic
        if (this.editCache[indexId].data['pic'] !== this.picId) {
          if (this.picEmail) {
            let mails = '';
            this.yrGenerateService.findUserById(this.userId).subscribe(res => {
              mails = res['email'] + ';' + this.picEmail;
              const url = `${location.origin}/dashboard/rfi/yr-generate?sitePlant=${this.plant}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`;
              const notice: MailInterface = {
                subject: '【DFQ系統提醒】DFQ目標良率PIC變更通知',
                content: 'Dear Sir:<br>' + this.customer + '客戶' + this.projectName + '幾種目標良率PIC已發生變更，請登陸DFQ系統及時進行追踪處理.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                sender: 'DFi@Wistron.com',
                receiver: mails
              };
              this.meetingReviewTestService.createMail(notice).subscribe();
            });
          }
        }
      }
    });
  }

  numDiv(num1, num2) {
    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;
    try {
      baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
  }

  async updateEditCache(): Promise<void> {
    this.modelMaterials.forEach(item => {
      this.editCache[item.indexId] = {
        edit: false,
        data: { ...item }
      };
    });
    this.bestTotalYield = 1;
    if (this.modelMaterials.length !== 0) {
      if (!this.plantMatch) {
        this.plantMatch = undefined;
      }
      for (let index = 0; index < this.modelMaterials.length; index++) {
        // 找最优良率
        await this.yrGenerateService.getModelUploadByMaterialId(this.modelMaterials[index].materialId, this.plantMatch).toPromise().then(async res => {
          if (res.length !== 0) {
            if (this.modelMaterials[index].material.name !== 'MB') {
              this.editCache[index].data.bestYield = res[0]['yieldRate'];
              this.modelMaterials[index].bestYield = res[0]['yieldRate'];
              // echarts资料
              this.bestTotalYield *= this.modelMaterials[index].bestYield;
            } else {
              this.editCache[index].data.bestYield = this.editCache[index].data.originalYieldRate;
              this.modelMaterials[index].bestYield = this.modelMaterials[index].originalYieldRate;
              this.bestTotalYield *= this.modelMaterials[index].bestYield;
            }
            if (index === this.modelMaterials.length - 1) {
              this.getEchart(this.trans['analysisChart'],
                this.trans['designYield'],
                this.trans['pushYield'],
                this.trans['bestYield']);
            }
          } else {
            // 無匹配;
            if (this.modelMaterials[index].material.name !== 'MB') {
              this.editCache[index].data.bestYield = null;
              this.modelMaterials[index].bestYield = null;
              // 未找到就不再计算
              // this.bestTotalYield *= this.modelMaterials[index].bestYield;
            } else {
              this.editCache[index].data.bestYield = this.editCache[index].data.originalYieldRate;
              this.modelMaterials[index].bestYield = this.modelMaterials[index].originalYieldRate;
              this.bestTotalYield *= this.modelMaterials[index].bestYield;
            }
            if (index === this.modelMaterials.length - 1) {
              this.getEchart(this.trans['analysisChart'],
                this.trans['designYield'],
                this.trans['pushYield'],
                this.trans['bestYield']);
            }
          }
        });
      }
    }
  }


  download() {
    this.pageSize = this.showData.length;
    this.downing = true;
    setTimeout(() => {
      const table = document.getElementById('yrReport');
      this.downExcelService.exportTableAsExcelFile(table, 'yrReport');
      this.downing = false;
      this.pageSize = 10;
    }, 1100);
  }

  async getEchart(analysisChart, designYield, pushYield, bestYield) {
    this.targetYrOptions = {
      title: [{
        text: this.projectName + analysisChart,
        x: 'center',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      {
        text: `Plant:${this.plant}\nCustomer:${this.customer}\nProduct:${this.product}`,
        x: '80%',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      }
      ],
      xAxis: [{
        type: 'category',
        splitLine: { show: false },
        axisLabel: {
          show: true,
          // rotate: 315
          fontSize: 14
        },
        data: [designYield, pushYield, bestYield]
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %'
        },
        show: true,
        max: 100
      }],
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: function (params) {
                // build a color map as your need.
                const colorList = [
                  'rgb(0, 102, 255)', 'rgb(0, 102, 255)', 'rgba(245,201,16,1)'
                ];
                return colorList[params.dataIndex];
              },
              label: { show: true, position: 'inside', formatter: '{c} %' }
            },
          },
          data: [(new PercentPipe().transform(this.designYield)).split('%')[0], (new PercentPipe().transform(this.changeYield)).split('%')[0], (new PercentPipe().transform(this.bestTotalYield)).split('%')[0]],
          barWidth: 80,
        }
      ]
    };
    if (this.modelMaterials.length !== 0) {
      this.filterMaterial.length = 0;
      this.filterDueday.length = 0;
      this.filterPic.length = 0;
      for (let index = 0; index < this.modelMaterials.length; index++) {
        this.modelMaterials[index]['dif'] = this.modelMaterials[index]['bestYield'] - this.modelMaterials[index]['originalYieldRate'];
        this.modelMaterials[index]['yrInf'] = (this.modelMaterials[index]['bestYield'] - this.modelMaterials[index]['originalYieldRate']) * 100 * 0.12;
        this.modelMaterials[index]['actualInf'] = this.modelMaterials[index]['yrInf'] - (this.modelMaterials[index]['workHour'] * 0.001);
        this.filterMaterial.push({ text: this.modelMaterials[index]['materialName'], value: this.modelMaterials[index]['materialName'] });
        this.filterDueday.push({ text: this.modelMaterials[index]['duedate'], value: this.modelMaterials[index]['duedate'] });
        if (!this.filterPic.find(item => item.value === this.modelMaterials[index]['pic'])) {
          await this.memberService.findById(this.modelMaterials[index]['pic']).toPromise().then(res => {
            this.filterPic.push({ text: res['EName'], value: this.modelMaterials[index]['pic'] });
          }, err => {
            this.message.create('warning', `${this.modelMaterials[index]['pic']}NO DFI Authority`);
          });
        }
      }
      this.filterDueday = this.filterDueday.filter(item => item.text);
      this.showData = this.modelMaterials;
      this.deleteShow = true;
      this.tableShow = true;
      setTimeout(() => {
        if (document.getElementById('yrReport')) {
          const a = document.getElementsByClassName('ant-table-body ng-star-inserted')[0];
          this.renderer.setAttribute(a, 'id', 'scrollReport');
          const div = this.ref.nativeElement.querySelector('#scrollReport');
          // 鼠标事件
          div.onmouseenter = () => {
            this.yrGenerateService.scrollSub.next('lock');
          };
          div.onmouseleave = () => {
            this.yrGenerateService.scrollSub.next('unlock');
          };
          this.renderer.listen(div, 'mousewheel', function (e) {
            // 判断滚轮方向
            const direc = e['wheelDelta'] ? e['wheelDelta'] : -e['detail'] * 40;
            const move_s = direc > 0 ? -50 : 50;

            div.scrollLeft += move_s;
          });
        }
      }, 1000);
    }
  }

  // 排序
  sort(datas: any[]) {
    for (let i = 0; i < datas.length - 1; i++) {
      for (let j = 0; j < datas.length - 1 - i; j++) {
        if (datas[j]['_source'].modelUpload[0].yieldRate < datas[j + 1]['_source'].modelUpload[0].yieldRate) {
          const t = datas[j];
          datas[j] = datas[j + 1];
          datas[j + 1] = t;
        }
      }
    }
  }

  delete(indexId) {
    this.modalService.confirm({
      nzTitle: '<i>Delete Alert</i>',
      nzContent: '<b>Do you Want to Delete?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { },
      nzOnOk: () => {
        this.deleteShow = false;
        this.modelMaterialService.find({
          where: {
            plantId: this.showData.find(item => item.indexId === indexId).plant,
            modelId: this.showData.find(item => item.indexId === indexId).modelId,
            materialId: this.showData.find(item => item.indexId === indexId).materialId
          }
        }).subscribe(ree => {
          for (let index = 0; index < ree.length; index++) {
            this.modelMaterialService.deleteById(ree[index]['id']).subscribe(res => {
              if (index === ree.length - 1) {
                this.yrGenerateService.getChartData(this.plant.split('-')[0], this.plant.split('-')[1], this.projectName, this.product).subscribe(reed => {
                  if (reed.length !== 0) {
                    this.designYield = reed[0]['originalYieldRate'];
                    this.changeYield = reed[0]['improvedYieldRate'];
                    this.modelMaterials = this.modelMaterials.filter(item => item.indexId !== indexId);
                    this.updateEditCache();
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  showblankModal(materialId, data, materialName) {
    this.blankModalMaterialName = materialName;
    this.blankModalMaterialId = materialId;
    this.blankmaterialDetails = data;
    if (data.originalId === data.id) {
      this.blankModalShow = true;
    } else {
      this.blankModalShow = false;
    }
  }

  blankModalCal(evt) {
    this.blankModalShow = evt;
  }

  savedblankModalCal(evt) {
    this.blankModalShow = false;
    const index = this.showData.find(item => item.id === evt.id).indexId;
    Object.assign(this.showData[index], evt);
  }

  showYrCompare(materialId, data) {
    this.yrCompareMaterialId = materialId;
    this.materialDetails = data;
    this.yrCompareShow = true;
  }

  yrComCancel(evt) {
    this.yrCompareShow = evt;
  }

  savedYrComCancel(evt) {
    this.yrCompareShow = false;
    const index = this.showData.find(item => item.id === evt.id).indexId;
    Object.assign(this.modelMaterials[index], evt);
    Object.assign(this.showData[index], evt);
    Object.assign(this.editCache[index].data, evt);
    this.getChartData(
      this.trans['analysisChart'],
      this.trans['designYield'],
      this.trans['pushYield'],
      this.trans['bestYield']
    );
  }

  showChangeCompare(materialId, materialName) {
    this.changeCompareMaterialId = materialId;
    this.materialName = materialName;
    this.changeCompareShow = true;
  }

  changeComCacel(evt) {
    this.changeCompareShow = evt;
  }

  showMB(id, discussionId) {
    this.mbYrEditId = id;
    this.mbDiscussionId = discussionId;
    this.motherboardDetailShow = true;
  }

  mBoardCancel(evt) {
    this.motherboardDetailShow = evt;
  }

  savedMBoardCancel(evt) {
    this.motherboardDetailShow = evt;
    this.getTableData(this.projectName);
  }

  showMBAdd(id) {
    this.mbMaterialId = id;
    this.motherboardAddShow = true;
  }

  mBoardAddCancel(evt) {
    this.motherboardAddShow = evt;
    this.getTableData(this.projectName);
  }
}
