import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: Date) {
    const date2 = new Date(value);
    return date2.toLocaleString();
  }

}
