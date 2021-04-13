import { Pipe, PipeTransform } from '@angular/core';
import { MemberApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'member'
})
export class MemberPipe implements PipeTransform {

  constructor(
    private memberApi: MemberApi
  ) {}

  transform(empID?: any, args?: any): any {
    if (!!empID) {
      if (!args) {
        return this.memberApi.findById(empID);
      } else if (args === 'mrrDocView') {
        return this.memberApi.findById(empID, {
          'fields': ['EmpID', 'Name', 'EName', 'Email']
        }).pipe(map(datas => {
          return {
            email: 'mailto:' + datas['Email'],
            show: datas['EName'] + '\t' + datas['Name'] + '\t' + datas['EmpID']
          };
        }));
      } else if (args === 'mrrUngoalDoc') {
        return this.memberApi.findById(empID, {
          'fields': ['EmpID', 'Name', 'EName', 'Email', 'Role']
        }).pipe(map(datas => {
          return {
            email: 'mailto:' + datas['Email'],
            show: datas['Role']
          };
        }));
      } else if (args === 'userId') {
        return this.memberApi.findById(empID, {
          'fields': ['EmpID', 'Name', 'EName', 'Email', 'Role']
        }).pipe(map(datas => {
          return {
            show: datas['EName']
          };
        }));
      }
    }
  }

}
