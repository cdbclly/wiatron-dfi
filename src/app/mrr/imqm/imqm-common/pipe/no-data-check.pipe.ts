import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDataCheck'
})
export class NoDataCheckPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // if (args === 'weChat') {
    //   if (value === 1) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    if (value) {
      // console.log(value);
      return value;
    } else {
      return args;
    }
  }

}
