import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { UserInfoApi, GroupMappingRoleApi } from '@service/imqm-sdk';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private message: NzMessageService,
              private userService: UserInfoApi,
              private groupMapService: GroupMappingRoleApi) {}

   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 獲取當前用戶的身份
    // debugger;
    console.log(route.params.id);
    const userId = localStorage.getItem('$DFI$userID');
    if (!localStorage.getItem('$IMQM$UserInfo')) {
      const res = await this.userService.find({where: {number: userId}}).toPromise();
      if (res.length > 0) {
        // if (!sessionStorage.getItem('$IMQM$UserRole')) {
          this.groupMapService.find({where: {groupId: res[0]['groupId']}, include: 'functionRole'}).subscribe(role => {
            sessionStorage.setItem('$IMQM$UserRole', JSON.stringify(role));
          });
        // }
        localStorage.setItem('$IMQM$UserInfo', JSON.stringify(res[0]));
        return true;
      } else {
        this.message.create('warning', '無權訪問');
        return false;
      }
    } else {
      // if (!sessionStorage.getItem('$IMQM$UserRole')) {
        this.groupMapService.find({where: {groupId: JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['groupId']}, include: 'functionRole'}).subscribe(role => {
          sessionStorage.setItem('$IMQM$UserRole', JSON.stringify(role));
        });
      // }
      return true;
    }
  }
}
