import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formsNoCate'
})
export class FormsNoCatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 'abnormal') {
      return 'imq-pop-table-overSpec';
    } else if (value === 'earlyWarn') {
      return 'imq-pop-table-preWarning';
    } else if (value === 'traceBack') {
      return 'imq-pop-table-traceBack';
    } else if (value === 'fakeData') {
      return 'imq-menu-falseData';
    } else {
      return value;
    }
  }

}
