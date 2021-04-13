import { FactorApi } from '@service/dfq_sdk/sdk';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'factor'
})
export class FactorPipe implements PipeTransform {

  constructor(
    public factorService: FactorApi
  ) { }

  transform(value: any): any {
    const factorName = this.factorService.findOne({
      where: {
        id: value
      }
    });
    return factorName;
  }

}
