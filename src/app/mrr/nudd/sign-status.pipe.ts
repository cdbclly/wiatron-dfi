import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signStatus'
})
export class SignStatusPipe implements PipeTransform {

  transform(value: string) {
    if (value === '0') {
      return 'Open';
    } else if (value === '1') {
      return 'Ongoing';
    } else {
      return 'Closed';
    }
  }

}
