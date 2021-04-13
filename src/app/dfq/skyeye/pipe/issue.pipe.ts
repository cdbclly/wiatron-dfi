import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'issue'
})
export class IssuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 'QMMO001') {
      return '測試工具版本';
    } else if (value === 'QMCPK002') {
      return '測試CPK';
    } else if (value === 'QMFAIL001') {
      return 'FPYR';
    } else if (value === 'QMRETRY001') {
      return '測試Retest Rate';
    } else if (value === 'QMTIME001') {
      return '測試時間';
    } else if (value === 'QMCPK001') {
      return '測試CPK';
    } else if (value === 'QMMO002') {
      return '測試工具版本';
    } else if (value === 'QMATE001') {
      return 'ATE Temperature';
    } else if (value === 'QMYR001') {
      return 'FA Y.R';
    } else if (value === 'QMLIBAR002') {
      return 'Light bar雙波峰';
    } else if (value === 'F232QMRAW001') {
      return 'Raw Data';
    } else if (value === 'QMRR001') {
      return 'FA Retest Rate';
    } else if (value === 'QMCPK003') {
      return 'FA CPK';
    } else if (value === 'QMLIBAR001') {
      return 'Light bar';
    }





    return null;
  }

}
