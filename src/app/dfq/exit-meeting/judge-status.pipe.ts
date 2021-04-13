import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'judgeStatus'
})
export class JudgeStatusPipe implements PipeTransform {

  transform(status: number): string {
    if (status === 1) {
      return 'Not Ready';
    } else if (status === 2) {
      return 'Ready with High risk';
    } else if (status === 3) {
      return 'Ready with Medium risk';
    } else if (status === 4 ) {
      return 'Ready with Low risk';
    } else if ( status === 5) {
      return 'Ready';
    } else {
      return 'Unknown';
    }
  }

}
