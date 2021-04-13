import { WorkflowFormApi } from '@service/dfi-sdk';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormMaintainServiceService {

  constructor(private workflowForm: WorkflowFormApi) { }

  getWorkflowForm() {
    return this.workflowForm.find();
  }

  addForm(form) {
    return this.workflowForm.create(form);
  }

  deleteForm(id) {
    return this.workflowForm.deleteById(id);
  }

  updateForm(form) {
    return this.workflowForm.upsert(form);
  }

}
