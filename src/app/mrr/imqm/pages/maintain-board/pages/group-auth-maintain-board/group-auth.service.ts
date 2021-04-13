import { Injectable } from '@angular/core';
import { GroupApi, GroupMappingRoleApi, FunctionRoleApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import { GroupAuthRoutingModule } from './group-auth-routing.module';

@Injectable({
  providedIn: 'root'
})
export class GroupAuthService {

  constructor(private groupService: GroupApi,
              private groupMappingRoleService: GroupMappingRoleApi,
              private funService: FunctionRoleApi) { }

  // 取得群組清單
  getGroup() {
    return this.groupService.find().pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 取得群組權限詳細內容
  getGroupDetail(id) {
    return this.groupMappingRoleService.find({where: {groupId: id}, include: 'functionRole'}).pipe(map((res) => {
      console.log(res);
      return res;
    }));
  }

  // 新增群組名稱
  addGroupName(data) {
    return this.groupService.create(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 新增群組內容
  addGroupContent(data) {
    return this.groupMappingRoleService.create(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 修改群組名稱
  editGroupName(data) {
    return this.groupService.upsert(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  // 修改群組內容
  editGroupContent(data) {
    return this.groupMappingRoleService.upsert(data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }

  getFunctions() {
    return this.funService.find().toPromise();
  }

  getGroupRolesMap() {
    return this.groupService.find({include: 'groupMappingRoles'});
  }
}
