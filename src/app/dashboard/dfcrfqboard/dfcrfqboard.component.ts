import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DfcDashboardApi } from '@service/dfc_sdk/sdk';
import { ProcessCodeApi } from '@service/dfi-sdk';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dfcrfqboard',
  templateUrl: './dfcrfqboard.component.html',
  styleUrls: ['./dfcrfqboard.component.scss']
})
export class DfcrfqboardComponent implements OnInit, OnChanges {
  option;
  title;
  statusColor;
  legendFlag = false;
  // 工時預測提示字樣
  tipTxt1 = [
    {
      class: 'green-circle',
      text: '目標工時生成, 且簽核完畢',
      color: 'green'
    },
    {
      class: 'red-circle',
      text: 'RFQ D.D ≤ 系統日期, 且未完成目標工時生成簽核',
      color: 'red'
    },
    {
      class: 'orange-circle',
      text: 'RFQ D.D 前一个月 ≤ 系統日期 < RFQ D.D, 且未完成目標工時生成簽核',
      color: 'yellow'
    },
    {
      class: 'purple-circle',
      text: 'RFQ D.D 前一个月 ≤ 系統日期 < RFQ D.D, 機種信息維護不完全 (未維護產品別/未複製/未維護製程)',
      color: 'purple'
    },
    {
      class: 'gray-circle',
      text: '系統日期 < RFQ D.D 前一个月',
      color: 'grey'
    }
  ];
  workhourForecastByPlant = {};
  // 工時追蹤提示字樣
  tipTxt2 = [
    {
      class: 'green-circle',
      text: '曾上傳过工時',
      color: 'green'
    },
    {
      class: 'red-circle',
      text: '未曾上傳過工時，C5 D.D < 系统日期',
      color: 'red'
    },
    {
      class: 'orange-circle',
      text: '未曾上傳過工時， C5 D.D ≥ 系统日期',
      color: 'yellow'
    },
    {
      class: 'purple-circle',
      text: '未做 BA機種 與 RFQ機種的綁定動作',
      color: 'purple'
    }
  ];
  workhourTrackByPlant = {};
  // 廠別參數
  DfcBgPlantMapping;
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  wtOptions1 = [];
  wtOptions2 = [];
  wsdOptions = [];
  rightOption1 = {};
  rightOption2 = {};
  // DFC落地執行傳入所需參數
  routeFlag = false;
  echartSummarytop = [];
  echartSummarybottom = [];
  isLoading = true;
  @Input() floorTitle;
  @Input() floorColor;
  @Input() floorLegendFlag;
  transNotice = {};
  constructor(
    private processCodeApi: ProcessCodeApi,
    private dfcDashboardApi: DfcDashboardApi,
    private route: Router,
    private router: ActivatedRoute,
    private translate: TranslateService
  ) { }

