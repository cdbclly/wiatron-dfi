import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flowStatus'
})
export class FlowStatusPipe implements PipeTransform {
  transform(status: number): string {
    if (status == 1) {
      return '簽核通過';
    } else if (status == 2) {
      return '簽核未通過';
    } else if (status == 0) {
      return '簽核中';
    } else if (status == null || status === undefined) {
      return '未送簽';
    } else {
      return '審核未通過';
    }
  }
}
