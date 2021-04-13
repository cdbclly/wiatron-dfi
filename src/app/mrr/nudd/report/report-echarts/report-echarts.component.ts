import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-echarts',
  templateUrl: './report-echarts.component.html',
  styleUrls: ['./report-echarts.component.scss']
})
export class ReportEchartsComponent implements OnInit {
  @Input() total;
  @Input() pass;
  @Input() title;
  option;
  constructor() { }

  ngOnInit() {
    this.getEcharts();
  }
  // 獲取對應產品的圓餅圖
  getEcharts() {
    this.option = {
      'title': {
        'textStyle': {
          'fontSize': 20,
          'color': '#000000',
          'fontWeight': 'normal'
        },
        'subtextStyle': {
          'color': '#000000',
          'fontWeight': 'bold',
          'fontSize': 18
        },
        'text': this.title,
        'x': 'center',
        'y': '5px'
      },
      'backgroundColor': '#e5e5e5',
      'series': [{
        'type': 'pie',
        'center': [
          '50%',
          '60%'
        ],
        'radius': [
          '50%',
          '70%'
        ],
        'animation': false,
        'silent': false,
        'itemStyle': {
          'normal': {}
        },
        label: {
          show: true,
          position: 'center',
          formatter: (this.pass !== undefined ? this.pass : 'N/A') + '\n' + '─────' + '\n' + (this.total !== undefined ? this.total : 'N/A'),
          fontWeight: 'bold',
          fontSize: 18,
          color: 'black'
        },
        'data': [{
          'name': 'Top',
          'value': this.pass / (this.total || 1),
          'itemStyle': {
            'normal': {
              'color': '#05ac9c',
              'label': {
                'show': false,
                'position': 'center',
                'textStyle': {}
              }
            }
          }
        },
        {
          'name': 'Down',
          'value': 1 - this.pass / (this.total || 1),
          'itemStyle': {
            'normal': {
              'color': 'rgba(212, 48, 48, 1)',
              'label': {
                'show': false,
                'position': 'center'
              }
            }
          }
        }
        ]
      }]
    };
  }
}
