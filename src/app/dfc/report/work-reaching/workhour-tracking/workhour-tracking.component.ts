import { DfcDashboardApi, BasicModelApi } from '@service/dfc_sdk/sdk';
import { ProcessCodeApi } from '@service/dfi-sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { DfcWorkReachingReportQuery } from '../work-reaching.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DownexcelService } from '@service/downexcel.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-workhour-tracking',
  templateUrl: './workhour-tracking.component.html',
  styleUrls: ['./workhour-tracking.component.scss']
})
export class WorkhourTrackingComponent implements OnInit {
  @Input() nzScrollY;

  querySelect = JSON.parse(JSON.stringify(DfcWorkReachingReportQuery));

  // 提示字樣
  tipTxt = [
    { class: 'square-green', text: '曾上傳过工時' },
    { class: 'square-red', text: '未曾上傳過工時，C5 D.D < 系统日期' },
    {
      class: 'square-yellow',
      text: '未曾上傳過工時， C5 D.D ≥ 系统日期'
    },
    {
      class: 'square-purple',
      text: '未做 BA機種 與 RFQ機種的綁定動作'
    }
  ];
  // 工時追蹤數據
  dataSet = [];
  statusValue;
  colorList = [
    { value: 'green', label: 'green', class: 'square-green' },
    { value: 'red', label: 'red', class: 'square-red' },
    { value: 'yellow', label: 'yellow', class: 'square-yellow' },
    { value: 'purple', label: 'purple', class: 'square-purple' }
  ];
  @Input() trackParam;
  workhourTrackData = {};
  queryFlag = true;
  tableFlag = false;
  trackDataList = [];
  isLoading = false;
  trans = {};
  constructor(
    private dfcSelectService: DfcSelectNewService,
    private route: ActivatedRoute,
    private router: Router,
    private dfcDashboardApi: DfcDashboardApi,
    private processCodeApi: ProcessCodeApi,
    private basicModelApi: BasicModelApi,
    private message: NzMessageService,
    private downexcelService: DownexcelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['dashboard.rfqWorkhourTracking', 'mrr.mrr-plant', 'dashboard.rfq-forecast', 'dashboard.workhour-track',
      'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
      'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4',
      'report.not-bound', 'report.actual', 'military-order.goal']).subscribe(res => {
        this.querySelect.plant.style.label = res['mrr.mrr-plant'];
        this.tipTxt[0].text = res['dashboard.dfc-track-tipTxt1'];
        this.tipTxt[1].text = res['dashboard.dfc-track-tipTxt2'];
        this.tipTxt[2].text = res['dashboard.dfc-track-tipTxt3'];
        this.tipTxt[3].text = res['dashboard.dfc-track-tipTxt4'];
        this.trans['title'] = res['dashboard.rfqWorkhourTracking'];
        this.trans['notBound'] = res['report.not-bound'];
        this.trans['actual'] = res['report.actual'];
        this.trans['goal'] = res['military-order.goal'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dashboard.rfqWorkhourTracking', 'mrr.mrr-plant', 'dashboard.rfq-forecast', 'dashboard.workhour-track',
        'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
        'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4',
        'report.not-bound', 'report.actual', 'military-order.goal']).subscribe(res => {
          this.querySelect.plant.style.label = res['mrr.mrr-plant'];
          this.tipTxt[0].text = res['dashboard.dfc-track-tipTxt1'];
          this.tipTxt[1].text = res['dashboard.dfc-track-tipTxt2'];
          this.tipTxt[2].text = res['dashboard.dfc-track-tipTxt3'];
          this.tipTxt[3].text = res['dashboard.dfc-track-tipTxt4'];
          this.trans['title'] = res['dashboard.rfqWorkhourTracking'];
          this.trans['notBound'] = res['report.not-bound'];
          this.trans['actual'] = res['report.actual'];
          this.trans['goal'] = res['military-order.goal'];
        });
    });
    this.initPlantSelect();
    this.route.params.subscribe(param => {
      if (param['plant']) {
        this.querySelect.plant.value = param['plant'];
        this.changePlant();
        if (!this.statusValue.includes(this.trackParam['color'])) {
          this.statusValue.push(this.trackParam['color']);
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

  changePlant() {
    this.queryFlag = false;
    this.statusValue = [];
  }

  async getWorkhourTrack() {
    this.workhourTrackData = {};
    const jobs = [
      this.dfcDashboardApi.find({ where: { isTargetSigned: 1 } }).toPromise(),
      this.processCodeApi.find().toPromise(),
      this.basicModelApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    const project = jobsResult[0];
    const processCodeTable = jobsResult[1];
    const basicModels = jobsResult[2];
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    project.forEach(x => {
      x['unknownProductType'] = false;
      x['processCodeMissing'] = false;
      x['noRfqCode'] = false;
      x['notBound'] = false;
      x['notUploadedExpired'] = false;
      x['notUploadedWarning'] = false;
      x['workhourUploaded'] = false;
      x['currentStage'] = 'rfq';
      x['modelDetail'] = null;
      const dueday = [
        { stage: 'C2', date: new Date(x['c2Dueday']) },
        { stage: 'C3', date: new Date(x['c3Dueday']) },
        { stage: 'C4', date: new Date(x['c4Dueday']) },
        { stage: 'C5', date: new Date(x['c5Dueday']) },
        { stage: 'C6', date: new Date(x['c6Dueday']) }
      ];
      for (let i = 0; i < dueday.length; i++) {
        if (moment(new Date(dueday[i].date)).format('YYYY-MM-DD HH:mm:ss') > now) {
          x['currentStage'] = dueday[i].stage;
          break;
        }
      }
      if (x['c5Dueday']) {
        x['c5Dueday'] = new Date(x['c5Dueday']);
      }

      const processCode = processCodeTable.find(m => (m['plantId'] === x['plant'] && m['productId'] === x['product']));
      if (['None', '', null].includes(x['rfqProjectCode'])) {
        x['noRfqCode'] = true;
      }
      if (!processCode) {
        x['processCodeMissing'] = true;

      } else if (['', null].includes(x['rfqProjectName'])) {
        x['notBound'] = true;
      }
      const t_model = basicModels.filter(d => d['projectNameId'] === x['projectNameId']);
      const modelDetail = t_model.map(t => {
        return {
          modelId: t['modelId'],
          isTargetSignSent: t['isTargetSignSent'],
          isTargetSignApproved: t['isTargetSignApproved']
        };
      });
      if (x['actualWorkHours']) {
        x['workhourUploaded'] = true;
      } else {
        if (now > moment(new Date(x['c5Dueday'])).format('YYYY-MM-DD HH:mm:ss')) {
          x['notUploadedExpired'] = true;
        } else {
          x['notUploadedWarning'] = true;
        }
      }
      const returnObj = {
        ProjectNameID: x['projectNameId'],
        Plant: x['plant'],
        BU: x['bu'],
        Customer: x['customer'],
        ModelType: x['product'],
        ProjectCode: x['projectCode'],
        ProjectName: x['projectName'],
        RfqProjectCode: x['rfqProjectCode'],
        RfqProjectName: x['rfqProjectName'],
        PLMProjectStatus: x['plmStatus'],
        IsTargetSigned: x['isTargetSigned'],
        workhourGoal: x['workhourGoal'],
        currentStage: x['currentStage'],
        totalCostTime: x['actualWorkHours'],
        totalTargetCostTime: x['targetWorkHours'],
        C5DueDay: x['c5Dueday'],
        modelDetail: modelDetail,
      };
      if (!this.workhourTrackData[x['plant']]) {
        this.workhourTrackData[x['plant']] = {
          unknownProductType: [],
          processCodeMissing: [],
          noRfqCode: [],
          notBound: [],
          uploadedGoal: [],
          notUploadedExpired: [],
          notUploadedWarning: []
        };
      }
      if (!x['product']) {
        this.workhourTrackData[x['plant']].unknownProductType.push(returnObj);
      } else if (x['processCodeMissing']) {
        this.workhourTrackData[x['plant']].processCodeMissing.push(returnObj);
      } else if (x['noRfqCode']) {
        this.workhourTrackData[x['plant']].noRfqCode.push(returnObj);
      } else if (x['notBound']) {
        this.workhourTrackData[x['plant']].notBound.push(returnObj);
      } else if (x['workhourUploaded']) {
        this.workhourTrackData[x['plant']].uploadedGoal.push(returnObj);
      } else { // not uploaded
        if (x['notUploadedExpired']) {
          this.workhourTrackData[x['plant']].notUploadedExpired.push(returnObj);
        } else if (x['notUploadedWarning']) {
          this.workhourTrackData[x['plant']].notUploadedWarning.push(returnObj);
        }
      }
    });
    for (const key in this.workhourTrackData) {
      if (this.workhourTrackData.hasOwnProperty(key)) {
        this.workhourTrackData[key]['Plant'] = key;
        if (this.workhourTrackData[key]['uploadedGoal'].length > 0) {
          this.workhourTrackData[key]['uploadedGoal'].forEach(element => {
            element['color'] = 'green';
            if (element['totalTargetCostTime'] && element['totalCostTime']) {
              if (element['totalTargetCostTime'] > element['totalCostTime']) {
                element['fontWeight'] = 'bold';
              }
              element['workHourRatio'] = `${this.trans['goal']}:` + element['totalTargetCostTime'].toFixed(2) + '\n' + `${this.trans['actual']}:` + element['totalCostTime'].toFixed(2);
            } else {
              element['workHourRatio'] = null;
            }
          });
        }
        if (this.workhourTrackData[key]['notUploadedExpired'].length > 0) {
          this.workhourTrackData[key]['notUploadedExpired'].forEach(element => {
            element['color'] = 'red';
          });
        }
        if (this.workhourTrackData[key]['notUploadedWarning'].length > 0) {
          this.workhourTrackData[key]['notUploadedWarning'].forEach(element => {
            element['color'] = 'yellow';
          });
        }
        if (this.workhourTrackData[key]['noRfqCode'].length > 0) {
          this.workhourTrackData[key]['noRfqCode'].forEach(element => {
            element['color'] = 'purple';
            element['textDetail'] = this.trans['notBound'];
          });
        }
        if (this.workhourTrackData[key]['notBound'].length > 0) {
          this.workhourTrackData[key]['notBound'].forEach(element => {
            element['color'] = 'purple';
            element['textDetail'] = this.trans['notBound'];
          });
        }
        if (this.workhourTrackData[key]['processCodeMissing'].length > 0) {
          this.workhourTrackData[key]['processCodeMissing'].forEach(element => {
            element['color'] = 'purple';
            element['textDetail'] = this.trans['notBound'];
          });
        }
        if (this.workhourTrackData[key]['unknownProductType'].length > 0) {
          this.workhourTrackData[key]['unknownProductType'].forEach(element => {
            element['color'] = 'purple';
            element['textDetail'] = this.trans['notBound'];
          });
        }
        this.dataSet.push(this.workhourTrackData[key]);
      }
    }
  }

  async query() {
    this.isLoading = true;
    this.tableFlag = false;
    await this.getWorkhourTrack();
    if (!this.querySelect.plant.value) {
      this.message.create('error', 'Please select the plant！');
    }
    if (!!this.querySelect.plant.value) {
      const plantData = this.dataSet.filter(
        trackData => trackData['Plant'] === this.querySelect.plant.value
      );
      let dataList = [];
      if (plantData.length !== 0) {
        dataList = [
          ...plantData[0]['uploadedGoal'],
          ...plantData[0]['notUploadedExpired'],
          ...plantData[0]['notUploadedWarning'],
          ...plantData[0]['noRfqCode'],
          ...plantData[0]['notBound'],
          ...plantData[0]['processCodeMissing'],
          ...plantData[0]['unknownProductType']
        ];
      }
      if (this.statusValue.length !== 0) {
        this.trackDataList = dataList.filter(trackData =>
          this.statusValue.includes(trackData['color'])
        );
      } else {
        this.trackDataList = dataList;
      }
      this.isLoading = false;
      this.tableFlag = true;
    }
  }

  download() {
    const downLoadData = [];
    for (const item of this.trackDataList) {
      if (item.C5DueDay) {
        item.C5DueDay = moment(new Date(item.C5DueDay)).format('YYYY-MM-DD');
      }
      const Data = {
        Plant: item.Plant,
        BU: item.BU,
        Customer: item.Customer,
        ProductType: item.ProductType,
        ProjectCode: item.ProjectCode,
        ProjectName: item.ProjectName,
        RfqProjectCode: item.RfqProjectCode,
        RfqProjectName: item.RfqProjectName,
        PLMProjectStatus: item.PLMProjectStatus,
        IsTargetSigned: item.IsTargetSigned,
        currentStage: item.currentStage,
        C5DueDay: item.C5DueDay,
        textDetail: item.textDetail,
      };
      downLoadData.push(Data);
    }
    this.downexcelService.exportAsExcelFile(downLoadData, this.trans['title']);
  }

  // 跳轉至機種工時資料維護
  toWorkhourMaintain(data) {
    this.router.navigate(['/dashboard/dfc/workhour-maintain'], {
      queryParams: {
        Plant: data.Plant,
        Product: data.ModelType,
        Customer: data.Customer,
        ProjectNameID: data.ProjectNameID
      }
    });
  }

  // 跳轉至機種工時Report
  toModelWorkhour(data) {
    this.router.navigate([
      '/dashboard/dfc/model-workhour/' +
      data.Plant +
      '/' +
      data.ModelType +
      '/' +
      data.lastUploadStage +
      '/' +
      data.ProjectNameID
    ]);
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
