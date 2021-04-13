import { RewardsSignService } from './../rewards-sign.service';
import { DfcSignHitoryParam } from 'app/shared/dfc-common';
import { DfqKpiRewardsContent } from './../../../report/dfc-kpi/dfc-kpi';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dfq-rewards-punishment-sign',
  templateUrl: './dfq-rewards-punishment-sign.component.html',
  styleUrls: ['./dfq-rewards-punishment-sign.component.scss']
})
export class DfqRewardsPunishmentSignComponent implements OnInit {
  // 送簽人的信息
  applicationData = {
    deptCode: '',
    deptName: '',
    applicant: '',
    applyDate: ''
  };
  rule = DfqKpiRewardsContent;
  version;
  show = false;
  data: {
    signID: any,
    formNo: any
  };
  // 簽核人的記錄
  dfcSignHitoryParam = new DfcSignHitoryParam();
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['RewardSign']; // 页面上的用户权限

  constructor(private rewardsSignService: RewardsSignService) { }

  async ngOnInit() {
    await this.queryRule();
    this.dfcSignHitoryParam.btnAddSignFlag = true;
    this.dfcSignHitoryParam.btnBeforeAddSignFlag = true;
  }

  // 查詢
  async queryRule(): Promise<any> {
    const data = await this.rewardsSignService.queryRule('DFQ');
    if (JSON.stringify(data['recently']) !== '{}') {
      this.rule = data['recently']['content'];
      this.version = data['recently']['version'];
      this.data = {
        signID: data['recently']['signID'],
        formNo: data['recently']['id']
      };
      this.rewardsSignService.querySender(data['recently']['sender']).then(res => {
        this.applicationData = {
          deptCode: res['Dept'],
          deptName: res['Role'],
          applicant: res['EName'],
          applyDate: !data['recently']['date'] ? '' : (new Date(data['recently']['date']).toLocaleDateString())
        };
      });
      this.show = true; // 數據加載完之後再顯示表格
    } else {
      this.show = false;
    }
  }

  // 簽核后回傳的值
  async approveClick(data) {
    // 當前簽核人的信息
    const currentData = await this.rewardsSignService.queryCurrent(this.data.signID, localStorage.getItem('$DFI$userID')).toPromise();
    if (currentData.length > 0) {
      if (currentData[0]['isAgree'] === true) {
        await this.rewardsSignService.dfqSendMail(this.data.signID);
      } else if (currentData[0]['isAgree'] === false) {
        await this.rewardsSignService.SendFail(this.data.signID);
      }
    }
  }
}
