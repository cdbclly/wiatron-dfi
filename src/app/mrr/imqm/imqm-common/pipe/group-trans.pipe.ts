import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupTrans'
})
export class GroupTransPipe implements PipeTransform {

  transform(value: string, lang: any): any {
    let curText;
    if (lang === 'en') {
      switch (value) {
        case '廠商實時看板': {
          curText = 'Supplier Real-Time Dashboard';
          break;
        }
        case '機種實時看板': {
          curText = 'Model Real-Time Dashboard';
          break;
        }
        case '使用者權限維護': {
          curText = 'User Authority Maintenance';
          break;
        }
        case '群組權限維護': {
          curText = 'Group Authority Maintenance';
          break;
        }
        case '參數維護': {
          curText = 'System Parameter Maintenance';
          break;
        }
        case '推送Mail地址維護': {
          curText = 'Mail Address Maintenance';
          break;
        }
        case '良率': {
          curText = 'Yield Rate';
          break;
        }
        case '預警': {
          curText = 'Prewarning';
          break;
        }
        case '追溯': {
          curText = 'Tracking';
          break;
        }
        case '異常': {
          curText = 'Over Spec';
          break;
        }
        case 'KPI管理看板': {
          curText = 'KPI Management Dashboard';
          break;
        }
        case '結案率自動追蹤': {
          curText = 'Auto Tracking Of Case Close Rate';
          break;
        }
        case '預警+Over Spec Review': {
          curText = 'Prewarning + Over Spec Review';
          break;
        }
        case '自動追蹤Review': {
          curText = 'Auto Tracking Review';
          break;
        }
        case '操作指南維護': {
          curText = 'Operational Manual Maintenance';
          break;
        }
        default: {
          curText = value;
          break;
        }
      }
      return curText;
    } else {
      return value;
    }

    // if (lang === 'zh') {

    // }
  }

}
