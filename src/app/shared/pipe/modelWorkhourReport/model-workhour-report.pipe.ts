import { Pipe, PipeTransform } from '@angular/core';
import { BasicModelApi, GroupModelApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'modelWorkhourReport'
})
export class ModelWorkhourReportPipe implements PipeTransform {

  constructor(
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi
  ) {}

  transform(modelId: any, args?: any): any {
    if (!!args) {
      if (args.type === 1) {
        return this.basicModelApi.GetOpTimeReport(modelId, args.stage, true).pipe(map(res => {
          let workhourActual = 0;
          let workhourTarget = 0;
          if (!!res['result'] && res['result']['operationTime']) {
            for (const key in res[1]['result']['operationTime']) {
              if (res[1]['result']['operationTime'].hasOwnProperty(key) && !key.endsWith('M')) {
                const operationTime = res[1]['result']['operationTime'][key];
                workhourActual += operationTime['costTime'];
                workhourTarget += operationTime['targetCostTime'];
              }
            }
          }
          return {
            workhourActual: workhourActual,
            workhourTarget: workhourTarget
          };
        }));
      } else {
        return this.groupModelApi.GetOpTimeReport(modelId, args.stage).pipe(map(res => {
          let workhourActual = 0;
          let workhourTarget = 0;
          if (!!res['result'] && res['result']['operationTime']) {
            for (const key in res[1]['result']['operationTime']) {
              if (res[1]['result']['operationTime'].hasOwnProperty(key) && !key.endsWith('M')) {
                const operationTime = res[1]['result']['operationTime'][key];
                workhourActual += operationTime['costTime'];
                workhourTarget += operationTime['targetCostTime'];
              }
            }
          }
          return {
            workhourActual: workhourActual,
            workhourTarget: workhourTarget
          };
        }));
      }
    }
  }
}
