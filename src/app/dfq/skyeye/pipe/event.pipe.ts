import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'event'
})
export class EventPipe implements PipeTransform {

  transform(value: any, type: any): any {
    if (type === 'toEvent') {
      if (value === 'rf cpk') {
        return 'QMCPK001';
      }
      if (value === 'fpyr') {
        return 'QMFAIL001';
      }
      if (value === 'retry rate') {
        return 'QMRETRY001';
      }
      if (value === 'test time') {
        return 'QMTIME001';
      }
      if (value === 'ATE Temperature') {
        return 'QMATE001';
      }
    } else {
      if (value === 'QMCPK001') {
        return 'rf cpk';
      }
      if (value === 'QMFAIL001') {
        return 'fpyr';
      }
      if (value === 'QMRETRY001') {
        return 'retry rate';
      }
      if (value === 'QMTIME001') {
        return 'test time';
      }
      if (value === 'QMATE001') {
        return 'ATE Temperature';
      }
    }
  }

}
