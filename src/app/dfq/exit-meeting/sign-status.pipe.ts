import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signStatus'
})
export class SignStatusPipe implements PipeTransform {

  transform(value: number): string {
    if(value == 3)
      return 'Ongoing';
    else if(value == 4)
      return 'Rejected';
    else if(value == 5)
      return 'Completed';
    else
      return 'Unknown';
  }

}
