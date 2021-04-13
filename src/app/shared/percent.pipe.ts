import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percent'
})
export class PercentPipe implements PipeTransform {

  transform(value: any, precision?): any {
    if (precision) {
      if (precision === 'twoDecimal') {
         if (String(value * 100) === '100') {
          return (`${"'"}${String(value * 100)}${'.00'}`);
         } if (String(value * 100).split('.')[0].length === 1) {
             if (String(value * 100).substring(0, 4).length === 1) {
            return (`${"'"}${String(value * 100).substring(0, 4)}${'.00'}`);
           } else if (String(value * 100).substring(0, 4).length === 3) {
            return (`${"'"}${String(value * 100).substring(0, 4)}${'0'}`);
           } else {
            return (`${"'"}${String(value * 100).substring(0, 4)}`);
           }
         } if (String(value * 100).split('.')[0].length === 2) {
             if (String(value * 100).substring(0, 5).length === 2) {
            return (`${"'"}${String(value * 100).substring(0, 5)}${'.00'}`);
          } else if (String(value * 100).substring(0, 5).length === 4) {
            return (`${"'"}${String(value * 100).substring(0, 5)}${'0'}`);
          } else {
            return (`${"'"}${String(value * 100).substring(0, 5)}`);
           }
         }
      }

      if (String(value * 100).split('.').length === 1) {
        return (String(value * 100) + '.0000%');
      } else {
        if (String(value * 100).split('.')[1].length === 3) {
          return (String(value * 100) + '0%');
        } else if (String(value * 100).split('.')[1].length === 2) {
          return (String(value * 100) + '00%');
        } else if (String(value * 100).split('.')[1].length === 1) {
          return (String(value * 100) + '000%');
        } else {
          return (String(value * 100).split('.')[0] + '.' + String(value * 100).split('.')[1].substring(0, 4) + '%');
        }
      }
    } else {
      if (String(value * 100).split('.').length === 1) {
        return (String(value * 100) + '.00%');
      } else {
        if (String(value * 100).split('.')[1].length === 1) {
          return (String(value * 100) + '0%');
        } else {
          return (String(value * 100).split('.')[0] + '.' + String(value * 100).split('.')[1].substring(0, 2) + '%');
        }
      }
    }
    // return (Math.floor(value * 10000) / 100 + '%');
  }

}
