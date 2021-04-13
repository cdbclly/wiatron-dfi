import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ClsDfcKpiReward } from '../dfc-kpi';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dfc-kpi-rewards',
  templateUrl: './dfc-kpi-rewards.component.html',
  styleUrls: ['./dfc-kpi-rewards.component.scss']
})
export class DfcKpiRewardsComponent implements OnInit {
  @Input() rewards: ClsDfcKpiReward;
  @Input() isVisible;
  @Output() isVisibleChange = new EventEmitter();
  @Output() viewRuleChange = new EventEmitter();
  isReportPopVisible = true;

  title = {
    'green': '獎勵建議書',
    'red': '懲罰建議書'
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['report.dfc-reward-sug', 'report.dfc-punish-sug']).subscribe(res => {
      this.title['green'] = res['report.dfc-reward-sug'];
      this.title['red'] = res['report.dfc-punish-sug'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['report.dfc-reward-sug', 'report.dfc-punish-sug']).subscribe(res => {
        this.title['green'] = res['report.dfc-reward-sug'];
        this.title['red'] = res['report.dfc-punish-sug'];
      });
    });
  }

  cancelPop() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  viewRule() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this.viewRuleChange.emit('rule');
  }

  military() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this.viewRuleChange.emit('military');
  }
}
