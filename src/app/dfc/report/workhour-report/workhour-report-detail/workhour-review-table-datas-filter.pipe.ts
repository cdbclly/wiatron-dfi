import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'workhourReviewTableDatasFilter'
})
export class WorkhourReviewTableDatasFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (args.type) {
      case 'actual': {
        if (!args.change) {
          return value;
        } else {
          return this.getRes(value, args.change, 'stageData', ['FactorDetailActural']);
        }
      }
      case 'rfq': {
        if (!args.change) {
          return value;
        } else {
          return this.getRes(value, args.change, 'rfqData', ['FactorDetailActural']);
        }
      }
      case 'target': {
        if (!args.change) {
          return value;
        } else {
          return this.getRes(value, args.change, 'rfqData', ['TargetCount', 'TargetFactorDetail', 'FactorDetailActural'], true);
        }
      }
      case 'stage': {
        if (!args.change) {
          return value;
        } else {
          return this.getRes(value, args.change, 'stageData', ['TargetFactorDetail']);
        }
      }
      default: {
        return value;
      }
    }
  }

  getRes(value, change, stageData, factorDetail, rfqTargetFlag?) {
    const dataSet = JSON.parse(JSON.stringify(value));
    for (const key in dataSet) {
      if (dataSet.hasOwnProperty(key)) {
        const data = dataSet[key];
        if (rfqTargetFlag) {
          data[stageData] = data[stageData].filter(d => (!!d[factorDetail[0]] ?
            (d[factorDetail[1]].toLowerCase().includes(change.toLowerCase())) :
            (!d[factorDetail[2]] ? false : d[factorDetail[2]].toLowerCase().includes(change.toLowerCase()))));
        } else {
          data[stageData] = data[stageData].filter(d => !d[factorDetail[0]] ? false : d[factorDetail[0]].toLowerCase().includes(change.toLowerCase()));
        }
        if (data[stageData].length === 0) {
          delete dataSet[key];
        }
      }
    }
    return dataSet;
  }
}
