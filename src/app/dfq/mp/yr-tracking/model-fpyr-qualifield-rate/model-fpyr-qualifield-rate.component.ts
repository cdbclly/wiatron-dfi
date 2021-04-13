import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mp-model-fpyr-qualifield-rate',
  templateUrl: './model-fpyr-qualifield-rate.component.html',
  styleUrls: ['./model-fpyr-qualifield-rate.component.scss']
})
export class ModelFpyrQualifieldRateComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() data: any[] = [];
  @Input() isLoading;
  option = {};

  constructor(
    private router: Router
  ) { }

  ngOnChanges(): void { }

  ngOnInit(): void { }

  clickEchart(param) {
    const params = {
      plant: param.data.plant,
      mfgType: param.data.mfgtype,
      status: param.data.name,
    };
    if (param.data.startDate && param.data.endDate) {
      params['startDate'] = param.data.startDate;
      params['endDate'] = param.data.endDate;
    } else if (param.data.date) {
      params['date'] = param.data.date;
    }
    this.router.navigate(['/dashboard/dfq/mp/model-fpyr-list'], { queryParams: params });
  }

  getOption(title: string, data: any[]): {} {
    return {
      title: {
        text: title,
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)'
      },
      series: {
        name: '',
        type: 'pie',
        label: {
          show: true,
          formatter: '{b}:{c}({d}%)'
        },
        center: ['50%', '60%'],
        data: data
      }
    };
  }

}
