import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pop-dr',
  templateUrl: './pop-dr.component.html',
  styleUrls: ['./pop-dr.component.scss']
})
export class PopDrComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() drAnalyze;
  @Output('drAnalyzeDetail') drAnalyzeDetail = new EventEmitter();
  barData;
  subPieData;
  pieData;
  subDetailRowData;
  defectLossAnalyze;
  isVisible;
  footer = null;
  cancelOK = false;
  isVisibleSub = false;
  footerSub = null;
  cancelOKSub = false;
  destroy$ = new Subject();
  trans: Object = {};
  constructor(private route: ActivatedRoute,
    private translate: TranslateService) {
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
    })

    if (changes['data']) {
      if (changes['data'].firstChange) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
        this.buildChart(changes['data'].currentValue);
      }
    }
    if (changes['drAnalyze']) {
      if (changes['drAnalyze'].firstChange) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
        this.showDefectLoss(changes['drAnalyze'].currentValue);
      }
    }
  }

  buildChart(rawChartData) {
    console.log(rawChartData);
    if (rawChartData['detail']) {
      this.defectLossAnalyze = rawChartData['detail']['defectLoss'];
      this.subDetailRowData = rawChartData['detail']['vendorDr'];
    }
    const data_x = Array(10).fill(''); const data_y = []; const target = []; let series_data;
    const dataPie = []; const data_arr = [];
    this.subDetailRowData.map((res, index) => {
      res['percent'] = parseFloat(res['percent']);
      data_arr.push({value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'], itemStyle: {color: '#fb928e'}});
        data_x[index] = res['key'];
        if (res['key'].includes('.') && data_x[index].split('.').length === 3) {
          data_x[index] = data_x[index].split('.');
          data_x[index].splice(0, 1);
          data_x[index] = data_x[index].join(',');
          data_x[index] = data_x[index].replace(',', '.');
        }
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
                fontSize: 12,
                color: 'white'
               }
          };
        data_y.push(series_data);
      });
       this.barData = {
        data_x: data_x,
        data_y: data_y,
        target: target,
        target_name: 'target',
        title: rawChartData['preTitle'] + ' ' + rawChartData['title'],
        legend: rawChartData['legend'],
        width: '90%',
        height: '14vw',
        search_type: rawChartData['detail']['search_type'],
        data_arr: data_arr,
        toolTip: rawChartData['detail']['toolTip']
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

      // for (const key in this.defectLossAnalyze) {
      //   if (this.defectLossAnalyze.hasOwnProperty(key)) {
      //     if (key === 'outLook') {
      //       dataPie.push({name: '外觀', value: this.defectLossAnalyze[key], itemStyle: {color: '#00B358'}});
      //     }
      //     if (key === 'sizeFailCount') {
      //       dataPie.push({name: '尺寸', value: this.defectLossAnalyze[key], itemStyle: {color: '#4284D3'}});
      //     }
      //     if (key === 'deformationFailCount') {
      //       dataPie.push({name: '變形度', value: this.defectLossAnalyze[key], itemStyle: {color: '#8A6ED7'}});
      //     }
      //   }
      // }
      const seriesPie = {
        name: rawChartData['titlePie'],
        type: 'pie',
        avoidLabelOverlap: false,
        itemStyle: {
          normal: {
            show: true,
            position: 'inner',
            color: 'black'
          }
        },
        label: {
          show: false
        },
        radius : '65%',
        center: ['50%', '60%'],
        data: dataPie
      };
      this.pieData = {
        title: rawChartData['preTitle'] + rawChartData['titlePie'],
        series_name: rawChartData['titlePie'],
        series: seriesPie,
        width: '40%',
        height: '14vw',
        display: 'inline-block'
      };
  }

  ngOnInit() {
  }

  emitDefectLoss(detail, titlePie) {
    // 根據條件呼叫API
    this.drAnalyzeDetail.emit({data: detail, titlePie: titlePie, vendor: this.data['preTitle']});
  }

  showDefectLoss(data) {
    // const defectLossAnalyze = this.route.snapshot.data['injectResolve']['defectAnanlyze'];
    const dataPie = [];
    this.isVisibleSub = true;
    console.log(data['drAnalyze']);
    // for (const key in data['drAnalyze']) {
    //   if (data['drAnalyze'].hasOwnProperty(key)) {
    //     if (key === 'outLook') {
    //       dataPie.push({name: '外觀', value: data['drAnalyze'][key], itemStyle: {color: '#00B358'}});
    //     }
    //     if (key === 'sizeFailCount') {
    //       dataPie.push({name: '尺寸', value: data['drAnalyze'][key], itemStyle: {color: '#4284D3'}});
    //     }
    //     if (key === 'deformationFailCount') {
    //       dataPie.push({name: '變形度', value: data['drAnalyze'][key], itemStyle: {color: '#8A6ED7'}});
    //     }
    //   }
    // }

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
        if (key === 'countFailCount' && data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'count', name: this.trans['count'], value: this.defectLossAnalyze[key], itemStyle: { color: '#F6912D' } });
        }
        if (key === 'measurementFailCount' && data['drAnalyze'][key] !== 0) {
          dataPie.push({tag: 'measurement', name: this.trans['measurement'], value: this.defectLossAnalyze[key], itemStyle: { color: '#8459A4' } });
        }
      }
    }



    const seriesPie = {
      name: data['detail']['titlePie'],
      type: 'pie',
      avoidLabelOverlap: false,
      itemStyle: {
        normal: {
          show: true,
          position: 'inner',
          color: 'black'
        }
      },
      label: {
        show: false
      },
      radius : '65%',
      center: ['50%', '60%'],
      data: dataPie
    };
    console.log(seriesPie);
    this.subPieData = {
      title: data['detail']['data']['name'] + data['detail']['titlePie'],
      series_name: data['detail']['titlePie'],
      series: seriesPie,
      width: '100%',
      height: '14vw'
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

}
