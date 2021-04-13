import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() subtext: string;
  @Input() data: any[];
  @Input() width: string | number = '160px';
  @Input() height: string | number = '160px';
  @Input() color: any[] = [];
  @Input() mufrDatas: any[] = [];
  @Output() clickChart = new EventEmitter<Object>();
  pieChart: {};
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    let fontSize;
    if (changes.title.currentValue === 'RFQ Workhour Forecast' || changes.title.currentValue === 'Workhour Tracking') {
      fontSize = 12;
    }
    this.pieChart = this.getOptions(fontSize);
  }

  ngOnInit() { }

  getOptions(param?): {} {
    return {
      title: {
        textStyle: {
          fontSize: param ? param : 20
        },
        text: this.title,
        left: 'center'
      },
      backgroundColor: '#e5e5e5',
      color: this.color,
      series: [
        {
          type: 'pie',
          center: ['50%', '60%'],
          radius: ['50%', '70%'],
          label: {
            show: true,
            position: 'center',
            formatter: this.subtext,
            fontWeight: 'bold',
            fontSize: 18,
            color: 'black'
          },
          data: this.data
        }
      ]
    };
  }

  onChartEvent(event) {
    this.clickChart.emit(event);
  }
}
