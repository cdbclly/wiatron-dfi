import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { View_ModelResultApi, View_ModelResult } from '@service/mrr-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { PlantApi, Plant } from '@service/dfi-sdk';
import { PlantNamePipe } from 'app/shared/pipe';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nudd-board',
  templateUrl: './nudd-board.component.html',
  styleUrls: ['./nudd-board.component.scss']
})
export class NuddBoardComponent implements OnInit, OnChanges {
  options = [];
  bg: any;
  isLoading = true;
  echartSummary = [];
  @Input() flag;
  transNotice = {};
  constructor(
    private viewService: View_ModelResultApi,
    private plantService: PlantApi,
    private plantNamePipe: PlantNamePipe,
    private router: ActivatedRoute,
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // 從MRR落地執行進入 不分bg
    if (changes['flag'].currentValue) {
      this.query(undefined);
    }
  }

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
    this.router.paramMap.subscribe(params => {
      this.bg = params.get('bg');
      // 從dashboard進入 分bg
      if (this.bg) {
        this.query(this.bg);
      }
    });
  }

  async query(businessGroup: string) {
    const plants = await this.plantService.find<Plant>({ where: { businessGroupId: businessGroup } }).toPromise();
    const result = await this.viewService.find<View_ModelResult>({ where: { businessGroup: businessGroup } }).toPromise();
    for (let index = 0; index < plants.length; index++) {
      const plant = plants[index];
      const plantName = await this.plantNamePipe.transform(plant.id);
      const total = result.filter(data => data.plant === plant.id).length;
      const pass = result.filter(data => data.plant === plant.id && data.status === 2).length;
      const option: IPieChartOption = {
        title: plantName,
        subtext: total === 0 ? (plant.enabled ? `${this.transNotice['noData']}` : `${this.transNotice['sysDev']}`) : (pass + '\n' + '─────' + '\n' + total),
        height: '160px',
        width: '160px',
        data: [
          {
            plantId: plant.id,
            name: 'pass',
            value: pass,
            itemStyle: {
              color: total ? 'green' : 'white'
            },
          },
          {
            plantId: plant.id,
            name: 'total',
            value: total ? total - pass : 1,
            itemStyle: {
              color: total ? 'red' : 'white'
            },
          }
        ]
      };
      this.options.push(option);
    }
    this.options.sort(this.sortBySubtext);
    this.isLoading = false;
  }

  // 按subtext排序
  sortBySubtext(a, b) {
    if (a['subtext'] > b['subtext']) {
      return 1;
    } else if (a['subtext'] < b['subtext']) {
      return -1;
    } else {
      return 0;
    }
  }

  clickMrr(params) {
    this.route.navigateByUrl('/dashboard/nudd/nuddreport' + '?plant=' + params.data.plantId);
  }
}
