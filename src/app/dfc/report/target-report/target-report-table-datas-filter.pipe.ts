import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'targetReportTableDatasFilter'
})
export class TargetReportTableDatasFilterPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    switch (args.type) {
      case 'factorDetailActual': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => d.FactorDetailActural.toLowerCase().includes(args.change.toLowerCase()));
        }
      }
      case 'factorDetailTarget': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => (!d.TargetFactorDetail ? false : d.TargetFactorDetail.toLowerCase().includes(args.change.toLowerCase())));
        }
      }
      case 'factorDetailBest': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => d.BestFactorDetail.toLowerCase().includes(args.change.toLowerCase()));
        }
      }
      default: {
        return value;
      }
    }
  }
}
