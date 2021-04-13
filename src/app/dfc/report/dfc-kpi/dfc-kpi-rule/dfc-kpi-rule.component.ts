import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DfcKpiRewardsContent, ClsDfcKpiReward } from '../dfc-kpi';
import { DfcKpiService } from '../dfc-kpi.service';

@Component({
  selector: 'app-dfc-kpi-rule',
  templateUrl: './dfc-kpi-rule.component.html',
  styleUrls: ['./dfc-kpi-rule.component.scss']
})
export class DfcKpiRuleComponent implements OnInit, OnChanges {

  @Input() isVisible;
  @Input() rewards = new ClsDfcKpiReward();
  @Input() modelId;
  @Input() type;
  @Output() isVisibleChange = new EventEmitter();
  @Output() isBack = new EventEmitter();
  title = '金牛機種DFC組裝工時達標獎勵懲罰規則說明';
  rule = DfcKpiRewardsContent; // rule 的默認值為 DfcKpiRewardsContent, 其他會在 service中獲取實時的值過來
  version = '';
  actual = {
    target: '',
    actual: {}
  };
  transParam = {}
  constructor(
    private dfcKpiService: DfcKpiService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['report.dfc-jinniu-model-title', 'military-order.dfc-c4-reward1', 'military-order.dfc-c4-reward2', 'military-order.dfc-c4-reward3',
      'military-order.dfc-c4-c5-mp-l1-punish1', 'military-order.dfc-c4-c5-l1-punish2', 'military-order.dfc-c4-c5-l1-punish3',
      'military-order.dfc-c4-c5-mp-l2-punish1', 'military-order.dfc-c4-c5-l2-punish2', 'military-order.dfc-c4-c5-l2-punish3',
      'military-order.dfc-c4-c5-mp-l3-punish1', 'military-order.dfc-c4-c5-l3-punish2', 'military-order.dfc-c4-c5-l3-punish3',
      'military-order.dfc-c5-reward1', 'military-order.dfc-c5-reward2', 'military-order.dfc-c5-reward3',
      'military-order.dfc-mp-reward1', 'military-order.dfc-mp-reward2', 'military-order.dfc-mp-reward3', 'military-order.dfc-mp-reward4',
      'military-order.dfc-mp-l1-punish2', 'military-order.dfc-mp-l3-punish2', 'military-order.dfc-mp-l3-punish3']).subscribe(res => {
        this.title = res['report.dfc-jinniu-model-title'];
        DfcKpiRewardsContent.Standard['C4'].Reward[0] = res['military-order.dfc-c4-reward1'];
        DfcKpiRewardsContent.Standard['C4'].Reward[1] = res['military-order.dfc-c4-reward2'];
        DfcKpiRewardsContent.Standard['C4'].Reward[2] = res['military-order.dfc-c4-reward3'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][1] = res['military-order.dfc-c4-c5-l1-punish2'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l1-punish3'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l2-punish2'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
        DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
        DfcKpiRewardsContent.Standard['C5'].Reward[0] = res['military-order.dfc-c5-reward1'];
        DfcKpiRewardsContent.Standard['C5'].Reward[1] = res['military-order.dfc-c5-reward2'];
        DfcKpiRewardsContent.Standard['C5'].Reward[2] = res['military-order.dfc-c5-reward3'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][1] = res['military-order.dfc-c4-c5-l1-punish2'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l1-punish3'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l2-punish2'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
        DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
        DfcKpiRewardsContent.Standard['MP'].Reward[0] = res['military-order.dfc-mp-reward1'];
        DfcKpiRewardsContent.Standard['MP'].Reward[1] = res['military-order.dfc-mp-reward2'];
        DfcKpiRewardsContent.Standard['MP'].Reward[2] = res['military-order.dfc-mp-reward3'];
        DfcKpiRewardsContent.Standard['MP'].Reward[3] = res['military-order.dfc-mp-reward4'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][1] = res['military-order.dfc-mp-l1-punish2'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][1] = res['military-order.dfc-mp-l3-punish2'];
        DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][2] = res['military-order.dfc-mp-l3-punish3'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['report.dfc-jinniu-model-title', 'military-order.dfc-c4-reward1', 'military-order.dfc-c4-reward2', 'military-order.dfc-c4-reward3',
        'military-order.dfc-c4-c5-mp-l1-punish1', 'military-order.dfc-c4-c5-l1-punish2', 'military-order.dfc-c4-c5-l1-punish3',
        'military-order.dfc-c4-c5-mp-l2-punish1', 'military-order.dfc-c4-c5-l2-punish2', 'military-order.dfc-c4-c5-l2-punish3',
        'military-order.dfc-c4-c5-mp-l3-punish1', 'military-order.dfc-c4-c5-l3-punish2', 'military-order.dfc-c4-c5-l3-punish3',
        'military-order.dfc-c5-reward1', 'military-order.dfc-c5-reward2', 'military-order.dfc-c5-reward3',
        'military-order.dfc-mp-reward1', 'military-order.dfc-mp-reward2', 'military-order.dfc-mp-reward3', 'military-order.dfc-mp-reward4',
        'military-order.dfc-mp-l1-punish2', 'military-order.dfc-mp-l3-punish2', 'military-order.dfc-mp-l3-punish3']).subscribe(res => {
          this.title = res['report.dfc-jinniu-model-title'];
          DfcKpiRewardsContent.Standard['C4'].Reward[0] = res['military-order.dfc-c4-reward1'];
          DfcKpiRewardsContent.Standard['C4'].Reward[1] = res['military-order.dfc-c4-reward2'];
          DfcKpiRewardsContent.Standard['C4'].Reward[2] = res['military-order.dfc-c4-reward3'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][1] = res['military-order.dfc-c4-c5-l1-punish2'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l1-punish3'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l2-punish2'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
          DfcKpiRewardsContent.Standard['C4'].Punish['Lv3'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
          DfcKpiRewardsContent.Standard['C5'].Reward[0] = res['military-order.dfc-c5-reward1'];
          DfcKpiRewardsContent.Standard['C5'].Reward[1] = res['military-order.dfc-c5-reward2'];
          DfcKpiRewardsContent.Standard['C5'].Reward[2] = res['military-order.dfc-c5-reward3'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][1] = res['military-order.dfc-c4-c5-l1-punish2'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l1-punish3'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l2-punish2'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
          DfcKpiRewardsContent.Standard['C5'].Punish['Lv3'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
          DfcKpiRewardsContent.Standard['MP'].Reward[0] = res['military-order.dfc-mp-reward1'];
          DfcKpiRewardsContent.Standard['MP'].Reward[1] = res['military-order.dfc-mp-reward2'];
          DfcKpiRewardsContent.Standard['MP'].Reward[2] = res['military-order.dfc-mp-reward3'];
          DfcKpiRewardsContent.Standard['MP'].Reward[3] = res['military-order.dfc-mp-reward4'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][0] = res['military-order.dfc-c4-c5-mp-l1-punish1'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][1] = res['military-order.dfc-mp-l1-punish2'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv1'][2] = res['military-order.dfc-c4-c5-l2-punish3'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][0] = res['military-order.dfc-c4-c5-mp-l2-punish1'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][1] = res['military-order.dfc-c4-c5-l3-punish2'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv2'][2] = res['military-order.dfc-c4-c5-l3-punish3'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][0] = res['military-order.dfc-c4-c5-mp-l3-punish1'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][1] = res['military-order.dfc-mp-l3-punish2'];
          DfcKpiRewardsContent.Standard['MP'].Punish['Lv3'][2] = res['military-order.dfc-mp-l3-punish3'];
        });
    });
    this.queryRewardRule();
    this.rule.Stage.forEach(stage => {
      this.actual['actual'][stage] = '';
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rewards'] && changes['rewards'].currentValue) {
      this.actual['target'] = this.rewards.actual;
      const ruleStages = [];
      this.rule.Stage.forEach(stage => {
        this.actual['actual'][stage] = '';
        ruleStages.push((stage === 'MP' ? 'C6' : stage));
      });
      this.dfcKpiService.queryRuleActualData(this.modelId, ruleStages).subscribe(datas => {
        datas.forEach(d => {
          if (d.stage === 'C6') {
            this.actual['actual']['MP'] = d.optTime;
          } else {
            this.actual['actual'][d.stage] = d.optTime;
          }
        });
      });
    }
  }

  queryRewardRule() {
    this.dfcKpiService.queryRewardRule().then(data => {
      this.rule = data;
    });
  }

  cancelPop() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  backPop() {
    this.isVisible = false;
    this.isBack.emit(true);
    this.isVisibleChange.emit(this.isVisible);
  }
}
