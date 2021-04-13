import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mrrDocBomFilter'
})
export class MrrDocBomFilterPipe implements PipeTransform {

  transform(values: any[], filterValue?: string): any {
    if (!filterValue) {
      return values;
    }

    const reg = new RegExp(filterValue, 'i');
    return values.filter(item => {
      if (item.PARTNUMBER) {
        return reg.test(item.PARTNUMBER);
      }
      if (item.CPN) {
        return reg.test(item.CPN);
      }
    })
  }

}
