import { Injectable } from '@angular/core';
import { WorkflowFormApi, WorkflowFormMappingApi, WorkflowSignatoryApi } from '@service/dfi-sdk';

@Injectable({
  providedIn: 'root'
})
export class SignMaintainService {
  constructor(
    private workflowForm: WorkflowFormApi,
    private workflowFormMapping: WorkflowFormMappingApi,
    private workflowSignatory: WorkflowSignatoryApi
  ) { }

  getKeyDescribe(id, key) {
   return this.workflowForm.find({
     where: {
       id: id
     },
     include: {
      relation: 'workflowFormMappings',
            scope: {
              where: {
                key: key
              }
            }
     }
   });
  }

  getWorkflowForm(where) {
    return this.workflowForm.find(where);
  }

  getWorkflowFormMapping(data) {
    return this.workflowFormMapping.find(data);
  }

  addMappingForm(form) {
    return this.workflowFormMapping.create(form);
  }

  delMappingForm(id) {
    return this.workflowFormMapping.deleteById(id);
  }

  updateMappingForm(form) {
    return this.workflowFormMapping.upsert(form);
  }

  addSignForm(form) {
    return this.workflowSignatory.create(form);
  }

  delSignForm(id) {
    return this.workflowSignatory.deleteById(id);
  }

  updateSignForm(form) {
    return this.workflowSignatory.upsert(form);
  }
}
