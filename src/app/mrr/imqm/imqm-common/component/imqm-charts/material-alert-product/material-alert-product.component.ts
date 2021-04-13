import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-material-alert-product',
  templateUrl: './material-alert-product.component.html',
  styleUrls: ['./material-alert-product.component.scss']
})
export class MaterialAlertProductComponent implements OnInit, OnChanges, OnDestroy {

  barOption;
  @Input() options;
  @Output('subDetail') subDetail = new EventEmitter<any>();

   // i18n
   destroy$ = new Subject();
   trans: Object = {};


  constructor(
    private translate: TranslateService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['imq-model', 'imq-proName', 'imq-partNumber', 'imq-pop-number', 'imq-supplier']).subscribe(res => {
        this.trans['model'] = res['imq-model'];
        this.trans['proName'] = res['imq-proName'];
        this.trans['partNumber'] = res['imq-partNumber'];
        this.trans['number'] = res['imq-pop-number'];
        this.trans['supplier'] = res['imq-supplier'];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.get(['imq-model', 'imq-proName', 'imq-partNumber', 'imq-pop-number', 'imq-supplier']).subscribe(res => {
      this.trans['model'] = res['imq-model'];
      this.trans['proName'] = res['imq-proName'];
      this.trans['partNumber'] = res['imq-partNumber'];
      this.trans['number'] = res['imq-pop-number'];
      this.trans['supplier'] = res['imq-supplier'];
      if (this.options !== undefined) {
        console.log('接收上一个界面的数据\n', this.options);
        this.get_barChart();
      }
    });
  }
  ngOnInit() {
  }

  get_barChart() {
    this.barOption = {
      grid: {
        x: 70,
        x2: 70,
        y2: 40
      },
      title : {
        text: this.options ? this.options['title'] : null,
        x: 'center'
    },
    backgroundColor: 'rgba(255,255,255,1)',
    tooltip : {
      backgroundColor: 'rgba(255,255,255,1)',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: 'black'
      },
      formatter: (params, ticket, callback) => {
        console.log(this.options);
        if (this.options && this.options['toolTip'] && this.options['toolTip'].length > 0) {
          let partNo;
          if (this.options['toolTip'][params['dataIndex']]) {
            partNo =  this.options['toolTip'][params['dataIndex']].length > 0 ?  this.options['toolTip'][params['dataIndex']][0]['partNumber'] :  this.options['toolTip'][params['dataIndex']]['partNumber'];
          } else {
            partNo = 'NA';
          }
          let contents = '';
          for (let i = 0; i < this.options['toolTip'][params['dataIndex']].length; i++) {
            contents =  contents + `<div style="flex: 0 1 120px;margin: 10px;">
            <table border="1" bordercolor="skyblue" style="color: black">
        <tr>
          <td style="padding:5px">${this.trans['supplier']}:</td>
          <td style="padding:5px">${this.options['toolTip'][params['dataIndex']] ? this.options['toolTip'][params['dataIndex']][i]['vendor'] : 'NA'}</td>
        </tr>
        <tr>
          <td style="padding:5px">${this.trans['model']}:</td>
          <td style="padding:5px">${this.options['toolTip'][params['dataIndex']] ? this.options['toolTip'][params['dataIndex']][i]['model'] : 'NA'}</td>
        </tr>
        <tr>
          <td style="padding:5px">${this.trans['proName']}:</td>
          <td style="padding:5px">${this.options['toolTip'][params['dataIndex']] ? this.options['toolTip'][params['dataIndex']][i]['productName'] : 'NA'}</td>
        </tr>
        <tr>
          <td style="padding:5px">${this.trans['partNumber']}:</td>
          <td style="padding:5px">${partNo}</td>
        </tr>
        <tr>
          <td style="padding:5px">${this.trans['number']}:</td>
          <td style="padding:5px">${parseFloat(params['value'])}</td>
        </tr>
        </table>
            </div>`;
          }
        contents =  `<div style="display: flex;flex-wrap: wrap;flex-direction: row;">${contents}</div>`;
        // console.log(contents);
        return contents;
        } else {
          return params['name'] + ': ' + params['value'];
        }
      }
    },
    legend: {
        data: this.options ? this.options['legend'] : [],
        orient: 'horizontal',
        x: 'right',
        selectedMode: false
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : this.options ? this.options['data_x'] : [],
            axisLabel: {
              interval: 0
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series: this.options ? this.options['series'] : []
    };
  }

  showSubChart(detail) {
    this.subDetail.emit(detail);
    // console.log(detail);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }

}
