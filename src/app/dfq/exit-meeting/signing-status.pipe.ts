import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signingStatus'
})
export class SigningStatusPipe implements PipeTransform {

  transform(status: any, args?: any): any {
    switch (status) {
      case 2: return 'Open';
      case 3: return 'Ongoing';
      case 4: return 'Rejected';
      case 5: return 'Approved';
    }
  }
}
