import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { View_RfiDashboardApi } from '@service/dfq_sdk/sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { PlantNamePipe } from 'app/shared/pipe';
import { PlantApi } from '@service/dfi-sdk';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rfi-work-progress',
  templateUrl: './rfi-work-progress.component.html',
  styleUrls: ['./rfi-work-progress.component.scss']
})
export class RfiWorkProgressComponent implements OnInit {
  @Output() setEchartSummaryrfi = new EventEmitter<any>();
  WorkProgressChartOptions = [];      // 餅圖數組
  rfiWorkProgressRgb = {              // 工作進程rgb參數
    title: '',
    Red: 0,
    Yellow: 0,
    Green: 0,
    Gray: 0,
    Purple: 0,
    totalColor: 0,
    data: []
  };
  rfiWorkProgressRgbs = [];            // 所有餅圖顏色參數數值
  totalData;
  plantsList = [];
  bg;
  isLoading = true;
  echartSummary = [];
  projectNames = [];
  transNotice = {};
  constructor(
    private View_RfiDashboard: View_RfiDashboardApi,
    private route: Router,
    private router: ActivatedRoute,
    private plantName: PlantNamePipe,
    private plantService: PlantApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
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
    this.router.params.subscribe(param => {
      if (param.bg) {
        this.bg = param['bg'];
      } else {
        this.bg = undefined;
      }
      this.getWorProgress();
    });
  }

  // rfi良率預測數據獲取
  getWorProgress() {
    // 數據處理廠別分類
    this.View_RfiDashboard.find().subscribe(async res => {
      const plantByBg = await this.plantService.find({ where: { businessGroupId: this.bg }, fields: 'id' }).toPromise();
      let rfiDashbordData = [];
      const plantList = [];
      plantByBg.map(item => plantList.push(item['id']));
      rfiDashbordData = res.filter(itea => itea['color'] && plantList.includes(itea['plant']));
      this.totalData = rfiDashbordData.length;
      let allData = [];
      for (let j = 0; j < rfiDashbordData.length; j++) {
        rfiDashbordData[j]['sitePlant'] = rfiDashbordData[j]['site'] + '-' + rfiDashbordData[j]['plant'];
      }
      allData = this.groupByType(rfiDashbordData, 'sitePlant');
      // 没有资料和系统开发中的饼图
      await this.plantService.find({ where: { businessGroupId: this.bg } }).toPromise().then(red => {
        if (allData.length > 0) {
          const hasDataPlant = [];
          for (let index = 0; index < allData.length; index++) {
            hasDataPlant.push(allData[index].key.slice(4, 8));
          }
          this.plantsList = red.filter(item => !hasDataPlant.includes(item['id']));
        } else {
          this.plantsList = red;
          this.plantsList.forEach(async item => {
            this.WorkProgressChartOptions.push(await this.getPieOptionOngoing(item['id'], item['enabled']));
          });
          this.isLoading = false;
        }
      });
      const listOfData = [];
      for (let index = 0; index < allData.length; index++) {
        listOfData.push({ key: allData[index]['key'], data: this.groupByType(allData[index]['data'], 'color') });
        listOfData[index]['totalColor'] = allData[index]['data'].length;
      }
      // 餅圖與路由傳參
      this.rfiWorkProgressRgbs = [];
      for (let k = 0; k < listOfData.length; k++) {
        // 內層循環
        for (let index = 0; index < listOfData[k]['data'].length; index++) {
          if (index === 0) {
            this.rfiWorkProgressRgb = {
              title: '',
              Red: 0,
              Yellow: 0,
              Green: 0,
              Gray: 0,
              Purple: 0,
              totalColor: 0,
              data: []
            };
          }
          if (listOfData[k]['data'][index]['key'] === 'Green') {
            this.rfiWorkProgressRgb.Green = listOfData[k]['data'][index]['data'].length;
          } else if (listOfData[k]['data'][index]['key'] === 'Yellow') {
            this.rfiWorkProgressRgb.Yellow = listOfData[k]['data'][index]['data'].length;
          } else if (listOfData[k]['data'][index]['key'] === 'Red') {
            this.rfiWorkProgressRgb.Red = listOfData[k]['data'][index]['data'].length;
          } else if (listOfData[k]['data'][index]['key'] === 'Gray') {
            this.rfiWorkProgressRgb.Gray = listOfData[k]['data'][index]['data'].length;
          } else if (listOfData[k]['data'][index]['key'] === 'Purple') {
            this.rfiWorkProgressRgb.Purple = listOfData[k]['data'][index]['data'].length;
          }
        }
        this.rfiWorkProgressRgb.totalColor = listOfData[k]['totalColor'];
        this.rfiWorkProgressRgb.title = listOfData[k]['key'];
        this.rfiWorkProgressRgb.data = listOfData[k]['data'];
        this.rfiWorkProgressRgbs.push(this.rfiWorkProgressRgb);
        this.WorkProgressChartOptions = [...this.WorkProgressChartOptions, await this.WorProgressOption(listOfData[k]['key'], listOfData[k]['totalColor'])];
        this.echartSummary.push({ 'title': listOfData[k]['key'], 'top': this.rfiWorkProgressRgb.Green, 'total': listOfData[k]['totalColor'] });
        if (k === listOfData.length - 1) {
          this.setEchartSummaryrfi.emit(this.echartSummary);
          this.plantsList.forEach(async item => {
            this.WorkProgressChartOptions.push(await this.getPieOptionOngoing(item['id'], item['enabled']));
          });
          this.isLoading = false;
        }
      }
    });
  }

