import { FileService } from '@service/file.service';
import { FactInterface } from './../../../../../service/mrr-sdk/models/Fact';
import { DownexcelService } from '@service/downexcel.service';
import { PictureanalyseService } from './../pictureanalyse.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FactRiskInterface, FactLogInterface } from '@service/mrr-sdk';
import { NzModalService } from 'ng-zorro-antd';
import { MailInterface } from '@service/dfi-sdk';
import { SigningService } from 'app/mrr/nudd/signing/signing.service';
import { PicturereportService } from '../../pictureanalysereport/picturereport.service';

@Component({
  selector: 'app-picinput',
  templateUrl: './picinput.component.html',
  styleUrls: ['./picinput.component.scss']
})
export class PicinputComponent implements OnInit, OnChanges {
  @Input() plant;
  @Input() product;
  @Input() customer;
  @Input() site;
  @Input() rdId;
  @Input() projectName;
  @Input() url;
  @Input() afterAnalyseEnable;
  @Input() dataSet;
  @Input() dimension;
  @Input() facts;
  @Input() modelResultId;
  @Input() inputShow;
  @Input() otherItems;
  @Input() valueItems;
  @Input() analysisShow;
  @Output() tableChange = new EventEmitter<any>();
  isVisiblePic = false;
  afterAnalyse = false;
  // 输入值
  editCache = [];
  // 输入工艺
  editProcess = [];

  inputData = [];
  red: any;
  yellow: any;
  green: any;
  // 提示
  isSaveVisible = false;
  inputDataSet: any;
  mixing = true;

  imageUrl: string;
  mailReceiver: string;
  valueList = ['H', 'L', 'NA'];
  riskName = ['技術風險', '規格是否可以完成', '流程風險', '供應鏈'];
  riskData = [];
  constructor(
    private pictureAnalyseService: PictureanalyseService,
    private downExcelService: DownexcelService,
    private fileService: FileService,
    private modalService: NzModalService,
    private signingService: SigningService,
    private pictureReportService: PicturereportService
  ) { }

  ngOnInit() {
    this.pictureAnalyseService.dataChanged.subscribe(res => {
      this.paramAnalyse();
    });
    this.pictureReportService
      .getNuddUsers(`${this.plant}_${this.customer}_${this.product}`, 'NUDD001')
      .subscribe(res => {
        if (
          res[0]['workflowFormMappings'][0]['workflowSignatories'].filter(
            reso => reso.stageDesc === 'RD'
          ).length !== 0
        ) {
          this.pictureAnalyseService
            .findUserById(
              res[0]['workflowFormMappings'][0]['workflowSignatories'].find(
                reso => reso.stageDesc === 'RD'
              ).picId
            )
            .subscribe(reso => {
              this.mailReceiver = reso['email'];
            });
        } else {
          this.pictureAnalyseService.findUserById(this.rdId).subscribe(reso => {
            this.mailReceiver = reso['email'];
          });
        }
      }, err => console.log(err));
  }

  ngOnChanges() {
    this.afterAnalyse = this.afterAnalyseEnable;
    this.editProcess = this.otherItems;
    this.editCache = this.valueItems;
  }

  clickEventHandler(data) {
    this.isVisiblePic = true;
    this.imageUrl = data;
  }

  handleCancel() {
    this.isVisiblePic = false;
  }

  download() {
    const table = document.getElementById('datatable');
    this.downExcelService.exportTableAsExcelFile(table, '2D/3D');
  }

  downloadLL(fileName) {
    this.fileService.downloadMRRFile('lessonlearned', fileName);
  }

