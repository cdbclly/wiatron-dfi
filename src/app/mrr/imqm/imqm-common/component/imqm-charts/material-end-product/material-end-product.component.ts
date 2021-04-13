import { style } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-material-end-product',
  templateUrl: './material-end-product.component.html',
  styleUrls: ['./material-end-product.component.scss']
})
export class MaterialEndProductComponent implements OnInit, OnChanges, OnDestroy {

  @Input() barOptions;
  @Output('trdDetail') trdDetail = new EventEmitter<any>();
  @Output('subDetail') subDetail = new EventEmitter<any>();
  toolTip;
  barChart;

  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private translate: TranslateService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-model', 'imq-proName', 'imq-partNumber', 'imq-pop-number', 'imq-supplier']).subscribe(res => {
        this.trans['imq-model'] = res['imq-model'];
        this.trans['imq-proName'] = res['imq-proName'];
        this.trans['imq-partNumber'] = res['imq-partNumber'];
        this.trans['imq-number'] = res['imq-pop-number'];
        this.trans['imq-supplier'] = res['imq-supplier'];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.translate.get(['imq-model', 'imq-proName', 'imq-partNumber', 'imq-pop-number', 'imq-supplier']).subscribe(res => {
      this.trans['imq-model'] = res['imq-model'];
      this.trans['imq-proName'] = res['imq-proName'];
      this.trans['imq-partNumber'] = res['imq-partNumber'];
      this.trans['imq-number'] = res['imq-pop-number'];
      this.trans['imq-supplier'] = res['imq-supplier'];
      console.log(changes['barOptions'].currentValue);
      if (this.barOptions !== undefined) {
        this.barOptions = changes['barOptions'].currentValue;
        this.getbarChart(this.barOptions);
      }
    });
  }
  ngOnInit() {
  }

  showSubChart(event, target, toolTip) {
    console.log(event, target);
    if (event['seriesName'] === 'Y/R' && (this.barOptions['search_type'] === 'model' || this.barOptions['search_type'] === 'vendor')) {
      this.subDetail.emit({ data: event, target: target[0] });
    }
    if (event['seriesName'] === 'Y/R' && this.barOptions['search_type'] === 'partNumber') {
      event['partNumber'] = toolTip[event.dataIndex][0]['partNumber'];
      this.trdDetail.emit(event);
    }
    if (event['seriesName'] === 'D/R') {
      this.subDetail.emit({ data: event, target: undefined });
    }

    if (this.barOptions['legend'] === 'Y/R' && (this.barOptions['search_type'] === 'predefined')) {
      // 当选择自定义选料号的时候没有第二层
      if (this.barOptions['other'] === 'partNumber') {
        event['partNumber'] = toolTip[event.dataIndex][0]['partNumber'];
        this.trdDetail.emit(event);
      } else {
        this.subDetail.emit({ data: event, target: target[0], other: this.barOptions['other'] });
      }
    }
  }

  getbarChart(options?) {
    this.barChart = {
      title: {
        text: options['title'],
        x: 'center'
      },
      grid: {
        x: 70,
        x2: 70,
        y2: 80
      },
      backgroundColor: 'rgba(255,255,255,1)',
      tooltip: {
        backgroundColor: 'rgba(255,255,255, 1)',
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle: {
          color: 'black'
        },
        // position: options['toolTip_position'] ? options['toolTip_position'] : [10, 200],
        formatter: (params, ticket, callback) => {
          if (options['toolTip'] && options['toolTip'].length > 0) {
            let partNo;
            if (options['toolTip'][params[1]['dataIndex']]) {
              partNo = options['toolTip'][params[1]['dataIndex']].length > 0 ? options['toolTip'][params[1]['dataIndex']][0]['partNumber'] : options['toolTip'][params[1]['dataIndex']]['partNumber'];
            } else {
              partNo = 'NA';
            }
            let contents = '';
            for (let i = 0; i < options['toolTip'][params[1]['dataIndex']].length; i++) {
              contents = contents + `<div style="flex: 0 1 120px;margin: 10px;display:absolute">
            <table border="1" bordercolor="skyblue" style="color: black">
        <tr>
          <td style="padding:5px">${this.trans['imq-supplier']}:</td>
          <td style="padding:5px">${options['toolTip'][params[1]['dataIndex']] ? options['toolTip'][params[1]['dataIndex']][i]['vendor'] : 'NA'}</td>
        </tr>
        <tr ${options['toolTip'][params[1]['dataIndex']][i]['model'] ? function a() { return; } : function a() {const style = 'display: none'; return style; }}>
          <td style="padding:5px">${this.trans['imq-model']}:</td>
          <td style="padding:5px">${options['toolTip'][params[1]['dataIndex']] ? options['toolTip'][params[1]['dataIndex']][i]['model'] : 'NA'}</td>
        </tr>
        <tr  ${options['toolTip'][params[1]['dataIndex']][i]['productName'] ? function a() { return; } : function a() {const style = 'display: none'; return style; }} >
          <td style="padding:5px">${this.trans['imq-proName']}:</td>
          <td style="padding:5px">${options['toolTip'][params[1]['dataIndex']] ? options['toolTip'][params[1]['dataIndex']][i]['productName'] : 'NA'}</td>
        </tr>
        <tr ${options['toolTip'][params[1]['dataIndex']][i]['partNumber'] ? function a() { return; } : function a() {const style = 'display: none'; return style; }}>
          <td style="padding:5px">${this.trans['imq-partNumber']}:</td>
          <td style="padding:5px">${partNo}</td>
        </tr>
        <tr>
          <td style="padding:5px">${this.trans['imq-number']}:</td>
          <td style="padding:5px">${parseFloat(params[1]['value']).toFixed(1)}%</td>
        </tr>
        <tr>
          <td style="padding:5px">Input:</td>
          <td style="padding:5px">${options['toolTip'][params[1]['dataIndex']] ? options['toolTip'][params[1]['dataIndex']][i]['count'] : 'NA'}</td>
        </tr>
        </table>
            </div>`;
            }
            contents = `<div style="display: flex;flex-wrap: wrap;flex-direction: row;">${contents}</div>`;
            return contents;
          } else if (options['toolTip_vm'] && options['toolTip_vm'].length > 0) {
            const content = `<table border="1" bordercolor="skyblue" style="color: black">
          <tr>
            <td style="padding:5px">${params[1]['name']}:</td>
            <td style="padding:5px">${parseFloat(params[1]['value']).toFixed(1)}%</td>
          </tr>
          <tr>
          <td style="padding:5px">Input:</td>
          <td style="padding:5px">${options['toolTip_vm'][params[1]['dataIndex']] ? options['toolTip_vm'][params[1]['dataIndex']]['count'] : 'NA'}</td>
        </tr>
          </table>`;
            return content;
          } else {
            return params[1]['name'] + ': ' + parseFloat(params[1]['value']).toFixed(1) + '%';
          }
        }
      },
      legend: {
        data: [{
          name: options['legend'],
          icon: 'circle'
        }, options['legend'] === 'D/R' ? '' : 'target'],
        orient: 'horizontal',
        x: 'right',
        selectedMode: false
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: options['data_x'],
          axisLabel: {
            interval: 0,
            rotate: 45
          }

        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          max: function (value) {
            if (options['legend'] === 'D/R') {
              return (value.max + 0.1 * (value.min)).toFixed(2);
            } else {
              return (value.max + 0.05 * (value.min)).toFixed(2);
            }
          },
          min: function (value) {
            if (options['legend'] === 'D/R') {
              return (value.min - 0.1 * (value.min)).toFixed(2);
            } else {
              return (value.min - 0.05 * (value.min)).toFixed(2);
            }
          },
        }
      ],
      series: [
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: ['85%', 10],
          symbolOffset: [0, -5],
          symbolPosition: 'end',
          label: {
            show: false,
            position: 'top',
            formatter: '{c}%'
          },
          data: options['data_arr'],
          tooltip: {
            showContent: false
          }
        },
        {
          name: options['legend'],
          type: 'bar',
          data: options['data_y'],
          barWidth: '70%',
          z: 12,
          itemStyle: { color: '#FF3300' },
          markLine: {
            silent: true,
            data: options['markLine']
          },
          symbolRepeat: false,
          symbolClip: true,
          symbolPosition: 'end',
          symbol: 'rect',
          barMinHeight: 2
        },
        {
          name: options['target_name'],
          type: 'line',
          data: options['target'],
          // z: 12,
          itemStyle: {
            borderColor: 'rgb(60,144,247)',
            borderWidth: 2,
            color: 'rgb(60,144,247)'
          },
          label: {
            show: true,
            position: 'top',
            color: 'black',
            formatter: '{c}%'
          },
          z: 12,
          lineStyle: {
            color: 'rgb(60,144,247)'
          }
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}


// ${function a() {
//   let style;
//   if ( options['toolTip'][params[1]['dataIndex']][i]['productName']) {
//     style = 'background: red';
//   } else {
//     style = 'background: blue';
//   }
// }}
