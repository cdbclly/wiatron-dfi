import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { async } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pop-yr',
  templateUrl: './pop-yr.component.html',
  styleUrls: ['./pop-yr.component.scss']
})
export class PopYrComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data;
  @Input() drAnalyze;
  @Input() analyzeByPartNo;
  @Output('yrAnalyzeDetail') yrAnalyzeDetail = new EventEmitter<any>();
  barData;
  pieData;
  subPieData;
  isVisible;
  subDetailRowData;
  defectLossAnalyze;
  footer = null;
  cancelOK = false;
  footerSub = null;
  cancelOKSub = false;
  isVisibleSub = false;
  isYrTrend = false;
  select;

  // 18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-dimension', 'imq-deformation', 'imq-yr-outlook', 'imq-yr-count', 'imq-yr-measurement']).subscribe(res => {
        this.trans['dimension'] = res['imq-dimension'];
        this.trans['deformation'] = res['imq-deformation'];
        this.trans['outLook'] = res['imq-yr-outlook'];
        this.trans['count'] = res['imq-yr-count'];
        this.trans['measurement'] = res['imq-yr-measurement'];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.translate.get(['imq-dimension', 'imq-deformation', 'imq-yr-outlook', 'imq-yr-count', 'imq-yr-measurement']).subscribe(res => {
      this.trans['dimension'] = res['imq-dimension'];
      this.trans['deformation'] = res['imq-deformation'];
      this.trans['outLook'] = res['imq-yr-outlook'];
      this.trans['count'] = res['imq-yr-count'];
      this.trans['measurement'] = res['imq-yr-measurement'];

      // 呼叫資料, 實際是根據data的類別去呼叫廠商或幾種的資料
      if (changes['data']) {
        if (changes['data'].firstChange) {
          this.isVisible = false;
        } else {
          if (changes['data'].currentValue) {
            // console.log('传入的数据==========data \n', changes['data'].currentValue);
            this.select = changes['data'].currentValue['downloadSelect'];
            this.isVisible = true;
            this.buildChart(changes['data'].currentValue);
          }
        }
      }
      if (changes['drAnalyze']) {
        if (changes['drAnalyze'].firstChange) {
          this.isVisibleSub = false;
        } else {
          if (changes['drAnalyze'].currentValue) {
            // console.log('传入的数据========== arAnalyze\n', changes['drAnalyze'].currentValue);
            this.select = changes['drAnalyze'].currentValue['downloadSelect'];
            this.isVisibleSub = true;
            this.isYrTrend = changes['drAnalyze'].currentValue['isYrTrend'];
            this.showDefectLoss(changes['drAnalyze'].currentValue);
          }
        }
      }
    });
    // if (changes['analyzeByPartNo']) {
    //   if (changes['analyzeByPartNo'].firstChange) {
    //     this.isVisibleSub = false;
    //   } else {
    //     this.isVisibleSub = true;
    //     this.showDefectLoss(changes['analyzeByPartNo'].currentValue);
    //   }
    // }
  }

  ngOnInit() {
  }

  buildChart(rawChartData) {
    console.log(rawChartData);
    if (rawChartData['detail']) {
      this.defectLossAnalyze = rawChartData['detail']['defectLoss'];
      this.subDetailRowData = rawChartData['detail']['vendorYr'];
    }
    const data_x = Array(10).fill(''); const data_y = []; const target = []; let series_data;
    const dataPie = []; const data_arr = [];
    this.subDetailRowData.map((res, index) => {
      res['percent'] = parseFloat(res['percent']);
      data_x[index] = res['key'];
      if (res['key'].includes('.') && data_x[index].split('.').length === 3) {
        data_x[index] = data_x[index].split('.');
        data_x[index].splice(0, 1);
        data_x[index] = data_x[index].join(',');
        data_x[index] = data_x[index].replace(',', '.');
      }
      if (rawChartData['target'][index] && res['percent'] < rawChartData['target'][index]) {
        data_arr.push({ value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'], itemStyle: { color: '#fb928e' } });
        series_data = {
          value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'],
          itemStyle: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#fe0c01',
              }, {
                offset: 0.5,
                color: '#fb928e'
              }, {
                offset: 1,
                color: '#fe0c01'
              }],
              globalCoord: false
            }
          },
          label: {
            show: res['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            fontSize: 10,
            color: 'white'
          }
        };
      } else {
        data_arr.push({ value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'], itemStyle: { color: '#60d26e' } });
        series_data = {
          value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'],
          itemStyle: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#038113',
              }, {
                offset: 0.5,
                color: '#60d26e'
              }, {
                offset: 1,
                color: '#038113'
              }],
              globalCoord: false
            }
          },
          label: {
            show: res['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            fontSize: 10,
            color: 'white'
          }
        };
      }
      target.push(rawChartData['target'][index] ? rawChartData['target'][index] : undefined);
      data_y.push(series_data);
    });
    this.barData = {
      data_x: data_x,
      data_y: data_y,
      target: target,
      target_name: 'target',
      title: rawChartData['preTitle'] + ' ' + rawChartData['title'],
      legend: rawChartData['legend'],
      width: '60%',
      height: '14vw',
      float: 'left',
      search_type: rawChartData['detail']['search_type'],
      data_arr: data_arr,
      toolTip: rawChartData['detail']['tooltip']
    };
    for (const key in this.defectLossAnalyze) {
      if (this.defectLossAnalyze.hasOwnProperty(key)) {
        if (key === 'visualizationFailCount' && this.defectLossAnalyze[key] !== 0) {
          dataPie.push({tag: 'appearance', name: this.trans['outLook'], value: this.defectLossAnalyze[key], itemStyle: { color: '#D23E96' } });
        }
        if (key === 'sizeFailCount' && this.defectLossAnalyze[key] !== 0) {
          dataPie.push({tag: 'size', name: this.trans['dimension'], value: this.defectLossAnalyze[key], itemStyle: { color: '#34B2CA' } });
        }
        if (key === 'deformationFailCount' && this.defectLossAnalyze[key] !== 0) {
          dataPie.push({tag: 'deformation', name: this.trans['deformation'], value: this.defectLossAnalyze[key], itemStyle: { color: '#F6CE10' } });
        }
        if (key === 'countFailCount' && this.defectLossAnalyze[key] !== 0) {
          dataPie.push({tag: 'count', name: this.trans['count'], value: this.defectLossAnalyze[key], itemStyle: { color: '#F6912D' } });
        }
        if (key === 'measurementFailCount' && this.defectLossAnalyze[key] !== 0) {
          dataPie.push({tag: 'measurement', name: this.trans['measurement'], value: this.defectLossAnalyze[key], itemStyle: { color: '#8459A4' } });
        }
      }
    }

    // 良率  点击第一层百分比柱子展开第二层饼图配置
    const seriesPie = {
      name: rawChartData['titlePie'],
      type: 'pie',
      avoidLabelOverlap: false,
      // itemStyle: {
      //   show: true,
      //   position: 'inner',
      //   color: 'black'
      // },
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: '{b}:{c} ({d}%)'
          },
          labelLine: { show: true }
        }
      },
      // label: {
      //   show: false
      // },
      label: {
        normal: {
          show: true,
          position: 'inner'
        }
      },
      radius: '65%',
      center: ['50%', '60%'],
      data: dataPie
    };
    // console.log ('二层右侧饼图配置\n',seriesPie)
    this.pieData = {
      downloadSelect: this.select,
      title: rawChartData['preTitle'] + rawChartData['titlePie'],
      series_name: rawChartData['titlePie'],
      series: seriesPie,
      width: '40%',
      height: '14vw',
      display: 'inline-block',
      label: {
        show: false
      },
    };
  }

  emitDefectLoss(detail, titlePie) {
    // 根據條件呼叫API
    this.yrAnalyzeDetail.emit({ data: detail, titlePie: titlePie, vendor: this.data['preTitle'] });
  }

  showDefectLoss(data) {
    // const defectLossAnalyze = this.route.snapshot.data['injectResolve']['defectAnanlyze'];
    const dataPie = [];
    this.isVisibleSub = true;
    this.isYrTrend = data['isYrTrend'];
    for (const key in data['drAnalyze']) {
      if (data['drAnalyze'].hasOwnProperty(key)) {
        if (key === 'visualizationFailCount' && data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'appearance', name: this.trans['outLook'], value: data['drAnalyze'][key], itemStyle: { color: '#D23E96' } });
        }
        if (key === 'sizeFailCount' && data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'size', name: this.trans['dimension'], value: data['drAnalyze'][key], itemStyle: { color: '#34B2CA' } });
        }
        if (key === 'deformationFailCount' && data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'deformation', name: this.trans['deformation'], value: data['drAnalyze'][key], itemStyle: { color: '#F6CE10' } });
        }
        if (key === 'countFailCount' &&  data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'count', name: this.trans['count'], value: data['drAnalyze'][key], itemStyle: { color: '#F6912D' } });
        }
        if (key === 'measurementFailCount' &&  data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'measurement', name: this.trans['measurement'], value: data['drAnalyze'][key], itemStyle: { color: '#8459A4' } });
        }
      }
    }

    // 良率 点击第一层百分比柱子展开第三层饼图配置
    const seriesPie = {
      name: data['detail']['titlePie'],
      type: 'pie',
      avoidLabelOverlap: false,
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: '{b}:{c} ({d}%)'
          },
          labelLine: { show: true }
        }
      },
      label: {
        normal: {
          show: true,
          position: 'inner'
        }
      },
      radius: '65%',
      center: ['50%', '60%'],
      data: dataPie
    };
    this.subPieData = {
      downloadSelect: this.select,
      title: data['detail']['preTitle'] + data['detail']['titlePie'],
      series_name: data['detail']['titlePie'],
      series: seriesPie,
      width: '100%',
      height: '14vw',
      label: {
        show: false
      },
    };
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOkSub(): void {
    this.isVisibleSub = false;
  }

  handleCancelSub(): void {
    this.isVisibleSub = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
