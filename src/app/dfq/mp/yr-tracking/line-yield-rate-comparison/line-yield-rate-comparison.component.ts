import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'mp-line-yield-rate-comparison',
  templateUrl: './line-yield-rate-comparison.component.html',
  styleUrls: ['./line-yield-rate-comparison.component.scss']
})
export class LineYieldRateComparisonComponent implements OnChanges {
  @Input() data;
  @Input() isLoading;
  @Input() title: string;
  @Output() line = new EventEmitter();
  option;

  ngOnChanges() {
    this.option = this.getOption(this.data, this.title);
  }

  getOption(data, title) {
    return {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (param) => param[0].data.line + ': ' + param[0].data.fpyr + '%'
      },
      dataset: [
        {
          dimensions: ['line', 'fpyr'],
          source: data
        }
      ],
      xAxis: [
        {
          type: 'category'
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      series: {
        type: 'bar',
        label: {
          show: true,
          formatter: (param) => param.data.fpyr + '%'
        }
      }
    };
  }

  detail(param) {
    this.line.emit({ inq: param.data.lines });
  }
}
