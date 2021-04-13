import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waive'
})
export class WaivePipe implements PipeTransform {

  transform(value: number): string {

    if (typeof value !== 'number') {
      return value;
    }

    if (value == 0) {
      return 'Not Waive';
    } else if (value == 1) {

      return 'Waive';
    } else {

      return '';
    }
  }

}
