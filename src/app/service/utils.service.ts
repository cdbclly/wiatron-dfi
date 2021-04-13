import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorityApi, MemberApi } from './dfc_sdk/sdk';
import { GroupMappingRoleApi, UserInfoApi } from './imqm-sdk';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  configFile: string = '/assets/config.json?nocache=' + (new Date()).getTime();
  dfcSignConfig: string = '/assets/dfcSign.config.json?nocache=' + (new Date()).getTime();

  constructor(
    private http: HttpClient,
    private authorityService: AuthorityApi,
    private memberServer: MemberApi,
    private imqmUserService: UserInfoApi,
    private groupMapService: GroupMappingRoleApi,
    ) { }
  getConfig() {
    return this.http.get(this.configFile);
  }

  getDfcSignConfig() {
    return this.http.get(this.dfcSignConfig);
  }

  getAuthority() {
    return this.authorityService.GetAuthority(localStorage.getItem('$DFI$userID'))
      .toPromise().then(result => {
        if (result && Object.getOwnPropertyNames(result).length) {
          localStorage.setItem('$DFI$UserAuth', JSON.stringify(result));
          const job1 = this.memberServer.findOne({ 'where': { 'EmpID': localStorage.getItem('$DFI$userID') } }).toPromise().then(memberRS => {
            localStorage.setItem('DFC_Plant', memberRS['Plant']);
            localStorage.setItem('DFC_Site', memberRS['Site']);
            localStorage.setItem('$DFI$userName', memberRS['EName']);
            localStorage.setItem('$DFI$userRole', memberRS['Role']);
          });
        }
      });
    }

    getIMQMAuthority() {
      return this.imqmUserService.find({ where: { number: localStorage.getItem('$DFI$userID') } }).toPromise().then(user => {
        if (user && user.length > 0) {
          // 以后imqm的site和plant 的数据全部来自 operablePlant
          const sitePlantDic = this.getImqmSitePlant(user[0]['operablePlant'].split(','));
          localStorage.setItem('$IMQM$SitePlan', JSON.stringify(sitePlantDic));

          this.groupMapService.find({ where: { groupId: user[0]['groupId'] }, include: 'functionRole' }).toPromise().then(role => {
            const roleObj = {};
            role.forEach(item => {
              roleObj[item['functionRole']['id'].toString()] = item;
            });
            localStorage.setItem('$IMQM$UserInfo', JSON.stringify(user[0]));
            localStorage.setItem('$IMQM$UserRole', JSON.stringify(roleObj));
          });
        }
      });
    }


    getImqmSitePlant(data) {
      const plantArr = data;
      const tempArr = [];
      for (const iterator of plantArr) {
        tempArr.push(iterator.substring(0, 3));
      }
      const siteArr = this.uniqueEle(tempArr);
      const dic = {};
      for (const site of siteArr) {
        const temp = [];
        for (const plant of plantArr) {
          if (plant.indexOf(site) !== -1) {
            temp.push(plant);
          }
          dic[site] = temp;
        }
      }
      return dic;
    }

    uniqueEle(arr: Array<any>) {
      return arr.filter(function(item, index) {
        return arr.indexOf(item, 0) === index;
      });
    }
}
