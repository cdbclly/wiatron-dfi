import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
// SDK
import { View_ModelResultApi } from '@service/dfq_sdk/sdk';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { PlantApi } from '@service/dfi-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-em-auto-judgement-qualifield-rate',
  templateUrl: './em-auto-judgement-qualifield-rate.component.html',
  styleUrls: ['./em-auto-judgement-qualifield-rate.component.scss']
})
export class EmAutoJudgementQualifieldRateComponent implements OnInit, OnDestroy {
  @Output() setEchartSummarycx = new EventEmitter<any>();
  stages = ['C4', 'C5'];
  bg: string;
  url: string;
  sites;
  c4Options = [];
  c5Options = [];
  isLoading = true;
  echartSummary = [];
  transNotice = {};
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private modelResultService: View_ModelResultApi,
    private meetingReviewService: MeetingReviewTestService,
    private plantService: PlantApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
      });
    });
    this.router.paramMap.subscribe(param => {
      this.bg = param.get('bg');
      if (this.bg) {
        this.getSites(this.bg).subscribe(plants => this.query(this.bg.slice(0, 4), plants));
      } else {
        this.getSites(undefined).subscribe(plants => this.query(undefined, plants));
      }
    });
  }

  async query(bg, plants: any[]) {
    for (let index = 0; index < plants.length; index++) {
      if (plants[index]['enabled']) {
        const c4 = await this.getNum(bg, this.stages[0], plants[index]['siteId'], plants[index]['name']).toPromise();
        const c5 = await this.getNum(bg, this.stages[1], plants[index]['siteId'], plants[index]['name']).toPromise();
        this.c4Options.push(this.getOptions(plants[index], 'C4', c4.pass, c4.total));
        this.c5Options.push(this.getOptions(plants[index], 'C5', c5.pass, c5.total));
        // dfi月报title 文字描述
        this.echartSummary.push(
          {
            'title': plants[index]['siteId'] + '-' + plants[index]['name'],
            'C4pass': c4.pass,
            'C5pass': c5.pass,
            'C4total': c4.total,
            'C5total': c5.total
          }
        );
      } else {
        const c4params = {
          titleText: plants[index]['siteId'] + '-' + plants[index]['name'],
        };
        const c5params = {
          titleText: plants[index]['siteId'] + '-' + plants[index]['name'],
        };
        this.c4Options.push(this.getPieOptionOngoing(c4params));
        this.c5Options.push(this.getPieOptionOngoing(c5params));
      }
      if (index === plants.length - 1) {
        this.isLoad();
        this.setEchartSummarycx.emit(this.echartSummary);
      }
    }
  }

  isLoad() {
    if (this.c4Options.length === this.c5Options.length) {
      this.isLoading = false;
    }
  }

  getOptions(plant: string, stage: string, pass: number, total: number): IPieChartOption {
    const siteId = plant['siteId'];
    const plantId = plant['name'];
    const options: IPieChartOption = {
      title: plant['siteId'] + '-' + plant['name'],
      subtext: (pass !== undefined ? pass : 'N/A') + '\n' + '─────' + '\n' + (total !== undefined ? total : 'N/A'),
      data: [],
      height: '160px',
      width: '160px'
    };
    if (total === 0) {
      options.subtext = this.transNotice['noData'],
        options.data.push({
          name: 'total',
          value: 0,
          itemStyle: {
            color: 'white'
          },
          siteId: siteId,
          plantId: plantId,
          stage: stage
        });
    } else {
      options.data.push({
        name: 'pass',
        value: pass,
        itemStyle: {
          color: 'green'
        },
        siteId: siteId,
        plantId: plantId,
        stage: stage
      });
      options.data.push({
        name: 'total',
        value: total - pass,
        itemStyle: {
          color: 'red'
        },
        siteId: siteId,
        plantId: plantId,
        stage: stage
      });
    }
    return options;
  }

  onChartEvent(params) {
    if (params.data.name === 'total' && params.data.value === 0) {
      return;
    }
    this.route.navigate(['/dashboard/exit-meeting/summary'], {
      queryParams: {
        site: params.data.siteId,
        plant: params.data.plantId,
        stages: params.data.stage
      }
    });
  }

  getNum(bg: string, stage: string, site: string, plant: string) {
    return this.modelResultService.find({
      where: {
        businessGroup: bg,
        stage: stage,
        site: site,
        plant: plant.slice(1, 2),
        signStatus: { inq: [4, 5] }
      }
    }).pipe(map(result => {
      const obj = { pass: 0, total: result.length };
      for (let index = 0; index < result.length; index++) {
        if (this.meetingReviewService.getResultByPlantId(result[index]['plant'], result[index]['status'])) {
          obj.pass++;
        }
      }
      obj['stage'] = stage;
      return obj;
    }));
  }

  getSites(bg: string) {
    return this.plantService.find({
      where: {
        businessGroupId: bg
      }
    }).pipe(map(red => {
      let plants = [];
      for (let index = 0; index < red.length; index++) {
        red[index]['plantName'] = red[index]['siteId'] + '-' + red[index]['name'];
      }
      const result = new Map();
      plants = red.filter(item => !result.has(item['plantName']) && result.set(item['plantName'], 1));
      return plants;
    }));
  }

  ngOnDestroy() { }

  // 未开发系统饼图绘制
  getPieOptionOngoing(param: any): {} {
    const params: IPieChartOption = {
      title: param.titleText,
      subtext: this.transNotice['sysDev'],
      data: [{
        name: param.titleText,
        value: 0,
        itemStyle: {
          color: 'white'
        }
      }],
      width: '160px',
      height: '160px'
    };
    return params;
  }
}