  notice() {
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        const mail: MailInterface = {
          subject: '[' + this.projectName + ']' + 'Nudd notification',
          content:
            '[' +
            this.projectName +
            ']NUDD need you judge(2D/3D risk item),please review it.<br>Link <a href=' + this.url + '>MRR NUDD system</a> for detail information(需使用Google Chrome登陸)',
          sender: 'dfi@wistron.com',
          receiver: this.mailReceiver
        };
        this.signingService.createMail(mail).subscribe();
      }
    });
  }

  save() {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        if (this.facts.length !== 0) {
          for (let index = 0; index < this.facts.length; index++) {
            this.pictureAnalyseService
              .deleteFacts(this.facts[index].id)
              .subscribe();
          }
        }
        const factArray = [];
        for (let index = 0; index < this.dataSet.length; index++) {
          const factLog: FactLogInterface = {
            value: this.editCache[index],
            riskLevel: this.dataSet[index].level,
            modelResultId: this.dataSet[index].modelResultId,
            pointName: this.dataSet[index].point,
            sideName: this.dataSet[index].sideName,
            dimensionName: this.dataSet[index].dimension,
            partName: this.dataSet[index].part
          };
          this.pictureAnalyseService.upsertFactLog(factLog).subscribe();
          const fact: FactInterface = {
            value: this.editCache[index],
            riskLevel: this.dataSet[index].level,
            modelResultId: this.dataSet[index].modelResultId,
            pointName: this.dataSet[index].point,
            sideName: this.dataSet[index].sideName,
            dimensionName: this.dataSet[index].dimension,
            partName: this.dataSet[index].part,
            processType: this.dataSet[index].processType,
            designItemName:
              this.dataSet[index].processType === 'Other'
                ? this.editProcess[index]
                : this.dataSet[index].itemName +
                '(' +
                this.dataSet[index].item +
                ')',
            owner: null,
            category: null,
            designItemPath: this.dataSet[index].picPath
          };
          const obsFact = this.pictureAnalyseService.upsertFact(fact).pipe(
            map((res: FactInterface[]) => {
              const tempArray = [];
              if (this.dataSet[index].processType !== 'Other') {
                if (this.dataSet[index].levelDetails) {
                  for (let j = 0; j < this.dataSet[index].levelDetails.length; j++) {
                    const factRisk: FactRiskInterface = {
                      name: this.dataSet[index].levelDetails[j].name,
                      level: this.dataSet[index].levelDetails[j].level,
                      factId: res['id']
                    };
                    tempArray.push(
                      of(this.pictureAnalyseService.upsertFactRisk(factRisk).subscribe())
                    );
                  }
                }
              } else {
                tempArray.push(of('other'));
              }
              return forkJoin(tempArray);
            })
          );
          factArray.push(obsFact);
        }
        forkJoin(factArray).subscribe(() => {
          this.isSaveVisible = true;
          setTimeout(() => {
            this.isSaveVisible = false;
          }, 3000);
        });
      }
    });
  }

  paramAnalyse() {
    this.afterAnalyse = false;
    // Other项评分
    for (let index = 0; index < this.dataSet.length; index++) {
      if (this.dataSet[index].processType === 'Other') {
        this.dataSet[index].level = 20;
      } else {
        this.mixing = false;
      }
    }
    // Other项判断
    if (this.mixing) {
      this.green = this.dataSet.filter(
        res => res.level >= 4 && res.level <= 11
      );
      this.yellow = this.dataSet.filter(
        res => res.level >= 12 && res.level <= 15
      );
      this.red = this.dataSet.filter(res => res.level >= 16 && res.level <= 20);
      this.inputShow = false;
      this.afterAnalyse = true;
      this.analysisShow = true;
      this.tableChange.emit(true);
    }
    this.inputData.length = 0;
    for (let index = 0; index < this.editCache.length; index++) {
      if (this.editCache[index]) {
        this.inputData.push({
          id: index,
          input: this.editCache[index]
        });
      }
    }
    for (let index = 0; index < this.dataSet.filter(res => res.processType !== 'Other').length; index++) {
      this.dataSet[index].input = this.inputData[index].input;
    }
    of(this.dataSet.filter(res => res.processType !== 'Other'))
      .pipe(
        switchMap(resLevelData => {
          const noValueData = resLevelData.filter(item => item['input'] !== 'H' && item['input'] !== 'L');
          if (noValueData.length) {
            const resLevelDataObsArray = noValueData.map(item => {
              return this.pictureAnalyseService.getLevel(item).pipe(
                map(res => {
                  const data = [];
                  for (let index = 0; index < res.length; index++) {
                    if (
                      item['input'] > res[index]['minimum'] &&
                      res[index]['maximum'] === null
                    ) {
                      data.push(res[index]);
                    } else if (
                      item['input'] <= res[index]['maximum'] &&
                      res[index]['minimum'] === null
                    ) {
                      data.push(res[index]);
                    } else if (
                      item['input'] <= res[index]['maximum'] &&
                      item['input'] > res[index]['minimum'] &&
                      res[index]['maximum'] !== null &&
                      res[index]['minimum'] !== null
                    ) {
                      data.push(res[index]);
                    }
                  }
                  return data;
                })
              );
            });
            return forkJoin(resLevelDataObsArray);
          } else {
            return of([]);
          }
        }),
        map(finalRes => {
          finalRes.forEach((data: Array<any>, idx) => {
            let total = 0;
            if (this.dataSet[idx].value !== 'NA') {
              for (let index = 0; index < data.length; index++) {
                total += data[index]['level'];
              }
            }
            this.dataSet[idx].level = total;
            this.dataSet[idx].levelDetails = data;
          });
          this.inputDataSet = this.dataSet.filter(
            res => res.processType !== 'Other'
          );
          of(this.inputDataSet)
            .pipe(
              switchMap(resData => {
                const dataArray = resData.map(item => {
                  return this.pictureAnalyseService.getLessonLearned(item).pipe(
                    map(res => {
                      return res;
                    })
                  );
                });
                return forkJoin(dataArray);
              }),
              map(resLes => {
                resLes.forEach((res, idx) => {
                  this.dataSet[idx].lessonLearned = res;
                });
                for (let index = 0; index < this.dataSet.length; index++) {
                  if (this.dataSet[index]['input'] === 'H') {
                    this.dataSet[index]['level'] = 20;
                    this.riskData = [];
                    for (let i = 0; i < this.riskName.length; i++) {
                      this.riskData.push({
                        id: i,
                        name: this.riskName[i],
                        level: 5
                      });
                    }
                    this.dataSet[index]['levelDetails'] = this.riskData;
                  } else if (this.dataSet[index]['input'] === 'L') {
                    this.dataSet[index]['level'] = 4;
                    this.riskData = [];
                    for (let i = 0; i < this.riskName.length; i++) {
                      this.riskData.push({
                        id: i,
                        name: this.riskName[i],
                        level: 1
                      });
                    }
                    this.dataSet[index]['levelDetails'] = this.riskData;
                  } else if (this.dataSet[index]['input'] === 'NA') {
                    this.dataSet[index]['level'] = 0;
                  }
                }
                this.green = this.dataSet.filter(
                  res => res.level >= 4 && res.level <= 11
                );
                this.yellow = this.dataSet.filter(
                  res => res.level >= 12 && res.level <= 15
                );
                this.red = this.dataSet.filter(
                  res => res.level >= 16 && res.level <= 20
                );
                this.afterAnalyse = true;
                this.tableChange.emit(true);
              })
            )
            .subscribe(res => {
              // 跳頂部
              document.getElementsByClassName(
                'content-header'
              )[0].scrollTop = 0;
              this.analysisShow = true;
            });
        })
      )
      .subscribe();
  }
}
