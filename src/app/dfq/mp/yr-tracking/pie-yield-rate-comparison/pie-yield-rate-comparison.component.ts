import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { RepairDetailApi } from '@service/dpm_sdk/sdk';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'mp-pie-yield-rate-comparison',
  templateUrl: './pie-yield-rate-comparison.component.html',
  styleUrls: ['./pie-yield-rate-comparison.component.scss']
})
export class PieYieldRateComparisonComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() isLoading: boolean;
  @Input() titles: string;
  isDetailLoading: boolean;
  options;
  detailOptions;
  isVisible = false;
  title;

  constructor(
    private repairDetailService: RepairDetailApi,
    private messageService: NzMessageService
  ) { }

  ngOnChanges() {
    this.options = this.getOptions(this.data, this.titles);
  }

  ngOnInit() { }

  getOptions(data, titles): {} {
    return {
      title: {
        text: titles,
        left: 'center',
      },
      series: {
        type: 'pie',
        label: {
          formatter: '{b} : {c} ({d}%)'
        },
        data: data.length > 0 ? data : [{ value: 0 }]
      }
    };
  }

  detail(params): void {
    if (this.data.length === 0) {
      return;
    }
    this.isDetailLoading = true;
    this.isVisible = true;
    this.title = (params.data.line ? params.data.name : '') + ' Repair reason';
    const filter = {
      where: {
        plant: params.data.plant,
        mfgType: params.data.mfgType,
        reasonType: params.data.name,
        model: params.data.model,
        line: params.data.relatedLines,
        trnDate: params.data.trnDate,
      },
      group: ['description']
    };
    this.repairDetailService.find(filter).subscribe({
      next: data => {
        data = data.map((data: any) => {
          return {
            name: data.description,
            value: data.qty
          }
        });
        // top 5 and sort by qty
        data = data.sort((a: any, b: any) => a.value > b.value ? 1 : -1);
        // get detail option
        this.detailOptions = this.getDetailOption(data);
        // set detail loading false
        this.isDetailLoading = false;
      },
      error: err => this.handleError(err, 'DPM Server error')
    });
  }

  getDetailOption(data): {} {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '4%',
        left: '5%',
        right: '4%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        minInterval: 1
      },
      yAxis: {
        type: 'category'
      },
      dataset: [
        {
          dimensions: ['name', 'value'],
          source: data
        }
      ],
      series: {
        type: 'bar'
      }
    };
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleError(err, title: string) {
    if (err === 'Server error') {
      this.messageService.error(`${title}: Unable to connect to server`);
    } else {
      this.messageService.error(`${title}: ${err.message}`);
    }
  }
}
