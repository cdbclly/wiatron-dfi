import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'mp-fpyr-moving-average',
  templateUrl: './fpyr-moving-average.component.html',
  styleUrls: ['./fpyr-moving-average.component.scss']
})
export class FpyrMovingAverageComponent implements OnChanges {
  @Input() forecast;
  @Input() actual;
  @Input() data: any[];
  @Input() wma: any[];
  @Input() isLoading: boolean;
  option: {};

  constructor() {
  }

  ngOnChanges() {
    this.option = this.getOption(this.forecast, this.actual, this.data, this.wma);
  }

  getOption(forecast, actual, data: any[], wma: any[]): {} {
    return {
      title: {
        text: forecast,
        x: 'center'
      },
      legend: {
        left: 'left',
        data: [actual, forecast]
      },
      dataset: [
        {
          dimensions: ['trnDate', 'fpyr'],
          source: data
        },
        {
          dimensions: ['trnDate', 'fpyr'],
          source: wma
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let formatterParam = '';
          for (let index = 0; index < params.length; index++) {
            const seriesName = params[index]['seriesName'] ? params[index]['seriesName'] : '';
            const fpyr = params[index]['data']['fpyr'] ? params[index]['data']['fpyr'] + '%' : '';
            formatterParam += seriesName + ':' + fpyr + '<br>';
          }
          return params[0].name + ':<br>' + formatterParam;
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value',
        // axisLabel: {
        //   formatter: '{value} %'
        // },
        max: 100,
        min: Math.floor(Math.min(...[Math.min(...data.filter(x => x.fpyr !== undefined).map(x => x.fpyr)), Math.min(...wma.filter(x => x.fpyr !== undefined).map(x => x.fpyr))])),
        minInterval: 0.01
      },
      series: [
        {
          type: 'line',
          name: actual,
          datasetIndex: 0,
          lineStyle: {
            color: 'rgb(194,53,49)'
          },
          label: {
            show: true,
            color: 'rgb(194,53,49)',
            position: [-20, -20],
            formatter: params => params.data.fpyr + '%'
          }
        },
        {
          type: 'line',
          name: forecast,
          datasetIndex: 1,
          lineStyle: {
            type: 'dashed',
            color: 'rgb(47,69,84)'
          },
          label: {
            show: true,
            color: 'rgb(47,69,84)',
            position: [10, -20],
            formatter: params => params.data.fpyr + '%'
          }
        }
      ]
    };
  }
}
