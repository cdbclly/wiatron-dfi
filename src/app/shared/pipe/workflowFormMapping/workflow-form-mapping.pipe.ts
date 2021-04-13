import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workflowFormMapping'
})
export class WorkflowFormMappingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
