import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'factortype'
})
export class FactortypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
