import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelWorkHourTableDatasFilter'
})
export class ModelWorkHourTableDatasFilterPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    switch (args.type) {
      case 'factorDetail': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => d.factorDetail.toLowerCase().includes(args.change.toLowerCase()));
        }
      }
      default: {
        return value;
      }
    }
  }
}
