import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mrrDocDelayedDay'
})
export class MrrDocDelayedDayPipe implements PipeTransform {

  transform(value: number): any {
    if (value > 0) {
      return value;
    } else {
      return '未逾期';
    }
  }

}