  // DFC落地執行導入
  async ngOnChanges(changes: SimpleChanges) {
    const res = new Map();
    this.PlantMapping = this.PlantMapping.filter(p => !res.has(p.Plant) && res.set(p.Plant, 1));
    const plantMappingSet = this.PlantMapping.reduce((p, t) => {
      if (!p['bgSet'][t['op']]) {
        p['bgSet'][t['op']] = [];
      }
      p['bgSet'][t['op']].push(t['Plant']);
      return p;
    }, {
      bgSet: {}
    });
    this.DfcBgPlantMapping = plantMappingSet['bgSet'];
    if (changes['floorLegendFlag'].currentValue) {
      this.legendFlag = true;
      await this.getForecastData();
      this.getWorkhourForecastPie(changes['floorColor'].currentValue);
      this.isLoading = false;
    } else {
      this.legendFlag = false;
      await this.getWorkhourTrackData();
      this.getWorkhourTrackPie(changes['floorColor'].currentValue);
      this.isLoading = false;
    }
    this.routeFlag = false;
  }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['dashboard.rfq-forecast', 'dashboard.workhour-track',
      'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
      'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4']).subscribe(res => {
        this.transNotice['foreTitle'] = res['dashboard.rfq-forecast'];
        this.transNotice['trackTitle'] = res['dashboard.workhour-track'];
        this.tipTxt1[0].text = res['dashboard.dfc-rfqfore-tipTxt1'];
        this.tipTxt1[1].text = res['dashboard.dfc-rfqfore-tipTxt2'];
        this.tipTxt1[2].text = res['dashboard.dfc-rfqfore-tipTxt3'];
        this.tipTxt1[3].text = res['dashboard.dfc-rfqfore-tipTxt4'];
        this.tipTxt1[4].text = res['dashboard.dfc-rfqfore-tipTxt5'];
        this.tipTxt2[0].text = res['dashboard.dfc-track-tipTxt1'];
        this.tipTxt2[1].text = res['dashboard.dfc-track-tipTxt2'];
        this.tipTxt2[2].text = res['dashboard.dfc-track-tipTxt3'];
        this.tipTxt2[3].text = res['dashboard.dfc-track-tipTxt4'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dashboard.rfq-forecast', 'dashboard.workhour-track',
        'dashboard.dfc-rfqfore-tipTxt1', 'dashboard.dfc-rfqfore-tipTxt2', 'dashboard.dfc-rfqfore-tipTxt3', 'dashboard.dfc-rfqfore-tipTxt4', 'dashboard.dfc-rfqfore-tipTxt5',
        'dashboard.dfc-track-tipTxt1', 'dashboard.dfc-track-tipTxt2', 'dashboard.dfc-track-tipTxt3', 'dashboard.dfc-track-tipTxt4']).subscribe(res => {
          this.transNotice['foreTitle'] = res['dashboard.rfq-forecast'];
          this.transNotice['trackTitle'] = res['dashboard.workhour-track'];
          this.tipTxt1[0].text = res['dashboard.dfc-rfqfore-tipTxt1'];
          this.tipTxt1[1].text = res['dashboard.dfc-rfqfore-tipTxt2'];
          this.tipTxt1[2].text = res['dashboard.dfc-rfqfore-tipTxt3'];
          this.tipTxt1[3].text = res['dashboard.dfc-rfqfore-tipTxt4'];
          this.tipTxt1[4].text = res['dashboard.dfc-rfqfore-tipTxt5'];
          this.tipTxt2[0].text = res['dashboard.dfc-track-tipTxt1'];
          this.tipTxt2[1].text = res['dashboard.dfc-track-tipTxt2'];
          this.tipTxt2[2].text = res['dashboard.dfc-track-tipTxt3'];
          this.tipTxt2[3].text = res['dashboard.dfc-track-tipTxt4'];
        });
    });
    // by Plant Deduplication
    const res = new Map();
    this.PlantMapping = this.PlantMapping.filter(p => !res.has(p.Plant) && res.set(p.Plant, 1));
    const plantMappingSet = this.PlantMapping.reduce((p, t) => {
      if (!p['bgSet'][t['op']]) {
        p['bgSet'][t['op']] = [];
      }
      p['bgSet'][t['op']].push(t['Plant']);
      return p;
    }, {
      bgSet: {}
    });
    this.DfcBgPlantMapping = plantMappingSet['bgSet'];
    // fetch route params
    this.router.params.subscribe(async params => {
      if (Object.keys(params).length) {
        this.statusColor = params['color'];
        this.routeFlag = true;
        if (params['title'] === 'forecast') {
          this.title = this.transNotice['foreTitle'];
          this.legendFlag = true;
          await this.getForecastData();
          this.getWorkhourForecastPie('');
        } else {
          this.title = this.transNotice['trackTitle'];
          this.legendFlag = false;
          await this.getWorkhourTrackData();
          this.getWorkhourTrackPie('');
        }
      }
    });
  }

  async getForecastData() {
    const jobs = [
      this.dfcDashboardApi.find().toPromise(),
      this.processCodeApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    const project = jobsResult[0];
    const processCodeTable = jobsResult[1];
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const warnDate = moment(new Date(new Date().setDate(new Date().getDate() + 30))).format('YYYY-MM-DD HH:mm:ss');
    project.forEach(t => {
      t['unknownProductType'] = false;
      t['processCodeMissing'] = false;
      t['notCopied'] = false;
      const processCode = processCodeTable.find(x => (x['plantId'] === t['plant'] && x['productId'] === t['product']));
      if (!processCode) {
        t['processCodeMissing'] = true;
      }
      if ((t['projectCode'].startsWith('QRQY') || t['projectCode'].startsWith('DMA-')) && t['isPlmProject'] && !t['isPlmRfqCopied']) {
        // 未複製的PLM Project沒有Model/Stage
        t['notCopied'] = true;
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
        RfqDueDay: t['rfqDueday']
      };
      if (!this.workhourForecastByPlant[t['plant']]) {
        this.workhourForecastByPlant[t['plant']] = {
          signed: [],
          expired: [],
          warning: [],
          warningIncomplete: [],
          remind: []
        };
      }
      if (t['isTargetSigned']) {
        this.workhourForecastByPlant[t['plant']].signed.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= now) {
        this.workhourForecastByPlant[t['plant']].expired.push(returnObj);
      } else if (moment(new Date(returnObj.RfqDueDay)).format('YYYY-MM-DD HH:mm:ss') <= warnDate) {
        if (!t['product'] || t['notCopied'] || t['processCodeMissing']) {
          this.workhourForecastByPlant[t['plant']].warningIncomplete.push(returnObj);
        } else {
          this.workhourForecastByPlant[t['plant']].warning.push(returnObj);
        }
      } else {
        this.workhourForecastByPlant[t['plant']].remind.push(returnObj);
      }
    });
  }

  async getWorkhourTrackData() {
    const jobs = [
      this.dfcDashboardApi.find({ where: { isTargetSigned: 1 } }).toPromise(),
      this.processCodeApi.find().toPromise()
    ];
    const jobsResult = await Promise.all(jobs);
    const project = jobsResult[0];
    const processCodeTable = jobsResult[1];
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    project.forEach(x => {
      x['unknownProductType'] = false;
      x['processCodeMissing'] = false;
      x['noRfqCode'] = false;
      x['notBound'] = false;
      x['notUploadedExpired'] = false;
      x['notUploadedWarning'] = false;
      x['workhourUploaded'] = null;
      x['workhourGoal'] = null;
      x['currentStage'] = 'rfq';
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
      // else if (x['projectCode'].startsWith('DMA-')) {
      //   // 如果本身是DMA-開頭的機種，則撈取對應BA機種的c5Dueday
      //   const proNames = basicProjectName.filter(vv => vv['RfqProjectCode'] === x['projectCode']);
      //   const proCodes = basicProjectCode.filter(cc => cc['Plant'] === x['plant']);
      //   if (proNames.length) {
      //     for (let index = 0; index < proNames.length; index++) {
      //       const temPro = proCodes.filter(rr => rr['ProjectCodeID'] === proNames[index]['ProjectCodeID']);
      //       if (temPro && temPro.length) {
      //         x['c5Dueday'] = temPro[0]['C5DueDay']
      //       }
      //     }
      //   }
      // }
      const processCode = processCodeTable.find(m => (m['plantId'] === x['plant'] && m['productId'] === x['product']));

      if (['None', '', null].includes(x['rfqProjectCode'])) {
        x['noRfqCode'] = true;
      }
      if (!processCode) {
        x['processCodeMissing'] = true;
        // return;
      } else if (['', null].includes(x['rfqProjectName'])) {
        x['notBound'] = true;
      }
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
        workhourUploaded: x['workhourUploaded'],
        workhourGoal: x['workhourGoal'],
        currentStage: x['currentStage'],
        totalCostTime: x['actualWorkHours'],
        totalTargetCostTime: x['targetWorkHours'],
        C5DueDay: x['c5Dueday']
      };
      if (!this.workhourTrackByPlant[x['plant']]) {
        this.workhourTrackByPlant[x['plant']] = {
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
        this.workhourTrackByPlant[x['plant']].unknownProductType.push(returnObj);
      } else if (x['processCodeMissing']) {
        this.workhourTrackByPlant[x['plant']].processCodeMissing.push(returnObj);
      } else if (x['noRfqCode']) {
        this.workhourTrackByPlant[x['plant']].noRfqCode.push(returnObj);
      } else if (x['notBound']) {
        this.workhourTrackByPlant[x['plant']].notBound.push(returnObj);
      } else if (x['workhourUploaded']) {
        this.workhourTrackByPlant[x['plant']].uploadedGoal.push(returnObj);
      } else { // not uploaded
        if (x['notUploadedExpired']) {
          this.workhourTrackByPlant[x['plant']].notUploadedExpired.push(returnObj);
        } else if (x['notUploadedWarning']) {
          this.workhourTrackByPlant[x['plant']].notUploadedWarning.push(returnObj);
        }
      }
    });
  }

  // 獲取RFQ工時預測餅圖數據
  async getWorkhourForecastPie(color) {
    if (color) {
      this.statusColor = color;
    }
    const params = {
      flagColor: this.statusColor,
      bgData: [],
      plantData: []
    };
    const bgTotal = {};
    for (const plantKey in this.workhourForecastByPlant) {
      if (this.workhourForecastByPlant.hasOwnProperty(plantKey)) {
        for (const bgKey in this.DfcBgPlantMapping) {
          if (this.DfcBgPlantMapping.hasOwnProperty(bgKey)) {
            if (this.DfcBgPlantMapping[bgKey].includes(plantKey)) {
              if (!bgTotal[bgKey]) {
                bgTotal[bgKey] = {
                  green: 0,
                  red: 0,
                  yellow: 0,
                  grey: 0,
                  purple: 0
                };
              }
              bgTotal[bgKey]['green'] += this.workhourForecastByPlant[plantKey][
                'signed'
              ].length;
              bgTotal[bgKey]['red'] += this.workhourForecastByPlant[plantKey][
                'expired'
              ].length;
              bgTotal[bgKey]['yellow'] += this.workhourForecastByPlant[
                plantKey
              ]['warning'].length;
              bgTotal[bgKey]['grey'] += this.workhourForecastByPlant[plantKey][
                'remind'
              ].length;
              bgTotal[bgKey]['purple'] += this.workhourForecastByPlant[
                plantKey
              ]['warningIncomplete'].length;
              if (!bgTotal[bgKey][plantKey]) {
                bgTotal[bgKey][plantKey] = {
                  green: 0,
                  red: 0,
                  yellow: 0,
                  grey: 0,
                  purple: 0
                };
              }
              if (params['flagColor'] === 'green') {
                bgTotal[bgKey][plantKey][
                  params['flagColor']
                ] = this.workhourForecastByPlant[plantKey]['signed'].length;
              } else if (params['flagColor'] === 'red') {
                bgTotal[bgKey][plantKey][
                  params['flagColor']
                ] = this.workhourForecastByPlant[plantKey]['expired'].length;
              } else if (params['flagColor'] === 'yellow') {
                bgTotal[bgKey][plantKey][
                  params['flagColor']
                ] = this.workhourForecastByPlant[plantKey]['warning'].length;
              } else if (params['flagColor'] === 'grey') {
                bgTotal[bgKey][plantKey][
                  params['flagColor']
                ] = this.workhourForecastByPlant[plantKey]['remind'].length;
              } else {
                bgTotal[bgKey][plantKey][params['flagColor']] = this.workhourForecastByPlant[plantKey]['warningIncomplete'].length;
              }
            }
          }
        }
      }
    }
    let bgValueFlag = true;
    for (const bgKey in bgTotal) {
      if (bgTotal.hasOwnProperty(bgKey)) {
        bgValueFlag = bgValueFlag && bgTotal[bgKey][this.statusColor] === 0;
        params.bgData.push({
          name: bgKey,
          value: bgTotal[bgKey][this.statusColor],
          plantCnt: Object.keys(bgTotal[bgKey]).length - 5,
          bgData: bgTotal[bgKey][this.statusColor]
        });
        for (const plantKey in bgTotal[bgKey]) {
          if (bgTotal[bgKey].hasOwnProperty(plantKey)) {
            this.PlantMapping.forEach(plantNames => {
              if (plantKey === plantNames['Plant']) {
                params.plantData.push({
                  name: plantNames['PlantName'],
                  value: bgTotal[bgKey][plantKey][this.statusColor]
                });
              }
            });
          }
        }
      }
    }
    if (bgValueFlag) {
      params.bgData = params.bgData.map(d => {
        d.value = d.plantCnt;
        return d;
      });
    }
    this.PlantRfq();
    this.rfqWorkhourForecastPie(params);
    this.isLoading = false;
  }

  // 獲取工時追蹤餅圖數據
  async getWorkhourTrackPie(color) {
    if (color) {
      this.statusColor = color;
    }
    const params = {
      flagColor: this.statusColor,
      bgData: [],
      plantData: []
    };
    const bgTotal = {};
    for (const plantKey in this.workhourTrackByPlant) {
      if (this.workhourTrackByPlant.hasOwnProperty(plantKey)) {
        for (const bgKey in this.DfcBgPlantMapping) {
          if (this.DfcBgPlantMapping.hasOwnProperty(bgKey)) {
            if (this.DfcBgPlantMapping[bgKey].includes(plantKey)) {
              if (!bgTotal[bgKey]) {
                bgTotal[bgKey] = {
                  green: 0,
                  red: 0,
                  yellow: 0,
                  purple: 0
                };
              }
              bgTotal[bgKey]['green'] += this.workhourTrackByPlant[plantKey]['uploadedGoal'].length;
              bgTotal[bgKey]['red'] += this.workhourTrackByPlant[plantKey]['notUploadedExpired'].length;
              bgTotal[bgKey]['yellow'] += this.workhourTrackByPlant[plantKey]['notUploadedWarning'].length;
              bgTotal[bgKey]['purple'] += this.workhourTrackByPlant[plantKey]['noRfqCode'].length;
              bgTotal[bgKey]['purple'] += this.workhourTrackByPlant[plantKey]['notBound'].length;
              bgTotal[bgKey]['purple'] += this.workhourTrackByPlant[plantKey]['processCodeMissing'].length;
              bgTotal[bgKey]['purple'] += this.workhourTrackByPlant[plantKey]['unknownProductType'].length;
              if (!bgTotal[bgKey][plantKey]) {
                bgTotal[bgKey][plantKey] = {
                  green: 0,
                  red: 0,
                  yellow: 0,
                  purple: 0
                };
              }
              if (params['flagColor'] === 'green') {
                bgTotal[bgKey][plantKey][params['flagColor']] =
                  this.workhourTrackByPlant[plantKey]['uploadedGoal'].length;
              } else if (params['flagColor'] === 'red') {
                bgTotal[bgKey][plantKey][params['flagColor']] =
                  this.workhourTrackByPlant[plantKey]['notUploadedExpired'].length;
              } else if (params['flagColor'] === 'yellow') {
                bgTotal[bgKey][plantKey][params['flagColor']] =
                  this.workhourTrackByPlant[plantKey]['notUploadedWarning'].length;
              } else {
                bgTotal[bgKey][plantKey][params['flagColor']] =
                  this.workhourTrackByPlant[plantKey]['noRfqCode'].length +
                  this.workhourTrackByPlant[plantKey]['notBound'].length +
                  this.workhourTrackByPlant[plantKey]['processCodeMissing'].length +
                  this.workhourTrackByPlant[plantKey]['unknownProductType'].length;
              }
            }
          }
        }
      }
    }
    let bgValueFlag = true;
    for (const bgKey in bgTotal) {
      if (bgTotal.hasOwnProperty(bgKey)) {
        bgValueFlag = bgValueFlag && bgTotal[bgKey][this.statusColor] === 0;
        params.bgData.push({
          name: bgKey,
          value: bgTotal[bgKey][this.statusColor],
          plantCnt: Object.keys(bgTotal[bgKey]).length - 6,
          bgData: bgTotal[bgKey][this.statusColor]
        });
        for (const plantKey in bgTotal[bgKey]) {
          if (bgTotal[bgKey].hasOwnProperty(plantKey)) {
            this.PlantMapping.forEach(plantNames => {
              if (plantKey === plantNames['Plant']) {
                params.plantData.push({
                  name: plantNames['PlantName'],
                  value: bgTotal[bgKey][plantKey][this.statusColor]
                });
              }
            });
          }
        }
      }
    }
    if (bgValueFlag) {
      params.bgData = params.bgData.map(d => {
        d.value = d.plantCnt;
        return d;
      });
    }
    this.PlantWorkhour();
    this.workhourTrackPie(params);
    this.isLoading = false;
  }

  // 點擊切換不同燈號的餅圖
  switchColor(item) {
    this.statusColor = item['color'];
    if (this.title === this.transNotice['foreTitle']) {
      this.getWorkhourForecastPie(this.statusColor);
    } else {
      this.getWorkhourTrackPie(this.statusColor);
    }
  }

  // RFQ工時預測餅圖
  rfqWorkhourForecastPie(params) {
    if (params.flagColor === 'green') {
      this.echartSummarytop = params.plantData;
    }
    this.option = {
      series: [
        {
          name: this.transNotice['foreTitle'],
          type: 'pie',
          center: ['50%', '60%'],
          radius: [0, '30%'],
          hoverAnimation: false,
          label: {
            normal: {
              formatter: params => {
                return params.name + ':' + params.data.bgData;
              },
              position: 'inside',
              fontSize: 14,
              color: '#000',
              rotate: 'radial',
              align: 'right'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color:
                params.flagColor === 'green'
                  ? 'rgb(60, 255, 76)'
                  : params.flagColor === 'red'
                    ? 'rgb(255, 68, 68)'
                    : params.flagColor === 'yellow'
                      ? 'rgb(248, 252, 55)'
                      : params.flagColor === 'grey'
                        ? '#b9b6b6'
                        : 'rgb(201, 67, 201)',
              borderWidth: 2,
              borderColor: 'white'
            }
          },
          data: params.bgData
        },
        {
          name: this.transNotice['foreTitle'],
          type: 'pie',
          center: ['50%', '60%'],
          radius: ['30%', '52%'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              formatter: '\n{b| {b}：}{c|{c}}\n ',
              position: 'outer',
              alignTo: 'edge',
              margin: '20%',
              rich: {
                b: {
                  fontSize: 14,
                  lineHeight: 30,
                  color: '#334455',
                  align: 'left'
                },
                c: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  fontSize: 16,
                },
              }
            }
          },
          itemStyle: {
            normal: {
              color:
                params.flagColor === 'green'
                  ? 'rgb(60, 255, 76)'
                  : params.flagColor === 'red'
                    ? 'rgb(255, 68, 68)'
                    : params.flagColor === 'yellow'
                      ? 'rgb(248, 252, 55)'
                      : params.flagColor === 'grey'
                        ? '#b9b6b6'
                        : 'rgb(201, 67, 201)',
              borderWidth: 2,
              borderColor: 'white'
            }
          },
          data: params.plantData
        }
      ]
    };
  }

  // 工時追蹤餅圖
  workhourTrackPie(params) {
    if (params.flagColor === 'green') {
      this.echartSummarybottom = params.plantData;
    }
    this.option = {
      series: [
        {
          name: this.transNotice['trackTitle'],
          type: 'pie',
          center: ['50%', '60%'],
          radius: [0, '30%'],
          hoverAnimation: false,
          label: {
            normal: {
              formatter: params => {
                return params.name + ':' + params.data.bgData;
              },
              position: 'inside',
              fontSize: 14,
              color: '#000',
              rotate: 'radial',
              align: 'right'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color:
                params.flagColor === 'green'
                  ? 'rgb(60, 255, 76)'
                  : params.flagColor === 'red'
                    ? 'rgb(255, 68, 68)'
                    : params.flagColor === 'yellow'
                      ? 'rgb(248, 252, 55)'
                      : 'rgb(201, 67, 201)',
              borderWidth: 2,
              borderColor: 'white'
            }
          },
          data: params.bgData
        },
        {
          name: this.transNotice['trackTitle'],
          type: 'pie',
          center: ['50%', '60%'],
          radius: ['30%', '52%'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              formatter: '\n{b| {b}：}{c|{c}}\n ',
              position: 'outer',
              alignTo: 'edge',
              margin: '20%',
              rich: {
                b: {
                  fontSize: 14,
                  lineHeight: 30,
                  color: '#334455',
                  align: 'left'
                },
                c: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  fontSize: 16,
                },
              }
            }
          },
          itemStyle: {
            normal: {
              color:
                params.flagColor === 'green'
                  ? 'rgb(60, 255, 76)'
                  : params.flagColor === 'red'
                    ? 'rgb(255, 68, 68)'
                    : params.flagColor === 'yellow'
                      ? 'rgb(248, 252, 55)'
                      : 'rgb(201, 67, 201)',
              borderWidth: 2,
              borderColor: 'white'
            }
          },
          data: params.plantData
        }
      ]
    };
  }

  // 厂别 数据组合
  PlantRfq() {
    const params = {
      yAxis: [],
      series: [
        {
          name: 'green',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'red',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'yellow',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'grey',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'purple',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        }
      ]
    };
    for (const plant in this.workhourForecastByPlant) {
      if (this.workhourForecastByPlant.hasOwnProperty(plant)) {
        const plantDatas = this.workhourForecastByPlant[plant];
        const plantMapping = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant);
        if (!plantMapping) {
          continue;
        } else {
          params.yAxis.push(plantMapping['PlantName']);
          params.series[0].data.push(plantDatas['signed'].length);
          params.series[1].data.push(plantDatas['expired'].length);
          params.series[2].data.push(plantDatas['warning'].length);
          params.series[3].data.push(plantDatas['remind'].length);
          params.series[4].data.push(plantDatas['warningIncomplete'].length);
        }
      }
    }
    this.rightOption1 = this.PlantRfqWorkhourForecastPie(params);
  }

  PlantWorkhour() {
    const params = {
      yAxis: [],
      series: [
        {
          name: 'green',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'red',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'yellow',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        },
        {
          name: 'purple',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
            color: 'black'
          }
        }
      ]
    };
    for (const plant in this.workhourTrackByPlant) {
      if (this.workhourTrackByPlant.hasOwnProperty(plant)) {
        const plantDatas = this.workhourTrackByPlant[plant];
        const plantMapping = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant);
        params.yAxis.push((!plantMapping) ? plant : plantMapping['PlantName']);
        params.series[0].data.push(plantDatas['uploadedGoal'].length);
        params.series[1].data.push(plantDatas['notUploadedExpired'].length);
        params.series[2].data.push(plantDatas['notUploadedWarning'].length);
        params.series[3].data.push((
          plantDatas['noRfqCode'].length +
          plantDatas['notBound'].length +
          plantDatas['processCodeMissing'].length +
          plantDatas['unknownProductType'].length
        ));
      }
    }
    this.rightOption2 = this.PlantWorkhourTrackPie(params);
  }

  PlantRfqWorkhourForecastPie(param) {

    const option = {
      color: ['rgb(60, 255, 76)', 'rgb(255, 68, 68)', 'rgb(248, 252, 55)', '#b9b6b6', 'rgb(201, 67, 201)'],
      backgroundColor: '#e5e5e5',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: param.yAxis,
          splitLine: {
            show: true
          },
          max: '120px'
        }
      ],
      series: param.series
    };
    return option;
  }

  PlantWorkhourTrackPie(param) {
    const option = {
      color: [
        'rgb(60, 255, 76)',
        'rgb(255, 68, 68)',
        'rgb(248, 252, 55)',
        'rgb(201, 67, 201)'
      ],
      backgroundColor: '#e5e5e5',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: param.yAxis,
          splitLine: {
            show: true
          },
          max: '200px'
        }
      ],
      series: param.series
    };
    return option;
  }

  // 未开发系统饼图
  getPieOptionOngoing(text) {
    const option = {
      title: {
        text: text,
        x: 'center',
        y: '5px',
        textStyle: {
          fontSize: 15,
          color: 'black',
          fontWeight: 'normal'
        }
      },
      backgroundColor: '#e5e5e5',
      series: [
        {
          type: 'pie',
          z: 9,
          center: ['50%', '60%'],
          radius: ['50%', '70%'],
          animation: false,
          silent: false,
          data: [
            {
              name: '暫無數據',
              value: 0,
              itemStyle: {
                normal: {
                  color: 'rgba(248, 244, 244, 0.973)',
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 12
                    }
                  }
                }
              }
            }
          ]
        }
      ]
    };
    return option;
  }

  onChartEventRFQ(event) {
    const workhourData = JSON.stringify({
      name: event['seriesName'],
      color: this.statusColor
    });
    localStorage.setItem('workhourData', workhourData);
    this.PlantMapping.forEach(plantNames => {
      if (event['name'] === plantNames['PlantName']) {
        this.route.navigate([
          '/dashboard/dfc/work-reaching/' + plantNames['Plant']
        ]);
      }
    });
  }

  onPlantRfqChartEvent(event) {
    const workhourData = JSON.stringify({
      name: this.transNotice['foreTitle'],
      color: event['seriesName']
    });
    localStorage.setItem('workhourData', workhourData);
    this.PlantMapping.forEach(plantNames => {
      if (event['name'] === plantNames['PlantName']) {
        this.route.navigate([
          '/dashboard/dfc/work-reaching/' + plantNames['Plant']
        ]);
      }
    });
  }

  onPlantWorkhourChartEvent(event) {
    const workhourData = JSON.stringify({
      name: this.transNotice['trackTitle'],
      color: event['seriesName']
    });
    localStorage.setItem('workhourData', workhourData);
    this.PlantMapping.forEach(plantNames => {
      if (event['name'] === plantNames['PlantName']) {
        this.route.navigate([
          '/dashboard/dfc/work-reaching/' + plantNames['Plant']
        ]);
      }
    });
  }
}
