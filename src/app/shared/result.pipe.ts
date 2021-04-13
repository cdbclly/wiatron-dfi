import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'result'
})
export class ResultPipe implements PipeTransform {

  transform(value: boolean): any {
    if (value) {
      return 'Y';
    } else {
      return 'N';
    }
  }

}
