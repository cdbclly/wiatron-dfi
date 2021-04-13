import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riskLevel'
})
export class RiskLevelPipe implements PipeTransform {

  transform(value: number) {
    if (value >= 4 && value <= 11) {
      return 'No risk';
    } else if (value >= 12 && value <= 15) {
      return 'Middle risk';
    } else if (value >= 16 && value <= 20) {
      return 'High risk';
    }
  }

}