  // json數組根據屬性分類
  groupByType(arr, param) {
    let map = {},
      dest = [];
    for (let i = 0; i < arr.length; i++) {
      let ai = arr[i];
      if (ai[param] && !map[ai[param]]) {
        dest.push({
          key: ai[param],
          data: [ai]
        });
        map[ai[param]] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let dj = dest[j];
          if (dj.key == ai[param]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }

  // 餅圖
  async WorProgressOption(sitePlant, total): Promise<IPieChartOption> {
    const echartTitle = await this.plantName.transform(sitePlant.slice(4, 8));
    const param: IPieChartOption = {
      title: echartTitle,
      subtext: this.rfiWorkProgressRgb.Green + '\n' + '─────' + '\n' + total,
      data: [{
        value: this.rfiWorkProgressRgb['Green'],
        name: 'Green',
        itemStyle: {
          color: this.rfiWorkProgressRgb['Green'] === 0 ? 'white' : 'green'
        },
        title: sitePlant
      },
      {
        value: this.rfiWorkProgressRgb['Red'],
        name: 'Red',
        itemStyle: {
          color: this.rfiWorkProgressRgb['Red'] === 0 ? 'white' : 'red'
        },
        title: sitePlant
      },
      {
        value: this.rfiWorkProgressRgb['Yellow'],
        name: 'Yellow',
        itemStyle: {
          color:
            this.rfiWorkProgressRgb['Yellow'] === 0 ? 'white' : 'yellow'
        },
        title: sitePlant
      },
      {
        value: this.rfiWorkProgressRgb['Gray'],
        name: 'Gray',
        itemStyle: {
          color:
            this.rfiWorkProgressRgb['Gray'] === 0 ? 'white' : 'gray'
        },
        title: sitePlant
      },
      {
        value: this.rfiWorkProgressRgb['Purple'],
        name: 'Purple',
        itemStyle: {
          color:
            this.rfiWorkProgressRgb['Purple'] === 0
              ? 'white'
              : 'rgb(173, 0, 173)'
        },
        title: sitePlant
      }],
      height: '160px',
      width: '160px'
    };
    return param;
  }

  // 點擊餅圖跳轉到第二層
  onChartEventRFI(params) {
    if (params.data.name === this.transNotice['noData']) {
      return;
    }
    for (let index = 0; index < this.rfiWorkProgressRgbs.length; index++) {
      if (this.rfiWorkProgressRgbs[index]['title'] === params.data.title) {
        const pieParam = JSON.stringify({
          data: this.rfiWorkProgressRgbs[index]
        });
        localStorage.setItem('rfiPieParam', pieParam);
      }
    }
    this.route.navigate(['dashboard/rfi/report/model-chieve-report/' + params.data.title + ':' + params.data.name + ':' + this.bg]);
  }

  // 未开发系统饼图绘制
  async getPieOptionOngoing(titleText: any, enabled): Promise<{}> {
    const params: IPieChartOption = {
      title: titleText,
      subtext: this.transNotice['noData'],
      data: [{
        name: titleText,
        value: 0,
        itemStyle: {
          color: 'white'
        }
      }],
      width: '160px',
      height: '160px'
    };
    params.title = await this.plantName.transform(titleText);
    if (!enabled) {
      params.subtext = this.transNotice['sysDev'];
    }
    return params;
  }
}
