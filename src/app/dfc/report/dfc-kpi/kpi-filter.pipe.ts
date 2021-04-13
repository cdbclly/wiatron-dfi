import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpiFilter'
})
export class KpiFilterPipe implements PipeTransform {

  transform(value: Array<any>, filter?: string): any {
    if (!filter || !value) {
      return value;
    }
    const filterStr =  filter;
    return value.filter( y => y.status === filterStr);
  }

}
