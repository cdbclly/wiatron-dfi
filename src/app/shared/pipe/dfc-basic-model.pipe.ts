import { Pipe, PipeTransform } from '@angular/core';
import { BasicModelApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'dfcBasicModel'
})
export class DfcBasicModelPipe implements PipeTransform {

  constructor(
    private basicModelApi: BasicModelApi
  ) {}


  transform(value: any): any {
    if (!!value) {
      return this.basicModelApi.findById(value).pipe(map(datas => {
        return datas;
      }));
    } else {
      return '';
    }
  }

}
