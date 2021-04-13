import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { NzMessageService, NzI18nService, en_US, zh_TW } from 'ng-zorro-antd';
import { ToolkitService } from '../../../../imqm-common/service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit, OnDestroy {
  // 當前使用者權限相關
  authority;

  // 使用者權限資料相關
  dataSet = [];
  dataSetBk = []; // 权限资料临时备份
  editCache;
  actionEnabled = true;

  // 搜尋框相關
  searchKey = '';

  // 新增Modal相關
  isAddDataVisible = false;
  saveData;
  groupList = [];

  isAuthEdit = false; // 操作权限
  isAuthCreate = false;
  isAuthDel = false;
  isAllAuth = false; // all 權限
  isHideCol = false; // 新增时是否隐藏site,plant

  siteGroup = [];
  factoryGroup = [];
  operablePlantGroup =  []; // 獲取登入者可操作廠別,若為空獲取plant列表作為可操作廠別
  destroy$ = new Subject();
  trans: object = {};

  toWeChat = true; // 是否开启接受企业微信的权限
  // 当前登录者的site, plant
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
  number = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['number'];

  constructor(
    private service: UserAuthService,
    private messageService: NzMessageService,
    private toolKits: ToolkitService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-mt-successDel', 'imq-mt-failDel', 'imq-mt-successModify', 'imq-mt-failModify', 'imq-mt-successAdd',
        'imq-mt-failAdd', 'imq-mt-nullTel', 'imq-mt-dataDuplicate', 'imq-mt-errorMail', 'imq-mt-nullOperablePlant']).subscribe(res => {
          this.trans['successDel'] = res['imq-mt-successDel'];
          this.trans['failDel'] = res['imq-mt-failDel'];
          this.trans['successModify'] = res['imq-mt-successModify'];
          this.trans['failModify'] = res['imq-mt-failModify'];
          this.trans['successAdd'] = res['imq-mt-successAdd'];
          this.trans['failAdd'] = res['imq-mt-failAdd'];
          this.trans['nullTel'] = res['imq-mt-nullTel'];
          this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
          this.trans['errorMail'] = res['imq-mt-errorMail'];
          this.trans['nullOperablePlant'] = res['imq-mt-nullOperablePlant'];
          if (lang.lang === 'en') {
            this.nzI18nService.setLocale(en_US);
          } else {
            this.nzI18nService.setLocale(zh_TW);
          }
          this.ngOnInit();
        });
    });
  }

  ngOnInit() {
    this.translate.get(['imq-mt-successDel', 'imq-mt-failDel', 'imq-mt-successModify', 'imq-mt-failModify', 'imq-mt-successAdd',
      'imq-mt-failAdd', 'imq-mt-nullTel', 'imq-mt-dataDuplicate', 'imq-mt-errorMail', 'imq-mt-nullOperablePlant']).subscribe(res => {
        this.trans['successDel'] = res['imq-mt-successDel'];
        this.trans['failDel'] = res['imq-mt-failDel'];
        this.trans['successModify'] = res['imq-mt-successModify'];
        this.trans['failModify'] = res['imq-mt-failModify'];
        this.trans['successAdd'] = res['imq-mt-successAdd'];
        this.trans['failAdd'] = res['imq-mt-failAdd'];
        this.trans['nullTel'] = res['imq-mt-nullTel'];
        this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
        this.trans['errorMail'] = res['imq-mt-errorMail'];
        this.trans['nullOperablePlant'] = res['imq-mt-nullOperablePlant'];
        const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['6'];
        const allRoles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
        this.isAuthEdit = roles['edit'];
        this.isAuthCreate = roles['create'];
        this.isAuthDel = roles['delete'];
        this.isAllAuth = allRoles['read'];
        // this.authority = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
        // console.log(this.authority);
        // 獲取可操作廠別列表
        this.service.getCurrentUserInfo(this.site, this.plant, this.number).subscribe(userInfo => {
          this.operablePlantGroup = userInfo[0]['operablePlant'].split(',');
        });
        this.service.getUserInfo(this.site, this.plant).subscribe(userInfo => {
          this.dataSet = userInfo;

          this.dataSet.forEach(element => {
            this.service.getGroup(element.groupId).subscribe(group => {
              element['groupName'] = group[0]['name'];
            });
            element['operablePlant'] = element['operablePlant'].split(',');
          });

          if (this.dataSet) {
            this.updateEditCache();
          }
        });

        // this.service.getGroup().subscribe(res => {
        //   this.groupList = res;
        // });
        this.service.getGroupRolesMap().toPromise().then(res => {
          // 过滤掉非ALL权限的user看到的All群主
          this.groupList = this.isAllAuth ? res : res.filter(item => item['groupMappingRoles'].every(role =>
            !(role['roleId'] === 26 && role['read'])));
          console.log(this.groupList);
        });

        this.resetSaveData();
      });
  }

  // 進行搜尋
  query() {
    let searchCondition;

    searchCondition = {where: {or: [
          { number: { like: '%' + this.searchKey + '%'}},
          { site: { like: '%' + this.searchKey + '%'}},
          { plant: { like: '%' + this.searchKey + '%'}},
          { operablePlant: { like: '%' + this.searchKey + '%' } },
          { name: { like: '%' + this.searchKey + '%'}},
          { eMail: { like: '%' + this.searchKey + '%'}},
          { rank: { like: '%' + this.searchKey + '%'}},
          { groupId: { like: '%' + this.searchKey + '%'}}
      ]}};

    this.service.getUserInfoBySearch(searchCondition).subscribe(res => {
      this.dataSet = res;

      this.dataSet.forEach(element => {
        this.service.getGroup(element.groupId).subscribe(group => {
          element['groupName'] = group[0]['name'];
        });
        element['operablePlant'] = element['operablePlant'].split(',');
      });

      this.updateEditCache();
    });
  }

  // 點擊新增按鈕的事件
  operationAdd() {
    this.isAddDataVisible = true;
    this.service.getSelectDatas().subscribe(datas => {
      this.siteGroup = datas['site'];
      console.log(this.siteGroup);
    });
  }

  getOptions(type, data?) {
    if (type === 'group') {
      this.service.getGroupRoles(this.saveData.groupId).toPromise().then(
        res => {
          res.forEach(item => {
            this.isHideCol = item['roleId'] === 26 && item['read'] ? true : false;
            if (this.isHideCol) {
              return;
            }
          });
        }
      );
    }
    if (type === 'site') {
      console.log(this.saveData.site);
      this.saveData.plant = undefined;
      this.service.getSelectDatas(this.toolKits.assembleSelectObject(this.saveData.site)).subscribe(res => {
        this.factoryGroup = res['plant'];
      });
    }
    if (type === 'auth') {
      this.service.getGroup(this.editCache[data.number].data.groupId).subscribe(group => {
        this.editCache[data.number].data.groupName = group[0]['name'];
      });
    }
  }

  // 點擊Modal儲存按鈕的事件
  async handleAddSave() {
    console.log(this.saveData);
    this.saveData.weChat = this.saveData.weChat ? 1 : 0;
    // 校驗手機號格式
    if (this.saveData.tel) {
      this.saveData.tel = this.saveData.tel.includes('+86') ? this.saveData.tel.substring(3) : this.saveData.tel;
      // const validTel = /^(\+86)(1)\d{10}$/;
      // const validTel = /^1[3456789]\d{9}$/;
      // validTel.test(this.saveData.tel);
      // if (!validTel.test(this.saveData.tel)) {
      //   this.messageService.create('error', '手機號格式不正確');
      //   return;
      // } else {
      //   this.saveData.tel = '+86' + this.saveData.tel;
      // }
      this.saveData.tel = '+86' + this.saveData.tel;
    }
    // 郵箱校驗
    if (this.saveData.eMail) {
      const validMail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!validMail.test(this.saveData.eMail)) {
        this.messageService.create('error', this.trans['errorMail']);
        return;
      }
    }
    // 判斷可操作廠別是否為空
    let editOpPlant = new Array();
    editOpPlant = this.saveData.operablePlant;
    if (editOpPlant.length === 0) {
      this.messageService.create('error', this.trans['nullOperablePlant']);
      return;
    }
    // check double
    let queryInfo;
    if (this.saveData.tel) {
      queryInfo = {where: {or: [ { and: [
        { number: this.saveData.number },
        { site: this.saveData.site },
        { plant: this.saveData.plant }
      ]},
      { or: [
        {tel: this.saveData.tel}
      ]}]}};
    } else {
      queryInfo = {where: { and: [
        { number: this.saveData.number },
        { site: this.saveData.site },
        { plant: this.saveData.plant }
      ]}};
    }
    await this.service.getUserInfoBySearch(queryInfo).toPromise().then(checkInfo => {
      if (checkInfo.length > 0) {
        this.messageService.create('error', this.trans['dataDuplicate']);
        return;
      } else {
        this.service.addUser(this.saveData).subscribe(res => {
          // 更新dataSet
          if (res) {
            this.messageService.create('success', this.trans['successAdd']);
          }
          this.service.getUserInfo().subscribe(userInfo => {
            this.dataSet = userInfo;
            this.dataSet.forEach(element => {
              this.service.getGroup(element.groupId).subscribe(group => {
                element['groupName'] = group[0]['name'];
              });
              element['operablePlant'] = element['operablePlant'].split(',');
            });
            if (this.dataSet) {
              this.updateEditCache();
            }
          });
          this.resetSaveData();
        });
      }
    });
    this.isAddDataVisible = false;
  }

  // 點擊Modal取消按鈕的事件
  handleAddCancel() {
    this.isAddDataVisible = false;
  }

  // 重設要新增的資料為預設值
  resetSaveData() {
    this.saveData = {
      'number': '',
      'site': null,
      'plant': null,
      'operablePlant': null,
      'name': '',
      'tel': '',
      'chineseName': '',
      'eMail': '',
      'rank': '',
      'groupId': '',
      'department': '',
      'weChat': 0
    };
  }

  // 更新編輯按鈕的註冊資料
  updateEditCache() {
    this.editCache = {};
    this.dataSet.forEach(item => {
      if (!this.editCache[ item.number ]) {
        if (item.tel && item.tel.includes('+86')) {
          item.tel = item.tel.substring(3);
        }
        this.editCache[ item.number ] = {
          edit: false,
          data: item
        };
      }
    });
  }

  // 按下編輯事件
  startEdit(key: string) {
    console.log(key);
    this.editCache[ key ].edit = true;
    this.actionEnabled = false;
    this.dataSetBk = JSON.parse(JSON.stringify(this.dataSet));
    const editData = this.dataSet.filter(item => item.number === key);
    this.editCache[ key ].data = editData[0];
  }

  // 按下編輯儲存事件
  async saveEdit(key: string) {
    const index = this.dataSet.findIndex(item => item.number === key);
    // 保存至DB
    console.log(this.editCache[ key ].data);
    let editOpPlant = new Array();
    editOpPlant = this.editCache[key].data.operablePlant;
    // 校驗手機號格式
    if (this.editCache[ key ].data.tel) {
      const validTel = /^1[3456789]\d{9}$/;
      // // validTel.test(this.editCache[ key ].data.tel);
      // if (!validTel.test(this.editCache[ key ].data.tel)) {
      //   this.messageService.create('error', '手機號格式不正確');
      //   this.editCache[ key ].edit = true;
      //   return;
      // } else {
      //   this.editCache[ key ].data.tel = '+86' + this.editCache[ key ].data.tel;
      // }
      this.editCache[ key ].data.tel = '+86' + this.editCache[ key ].data.tel;
    } else if (!this.editCache[key].edit && this.dataSet[index]['weChat'] ) {
      this.editCache[ key ].data.weChat = 0;
      this.dataSet[index]['weChat'] = 0;
      this.messageService.create('error', this.trans['nullTel']);
      this.editCache[ key ].edit = true;
      return;
    } else if (this.editCache[key].edit && editOpPlant.length === 0) {
      this.messageService.create('error', this.trans['nullOperablePlant']);
      return;
    } else if (this.editCache[key].edit && this.dataSet[index]['weChat']) {
      this.editCache[ key ].data.weChat = 0;
      this.dataSet[index]['weChat'] = 0;
    }
    this.editCache[ key ].edit = false;
    await this.service.updateUser(this.editCache[ key ].data).toPromise().then(res => {
      if (res) {
        this.dataSet[ index ] = res;
        this.messageService.create('success', this.trans['successModify']);
        console.log(this.editCache[ key ]);
      } else {
        this.messageService.create('error', this.trans['failModify']);
      }
    });
    this.actionEnabled = true;
    await this.query();
    await this.service.getCurrentUserInfo(this.site, this.plant, this.number).subscribe(userInfo => {
      this.operablePlantGroup = userInfo[0]['operablePlant'].split(',');
    });
  }

  trackByIndex(index, item) {
    return index;
  }

  // 按下編輯取消事件
  cancelEdit(key: string) {
    if (this.dataSetBk.length > 0) {
      this.dataSet = this.dataSetBk;
    }
    this.editCache[ key ].edit = false;
    this.actionEnabled = true;
  }

  // 按下確認刪除事件
  deleteRow(key: string) {
    let result;
    this.editCache[ key ].edit = false;

    // 保存至DB
    console.log(this.editCache[ key ].data.number);
    result = this.service.deleteUser(this.editCache[ key ].data.number);

    if (result) {
      this.dataSet = this.dataSet.filter(item => item.number !== key);
      this.messageService.create('success', this.trans['successDel']);
    } else {
      this.messageService.create('error', this.trans['failDel']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
