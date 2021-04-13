import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DfcWorkReachingReportQuery, WorkReachingService } from '../work-reaching.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { ProcessCodeApi } from '@service/dfi-sdk';
import { ProcessApi, DfcDashboardApi, BasicModelApi } from '@service/dfc_sdk/sdk';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DfcProcessPipe } from 'app/dfc/dfc-pipe.pipe';
import { DownexcelService } from '@service/downexcel.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-workhour-forecast',
  templateUrl: './workhour-forecast.component.html',
  styleUrls: ['./workhour-forecast.component.scss']
})
export class WorkhourForecastComponent implements OnInit {
  @Input() nzScrollY;

  querySelect = JSON.parse(JSON.stringify(DfcWorkReachingReportQuery));

  // 提示字樣
  tipTxt = [
    { class: 'square-green', text: '目標工時生成, 且簽核完畢' },
    {
      class: 'square-red',
      text: 'RFQ D.D ≤ 系統日期, 且未完成目標工時生成簽核'
    },
    {
      class: 'square-yellow',
      text: 'RFQ D.D 前一个月 ≤ 系統日期 < RFQ D.D, 且未完成目標工時生成簽核'
    },
    {
      class: 'square-purple',
      text: 'RFQ D.D 前一个月 ≤ 系統日期 < RFQ D.D, 機種信息維護不完全 (未維護產品別/未複製/未維護製程)'
    },
    {
      class: 'square-grey',
      text: '系統日期 < RFQ D.D 前一个月'
    }
  ];
  // RFQ工時預測數據
  dataSet = [];
  statusValue;
  colorList = [
    { value: 'green', label: 'green', class: 'square-green' },
    { value: 'red', label: 'red', class: 'square-red' },
    { value: 'yellow', label: 'yellow', class: 'square-yellow' },
    { value: 'purple', label: 'purple', class: 'square-purple' },
    { value: 'grey', label: 'grey', class: 'square-grey' }
  ];
  @Input() forecastParam;
  workhourForecastData = {};
  queryFlag = true;
  tableFlag = false;
  isLoading = false;
  forecastDataList = [];

  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  trans = {};
  constructor(
    private dfcSelectService: DfcSelectNewService,
    private route: ActivatedRoute,
    private router: Router,
    private dfcDashboardApi: DfcDashboardApi,
    private processCodeApi: ProcessCodeApi,
    private basicModelApi: BasicModelApi,
    private message: NzMessageService,
    private workReachingService: WorkReachingService,
    private processApi: ProcessApi,
    private downexcelService: DownexcelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['dashboard.rfqWorkhourForecast', 'mrr.mrr-plant', 'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
      'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4',
      'report.unknown-product', 'report.not-found-process-notice', 'report.no-copy', 'report.no-sign-data', 'report.is-signing', 'report.sign-completed', 'report.rejected']).subscribe(res => {
        this.querySelect.plant.style.label = res['mrr.mrr-plant'];
        this.tipTxt[0].text = res['dashboard.dfc-rfqfore-tipTxt1'];
        this.tipTxt[1].text = res['dashboard.dfc-rfqfore-tipTxt2'];
        this.tipTxt[2].text = res['dashboard.dfc-rfqfore-tipTxt3'];
        this.tipTxt[3].text = res['dashboard.dfc-rfqfore-tipTxt4'];
        this.tipTxt[4].text = res['dashboard.dfc-rfqfore-tipTxt5'];
        this.trans['unknownProduct'] = res['report.unknown-product'];
        this.trans['noFoundProcess'] = res['report.not-found-process-notice'];
        this.trans['noCopy'] = res['report.no-copy'];
        this.trans['noSign'] = res['report.no-sign-data'];
        this.trans['signing'] = res['report.is-signing'];
        this.trans['signCompleted'] = res['report.sign-completed'];
        this.trans['rejected'] = res['report.rejected'];
        this.trans['title'] = res['dashboard.rfqWorkhourForecast'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dashboard.rfqWorkhourForecast', 'mrr.mrr-plant', 'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
        'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4',
        'report.unknown-product', 'report.not-found-process-notice', 'report.no-copy', 'report.no-sign-data', 'report.is-signing', 'report.sign-completed', 'report.rejected']).subscribe(res => {
          this.querySelect.plant.style.label = res['mrr.mrr-plant'];
          this.tipTxt[0].text = res['dashboard.dfc-rfqfore-tipTxt1'];
          this.tipTxt[1].text = res['dashboard.dfc-rfqfore-tipTxt2'];
          this.tipTxt[2].text = res['dashboard.dfc-rfqfore-tipTxt3'];
          this.tipTxt[3].text = res['dashboard.dfc-rfqfore-tipTxt4'];
          this.tipTxt[4].text = res['dashboard.dfc-rfqfore-tipTxt5'];
          this.trans['unknownProduct'] = res['report.unknown-product'];
          this.trans['noFoundProcess'] = res['report.not-found-process-notice'];
          this.trans['noCopy'] = res['report.no-copy'];
          this.trans['noSign'] = res['report.no-sign-data'];
          this.trans['signing'] = res['report.is-signing'];
          this.trans['signCompleted'] = res['report.sign-completed'];
          this.trans['rejected'] = res['report.rejected'];
          this.trans['title'] = res['dashboard.rfqWorkhourForecast'];
        });
    });
    this.initPlantSelect();
    this.route.params.subscribe(param => {
      if (param['plant']) {
        this.querySelect.plant.value = param['plant'];
        this.changePlant();
        if (!this.statusValue.includes(this.forecastParam['color'])) {
          this.statusValue.push(this.forecastParam['color']);
        }
        this.query();
      }
    });
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(res => {
      this.querySelect.plant.select.selectList = res;
    });
  }

  async getRfqWorkhourForecast(trans) {
    this.workhourForecastData = {};
    const jobs = [
      this.dfcDashboardApi.find().toPromise(),
      this.processCodeApi.find().toPromise(),
      this.basicModelApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    const project = jobsResult[0];
    const processCodeTable = jobsResult[1];
    const basicModels = jobsResult[2];
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const warnDate = moment(new Date(new Date().setDate(new Date().getDate() + 30))).format('YYYY-MM-DD HH:mm:ss');
    project.forEach(t => {
      t['processCodeMissing'] = false;
      t['notCopied'] = false;
      const t_model = basicModels.filter(d => d['projectNameId'] === t['projectNameId']);
      const targetSignResult = t_model.map(m => {
        return {
          modelId: m['modelId'],
          modelName: m['modelName'],
          isTargetSignSent: m['isTargetSignSent'],
          isTargetSignApproved: m['isTargetSignApproved']
        };
      });
      const processCode = processCodeTable.find(x => (x['plantId'] === t['plant'] && x['productId'] === t['product']));
      if (!processCode) {
        t['processCodeMissing'] = true;
      }

      if ((t['projectCode'].startsWith('QRQY') || t['projectCode'].startsWith('DMA-')) && t['isPlmProject'] && !t['isPlmRfqCopied']) {
        // 未複製的PLM Project沒有Model/Stage
        t['notCopied'] = true;
        // return;
      }
      const returnObj = {
        ProjectNameID: t['projectNameId'],
        Plant: t['plant'],
        BU: t['bu'],
        Customer: t['customer'],
        ProductType: t['product'],
        ProjectCode: t['projectCode'],
        ProjectCodeID: t['projectCodeId'],
        ProjectName: t['projectName'],
        PLMProjectStatus: t['plmStatus'],
        IsTargetSigned: t['isTargetSigned'],
        RfqDueDay: t['rfqDueday'],
        targetSignResult: targetSignResult,
        error: !t['product'] ? 1 :
          t['processCodeMissing'] ? 2 :
            t['notCopied'] ? 3 : 0,
      };
      if (!this.workhourForecastData[t['plant']]) {
        this.workhourForecastData[t['plant']] = {
          signed: [],
          expired: [],
          warning: [],
          warningIncomplete: [],
          remind: []
        };
      }

      if (t['isTargetSigned']) {
        this.workhourForecastData[t['plant']].signed.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= now) {
        this.workhourForecastData[t['plant']].expired.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= warnDate) {
        if (!t['product'] || t['notCopied'] || t['processCodeMissing']) {
          this.workhourForecastData[t['plant']].warningIncomplete.push(returnObj);
        } else {
          this.workhourForecastData[t['plant']].warning.push(returnObj);
        }
      } else {
        this.workhourForecastData[t['plant']].remind.push(returnObj);
      }
    });

    for (const key in this.workhourForecastData) {
      if (this.workhourForecastData.hasOwnProperty(key)) {
        this.workhourForecastData[key]['Plant'] = key;
        if (this.workhourForecastData[key]['signed'].length > 0) {
          this.workhourForecastData[key]['signed'].forEach(element => {
            element['color'] = 'green';
          });
        }
        if (this.workhourForecastData[key]['expired'].length > 0) {
          this.workhourForecastData[key]['expired'].forEach(element => {
            element['color'] = 'red';
            switch (element.error) {
              case 1: {
                element['textDetail'] = trans['unknownProduct'];
                break;
              }
              case 2: {
                element['textDetail'] = trans['noFoundProcess'];
                break;
              }
              case 3: {
                element['textDetail'] = trans['noCopy'];
                break;
              }
              default:
                element['textDetail'] = '';
                break;
            }
          });
        }
        if (this.workhourForecastData[key]['warning'].length > 0) {
          this.workhourForecastData[key]['warning'].forEach(element => {
            element['color'] = 'yellow';
            switch (element.error) {
              case 1: {
                element['textDetail'] = trans['unknownProduct'];
                break;
              }
              case 2: {
                element['textDetail'] = trans['noFoundProcess'];
                break;
              }
              case 3: {
                element['textDetail'] = trans['noCopy'];
                break;
              }
              default:
                element['textDetail'] = '';
                break;
            }
          });
        }
        if (this.workhourForecastData[key]['remind'].length > 0) {
          this.workhourForecastData[key]['remind'].forEach(element => {
            element['color'] = 'grey';
            switch (element.error) {
              case 1: {
                element['textDetail'] = trans['unknownProduct'];
                break;
              }
              case 2: {
                element['textDetail'] = trans['noFoundProcess'];
                break;
              }
              case 3: {
                element['textDetail'] = trans['noCopy'];
                break;
              }
              default:
                element['textDetail'] = '';
                break;
            }
          });
        }
        if (this.workhourForecastData[key]['warningIncomplete'].length > 0) {
          this.workhourForecastData[key]['warningIncomplete'].forEach(element => {
            element['color'] = 'purple';
            switch (element.error) {
              case 1: {
                element['textDetail'] = trans['unknownProduct'];
                break;
              }
              case 2: {
                element['textDetail'] = trans['noFoundProcess'];
                break;
              }
              case 3: {
                element['textDetail'] = trans['noCopy'];
                break;
              }
              default:
                element['textDetail'] = '';
                break;
            }
          });
        }
        this.dataSet.push(this.workhourForecastData[key]);
      }
    }
  }

  changePlant() {
    this.queryFlag = false;
    this.statusValue = [];
  }

  async query() {
    this.isLoading = true;
    this.tableFlag = false;
    // this.forecastDataList = [];
    await this.getRfqWorkhourForecast(this.trans);
    if (!this.querySelect.plant.value) {
      this.message.create('error', 'Please select the plant！');
      return;
    }
    if (!!this.querySelect.plant.value) {
      const plantData = this.dataSet.filter(
        forecastData => forecastData['Plant'] === this.querySelect.plant.value
      );
      let dataList = [];
      if (plantData.length !== 0) {
        dataList = [
          ...plantData[0]['signed'],
          ...plantData[0]['expired'],
          ...plantData[0]['warning'],
          ...plantData[0]['remind'],
          ...plantData[0]['warningIncomplete']
        ];
      }
      if (this.statusValue.length !== 0) {
        this.forecastDataList = dataList.filter(forecastData =>
          this.statusValue.includes(forecastData['color'])
        );
      } else {
        this.forecastDataList = dataList;
      }
      this.isLoading = false;
      this.tableFlag = true;
    }
  }

  download() {
    const downLoadData = [];
    for (const item of this.forecastDataList) {
      if (item.RfqDueDay) {
        item.RfqDueDay = moment(new Date(item.RfqDueDay)).format('YYYY-MM-DD');
      }
      const Data = {
        Plant: item.Plant,
        BU: item.BU,
        Customer: item.Customer,
        ProductType: item.ProductType,
        ProjectCode: item.ProjectCode,
        ProjectName: item.ProjectName,
        PLMProjectStatus: item.PLMProjectStatus,
        IsTargetSigned: item.IsTargetSigned,
        RfqDueDay: item.RfqDueDay,
        textDetail: item.textDetail,
      };
      downLoadData.push(Data);
    }
    this.downexcelService.exportAsExcelFile(downLoadData, this.trans['title']);
  }

  // 點擊擴展 查詢出具體的 model中信息
  nzExpandChangeProName(event, proNameData) {
    if (!proNameData.checkFlag) {
      const p = proNameData;
      this.workReachingService.proNameTargetSignCheck(proNameData.ProjectNameID).pipe(
        map(
          (d) => {
            p.checkFlag = true;
            return p.targetSignResult.map(x => {
              const findModel = d.basicModels.find(y => y.modelId === x.modelId);
              x.targetSignDetail = [];
              x.stageId = findModel.stageId;
              for (const key in findModel.targetSignDetail) {
                if (findModel.targetSignDetail.hasOwnProperty(key)) {
                  const detail = findModel.targetSignDetail[key];
                  if (!detail) {
                    x.targetSignDetail.push({
                      processCode: key,
                      msg: this.trans['noSign'],
                      colspan: 2,
                      colFlag: true
                    });
                  } else {
                    const date = new Date(detail['date']);
                    let s = date.toLocaleDateString();
                    s = s + '    ' + this.changeTime(date.getHours());
                    s = s + ':' + this.changeTime(date.getMinutes());
                    s = s + ':' + this.changeTime(date.getSeconds());
                    x.targetSignDetail.push({
                      processCode: key,
                      colFlag: false,
                      status: (detail['status'] === 0 ? this.trans['signing'] : (detail['status'] === 1 ? this.trans['signCompleted'] : this.trans['rejected'])),
                      date: s,
                      targetOperationSignId: detail['targetOperationSignId'],
                      signId: detail['signId']
                    });
                  }

                }
              }
              return x;
            });
          }
        ),
        tap(
          (x) => {
            proNameData = x;
          }
        )
      ).subscribe(pp => console.log(pp));
    }
  }

  private changeTime(data: number): string {
    let d: string;
    if (data < 10) {
      d = '0' + data;
    } else {
      d = data + '';
    }
    return d;
  }

  // 跳轉至目標工時生成
  toTargethour(data) {
    this.router.navigate([
      '/dashboard/dfc/target-hours/' +
      data.Plant +
      '/' +
      data.ProductType +
      '/' +
      data.ProjectNameID
    ]);
  }

  // 跳轉至目標工時生成簽核
  toTargethourSign(data) {
    this.router.navigate(['/dashboard/dfc/target-hour-sign'], {
      queryParams: {
        Plant: data.Plant,
        ProjectNameID: data.ProjectNameID
      }
    });
  }

  // 跳轉至目標工時簽核細項
  async toTargethourSignDetail(signID, formID, proName, stageID, processCode) {
    const process = await (new DfcProcessPipe(this.processApi).transform(processCode)).toPromise();
    this.router.navigate(['/dashboard/dfc/target-hour-sign'], {
      queryParams: {
        signID: signID,
        formID: formID,
        proName: proName,
        stageID: stageID,
        process: process.Name,
        processCode: processCode
      }
    });
  }

  // 跳轉至新機種信息維護
  toNewmodelMaintain(data) {
    this.router.navigate(['/dashboard/dfc/newmodel-maintain'], {
      queryParams: {
        Plant: data.Plant,
        ProjectNameID: data.ProjectNameID
      }
    });
  }
}
