import { NzMessageService } from 'ng-zorro-antd';
import { RewardsSignService } from './../rewards-punishment-rule-sign/rewards-sign.service';
import { Component, OnInit } from '@angular/core';
import { DownexcelService } from '@service/downexcel.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dfq-rewards-punishment',
  templateUrl: './dfq-rewards-punishment.component.html',
  styleUrls: ['./dfq-rewards-punishment.component.scss']
})
export class DfqRewardsPunishmentComponent implements OnInit {
  rule = { week1: {}, week2: {}, week3: {}, week4: {} };
  DfqSignContent = { week1: {}, week2: {}, week3: {}, week4: {} }; // 用來存放送簽的內容
  version;
  showLoading = false;
  uploadType = 'reward';
  showUpload = false;
  isSendSignVisible = false; // 送簽按鈕的彈框
  // 送簽需要上傳的參數
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
  label1;
  label2;
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['RewardQuery']; // 页面上的用户权限
  transParam = {};
  constructor(
    private rewardsSignService: RewardsSignService,
    private downExcelService: DownexcelService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['military-order.form-approve', 'military-order.dfq-goal1', 'military-order.dfq-goal2', 'military-order.dfq-goal3', 'military-order.dfq-goal4',
      'military-order.dfq-actual1', 'military-order.dfq-actual2', 'military-order.dfq-actual3', 'military-order.dfq-actual4',
      'military-order.dfq-rewards1', 'military-order.dfq-rewards2', 'military-order.dfq-rewards3', 'military-order.dfq-rewards4',
      'military-order.dfq-punishment1', 'military-order.dfq-punishment2', 'military-order.dfq-punishment3', 'military-order.dfq-punishment4']).subscribe(res => {
        this.transParam['notice'] = res['military-order.form-approve'];
        this.rule['week1']['Goal'] = res['military-order.dfq-goal1'];
        this.rule['week2']['Goal'] = res['military-order.dfq-goal2'];
        this.rule['week3']['Goal'] = res['military-order.dfq-goal3'];
        this.rule['week4']['Goal'] = res['military-order.dfq-goal4'];
        this.rule['week1']['Actual'] = res['military-order.dfq-actual1'];
        this.rule['week2']['Actual'] = res['military-order.dfq-actual2'];
        this.rule['week3']['Actual'] = res['military-order.dfq-actual3'];
        this.rule['week4']['Actual'] = res['military-order.dfq-actual4'];
        this.rule['week1']['rewards'] = res['military-order.dfq-rewards1'];
        this.rule['week2']['rewards'] = res['military-order.dfq-rewards2'];
        this.rule['week3']['rewards'] = res['military-order.dfq-rewards3'];
        this.rule['week4']['rewards'] = res['military-order.dfq-rewards4'];
        this.rule['week1']['punishment'] = res['military-order.dfq-punishment1'];
        this.rule['week2']['punishment'] = res['military-order.dfq-punishment2'];
        this.rule['week3']['punishment'] = res['military-order.dfq-punishment3'];
        this.rule['week4']['punishment'] = res['military-order.dfq-punishment4'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['military-order.form-approve', 'military-order.dfq-goal1', 'military-order.dfq-goal2', 'military-order.dfq-goal3', 'military-order.dfq-goal4',
        'military-order.dfq-actual1', 'military-order.dfq-actual2', 'military-order.dfq-actual3', 'military-order.dfq-actual4',
        'military-order.dfq-rewards1', 'military-order.dfq-rewards2', 'military-order.dfq-rewards3', 'military-order.dfq-rewards4',
        'military-order.dfq-punishment1', 'military-order.dfq-punishment2', 'military-order.dfq-punishment3', 'military-order.dfq-punishment4']).subscribe(res => {
          this.transParam['notice'] = res['military-order.form-approve'];
          this.rule['week1']['Goal'] = res['military-order.dfq-goal1'];
          this.rule['week2']['Goal'] = res['military-order.dfq-goal2'];
          this.rule['week3']['Goal'] = res['military-order.dfq-goal3'];
          this.rule['week4']['Goal'] = res['military-order.dfq-goal4'];
          this.rule['week1']['Actual'] = res['military-order.dfq-actual1'];
          this.rule['week2']['Actual'] = res['military-order.dfq-actual2'];
          this.rule['week3']['Actual'] = res['military-order.dfq-actual3'];
          this.rule['week4']['Actual'] = res['military-order.dfq-actual4'];
          this.rule['week1']['rewards'] = res['military-order.dfq-rewards1'];
          this.rule['week2']['rewards'] = res['military-order.dfq-rewards2'];
          this.rule['week3']['rewards'] = res['military-order.dfq-rewards3'];
          this.rule['week4']['rewards'] = res['military-order.dfq-rewards4'];
          this.rule['week1']['punishment'] = res['military-order.dfq-punishment1'];
          this.rule['week2']['punishment'] = res['military-order.dfq-punishment2'];
          this.rule['week3']['punishment'] = res['military-order.dfq-punishment3'];
          this.rule['week4']['punishment'] = res['military-order.dfq-punishment4'];
        });
    });
    this.queryRule();
  }

  // 查詢
  queryRule() {
    this.rewardsSignService.queryRule('DFQ').then(data => {
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
        this.version = 'V01';
      }
      this.showUpload = true; // 初始化加載頁面
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

  // 刷新頁面，顯示上傳的文件
  upload(file) {
    this.showUpload = false;
    if (!file['name']) {
      this.version = file[0][file[0].length - 1];
      for (let i = 0; i < file.length; i++) {
        if (i === 3) {
          for (let j = 2; j < 6; j++) {
            this.DfqSignContent['week' + (j - 1)]['Goal'] = file[3][j];
          }
        }
        if (i === 4) {
          for (let j = 2; j < 6; j++) {
            this.DfqSignContent['week' + (j - 1)]['Actual'] = file[4][j];
          }
        }
        if (i === 5) {
          for (let j = 2; j < 6; j++) {
            this.DfqSignContent['week' + (j - 1)]['rewards'] = file[5][j];
          }
        }
        if (i === 6) {
          for (let j = 2; j < 6; j++) {
            this.DfqSignContent['week' + (j - 1)]['punishment'] = file[6][j];
          }
        }
      }
      this.rule = this.DfqSignContent; // 把選擇的文件處理后上傳到頁面
      this.showUpload = true;
    }
    this.showLoading = false;
  }

  // 送簽
  async sendSign() {
    const datas = await this.rewardsSignService.dfqSendMember();
    if (datas.length === 0 || datas.length === 1) {
      this.message.create('error', 'Please maintain the signer info！');
    }
    if (datas.length === 2) {
      this.sendMode.workflowMappingID = datas[0]['workflowFormMappingId'];
      this.sendMode.member1 = datas[0]['picId'];
      this.sendMode.member2 = datas[1]['picId'];
      await this.rewardsSignService
        .getSignMemberSelect('', datas[0]['picId'])
        .then(res => {
          if (!!res) {
            res.forEach(rs => {
              this.sendMode.memberOption1.push(rs);
            });
            this.label1 = this.sendMode.memberOption1[0]['label'];
          }
        });
      await this.rewardsSignService
        .getSignMemberSelect('', datas[1]['picId'])
        .then(res => {
          if (!!res) {
            res.forEach(rs => {
              this.sendMode.memberOption2.push(rs);
            });
            this.label2 = this.sendMode.memberOption2[0]['label'];
          }
        });
      this.isSendSignVisible = true;
    }
  }

  sendButton() {
    const list = [];
    list.push({ empID: this.sendMode.member1, role: 'IT' });
    list.push({ empID: this.sendMode.member2, role: 'IT' });
    this.rewardsSignService
      .dfqSendSign(
        this.DfqSignContent,
        this.version,
        this.sendMode.description,
        list,
        this.sendMode.workflowMappingID
      )
      .then(data => {
        this.cancelSendSign();
      });
  }

  // 取消送簽
  cancelSendSign() {
    this.isSendSignVisible = false;
    this.sendMode.description = '';
  }

  // 下載文件
  download() {
    const table = document.getElementById('downdata1');
    this.downExcelService.exportTableAsExcelFile(table, 'reward');
  }
}
