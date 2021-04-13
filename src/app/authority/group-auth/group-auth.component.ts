import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupApi, OperationLogApi } from '@service/dfc_sdk/sdk';
import { AuthorityApi } from '@service/dfc_sdk/sdk';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-group-auth',
  templateUrl: './group-auth.component.html',
  styleUrls: ['./group-auth.component.scss']
})
export class GroupAuthComponent implements OnInit, OnDestroy {
  groupList = [];
  currentGroup;
  isDisabledButton = true;
  isAddDataVisible;
  modalTitle = 'Add User';
  saveGroupName;
  saveGroupAuth;
  saveGroupId;
  type = 'Create';
  allSelect = true;
  auth;
  groupAuth = {
    'UserMangement': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'DfiMember': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'ModelProfiles': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'MOHCondition': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'MOHAddition': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'StandardOperation': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'ModelOperation': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'TargetOperation': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'TimeReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'MOHReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'StandardOperationSign': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'TargetOperationSign': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'WorkhourGap': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'WorkhourQuery': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'WorkhourReview': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'KpiReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'TargetOperationReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'SummaryReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'ImproveReport': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'MilitaryOrderQuery': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'MilitaryOrderSign': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'RewardQuery': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'RewardSign': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    },
    'SkyeyeTestItemMaintain': {
      'access': false,
      'update': false,
      'delete': false,
      'insert': false
    }
  };
  // i18n
  destroy$ = new Subject();
  dataSet = [
    {
      pageGroup: '權限維護',
      fiels: 'UserMangement'
    },
    {
      pageGroup: 'DFi Core Team',
      fiels: 'DfiMember'
    },
    {
      pageGroup: '新機種信息維護',
      fiels: 'ModelProfiles'
    },
    {
      pageGroup: 'MOH參數資料維護',
      fiels: 'MOHCondition'
    },
    {
      pageGroup: 'MOH機種差异項維護',
      fiels: 'MOHAddition'
    },
    {
      pageGroup: '工時標準資料維護',
      fiels: 'StandardOperation'
    },
    {
      pageGroup: '機種工時資料維護',
      fiels: 'ModelOperation'
    },
    {
      pageGroup: '目標工時生成',
      fiels: 'TargetOperation'
    },
    {
      pageGroup: '機種工時Report',
      fiels: 'TimeReport'
    },
    {
      pageGroup: '機種MOH Report',
      fiels: 'MOHReport'
    },
    {
      pageGroup: '工時標準資料簽核',
      fiels: 'StandardOperationSign'
    },
    {
      pageGroup: '目標工時生成簽核',
      fiels: 'TargetOperationSign'
    },
    {
      pageGroup: '工時差異對比',
      fiels: 'WorkhourGap'
    },
    {
      pageGroup: '工時查詢',
      fiels: 'WorkhourQuery'
    },
    {
      pageGroup: '工時改善檢討',
      fiels: 'WorkhourReview'
    },
    {
      pageGroup: 'KPI Report',
      fiels: 'KpiReport'
    },
    {
      pageGroup: '目標工時 Report',
      fiels: 'TargetOperationReport'
    },
    {
      pageGroup: 'Summary Report',
      fiels: 'SummaryReport'
    },
    {
      pageGroup: '改善成效 Report',
      fiels: 'ImproveReport'
    },
    {
      pageGroup: '軍令狀查詢',
      fiels: 'MilitaryOrderQuery'
    },
    {
      pageGroup: '軍令狀簽核',
      fiels: 'MilitaryOrderSign'
    },
    {
      pageGroup: '獎懲規則查詢',
      fiels: 'RewardQuery'
    },
    {
      pageGroup: '獎懲規則簽核',
      fiels: 'RewardSign'
    },
    {
      pageGroup: 'Skyeye測試細項維護',
      fiels: 'SkyeyeTestItemMaintain'
    }
  ];
  constructor(
    private groupService: GroupApi,
    private authorityService: AuthorityApi,
    private operationLogServer: OperationLogApi,
    private translate: TranslateService
  ) { }
  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dashboard.authority-maintain', 'base-data.new-model-information-maintenance',
      'authority-maintain.MOH-parameter-data-maintenance', 'authority-maintain.MOH-model-differences-maintenance',
      'authority-maintain.working-hours-standard-data-maintenance', 'authority-maintain.model-time-data-maintenance',
      'authority-maintain.target-time-generation', 'authority-maintain.model-working-hours-report',
      'authority-maintain.model-MOH-report', 'authority-maintain.approval-working-hours-standard-data',
      'authority-maintain.target-work-time-generation-sign-off', 'authority-maintain.comparison-of-working-hours',
      'authority-maintain.working-hours-query', 'authority-maintain.working-hours-improvement-review',
      'authority-maintain.target-working-hours-report', 'authority-maintain.improve-performance-report',
      'authority-maintain.military-order-query', 'authority-maintain.military-order-signing',
      'authority-maintain.reward-punishment-rules-query', 'authority-maintain.reward-punishment-rules-approval',
      'authority-maintain.skyeye-test-item-maintenance']).subscribe(res => {
        for (let index = 0; index < this.dataSet.length; index++) {
          this.dataSet[0].pageGroup = res['dashboard.authority-maintain'];
          this.dataSet[1].pageGroup = 'DFi Core Team';
          this.dataSet[2].pageGroup = res['base-data.new-model-information-maintenance'];
          this.dataSet[3].pageGroup = res['authority-maintain.MOH-parameter-data-maintenance'];
          this.dataSet[4].pageGroup = res['authority-maintain.MOH-model-differences-maintenance'];
          this.dataSet[5].pageGroup = res['authority-maintain.working-hours-standard-data-maintenance'];
          this.dataSet[6].pageGroup = res['authority-maintain.model-time-data-maintenance'];
          this.dataSet[7].pageGroup = res['authority-maintain.target-time-generation'];
          this.dataSet[8].pageGroup = res['authority-maintain.model-working-hours-report'];
          this.dataSet[9].pageGroup = res['authority-maintain.model-MOH-report'];
          this.dataSet[10].pageGroup = res['authority-maintain.approval-working-hours-standard-data'];
          this.dataSet[11].pageGroup = res['authority-maintain.target-work-time-generation-sign-off'];
          this.dataSet[12].pageGroup = res['authority-maintain.comparison-of-working-hours'];
          this.dataSet[13].pageGroup = res['authority-maintain.working-hours-query'];
          this.dataSet[14].pageGroup = res['authority-maintain.working-hours-improvement-review'];
          this.dataSet[15].pageGroup = 'KPI Report';
          this.dataSet[16].pageGroup = res['authority-maintain.target-working-hours-report'];
          this.dataSet[17].pageGroup = 'Summary Report';
          this.dataSet[18].pageGroup = res['authority-maintain.improve-performance-report'];
          this.dataSet[19].pageGroup = res['authority-maintain.military-order-query'];
          this.dataSet[20].pageGroup = res['authority-maintain.military-order-signing'];
          this.dataSet[21].pageGroup = res['authority-maintain.reward-punishment-rules-query'];
          this.dataSet[22].pageGroup = res['authority-maintain.reward-punishment-rules-approval'];
          this.dataSet[23].pageGroup = res['authority-maintain.skyeye-test-item-maintenance'];
        }
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dashboard.authority-maintain', 'base-data.new-model-information-maintenance',
        'authority-maintain.MOH-parameter-data-maintenance', 'authority-maintain.MOH-model-differences-maintenance',
        'authority-maintain.working-hours-standard-data-maintenance', 'authority-maintain.model-time-data-maintenance',
        'authority-maintain.target-time-generation', 'authority-maintain.model-working-hours-report',
        'authority-maintain.model-MOH-report', 'authority-maintain.approval-working-hours-standard-data',
        'authority-maintain.target-work-time-generation-sign-off', 'authority-maintain.comparison-of-working-hours',
        'authority-maintain.working-hours-query', 'authority-maintain.working-hours-improvement-review',
        'authority-maintain.target-working-hours-report', 'authority-maintain.improve-performance-report',
        'authority-maintain.military-order-query', 'authority-maintain.military-order-signing',
        'authority-maintain.reward-punishment-rules-query', 'authority-maintain.reward-punishment-rules-approval',
        'authority-maintain.skyeye-test-item-maintenance']).subscribe(res => {
          for (let index = 0; index < this.dataSet.length; index++) {
            this.dataSet[0].pageGroup = res['dashboard.authority-maintain'];
            this.dataSet[1].pageGroup = 'DFi Core Team';
            this.dataSet[2].pageGroup = res['base-data.new-model-information-maintenance'];
            this.dataSet[3].pageGroup = res['authority-maintain.MOH-parameter-data-maintenance'];
            this.dataSet[4].pageGroup = res['authority-maintain.MOH-model-differences-maintenance'];
            this.dataSet[5].pageGroup = res['authority-maintain.working-hours-standard-data-maintenance'];
            this.dataSet[6].pageGroup = res['authority-maintain.model-time-data-maintenance'];
            this.dataSet[7].pageGroup = res['authority-maintain.target-time-generation'];
            this.dataSet[8].pageGroup = res['authority-maintain.model-working-hours-report'];
            this.dataSet[9].pageGroup = res['authority-maintain.model-MOH-report'];
            this.dataSet[10].pageGroup = res['authority-maintain.approval-working-hours-standard-data'];
            this.dataSet[11].pageGroup = res['authority-maintain.target-work-time-generation-sign-off'];
            this.dataSet[12].pageGroup = res['authority-maintain.comparison-of-working-hours'];
            this.dataSet[13].pageGroup = res['authority-maintain.working-hours-query'];
            this.dataSet[14].pageGroup = res['authority-maintain.working-hours-improvement-review'];
            this.dataSet[15].pageGroup = 'KPI Report';
            this.dataSet[16].pageGroup = res['authority-maintain.target-working-hours-report'];
            this.dataSet[17].pageGroup = 'Summary Report';
            this.dataSet[18].pageGroup = res['authority-maintain.improve-performance-report'];
            this.dataSet[19].pageGroup = res['authority-maintain.military-order-query'];
            this.dataSet[20].pageGroup = res['authority-maintain.military-order-signing'];
            this.dataSet[21].pageGroup = res['authority-maintain.reward-punishment-rules-query'];
            this.dataSet[22].pageGroup = res['authority-maintain.reward-punishment-rules-approval'];
            this.dataSet[23].pageGroup = res['authority-maintain.skyeye-test-item-maintenance'];
          }
        });
    });
    this.auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    this.reset();
    this.getGroupList();
  }

  reset() {
    this.saveGroupAuth = {
      'UserMangement': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'DfiMember': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'ModelProfiles': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'MOHCondition': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'MOHAddition': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'StandardOperation': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'ModelOperation': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'TargetOperation': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'TimeReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'MOHReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'StandardOperationSign': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'TargetOperationSign': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'WorkhourGap': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'WorkhourQuery': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'WorkhourReview': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'KpiReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'TargetOperationReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'SummaryReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'ImproveReport': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'MilitaryOrderQuery': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'MilitaryOrderSign': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'RewardQuery': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'RewardSign': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      },
      'SkyeyeTestItemMaintain': {
        'access': false,
        'update': false,
        'delete': false,
        'insert': false
      }
    };
  }

  getGroupList() {
    this.groupService.find()
      .subscribe((res) => {
        console.log(res);
        this.groupList = res;
        if (!this.currentGroup) {
          this.currentGroup = res[0]['GroupID'];
        }
        if (!!this.currentGroup) {
          this.groupService.GetGroupAuthority(this.currentGroup)
            .subscribe((data) => {
              console.log(data);
              this.groupAuth = data;
            });
        }
      });
  }

  groupChange() {
    if (!!this.currentGroup) {
      this.groupService.GetGroupAuthority(this.currentGroup)
        .subscribe((data) => {
          this.groupAuth = data;
        });
    }
  }

  handleAddCancel() {
    this.isAddDataVisible = false;
  }

  handleAddSave() {
    const saveGroup = {
      Describtion: this.saveGroupName
    };
    if (this.type === 'Edit') {
      saveGroup['GroupID'] = this.saveGroupId;
    }
    this.groupService.upsert(saveGroup)
      .subscribe(data => {
        const authData = Object.assign(data, this.saveGroupAuth);
        this.groupService.SetGroupAuthority(data['GroupID'], authData)
          .subscribe(res => {
            this.currentGroup = data['GroupID'];
            this.getGroupList();
            this.isAddDataVisible = false;
            // 將操作信息存入緩存
            const logMsg = 'update\t' + localStorage.getItem('$DFI$userName') +
              '\n修改新增群組如下:\n' + JSON.stringify(res);
            this.operationLogServer.create({
              userID: localStorage.getItem('$DFI$userID'),
              APname: '頁面群組權限維護',
              data: logMsg
            }).subscribe(rs => console.log(rs), error => console.log(error));
          });
      });
  }

  operateAdd() {
    this.type = 'Create';
    this.modalTitle = 'Add Group';
    this.saveGroupName = '';
    this.reset();
    this.isAddDataVisible = true;
  }

  onEdit() {
    this.type = 'Edit';
    this.modalTitle = 'Edit Group';
    this.isAddDataVisible = true;
    const editItem = this.groupList.find(item => item.GroupID === this.currentGroup);
    this.saveGroupName = editItem['Describtion'];
    this.saveGroupId = editItem['GroupID'];
    this.saveGroupAuth = JSON.parse(JSON.stringify(this.groupAuth));
  }

  select() {
    let allChecked = true;
    let allUnChecked = true;
    for (const prop in this.saveGroupAuth) {
      if (this.saveGroupAuth.hasOwnProperty(prop)) {
        for (const sProp in this.saveGroupAuth[prop]) {
          if (this.saveGroupAuth[prop].hasOwnProperty(sProp)) {
            if (this.saveGroupAuth[prop][sProp] === false) {
              allChecked = false;
            }
            if (this.saveGroupAuth[prop][sProp] === true) {
              allUnChecked = false;
            }
          }
        }
      }
    }
    if (allChecked) {
      this.allSelect = false;
    }
    if (allUnChecked) {
      this.allSelect = true;
    }
    for (const prop in this.saveGroupAuth) {
      if (this.saveGroupAuth.hasOwnProperty(prop)) {
        for (const sProp in this.saveGroupAuth[prop]) {
          if (this.saveGroupAuth[prop].hasOwnProperty(sProp)) {
            this.saveGroupAuth[prop][sProp] = this.allSelect;
          }
        }
      }
    }
    this.allSelect = !this.allSelect;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
