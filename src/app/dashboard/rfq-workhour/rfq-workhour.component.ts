import { Router } from '@angular/router';
import { RFQworkhourForecast, workhourTrack } from './workhourData';
import { Component, OnInit } from '@angular/core';
import { DfcDashboardApi, ProjectCodeProfileApi, ProjectNameProfileApi } from '@service/dfc_sdk/sdk';
import { ProcessCodeApi } from '@service/dfi-sdk';
import { IPieChartOption } from '../../components/pie-chart/pie-chart';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-rfq-workhour',
  templateUrl: './rfq-workhour.component.html',
  styleUrls: ['./rfq-workhour.component.scss']
})
export class RfqWorkhourComponent implements OnInit {

  options = [];
  // 工時預測參數
  rfqWorkhourForecast = {};
  totalWorkhour1;
  // 工時追蹤參數
  totalWorkhour2; // 工時追蹤的分母等於工時預測的分子
  workhourTrack2 = [];
  isLoading = true;
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  transNotice = {};
  constructor(
    private dfcDashboardApi: DfcDashboardApi,
    private processCodeApi: ProcessCodeApi,
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'dashboard.rfq-forecast', 'dashboard.workhour-track']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      RFQworkhourForecast.title = res['dashboard.rfq-forecast'];
      workhourTrack.title = res['dashboard.workhour-track'];
      this.getNewData();
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'dashboard.rfq-forecast', 'dashboard.workhour-track']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        RFQworkhourForecast.title = res['dashboard.rfq-forecast'];
        workhourTrack.title = res['dashboard.workhour-track'];
        this.getNewData();
      });
    });
  }

  async getNewData() {
    this.isLoading = true;
    this.options = [];
    const jobs = [
      this.dfcDashboardApi.find().toPromise(),
      this.processCodeApi.find().toPromise(),
      this.projectCodeProfileApi.find().toPromise(),
      this.projectNameProfileApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    const project = jobsResult[0];
    const processCodeTable = jobsResult[1];
    const basicProjectCode = jobsResult[2];
    const basicProjectName = jobsResult[3];
    this.getForecastData(project, processCodeTable);
    this.getWorkhourTrackData(project, processCodeTable, basicProjectCode, basicProjectName);
  }

  getForecastData(project, processCodeTable) {
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const warnDate = moment(new Date(new Date().setDate(new Date().getDate() + 30))).format('YYYY-MM-DD HH:mm:ss');
    const forecastData = {};
    project.forEach(t => {
      t.unknownProductType = false;
      t.processCodeMissing = false;
      t.notCopied = false;
      const processCode = processCodeTable.find(x => (x['plantId'] === t.plant && x['productId'] === t.product));
      if (!processCode) {
        t.processCodeMissing = true;
      }
      if (t.isPlmProject && !t['isPlmRfqCopied']) {
        // 未複製的PLM Project沒有Model/Stage
        t.notCopied = true;
      }
      const returnObj = {
        ProjectNameID: t.projectNameId,
        Plant: t.plant,
        BU: t.bu,
        Customer: t.customer,
        ProductType: t.product,
        ProjectCode: t.projectCode,
        ProjectCodeID: t.projectCodeId,
        ProjectName: t.projectName,
        PLMProjectStatus: t.plmStatus,
        IsTargetSigned: t.isTargetSigned,
        RfqDueDay: t.rfqDueday
      };
      if (!forecastData[t.plant]) {
        forecastData[t.plant] = {
          signed: [],
          expired: [],
          warning: [],
          warningIncomplete: [],
          remind: []
        };
      }
      if (t.isTargetSigned) {
        forecastData[t.plant].signed.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= now) {
        forecastData[t.plant].expired.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= warnDate) {
        if (!t.product || t.notCopied || t.processCodeMissing) {
          forecastData[t.plant].warningIncomplete.push(returnObj);
        } else {
          forecastData[t.plant].warning.push(returnObj);
        }
      } else {
        forecastData[t.plant].remind.push(returnObj);
      }
    });
    this.getWorkhourForecastPie(forecastData);
  }

  getWorkhourTrackData(project, processCodeTable, basicProjectCode, basicProjectName) {
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const workhourTrackData = {};
    const data = project.filter(d => d.isTargetSigned);
    data.forEach(x => {
      x.unknownProductType = false;
      x.processCodeMissing = false;
      x.noRfqCode = false;
      x.notBound = false;
      x.notUploadedExpired = false;
      x.notUploadedWarning = false;
      x.workhourUploaded = false;
      x.currentStage = 'rfq';
      x.modelDetail = null;
      const dueday = [
        { stage: 'C2', date: new Date(x.c2Dueday) },
        { stage: 'C3', date: new Date(x.c3Dueday) },
        { stage: 'C4', date: new Date(x.c4Dueday) },
        { stage: 'C5', date: new Date(x.c5Dueday) },
        { stage: 'C6', date: new Date(x.c6Dueday) }
      ];
      for (let i = 0; i < dueday.length; i++) {
        if (moment(new Date(dueday[i].date)).format('YYYY-MM-DD HH:mm:ss') > now) {
          x.currentStage = dueday[i].stage;
          break;
        }
      }
      if (x.c5Dueday) {
        x.c5Dueday = new Date(x.c5Dueday);
      } else { // 如果本身是rfq機種，則撈取對應BA機種的c5Dueday
        const proNames = basicProjectName.filter(vv => vv['RfqProjectCode'] === x['projectCode']);
        const proCodes = basicProjectCode.filter(cc => cc['Plant'] === x['plant']);
        if (proNames) {
          for (let index = 0; index < proNames.length; index++) {
            const temPro = proCodes.filter(rr => rr['ProjectCodeID'] === proNames[index]['ProjectCodeID']);
            if (temPro && temPro.length) {
              x.c5Dueday = temPro[0]['C5DueDay']
            }
          }
        }
      }
      const processCode = processCodeTable.find(m => (m.plantId === x.plant && m.productId === x.product));

      if (['None', '', null].includes(x.rfqProjectCode) && !x['rfqDueday']) {
        x.noRfqCode = true;
        return;
      }
      if (!processCode) {
        x.processCodeMissing = true;
        return;
      } else if (['', null].includes(x.rfqProjectName) && !x['rfqDueday']) {
        x.notBound = true;
        return;
      }

      if (x.actualWorkHours) {
        x.workhourUploaded = true;
      } else {
        if (now > moment(new Date(x.c5Dueday)).format('YYYY-MM-DD HH:mm:ss')) {
          x.notUploadedExpired = true;
        } else {
          x.notUploadedWarning = true;
        }
      }
      const returnObj = {
        ProjectNameID: x.projectNameId,
        Plant: x.plant,
        BU: x.bu,
        Customer: x.customer,
        ModelType: x.product,
        ProjectCode: x.projectCode,
        ProjectName: x.projectName,
        RfqProjectCode: x.rfqProjectCode,
        RfqProjectName: x.rfqProjectName,
        PLMProjectStatus: x.plmStatus,
        IsTargetSigned: x.isTargetSigned,
        workhourUploaded: x.workhourUploaded,
        currentStage: x.currentStage,
        totalCostTime: x.actualWorkHours,
        totalTargetCostTime: x.targetWorkHours,
        C5DueDay: x.c5Dueday
      };
      if (!workhourTrackData[x.plant]) {
        workhourTrackData[x.plant] = {
          unknownProductType: [],
          processCodeMissing: [],
          noRfqCode: [],
          notBound: [],
          uploadedGoal: [],
          notUploadedExpired: [],
          notUploadedWarning: []
        };
      }
      if (!x.product) {
        workhourTrackData[x.plant].unknownProductType.push(returnObj);
      } else if (x.processCodeMissing) {
        workhourTrackData[x.plant].processCodeMissing.push(returnObj);
      } else if (x.noRfqCode) {
        workhourTrackData[x.plant].noRfqCode.push(returnObj);
      } else if (x.notBound) {
        workhourTrackData[x.plant].notBound.push(returnObj);
      } else if (x.workhourUploaded) {
        workhourTrackData[x.plant].uploadedGoal.push(returnObj);
      } else { // not uploaded
        if (x.notUploadedExpired) {
          workhourTrackData[x.plant].notUploadedExpired.push(returnObj);
        } else if (x.notUploadedWarning) {
          workhourTrackData[x.plant].notUploadedWarning.push(returnObj);
        }
      }
    });
    this.getWorkhourTrackPie(workhourTrackData);
  }

  // RFQ工時預測-不同燈號的數據總和
  getWorkhourForecastPie(forecastData) {
    let params: IPieChartOption;
    this.rfqWorkhourForecast = {
      green: 0,
      red: 0,
      yellow: 0,
      grey: 0,
      purple: 0
    };
    for (const key in forecastData) {
      if (forecastData.hasOwnProperty(key)) {
        this.rfqWorkhourForecast['green'] += forecastData[key]['signed'].length;
        this.rfqWorkhourForecast['red'] += forecastData[key]['expired'].length;
        this.rfqWorkhourForecast['yellow'] += forecastData[key]['warning'].length;
        this.rfqWorkhourForecast['purple'] += forecastData[key]['warningIncomplete'].length;
        this.rfqWorkhourForecast['grey'] += forecastData[key]['remind'].length;
        this.totalWorkhour1 =
          this.rfqWorkhourForecast['green'] +
          this.rfqWorkhourForecast['red'] +
          this.rfqWorkhourForecast['yellow'] +
          this.rfqWorkhourForecast['grey'] +
          this.rfqWorkhourForecast['purple'];
        this.workhourTrack2.push(forecastData[key]['signed']);
      }
    }
    Object.assign(RFQworkhourForecast['content'], forecastData);
    if (
      this.rfqWorkhourForecast['green'] === 0 &&
      this.rfqWorkhourForecast['red'] === 0 &&
      this.rfqWorkhourForecast['yellow'] === 0 &&
      this.rfqWorkhourForecast['grey'] === 0 &&
      this.rfqWorkhourForecast['purple'] === 0
    ) {
      params = {
        title: RFQworkhourForecast.title,
        subtext: this.transNotice['noData'],
        data: [
          {
            name: this.transNotice['noData'],
            value: 0,
            itemStyle: {
              color: 'rgba(248, 244, 244, 0.973)'
            }
          }
        ],
        height: '160px',
        width: '160px'
      };
      this.options.push(params);
    } else {
      params = {
        title: RFQworkhourForecast.title,
        subtext: this.rfqWorkhourForecast['green'] + '\n' + '─────' + '\n' + this.totalWorkhour1,
        data: [{
          value: this.rfqWorkhourForecast['green'],
          name: 'green',
          itemStyle: {
            color:
              this.rfqWorkhourForecast['green'] === 0
                ? '#white'
                : 'rgb(60, 255, 76)'
          },
          title: RFQworkhourForecast.title
        },
        {
          value: this.rfqWorkhourForecast['red'],
          name: 'red',
          itemStyle: {
            color: this.rfqWorkhourForecast['red'] === 0 ? '#white' : 'rgb(255, 68, 68)'
          },
          title: RFQworkhourForecast.title
        },
        {
          value: this.rfqWorkhourForecast['yellow'],
          name: 'yellow',
          itemStyle: {
            color:
              this.rfqWorkhourForecast['yellow'] === 0 ? '#white' : 'rgb(248, 252, 55)'
          },
          title: RFQworkhourForecast.title
        },
        {
          value: this.rfqWorkhourForecast['purple'],
          name: 'purple',
          itemStyle: {
            color:
              this.rfqWorkhourForecast['purple'] === 0
                ? '#white'
                : 'rgb(201, 67, 201)'
          },
          title: RFQworkhourForecast.title
        },
        {
          value: this.rfqWorkhourForecast['grey'],
          name: 'grey',
          itemStyle: {
            color:
              this.rfqWorkhourForecast['grey'] === 0 ? '#white' : '#b9b6b6'
          },
          title: RFQworkhourForecast.title
        }],
        width: '160px',
        height: '160px'
      };
      params.color = ['rgb(60, 255, 76)', 'rgb(255, 68, 68)', 'rgb(248, 252, 55)', 'rgb(201, 67, 201)', '#b9b6b6'];
      this.options.push(params);
    }
  }

  // 工時追蹤-不同燈號的數據總和
  getWorkhourTrackPie(workhourTrackData) {
    let params: IPieChartOption;
    Object.assign(workhourTrack['content'], workhourTrackData);
    const workhourTracks = {
      green: 0,
      red: 0
    };
    for (const key in workhourTrackData) {
      if (workhourTrackData.hasOwnProperty(key)) {
        workhourTracks['green'] += workhourTrackData[key]['uploadedGoal'].length;
        workhourTracks['red'] += workhourTrackData[key]['notUploadedExpired'].length;
        workhourTracks['red'] += workhourTrackData[key]['notUploadedWarning'].length;
        workhourTracks['red'] += workhourTrackData[key]['noRfqCode'].length;
        workhourTracks['red'] += workhourTrackData[key]['notBound'].length;
        workhourTracks['red'] += workhourTrackData[key]['processCodeMissing'].length;
        workhourTracks['red'] += workhourTrackData[key]['unknownProductType'].length;
        this.totalWorkhour2 = workhourTracks['green'] + workhourTracks['red'];
      }
    }
    if (workhourTracks['green'] === 0 && workhourTracks['red'] === 0) {
      params = {
        title: workhourTrack.title,
        subtext: this.transNotice['noData'],
        data: [
          {
            name: this.transNotice['noData'],
            value: 0,
            itemStyle: {
              normal: {
                color: 'rgba(248, 244, 244, 0.973)'
              }
            },
            title: workhourTrack.title
          }
        ],
        height: '160px',
        width: '160px'
      };
      this.options.push(params);
    } else {
      params = {
        title: workhourTrack.title,
        subtext: workhourTracks['green'] + '\n' + '─────' + '\n' + this.totalWorkhour2,
        data: [
          {
            value: workhourTracks['green'],
            name: 'green',
            itemStyle: {
              color:
                workhourTracks['green'] === 0
                  ? '#white'
                  : 'rgb(60, 255, 76)'
            },
            title: workhourTrack.title
          },
          {
            value: workhourTracks['red'],
            name: 'red',
            itemStyle: {
              color: workhourTracks['red'] === 0 ? '#white' : 'rgb(255, 68, 68)'
            },
            title: workhourTrack.title
          },
        ],
        height: '160px',
        width: '160px'
      };
      params.color = ['rgb(60, 255, 76)', 'rgb(255, 119, 28)'];
      this.options.push(params);
    }
    this.isLoading = false;
  }

  // 點擊餅圖跳轉到第二層
  onChartEventRFQ(params) {
    if (params.data.name === this.transNotice['noData']) {
      return;
    }
    if (params.data.title.indexOf('RFQ') !== -1) {
      this.route.navigate([`/dashboard/dfcrfqboard/forecast/${params.data.name}`]);
    } else {
      this.route.navigate([`/dashboard/dfcrfqboard/track/${params.data.name}`]);
    }
  }
}
