import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-imqm-line-chart',
  templateUrl: './imqm-line-chart.component.html',
  styleUrls: ['./imqm-line-chart.component.scss']
})
export class ImqmLineChartComponent implements OnInit, OnChanges {

  @Input() lineOptions;
  @Input() target;
  @Output('lineChartClick') lineChartClick = new EventEmitter<any>();
  lineChart;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lineOptions !== undefined) {
      this.lineOptions = changes['lineOptions'].currentValue;
      this.getLineChart(this.lineOptions);
    }
  }

  ngOnInit() {
  }

  showSubChart(event, time, toolTip, titlePie) {
    // 根據條件呼叫API
    if (typeof this.target !== 'undefined') {
      if (this.target[0] && event.value < this.target[0].yrTarget) {
        this.lineChartClick.emit({ data: event, time: time[event.dataIndex], titlePie: titlePie });
      }
    }
  }

  getLineChart(options) {
    this.lineChart = {
      title : {
        text: options['title'],
        x: 'center'
    },
    grid: {
      x: 70,
      x2: 70,
      y2: 30
    },
    backgroundColor: 'rgba(255,255,255,0.7)',
    tooltip : options['tooltip'] ? options['tooltip'] : {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.7)',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: 'black'
      },
      formatter: function (params, ticket, callback) {
        let content = '';
        const notInputLength = params.filter(item => !item['seriesName'].includes('input')).length;
        params.forEach((item, i) => {
            if (options['formatter']) {
              // 這樣判斷很不好，，暫時沒想到合適的解法
              // night_input = 0 則 night_yr 顯示NA，day_input 和 total Input同理
              content = content + params[i]['seriesName'] + ': ' + (params[i]['seriesName'].includes('input') ? params[i]['value'] : i < notInputLength && i > 0 &&
                (notInputLength !== params.length && parseInt(params[notInputLength - 1 + i]['value'], 0) === 0) ?  'NA' : params[i]['value']  + '%') + '<br/>';
            } else {
              content = content + params[i]['seriesName'] + ': ' + params[i]['value'] + '<br/>';
            }
        });
        return content;
      }
    },
    legend: {
      data: options['legend'],
      orient: 'horizontal',
      width: '40%',
      x: 'right'
    },
    calculable : true,
    xAxis : [
      {
          type : 'category',
          data : options['data_x'],
          axisLabel: {
          interval: 0
        }

      }
    ],
    yAxis : options['data_y'],
    dataZoom: options['dataZoom'],
    series: options['series']
    };
  }

}
