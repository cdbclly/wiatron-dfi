import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SummaryRateApi } from '@service/imqm-sdk';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPieChartOption } from '../../components/pie-chart/pie-chart';
@Component({
  selector: 'app-mrrboard',
  templateUrl: './mrrboard.component.html',
  styleUrls: ['./mrrboard.component.scss']
})
export class MrrboardComponent implements OnInit, OnChanges {
  bgChartOptionsDFQOP1 = {};
  bgChartOptionsDFQ = [];
  bgChartOptionsMRR = [];

  bg: string;
  CPBGSite = ['WCD', 'WCQ', 'WZS', 'WKS'];
  CSBGSite = ['WKS'];
  EBGSite = ['WZS'];
  bgChartOptionsDFQC4 = [];

  // 產品文件上傳 --- start
  BgPlantMapping = {
    CPBG: ['F721', 'F710', 'F230', 'F130', 'F138'],
    CSBG: ['F232'],
    EBG: ['F136']
  };

  plants = ['F721', 'F710', 'F230', 'F130', 'F138', 'F232', 'F136'];
  SitePlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [];
  bgChartOptionsImqmCur = [];
  bgChartOptionsImqmLast = [];
  bgChartOptionsMufr = [];
  site;
  standardScores;
  // 產品文件上傳 --- end
  @Input() flag;
  queryFlag = false;
  mrrKpiSiteCharts = []; // MRR材料良率追蹤餅圖
  mrrKpiSiteData = [];
  transNotice = {};
  constructor(
    private router: ActivatedRoute,
    private summaryRateService: SummaryRateApi,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
      });
    });
    // 從MRR落地執行進入 不分bg
    if (changes['flag'].currentValue) {
      this.initSelect(undefined);
      this.queryFlag = true;
    }
  }

  ngOnInit() {
    document.getElementsByClassName(
      'content-header'
    )[0].scrollTop = 0;
    const res = new Map();
    this.SitePlantMapping = this.SitePlantMapping.filter(p => !res.has(p.Plant) && res.set(p.Plant, 1));
    this.router.paramMap.subscribe(params => {
      // 從dashboard進入 分bg
      this.bg = params.get('bg');
      if (this.bg) {
        localStorage.setItem('bg', this.bg);
        this.initSelect(this.bg);
        this.queryFlag = false;
      }
    });
  }

  // 取出共用部分 方便MRR落地執行調用
  initSelect(bgValue: any) {
    let plantMappings = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    if (this.bg) {
      plantMappings = plantMappings.filter(a => a['op'] === this.bg);
    }
    const plantMapps = [];
    let sites = [];
    this.bgChartOptionsDFQ = [];
    if (bgValue === 'CPBG') {
      sites = this.CPBGSite;
    } else if (bgValue === 'CSBG') {
      sites = this.CSBGSite;
    } else if (bgValue === 'EBG') {
      sites = this.EBGSite;
    } else {
      sites = this.CPBGSite;
    }
    for (let index = 0; index < sites.length; index++) {
      const bgParamsDFQOP1 = {
        titleText: sites[index],
        subTitle: this.transNotice['noData']
      };
      this.bgChartOptionsDFQ.push(this.getPieOptionOngoing(bgParamsDFQOP1));
    }
    // 無資料的廠別餅圖
    // 拿到沒有資料的plant
    plantMappings.forEach(item => {
      if (!sites.includes(item.Site)) {
        plantMapps.push(item);
      }
    });
    const newSiteArry = [];
    for (let i = 0; i < plantMapps.length; i++) {
      let flag = true;
      let temp = plantMapps[i];
      for (let j = 0; j < newSiteArry.length; j++) {
        if (temp.Site === newSiteArry[j].Site) {
          flag = false;
          break;
        }
      }
      if (flag) {
        newSiteArry.push(temp);
      }
    }
    // 餅圖參數
    let subTitle;
    for (const item2 of newSiteArry) {
      if (item2.Actived) {
        subTitle = this.transNotice['noData'];
      } else {
        subTitle = this.transNotice['sysDev'];
      }
      const openParam = {
        titleText: item2.Site,
        subTitle: subTitle
      };
      this.bgChartOptionsDFQ.push(this.getPieOptionOngoing(openParam));
    }

    if (bgValue) {
      this.initIMQMPieCurMonth(bgValue);
      this.initIMQMPieLastMonth(bgValue);
    } else {
      this.initIMQMPieCurMonth(undefined);
      this.initIMQMPieLastMonth(undefined);
    }
  }

  async initIMQMPieCurMonth(bgValue: any) {
    const options = [];
    const sitePlant = [];
    let rawData: any;
    const jobs = [];
    let plantMappings = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    if (this.bg) {
      plantMappings = plantMappings.filter(a => a['op'] === this.bg);
    }
    const plantMapps = [];
    let result = {
      result: {
        nowMonth: [],
        lastMonth: []
      }
    };
    if (bgValue) {
      if (bgValue !== 'EBG') {
        rawData = await this.summaryRateService.getRate(bgValue).toPromise();
      }
    } else {
      // 查詢CPBG CSBG
      for (let index = 0; index < Object.keys(this.BgPlantMapping).length - 1; index++) {
        const bg = Object.keys(this.BgPlantMapping)[index];
        const res = await this.summaryRateService.getRate(bg).toPromise();
        jobs.push(res['result']);
      }
      if (jobs.length) {
        for (let index = 0; index < jobs.length; index++) {
          if (jobs[index]['nowMonth'].length) {
            jobs[index]['nowMonth'].forEach(now => {
              result.result.nowMonth.push(now);
            });
          }
          if (jobs[index]['lastMonth'].length) {
            jobs[index]['lastMonth'].forEach(last => {
              result.result.lastMonth.push(last);
            });
          }
        }
        rawData = result;
      }
    }
    if (rawData) {
      rawData['result']['nowMonth'].forEach(cur => {
        const param = {
          titleText: cur['plant'],
          dataTopValue: cur['close'] ? cur['close'] : 0,
          dataSecondName: cur['close'] ? cur['close'] : 0,
          dataFourName: cur['count'],
          dataDownValue: cur['count'] - cur['close']
        };
        options.push(this.getPieOption(param));
        sitePlant.push(cur['plant']);
      });
      // 無資料的廠別餅圖
      // 拿到沒有資料的plant
      plantMappings.forEach(item => {
        if (!sitePlant.includes(item.PlantName)) {
          plantMapps.push(item);
        }
      });
      const newSiteArry = [];
      for (let i = 0; i < plantMapps.length; i++) {
        let flag = true;
        let temp = plantMapps[i];
        for (let j = 0; j < newSiteArry.length; j++) {
          if (temp.PlantName === newSiteArry[j].PlantName) {
            flag = false;
            break;
          }
        }
        if (flag) {
          newSiteArry.push(temp);
        }
      }
      // 餅圖參數
      let subTitle;
      for (const item2 of newSiteArry) {
        if (item2.Actived) {
          subTitle = this.transNotice['noData'];
        } else {
          subTitle = this.transNotice['sysDev'];
        }
        const openParam = {
          titleText: item2.PlantName,
          subTitle: subTitle
        };
        options.push(this.getPieOptionOngoing(openParam));
      }
      this.bgChartOptionsImqmCur = options;
      return { options: options, sitePlant: sitePlant };
    } else {
      this.getNoDataPie(plantMappings, options);
    }
  }

  async initIMQMPieLastMonth(bgValue: any) {
    const options = [];
    let plantMappings = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    if (this.bg) {
      plantMappings = plantMappings.filter(a => a['op'] === this.bg);
    }
    const plantMapps = [];
    const sitePlant = [];
    let rawData;
    const jobs = [];
    let result = {
      result: {
        nowMonth: [],
        lastMonth: []
      }
    };
    if (bgValue) {
      if (bgValue !== 'EBG') {
        rawData = await this.summaryRateService.getRate(bgValue).toPromise();
      }
    } else {
      // 查詢CPBG CSBG
      for (let index = 0; index < Object.keys(this.BgPlantMapping).length - 1; index++) {
        const bg = Object.keys(this.BgPlantMapping)[index];
        const res = await this.summaryRateService.getRate(bg).toPromise();
        jobs.push(res['result']);
      }
      if (jobs.length) {
        for (let index = 0; index < jobs.length; index++) {
          if (jobs[index]['nowMonth'].length) {
            jobs[index]['nowMonth'].forEach(now => {
              result.result.nowMonth.push(now);
            });
          }
          if (jobs[index]['lastMonth'].length) {
            jobs[index]['lastMonth'].forEach(last => {
              result.result.lastMonth.push(last);
            });
          }
        }
        rawData = result;
      }
    }
    if (rawData) {
      rawData['result']['lastMonth'].forEach(cur => {
        const param = {
          titleText: cur['plant'],
          dataTopValue: cur['close'],
          dataSecondName: cur['close'] ? cur['close'] : 0,
          dataFourName: cur['count'],
          dataDownValue: cur['count'] - cur['close']
        };
        options.push(this.getPieOption(param));
        sitePlant.push(cur['plant']);
      });
      // 無資料的廠別餅圖
      // 拿到沒有資料的plant
      plantMappings.forEach(item => {
        if (!sitePlant.includes(item.PlantName)) {
          plantMapps.push(item);
        }
      });
      const newSiteArry = [];
      for (let i = 0; i < plantMapps.length; i++) {
        let flag = true;
        let temp = plantMapps[i];
        for (let j = 0; j < newSiteArry.length; j++) {
          if (temp.PlantName === newSiteArry[j].PlantName) {
            flag = false;
            break;
          }
        }
        if (flag) {
          newSiteArry.push(temp);
        }
      }
      // 餅圖參數
      let subTitle;
      for (const item2 of newSiteArry) {
        if (item2.Actived) {
          subTitle = this.transNotice['noData'];
        } else {
          subTitle = this.transNotice['sysDev'];
        }
        const openParam = {
          titleText: item2.PlantName,
          subTitle: subTitle
        };
        options.push(this.getPieOptionOngoing(openParam));
      }
      this.bgChartOptionsImqmLast = options;
      return { options: options, sitePlant: sitePlant };
    } else {
      this.getNoDataPie(plantMappings, options);
    }
  }

  getNoDataPie(plantMappings, options) {
    // 按PlantName去重
    const newSiteArry = [];
    for (let i = 0; i < plantMappings.length; i++) {
      let flag = true;
      let temp = plantMappings[i];
      for (let j = 0; j < newSiteArry.length; j++) {
        if (temp.PlantName === newSiteArry[j].PlantName) {
          flag = false;
          break;
        }
      }
      if (flag) {
        newSiteArry.push(temp);
      }
    }
    // 餅圖參數
    let subtext;
    for (const S1 of newSiteArry) {
      if (S1['Actived']) {
        subtext = this.transNotice['noData'];
      } else {
        subtext = this.transNotice['sysDev'];
      }
      const Params = {
        titleText: S1.PlantName,
        subTitle: subtext
      };
      options.push(this.getPieOptionOngoing(Params));
    }
    this.bgChartOptionsImqmCur = options;
    this.bgChartOptionsImqmLast = options;
  }

  getPieOption(data: any): IPieChartOption {
    const param: IPieChartOption = {
      title: data.titleText,
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      data: [
        {
          name: 'Top',
          value: data.dataTopValue,
          itemStyle: {
            color: 'green'
          },
          title: data.titleText
        },
        {
          name: 'Down',
          value: data.dataDownValue,
          itemStyle: {
            color: data.dataFourName === 0 ? 'rgba(248, 244, 244, 0.973)' : 'red'
          },
          title: data.titleText
        }
      ],
      height: '160px',
      width: '160px'
    };
    return param;
  }

  //  暫無數據餅圖、未开发系统饼图绘制
  getPieOptionOngoing(data: any): IPieChartOption {
    const param: IPieChartOption = {
      title: data.titleText,
      subtext: data.subTitle,
      data: [{
        name: data.subTitle,
        value: 0,
        itemStyle: {
          color: 'rgba(248, 244, 244, 0.973)'
        }
      }],
      height: '160px',
      width: '160px'
    };
    return param;
  }
}
