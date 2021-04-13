import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupAuthService } from './group-auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';

@Component({
  selector: 'app-group-auth',
  templateUrl: './group-auth.component.html',
  styleUrls: ['./group-auth.component.scss']
})
export class GroupAuthComponent implements OnInit, OnDestroy {
  // 下拉選單參數
  curGroupId;
  curGroupName;
  groupList = [];

  // 群組權限詳細內容
  dataSet;

  // 新增群組相關參數
  newGroupId;
  newGroupName;
  newGroup = [];
  isAddDataVisible = false;
  isSelectAllNew = false;

  // 修改群組相關參數
  editGroupName;
  editGroup = [];
  isEditDataVisible = false;
  isSelectAllEdit = false;

  isAuthEdit = false; // 操作权限
  isAuthCreate = false;
  isAuthDel = false;
  isAllAuth = false;

  destroy$ = new Subject();
  lang;


  constructor(
    private service: GroupAuthService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService

    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.lang = lang.lang;
        if (lang.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
      });
    }

  ngOnInit() {
    this.lang = this.translate.currentLang ? this.translate.currentLang : this.translate.defaultLang;
    const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['6'];
    const allRoles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
    this.isAuthCreate = roles['create'];
    this.isAuthDel = roles['delete'];
    this.isAuthEdit = roles['edit'];
    this.isAllAuth = allRoles['read'];
    this.service.getGroupRolesMap().subscribe(res => {
      this.groupList = this.isAllAuth ? res : res.filter(item => item['groupMappingRoles'].every(role =>
        !(role['roleId'] === 26 && role['read'])));
      if (this.groupList.length > 0) {
        this.curGroupId = this.groupList[0]['id'];
        this.curGroupName = this.groupList[0]['name'];
      }
      if (this.curGroupId) {
        this.service.getGroupDetail(this.curGroupId).subscribe(data => {
          this.dataSet = data;
        });
      }
    });

    this.resetGroupInitData();
  }

  // 選擇下拉框的事件
  groupChange() {
    this.curGroupName = this.groupList.find(res => res['id'] === this.curGroupId)['name'];
    console.log(this.curGroupName);
    this.service.getGroupDetail(this.curGroupId).subscribe(data => {
      this.dataSet = data;
    });
  }

  // 點擊新增的事件
  operationAdd() {
    this.resetGroupInitData();
    this.isAddDataVisible = true;
  }

  // 點擊編輯的事件
  operationEdit() {
    this.editGroup = [];
    this.editGroupName = this.curGroupName;
    this.dataSet.forEach(element => {
      this.editGroup.push({
        'data':
        {
        groupId: element['groupId'],
        roleId: element['roleId'],
        read: element['read'],
        create: element['create'],
        delete: element['delete'],
        edit: element['edit'],
        functionRole: {
          id: element['functionRole']['id'],
          name: element['functionRole']['name']
        }
      },
      'showAllAuth': this.isAllAuth ? false :  element['roleId'] === 26 ? true : false
    }
    );
    });
    this.isEditDataVisible = true;
  }

  // 點擊Modal視窗的全選按鈕的事件
  selectAllNew() {
    this.isSelectAllNew = !this.isSelectAllNew;
    this.newGroup.forEach(element => {
      element['data']['read'] = this.isAllAuth ? this.isSelectAllNew : element['data']['roleId'] === 26 ? false : this.isSelectAllNew;
      element['data']['create'] = this.isAllAuth ? this.isSelectAllNew : element['data']['roleId'] === 26 ? false : this.isSelectAllNew;
      element['data']['delete'] = this.isAllAuth ? this.isSelectAllNew : element['data']['roleId'] === 26 ? false : this.isSelectAllNew;
      element['data']['edit'] = this.isAllAuth ? this.isSelectAllNew : element['data']['roleId'] === 26 ? false : this.isSelectAllNew;
    });
  }

  // 點擊Modal視窗的全選按鈕的事件
  selectAllEdit() {
    this.isSelectAllEdit = !this.isSelectAllEdit;

    this.editGroup.forEach(element => {
      element['data']['read'] = this.isAllAuth ? this.isSelectAllEdit : element['data']['roleId'] === 26 ? false : this.isSelectAllEdit;
      element['data']['create'] = this.isAllAuth ? this.isSelectAllEdit : element['data']['roleId'] === 26 ? false : this.isSelectAllEdit;
      element['data']['delete'] = this.isAllAuth ? this.isSelectAllEdit : element['data']['roleId'] === 26 ? false : this.isSelectAllEdit;
      element['data']['edit'] = this.isAllAuth ? this.isSelectAllEdit : element['data']['roleId'] === 26 ? false : this.isSelectAllEdit;
    });
  }

  // 點擊新增Modal儲存按鈕的事件
  handleAddSave() {
    let newGroupNameData;

    newGroupNameData = [
    {
      'id': 0,
      'name': this.newGroupName
    }];

    // 新增群組名稱
    this.service.addGroupName(newGroupNameData).subscribe(list => {
      this.newGroupId = list[0]['id'];
      this.service.getGroupRolesMap().subscribe(res => {
        this.groupList = this.isAllAuth ? res : res.filter(item => item['groupMappingRoles'].every(role =>
          !(role['roleId'] === 26 && role['read'])));
      });

      // 將新增的Group ID代入要新增的群組權限內容裡
      const addGroup = [];
      this.newGroup.forEach(element => {
        element['data']['groupId'] = this.newGroupId;
        addGroup.push(element['data']);
      });

      // 新增群組內容
      this.service.addGroupContent(addGroup).subscribe();

      this.resetGroupInitData();
    });

    this.isAddDataVisible = false;
    this.newGroupName = undefined;
  }

  // 點擊新增Modal取消按鈕的事件
  handleAddCancel() {
    this.isAddDataVisible = false;
  }

  // 點擊修改Modal儲存按鈕的事件
  handleEditSave() {
    let editGroupNameData;
    let tempData;

    editGroupNameData = {
      'id': this.curGroupId,
      'name': this.editGroupName
    };

    // 修改群組名稱
    this.service.editGroupName(editGroupNameData).subscribe(list => {
      this.service.getGroupRolesMap().subscribe(res => {
        this.groupList = this.isAllAuth ? res : res.filter(item => item['groupMappingRoles'].every(role =>
          !(role['roleId'] === 26 && role['read'])));
        this.curGroupName = this.groupList.find(group => group['id'] === this.curGroupId)['name'];
      });
    });

    // 修改群組權限內容
    this.editGroup.forEach(element => {
      this.service.editGroupContent(element['data']).subscribe(res => {
        // 更新修改後的資料至顯示TABLE
        tempData = this.dataSet.find(data => data['roleId'] === res['roleId']);
        tempData['read'] = res['read'];
        tempData['create'] = res['create'];
        tempData['delete'] = res['delete'];
        tempData['edit'] = res['edit'];
      });
    });

    this.isEditDataVisible = false;
  }

  // 點擊修改Modal取消按鈕的事件
  handleEditCancel() {
    this.isEditDataVisible = false;
  }

  // 設置要新增的群組的預設值
  async resetGroupInitData() {
    this.newGroup = [];
    const res = await this.service.getFunctions();
      if (res.length > 0) {
        res.forEach(element => {
          this.newGroup.push({
            'data' : {
              'groupId': null,
              'roleId': element['id'],
              'read': false,
              'create': false,
              'edit': false,
              'delete': false,
              'functionRole': {
               'id': element['id'],
               'name': element['name']
             }
            },
            'showAllAuth': this.isAllAuth ? false :  element['id'] === 26 ? true : false
          });
        });
      }
      console.log(this.newGroup);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
