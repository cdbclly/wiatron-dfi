import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operation'
})
export class OperationPipe implements PipeTransform {

  transform(value: any, args?: {key: string, list: any[], returnKey: string}): any {
    if (args) {
      const data = args.list.find(d => d[args.key] === value);
      if (data) {
        return data[args.returnKey];
      }
    }
    return value;
  }

}

@Pipe({
  name: 'issueStatus'
})
export class IssueStatusPipe implements PipeTransform {

  transform(value: any): any {
    switch (value) {
      case 0: {
        return 'No Data/Submit';
      }
      case 1: {
        return 'Open';
      }
      case 2: {
        return 'Reject';
      }
      case 3: {
        return 'Ongoing';
      }
      case 4: {
        return 'Tracking';
      }
      case 5: {
        return 'Close';
      }
      default: {
        return value;
      }
    }
  }

}
