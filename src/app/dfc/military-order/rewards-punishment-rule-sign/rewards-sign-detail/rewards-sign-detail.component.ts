import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DfcKpiRewardsContent } from 'app/dfc/report/dfc-kpi/dfc-kpi';
import { RewardsSignService } from '../rewards-sign.service';
import { DfcSignHitoryParam } from 'app/shared/dfc-common';
@Component({
  selector: 'app-rewards-sign-detail',
  templateUrl: './rewards-sign-detail.component.html',
  styleUrls: ['./rewards-sign-detail.component.scss']
})
export class RewardsSignDetailComponent implements OnInit {
  @ViewChild('DFCRewardSignDetail') dfcRewardSign: ElementRef;
  applicationData = {
    deptCode: '',
    deptName: '',
    applicant: '',
    applyDate: ''
  };
  rule = DfcKpiRewardsContent;
  version;
  data: {
    signID: any,
    formNo: any,
    signData: any
  };
  dfcSignHitoryParam = new DfcSignHitoryParam();
  // 表格中的數據
  tableHeight;
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['RewardSign']; // 页面上的用户权限
  show = false;
  constructor(
    private rewardsSignService: RewardsSignService
  ) { }

  async ngOnInit() {
    await this.queryRule();
    this.tableHeight = (this.dfcRewardSign.nativeElement.offsetHeight - 185) + 'px';
    this.dfcSignHitoryParam.btnAddSignFlag = true;
    this.dfcSignHitoryParam.btnBeforeAddSignFlag = true;
  }

  // 查詢
  async queryRule(): Promise<any> {
    const data = await this.rewardsSignService.queryRule('DFC');
    if (JSON.stringify(data['recently']) !== '{}') {
      this.rule = data['recently']['content'];
      this.version = data['recently']['version'];
      this.data = {
        signID: data['recently']['signID'],
        formNo: data['recently']['id'],
        signData: data['recently']
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

  // 點擊簽核后的會傳值
  approveClick(data) {
    if (data['msg'] === 'success') {
      this.queryRule();
    }
  }
}
