import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(value: any, rangeStr: string, isDeleteHeader?: boolean): any {
    if (isDeleteHeader) {
      return 'black'
    } else {
      if (value === false) {
        return 'red'
      } else if (value === true) {
        return 'black'
      } else {
        const arr = rangeStr.split('    |    ');
        if (arr[0] > value || arr[1] < value) {
          return 'red'
        } else {
          return 'black'
        }
      }
    }
  }

}
