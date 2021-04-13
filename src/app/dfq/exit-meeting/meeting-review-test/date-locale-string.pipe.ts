import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateLocaleString'
})
export class DateLocaleStringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(value).toLocaleString();
  }

}
