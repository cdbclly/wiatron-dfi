import { Pipe, PipeTransform } from '@angular/core';
import { BasicModelApi, GroupModelApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'modelMohReport'
})
export class ModelMohReportPipe implements PipeTransform {

  constructor(
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi
  ) {}

  transform(modelId: any, args?: any): any {
    if (!!args) {
      if (args.type === 1) {
        return this.basicModelApi.GetMOHReport(modelId, args.stage).pipe(map(res => {
          const mohTarget = (!!res['result'] && !!res['result']['mohTarget']) ? res['result']['mohTarget'] : 0;
          return {
            mohTarget: mohTarget,
            mohGap: mohTarget - (!!args['quote'] ? args['quote'] : 0)
          };
        }));
      } else {
        return this.groupModelApi.GetMOHReport(modelId, args.stage).pipe(map(res => {
          const mohTarget = (!!res['result'] && !!res['result']['mohTarget']) ? res['result']['mohTarget'] : 0;
          return {
            mohTarget: mohTarget,
            mohGap: mohTarget - (!!args['quote'] ? args['quote'] : 0)
          };
        }));
      }
    }
  }

}
