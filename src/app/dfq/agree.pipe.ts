import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agree'
})
export class AgreePipe implements PipeTransform {

  transform(isAgree: number|boolean, role?: string): string {
    let agree = 'Waive';
    let notAgree = 'Not Waive';
    let result: string;

    if (role === 'CFE') {
      agree = 'Agree';
      notAgree = 'Disagree';
    }

    if (isAgree === 0 || isAgree === false) {
      result = notAgree;
    } else if (isAgree === 1 || isAgree === true) {
      result = agree;
    } else {
      return '';
    }

    return result;
  }

}
