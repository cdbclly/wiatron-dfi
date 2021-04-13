import { Pipe, PipeTransform } from '@angular/core';
import { WorkflowFormApi } from '@service/dfi-sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'workflowForm'
})
export class WorkflowFormPipe implements PipeTransform {

  constructor(
    private workflowFormApi: WorkflowFormApi
  ) {}

  transform(value: any, args?: any): any {

    return this.workflowFormApi.findById(value).pipe(map(data => {
      // console.log(data);
      return {
        id: !!data['id'] ? data['id'] : '',
        name: !!data['name'] ? data['name'] : '',
        routingPath: !!data['routingPath'] ? data['routingPath'] : '',
        description: !!data['description'] ? data['description'] : ''
      };
    }));
    // return null;
  }

}
