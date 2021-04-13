import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'judgeResult'
})
export class JudgeResultPipe implements PipeTransform {

  transform(result: boolean): string {
    if (result) {
      return 'Pass';
    } else {
      return 'Fail';
    }
  }

}
