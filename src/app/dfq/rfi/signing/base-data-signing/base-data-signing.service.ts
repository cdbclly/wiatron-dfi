import { WorkflowApi, View_WorkflowApi, WorkflowSignApi } from '@service/dfi-sdk';
import { Injectable } from '@angular/core';
import { View_ModelMaterialApi, DiscussionApi } from '@service/dfq_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class BaseDataSigningService {

  constructor(
    private workflowService: WorkflowApi,
    private workflowSignService: WorkflowSignApi,
    private view_modelMaterilService: View_ModelMaterialApi,
    private discussionService: DiscussionApi
  ) { }

  updateflowSign(id, form) {
    return this.workflowSignService.patchAttributes(id, form);
  }

  updateworkflow(id, form) {
    return this.workflowService.patchAttributes(id, form);
  }

  getflow(des) {
    return this.workflowService.find({
      where: {
        desc: des
      },
      order: 'id DESC'
    });
  }

  getflowSign(flowId) {
    return this.workflowService.find({
      where: {
        id: flowId
      },
      include: {
        relation: 'workflowSigns'
      }
    });
  }

  getViewModelMateril(site, plant, modelId) {
    return this.view_modelMaterilService.find({
      where: {
        site: site,
        plant: plant,
        modelId: modelId,
      }
    });
  }

  updateDiscussion(id, form) {
    return this.discussionService.patchAttributes(id, form);
  }
}
