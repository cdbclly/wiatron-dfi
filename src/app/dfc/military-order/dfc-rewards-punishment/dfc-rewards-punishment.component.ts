import { Component, OnInit } from '@angular/core';
import { DfcKpiRewardsContent } from 'app/dfc/report/dfc-kpi/dfc-kpi';
import { RewardsSignService } from '../rewards-punishment-rule-sign/rewards-sign.service';
import { DownexcelService } from '@service/downexcel.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dfc-rewards-punishment',
  templateUrl: './dfc-rewards-punishment.component.html',
  styleUrls: ['./dfc-rewards-punishment.component.scss']
})
export class DfcRewardsPunishmentComponent implements OnInit {
  rule;
  version;
  // 上傳時需要用的參數
  showLoading = false;
  uploadType = 'reward';
  isSendSignVisible = false;
  sendMode = {
    isSign: false,
    value: '',
    description: '',
    member1: '',
    memberOption1: [],
    member2: '',
    memberOption2: [],
    member3: '',
    memberOption3: [],
    workflowMappingID: ''
  };
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['RewardQuery']; // 页面上的用户权限
  showUpload = false;
  transParam = {};
  constructor(private rewardsSignService: RewardsSignService,
    private downExcelService: DownexcelService,
    private translate: TranslateService) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['military-order.form-approve', 'military-order.dfc-c4-reward1', 'military-order.dfc-c4-reward2', 'military-order.dfc-c4-reward3',
      'military-order.dfc-c4-c5-mp-l1-punish1', 'military-order.dfc-c4-c5-l1-punish2', 'military-order.dfc-c4-c5-l1-punish3',
      'military-order.dfc-c4-c5-mp-l2-punish1', 'military-order.dfc-c4-c5-l2-punish2', 'military-order.dfc-c4-c5-l2-punish3',
      'military-order.dfc-c4-c5-mp-l3-punish1', 'military-order.dfc-c4-c5-l3-punish2', 'military-order.dfc-c4-c5-l3-punish3',
      'military-order.dfc-c5-reward1', 'military-order.dfc-c5-reward2', 'military-order.dfc-c5-reward3',
      'military-order.dfc-mp-reward1', 'military-order.dfc-mp-reward2', 'military-order.dfc-mp-reward3', 'military-order.dfc-mp-reward4',
      'military-order.dfc-mp-l1-punish2', 'military-order.dfc-mp-l3-punish2', 'military-order.dfc-mp-l3-punish3']).subscribe(res => {
        this.transParam['notice'] = res['military-order.form-approve'];
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
      this.translate.get(['military-order.form-approve', 'military-order.dfc-c4-reward1', 'military-order.dfc-c4-reward2', 'military-order.dfc-c4-reward3',
        'military-order.dfc-c4-c5-mp-l1-punish1', 'military-order.dfc-c4-c5-l1-punish2', 'military-order.dfc-c4-c5-l1-punish3',
        'military-order.dfc-c4-c5-mp-l2-punish1', 'military-order.dfc-c4-c5-l2-punish2', 'military-order.dfc-c4-c5-l2-punish3',
        'military-order.dfc-c4-c5-mp-l3-punish1', 'military-order.dfc-c4-c5-l3-punish2', 'military-order.dfc-c4-c5-l3-punish3',
        'military-order.dfc-c5-reward1', 'military-order.dfc-c5-reward2', 'military-order.dfc-c5-reward3',
        'military-order.dfc-mp-reward1', 'military-order.dfc-mp-reward2', 'military-order.dfc-mp-reward3', 'military-order.dfc-mp-reward4',
        'military-order.dfc-mp-l1-punish2', 'military-order.dfc-mp-l3-punish2', 'military-order.dfc-mp-l3-punish3']).subscribe(res => {
          this.transParam['notice'] = res['military-order.form-approve'];
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
    this.queryRule();
  }

  // 查詢
  queryRule() {
    this.rewardsSignService.queryRule('DFC').then(data => {
      if (JSON.stringify(data['rule']) !== '{}') {
        this.rule = data['rule'];
        this.version = data['version'];
        // 查询表单是否正在签核
        if (![1, 2].includes(data['recently']['workflow']['status'])) {
          this.sendMode.isSign = true;
          this.sendMode.value = this.transParam['notice'];
        } else {
          this.sendMode.isSign = false;
        }
      } else {
        this.rule = DfcKpiRewardsContent;
        this.version = 'V01';
      }
      this.showUpload = true;
    });
  }

  // 查詢該表單是否正在簽核
  isSign(signID) {
    this.rewardsSignService.isSign(signID).then(data => {
      if (data) {
        this.sendMode.isSign = true;
        this.sendMode.value = this.transParam['notice'];
      } else {
        this.sendMode.isSign = false;
      }
    });
  }

  // 上傳 文件顯示
  upload(file) {
    this.showUpload = false;
    if (!file['name']) {
      this.version = file[0][(file[0].length - 1)];
      const stages = file[1].splice(2, (file[1].length - 3));
      let standard = {};
      stages.forEach((stage, index) => {
        standard[stage] = {
          Reward: [],
          Punish: {
            Lv1: [],
            Lv2: [],
            Lv3: []
          }
        };
        standard[stage].Reward.push(file[4][(2 + index)]);
        const rewards = file[5][(2 + index)].split('\r\n');
        rewards.forEach(reward => {
          standard[stage].Reward.push(reward);
        });
        const punishLv1s = file[6][(2 + index)].split('\r\n');
        punishLv1s.forEach(punishLv1 => {
          standard[stage].Punish.Lv1.push(punishLv1);
        });
        const punishLv2s = file[7][(2 + index)].split('\r\n');
        punishLv2s.forEach(punishLv2 => {
          standard[stage].Punish.Lv2.push(punishLv2);
        });
        const punishLv3s = file[8][(2 + index)].split('\r\n');
        punishLv3s.forEach(punishLv3 => {
          standard[stage].Punish.Lv3.push(punishLv3);
        });
      });
      this.rule.Stage = stages;
      this.rule.Standard = standard;
      this.showLoading = false;
      this.showUpload = true;
    }
  }

  // 送簽功能
  async sendSign() {
    const aaa = await this.rewardsSignService.sendMember().then(datas => {
      if (!!datas && datas.length > 0) {
        this.sendMode.workflowMappingID = datas[0]['workflowFormMappingId'];
        this.sendMode.member1 = datas[0]['picId'];
        this.sendMode.member2 = datas[1]['picId'];
        this.sendMode.member3 = datas[2]['picId'];
        this.rewardsSignService.getSignMemberSelect('', datas[0]['picId']).then(res => {
          if (!!res) {
            res.forEach(rs => {
              this.sendMode.memberOption1.push(rs);
            });
          }
        });
        this.rewardsSignService.getSignMemberSelect('', datas[1]['picId']).then(res => {
          if (!!res) {
            res.forEach(rs => {
              this.sendMode.memberOption2.push(rs);
            });
          }
        });
        this.rewardsSignService.getSignMemberSelect('', datas[2]['picId']).then(res => {
          if (!!res) {
            res.forEach(rs => {
              this.sendMode.memberOption3.push(rs);
            });
          }
        });
      }
    });
    this.isSendSignVisible = true;
  }

  cancelSendSign() {
    this.isSendSignVisible = false;
    this.sendMode.description = '';
  }

  sendButton() {
    const list = [];
    list.push({ empID: this.sendMode.member1, role: 'SECTION' });
    list.push({ empID: this.sendMode.member2, role: 'DEPT' });
    list.push({ empID: this.sendMode.member3, role: 'DIVISIONS' });
    this.rewardsSignService.sendSign(this.rule, this.version, this.sendMode.description, list, this.sendMode.workflowMappingID).then(data => {
      this.cancelSendSign();
      this.queryRule();
    });
  }

  // 下載
  download() {
    const table = document.getElementById('downdata');
    this.downExcelService.exportTableAsExcelFile(table, 'reward');
  }
}
