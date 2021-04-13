import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {

  transform(status: any, args?: any): any {
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'Ongoing';
      case 2:
        return 'Close';
      case 3:
        return 'Verify';
    }
  }

}
