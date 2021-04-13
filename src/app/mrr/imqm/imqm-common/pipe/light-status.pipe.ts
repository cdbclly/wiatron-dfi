import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lightStatus'
})
export class LightStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 'close') {
      return 'spot-close';
    }
    if (value === 'open') {
      return 'spot-open';
    }
    if (value === 'ongoing') {
      return 'spot-onGoing';
    }
  }

}
