import { Pipe, PipeTransform } from '@angular/core';
import { WorkflowApi, Workflow } from '@service/dfi-sdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Part } from '@service/dfq_sdk/sdk/models';
@Pipe({
  name: 'workflowStatus'
})
export class WorkflowStatusPipe implements PipeTransform {
  // cache = [];
  constructor(private workflowService: WorkflowApi) {}

  transform(workflowId: number): Observable<String> {
    if (workflowId === null || workflowId === undefined) {
      return of('未送簽');
    } else {
      // const exist = this.cache.find((data: Part) => data.id === workflowId);
      // if (exist) {
      //   return of(test(exist.status));
      // } else {
        return this.workflowService.findById(workflowId).pipe(map((workflow: Workflow) => {
          // this.cache.push(workflow);
          // return test(workflow.status);
          if (workflow.status === '1') {
            return '簽核通過';
          } else if (workflow.status === '2') {
            return '簽核未通過';
          } else if (workflow.status === '0') {
            return '簽核中';
          } else if (workflow.status == null) {
            return '未送簽';
          } else {
            return '異常';
          }
        }));
      // }
    }
  }
}

// function test(status: string) {
//   if (status === '1') {
//     return '簽核通過';
//   } else if (status === '2') {
//     return '簽核未通過';
//   } else if (status === '0') {
//     return '簽核中';
//   } else if (status == null) {
//     return '未送簽';
//   } else {
//     return '異常';
//   }
// }
