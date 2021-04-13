import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StageStatus } from './StageStatus';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss']
})
export class EchartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: StageStatus[];
  @Output() showTable = new EventEmitter<any>();
  @Input() isLoading: boolean;
  options;
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private translate: TranslateService
  ) {
  }

  ngOnInit() { }

  ngOnChanges() {
    this.options = [];
    if (this.data) {
      this.data.forEach((status: StageStatus) => {
        this.options.push(this.getOption(status.getStage(), status.getPass().toString(), status.getFail().toString(), (status.getPass() + status.getFail()).toString()));
      });
    }
    // 初始化I18N;
    this.translate.get(['dfq.dfq-pass-ratio', 'dfq.dfq-passed', 'dfq.dfq-failed']).subscribe(res => {
      this.trans['passRatio'] = res['dfq.dfq-pass-ratio'];
      this.trans['passed'] = res['dfq.dfq-passed'];
      this.trans['failed'] = res['dfq.dfq-failed'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-pass-ratio', 'dfq.dfq-passed', 'dfq.dfq-failed']).subscribe(res => {
        this.trans['passRatio'] = res['dfq.dfq-pass-ratio'];
        this.trans['passed'] = res['dfq.dfq-passed'];
        this.trans['failed'] = res['dfq.dfq-failed'];
        //  由於檢測不到變量變化重新賦值
        this.options = [];
        this.data.forEach((status: StageStatus) => {
          this.options.push(this.getOption(status.getStage(), status.getPass().toString(), status.getFail().toString(), (status.getPass() + status.getFail()).toString()));
        });
      });
    });
  }

  getOption(stage: string, pass: string, fail: string, total: string) {
    return {
      title: {
        left: 'center',
        text: stage + this.trans['passRatio'],
        textStyle: {
          fontWeight: 'normal'
        },
        subtextStyle: {
          color: '#000000',
          fontWeight: 'normal',
          fontSize: 20,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 'center'
      },
      series: [
        {
          name: stage + this.trans['passRatio'],
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            show: true,
            position: 'center',
            formatter: (pass !== undefined ? pass : 'N/A') + '\n' + '─────' + '\n' + (total !== undefined ? total : 'N/A'),
            fontWeight: 'bold',
            fontSize: 18,
            color: 'black'
          },
          labelLine: {
            show: false
          },
          data: [
            {
              name: this.trans['passed'],
              value: pass,
              itemStyle: {
                normal: {
                  color: 'green',
                  label: {
                    show: false,
                    position: 'center',
                    textStyle: {}
                  }
                }
              }
            },
            {
              name: this.trans['failed'],
              value: fail,
              itemStyle: {
                normal: {
                  color: 'red',
                  label: {
                    show: false,
                    position: 'center'
                  }
                }
              }
            }
          ]
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
