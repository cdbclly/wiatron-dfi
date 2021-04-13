import { WorkflowFormMappingApi } from '@service/dfi-sdk';
import { FactApi, SiteModelApi, WorkflowFormApi, LessonLearnedApi, FactRiskApi, ModelResultApi, FactInterface, FactRiskInterface, WorkflowApi, WorkflowSignApi } from '@service/mrr-sdk';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PicturereportService {

  constructor(
    private siteModelService: SiteModelApi,
    private factService: FactApi,
    private lessonLearnedService: LessonLearnedApi,
    private factRiskService: FactRiskApi,
    private modelResultService: ModelResultApi,
    private workFlowService: WorkflowApi,
    private workFlowSignService: WorkflowSignApi,
    private workflowFormService: WorkflowFormApi,
    private workflowFormMappingService: WorkflowFormMappingApi,
  ) { }

  getNuddUsers(key, projectName) {
    return this.workflowFormService.find({
      where: {
        name: projectName
      },
      include: {
        relation: 'workflowFormMappings',
        scope: {
          where: {
            key: key
          },
          include: {
            relation: 'workflowSignatories',
            scope: {
              where: {
                isDynamic: 0
              }
            }
          }
        }
      }
    });
  }

  getFact(site, projectName) {
    return this.siteModelService.find({
      include: {
        relation: 'modelResults',
        scope: {
          include: {
            relation: 'facts',
            scope: {
              order: ['riskLevel DESC', 'partName ASC', 'sideName DESC', 'pointName ASC'],
              include: [
                {
                  relation: 'factRisks'
                },
                {
                  relation: 'workflow',
                  scope: {
                    include: {
                      relation: 'workflowSigns',
                      scope: {
                        order: 'updateOn ASC'
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      },
      where: {
        siteId: site,
        modelId: projectName
      }
    }).pipe(map(res => {
      return res;
    }
    ));
  }

  updateFact(id, data) {
    return this.factService.patchAttributes(id, data);
  }

  updateModelResult(id, data) {
    return this.modelResultService.patchAttributes(id, data);
  }

  getWorkflowFormMappingId(key) {
    return this.workflowFormMappingService.find({
      where: {
        key: key
      }
    });
  }

  getLessonLearned(data) {
    return this.lessonLearnedService.find({
      where: {
        designItemId: data,
      },
      limit: 3,
      order: ['year DESC', 'id DESC']
    }).pipe(map((res) => {
      return res;
    }));
  }

  getFactRisk(data) {
    return this.factRiskService.find({
      where: {
        factId: data,
      }
    }).pipe(map((res: FactRiskInterface[]) => {
      return res;
    }));
  }

  getFacts(data) {
    return this.factService.find({
      where: {
        designItemName: data,
      }
    }).pipe(map((res: FactInterface[]) => {
      return res;
    }));
  }

  addWorkFlow(form) {
    return this.workFlowService.create(form);
  }

  upsertWorkFlow(id, form) {
    return this.workFlowService.patchAttributes(id, form);
  }

  upsertFactWorkFlowId(form) {
    const p = {
      'workflowId': form.workflowId
    };
    return this.factService.patchAttributes(form.id, p);
  }

  addWorkFlowSign(form) {
    return this.workFlowSignService.create(form);
  }

  upsertWorkFlowSign(id, form) {
    return this.workFlowSignService.updateAttributes(id, form);
  }
}
