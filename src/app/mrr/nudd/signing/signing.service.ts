import { MailApi } from './../../../service/dfi-sdk/services/custom/Mail';
import { Injectable } from '@angular/core';
import { PlantApi, CustomerApi, FactApi, WorkflowApi, WorkflowSignApi, SiteModelApi, ModelResultApi } from '@service/mrr-sdk';
import { map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SigningService {

  constructor(
    private plant: PlantApi,
    private customer: CustomerApi,
    private factService: FactApi,
    private workFlowService: WorkflowApi,
    private workFlowSignService: WorkflowSignApi,
    private siteModelService: SiteModelApi,
    private modelResultService: ModelResultApi,
    private mailService: MailApi
  ) { }

  public nuddSignUpd = new Subject<any>();

  getSigners() {
    return of([]);
  }

  createMail(data) {
    return this.mailService.create(data);
  }

  getWorkFlows(workflowIds) {
    return this.workFlowService.find({
      where: {
        id: { inq: workflowIds }
      },
      include:
        [
          {
            relation: 'facts',
            scope: {
              where: {
                workflowId: { inq: workflowIds }
              }
            }
          },
          {
            relation: 'workflowSigns',
            scope: {
              where: {
                workflowId: { inq: workflowIds }
              }
            }
          }
        ]
    }).pipe(
      map(
        (res) => {
          return res;
        }));
  }

  getModel(site, modelResultId) {
    return this.modelResultService.find({
      include: {
        relation: 'siteModel',
        scope: {
          include: {
            relation: 'model',
            scope: {
              where: {
                siteId: site
              },
              include: {
                relation: 'project'
              }
            }
          }
        }
      },
      where: {
        id: modelResultId
      }
    }).pipe(
      map(
        (res) => {
          return res;
        }));
  }

  updateWorkFlowSign(id, data) {
    return this.workFlowSignService.patchAttributes(id, data);
  }

  updateWorkFlowStatus(id, data) {
    return this.workFlowService.patchAttributes(id, data);
  }

  updateModelResultStatus(id, data) {
    return this.modelResultService.patchAttributes(id, data);
  }

  addWorkFlowSigns(from) {
    return this.workFlowSignService.createMany(from);
  }

  getModelResultId(site, projectName) {
    if (projectName.length === 0) {
      return this.siteModelService.find({
        where: {
          siteId: site
        },
        include: {
          relation: 'modelResults',
          scope: {
            where: {
              status: '1'
            },
            include: {
              relation: 'facts'
            }
          }
        }
      });
    } else {
      return this.siteModelService.find({
        where: {
          siteId: site,
          modelId: { inq: projectName }
        },
        include: {
          relation: 'modelResults',
          scope: {
            where: {
              status: '1'
            },
            include: {
              relation: 'facts'
            }
          }
        }
      });
    }
  }

  // 根據workflowId獲取到fact中的項目詳情
  getFacts(workflowId) {
    return this.factService.find({
      fields: ['value', 'riskLevel', 'pointName', 'sideName', 'dimensionName', 'partName', 'processType', 'designItemPath'],
      where: {
        workflowId: workflowId
      }
    });
  }

}
