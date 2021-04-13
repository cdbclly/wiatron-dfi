import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'judgeBooleanResult'
})
export class JudgeBooleanResultPipe implements PipeTransform {

  transform(status: number, plantId?: string): boolean {
    switch (status) {
      case 1:
      case 2: return false;
      case 3: if (plantId === '5') {
                return true;
              } else {
                return false;
              }
      case 4:
      case 5: return true;
    }
  }

}
