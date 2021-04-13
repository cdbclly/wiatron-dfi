import { Pipe, PipeTransform } from '@angular/core';
import { V_PlantProjectApi } from '@service/mrr-sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'plantModel'
})
export class PlantModelPipe implements PipeTransform {

  constructor(
    private vPlantProjectApi: V_PlantProjectApi
  ) {}

  transform(proName: any, args?: any): any {
    const query: any = {
      'where': {
        'and': [
          {'projectName': proName}
        ]
      },
      'fields': ['projectCode', 'bu', 'customer'],
      'limit': 1
    };
    if (args.length > 0) {
      query.where.and.push({'plant': args[0]});
      if (args.length === 2) {
        query.fields.push(args[1]);
      }
    }

    return this.vPlantProjectApi.find(query).pipe(map(datas => {
      return {
        bu: datas[0]['bu'],
        custom: datas[0]['customer'],
        proCode: datas[0]['projectCode'],
        dueDay: (!!args[1] ? (new Date(datas[0][args[1]])).toLocaleString() : '')
      };
    }));
  }

}
