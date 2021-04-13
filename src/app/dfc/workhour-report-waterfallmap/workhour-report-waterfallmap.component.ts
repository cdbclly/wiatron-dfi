import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-workhour-report-waterfallmap',
  templateUrl: './workhour-report-waterfallmap.component.html',
  styleUrls: ['./workhour-report-waterfallmap.component.scss']
})

export class WorkhourReportWaterfallmapComponent implements OnInit, OnChanges, OnDestroy {
  optionsSecond;
  cFlow;
  SecondEchartParam = {
    xAxisData: [],
    seriesData1: [],
    seriesData2: [],
  };
  constructor(
    private translate: TranslateService
  ) { }
  @Input() modelName;
  @Input() ctageFlow;
  @Input() processName;
  @Input() datatot1;
  // i18n
  destroy$ = new Subject();
  echartTitle;
  cFlowTitle;
  title;
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // 初始化I18N;
    this.translate.get(['report.process-workhour-improve-analysis', 'report.stage']).subscribe(res => {
      this.echartTitle = res['report.process-workhour-improve-analysis'];
      this.cFlowTitle = res['report.stage'];
      this.title = this.modelName + ' ' + this.ctageFlow + this.cFlowTitle + this.processName + this.echartTitle;
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['report.process-workhour-improve-analysis', 'report.stage']).subscribe(res => {
        this.echartTitle = res['report.process-workhour-improve-analysis'];
        this.cFlowTitle = res['report.stage'];
        this.title = this.modelName + ' ' + this.ctageFlow + this.cFlowTitle + this.processName + this.echartTitle;
        this.getOptionsSecond(this.title);
      });
    });
    if (changes.datatot1 && changes.datatot1.firstChange === false) {
      this.querySecondEchart(
        this.datatot1['data']['acturalName'],
        this.datatot1['data']['actural'],
        this.datatot1['data']['aimsName'],
        this.datatot1['data']['aims'],
        this.datatot1['data']['targetName'],
        this.datatot1['data']['target'],
        this.datatot1['data']['improvesTop5'],
        this.datatot1['data']['gapsTop5']);
    }
  }

  querySecondEchart(acturalName: string, actural: number, aimsName: string, aims: number, targetName: string, target: number,
    improves: { Material: string, Value: number }[], gaps: { Material: string, Value: number }[]) {
    this.SecondEchartParam.xAxisData = [];
    this.SecondEchartParam.seriesData1 = [];
    this.SecondEchartParam.seriesData2 = [];
    const colorList = { // 瀑布图颜色
      Actural: 'rgba(60, 144, 247, 1)',
      Gap: 'rgba(85, 191, 192, 1)',
      Best: 'rgba(255, 195, 0, 1)',
      Target: 'rgb(0, 102, 255)',
      Gap2: 'rgba(185, 91, 92, 19)',
    };
    this.SecondEchartParam.xAxisData.push(acturalName);
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: (!actural ? '0' : actural.toFixed(2)),
      itemStyle: {
        normal: {
          color: colorList.Actural
        }
      }
    });
    let height: number = (!actural ? 0 : actural);
    for (let index = 0; index < improves.length; index++) {
      const improve = improves[index];
      if (improve.Value >= 0) {
        this.SecondEchartParam.xAxisData.push(improve.Material);
        this.SecondEchartParam.seriesData1.push(height - improve.Value);
        this.SecondEchartParam.seriesData2.push({
          value: improve.Value.toFixed(2),
          itemStyle: {
            normal: {
              color: colorList.Gap
            }
          }
        });
      } else {
        const bbb = Math.abs(improve.Value);
        this.SecondEchartParam.xAxisData.push(improve.Material);
        this.SecondEchartParam.seriesData1.push(height);
        this.SecondEchartParam.seriesData2.push({
          value: bbb.toFixed(2),
          itemStyle: {
            normal: {
              color: colorList.Gap2
            }
          }
        });
      }
      height -= improve.Value;
    }
    this.SecondEchartParam.xAxisData.push(aimsName);
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: (!aims ? '0' : aims.toFixed(2)),
      itemStyle: {
        normal: {
          color: colorList.Target
        }
      }
    });
    let height2: number = (!aims ? 0 : aims);
    const length = this.SecondEchartParam.xAxisData.length;
    for (let index = 0; index < gaps.length; index++) {
      const gap = gaps[index];
      if (gap.Value >= 0) {
        this.SecondEchartParam.xAxisData.push(gap.Material);
        this.SecondEchartParam.seriesData1.push(height2 - gap.Value);
        this.SecondEchartParam.seriesData2.push({
          value: gap.Value.toFixed(2),
          itemStyle: {
            normal: {
              color: colorList.Gap
            }
          }
        });
      } else {
        const bbb = Math.abs(gap.Value);
        this.SecondEchartParam.xAxisData.push(gap.Material);
        this.SecondEchartParam.seriesData1.push(height2);
        this.SecondEchartParam.seriesData2.push({
          value: bbb.toFixed(2),
          itemStyle: {
            normal: {
              color: colorList.Gap2
            }
          }
        });
      }
      height2 -= gap.Value;
    }
    this.SecondEchartParam.xAxisData.push(targetName);
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: (!target ? '0' : target.toFixed(2)),
      itemStyle: {
        normal: {
          color: colorList.Best
        }
      }
    });
    this.getOptionsSecond(this.title);
  }

  getOptionsSecond(title) {
    this.optionsSecond = {
      title: {
        text: title,
        x: 'center',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[1];
          return tar.name + ' : ' + tar.value;
        }
      },
      xAxis: [{
        type: 'category',
        splitLine: { show: false },
        axisLabel: {
          show: true,
          rotate: 315
        },
        data: this.SecondEchartParam.xAxisData
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [
        {
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: this.SecondEchartParam.seriesData1
        },
        {
          type: 'bar',
          stack: '总量',
          itemStyle: { normal: { label: { show: true, position: 'top' } } },
          data: this.SecondEchartParam.seriesData2
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
