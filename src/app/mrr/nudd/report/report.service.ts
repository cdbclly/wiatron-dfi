import { Injectable } from '@angular/core';
import { CustomerInterface, ProductApi, ProductInterface, SiteApi, SiteInterface, ProjectInterface, ModelInterface, ModelApi, ProjectApi, ProfitCenterApi, SiteModelApi, StageApi, ProjectStageApi, View_ModelResultApi } from '@service/mrr-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private product: ProductApi,
    private site: SiteApi,
    private model: ModelApi,
    private project: ProjectApi,
    private profitCenter: ProfitCenterApi,
    private siteModel: SiteModelApi,
    private stage: StageApi,
    private projectStage: ProjectStageApi,
    private modelResult: View_ModelResultApi
  ) { }

  // 查詢view_modelResult
  getModel(form) {
    return this.modelResult.find(form);
  }

  getSiteModelIdByProduct(product, customer, BU, date) {
    return this.project.find({
      include: [{
        relation: 'models',
        scope: {
          include: {
            relation: 'sites'
          }
        }
      }],
      where: {
        createdOn: { between: date },
        productId: product,
        customerId: customer,
        profitCenterId: BU
      }
    });
  }

  getProduct() {
    return this.product.find({}).pipe(
      map(
        (res: ProductInterface[]) => {
          return res;
        }));
  }

  getCustomer(product) {
    return this.product.getCustomers(product).pipe(
      map(
        (res: CustomerInterface[]) => {
          return res;
        }));
  }

  getSite() {
    return this.site.find({}).pipe(
      map(
        (res: SiteInterface[]) => {
          return res;
        }));
  }

  getBU(profitCenter) {
    return this.profitCenter.find({
      where: {
        id: { inq: profitCenter }
      },
      include: 'businessUnit'
    });
  }

  getProjectCode() {
    return this.project.find({}).pipe(
      map(
        (res: ProjectInterface[]) => {
          return res;
        }));
  }

  getProjectName() {
    return this.model.find({}).pipe(
      map(
        (res: ModelInterface[]) => {
          return res;
        }));
  }

  // 條件查詢
  getProjectBySite() {
    return this.site.find({
      include: {
        relation: 'models'
      },
      where: {
        id: 'WKS'
      }
    });
  }

  getProjectByBU(id) {
    return this.product.findById(id);
  }

  getModelResult(modelId: Array<any>, siteId, date, bu) {
    return this.siteModel.find({
      where: {
        siteId: siteId,
        modelId: { inq: modelId }
      },
      include: [{
        relation: 'modelResults',
        scope: {
          include: 'facts',
          scope: {
            include: 'workflow'
          }
        }
      }, {
        relation: 'model',
        scope: {
          include: {
            relation: 'project',
            scope: {
              createdOn: { between: date },
              include: {
                relation: 'profitCenter',
                scope: {
                  where: {
                    id: { inq: bu }
                  }
                }
              }
            }
          }
        }
      }, {
        relation: 'site'
      }]
    });
  }

  getStage() {
    return this.stage.find();
  }

  getProjectStage(state, project) {
    return this.projectStage.find({
      where: {
        projectId: { inq: project },
        stageId: state
      },
      include: {
        relation: 'project',
        scope: {
          include: {
            relation: 'models',
            scope: {
              include: {
                relation: 'sites'
              }
            }
          }
        }
      }
    });
  }

  getC3ProjectStageByProjectId(state, id) {
    return this.projectStage.find({
      where: {
        projectId: id,
        stageId: state
      }
    });
  }
}
