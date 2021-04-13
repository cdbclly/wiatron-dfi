import { Injectable } from '@angular/core';
import { UserInfoApi, GroupApi, GroupMappingRoleApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
    private userInfoService: UserInfoApi,
    private groupService: GroupApi,
    private selectService: SelectMenuApi,
    private groupRoleService: GroupMappingRoleApi
    ) {}

  // 取得使用者名單詳細內容
  getUserInfo(site?, plant?) {
    return this.userInfoService.find({where: {and: [{site: site}, {plant: plant}]}}).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }
  // 取得當前登入者詳細內容
  getCurrentUserInfo(site?, plant?, number?) {
    return this.userInfoService.find({where: {and: [{site: site}, {plant: plant}, {number: number}]}}).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  getUserInfoBySearch(conditions) {
    return this.userInfoService.find(conditions).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 獲取site 下拉框資料
  getSelectDatas(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 取得群組清單
  getGroup(id?) {
    if (id) {
      return this.groupService.find({where: {id: id}}).pipe(map(res => {
        console.log(res);
        return res;
      }));
    } else {
      return this.groupService.find().pipe(map(res => {
        console.log(res);
        return res;
      }));
    }
  }

  // 新增使用者
  addUser(data) {
    return this.userInfoService.addUserInfo(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 修改使用者資料
  updateUser(data) {
    return this.userInfoService.addUserInfo(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 刪除使用者資料
  deleteUser(id) {
    return this.userInfoService.deleteById(id).subscribe(res => {
      console.log(res);
    });
  }

  getGroupRoles(id) {
    return this.groupRoleService.find({where: {groupId : id}});
  }

  getGroupRolesMap() {
    return this.groupService.find({include: 'groupMappingRoles'});
  }
}
