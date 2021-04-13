import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class StatusCheckPipe implements PipeTransform {

  transform(value: any, type: any): any {
    if (type === 'name') {
      if (value === 'Gray') {
        return 'spot-noproduct';
       } else if (value === 'Red') {
        return 'spot-abnormal';
      } else if (value === 'Yellow') {
        return 'spot-alert';
      } else if (value === 'Green') {
        return 'spot-normal';
      } else {
        return 'spot-noproduct';
      }
    } else {
       if (value === 'open') {
        return 'spot-abnormal';
      } else if (value === 'closed') {
        return 'spot-normal';
      } else {
        return 'spot-alert';
      }
    }
  }

}
