import { DimensionInterface } from './../../../../service/mrr-sdk/models/Dimension';
import { DimensionApi } from './../../../../service/mrr-sdk/services/custom/Dimension';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductInterface, SiteApi, SiteInterface, ProjectInterface, ModelInterface, ProductApi, ProjectApi, ModelApi, SiteModelApi, SiteModelInterface, PlantApi, NuddRfqIgnoreApi, V_PlantProjectApi } from '@service/mrr-sdk';
@Injectable({
  providedIn: 'root'
})
export class QueryformService {

  constructor(
    private productService: ProductApi,
    private projectService: ProjectApi,
    private modelService: ModelApi,
    private dimensionService: DimensionApi,
    private siteService: SiteApi,
    private siteModelService: SiteModelApi,
    private plantService: PlantApi,
    private nuddRfqIgnoreService: NuddRfqIgnoreApi,
    private v_PlantProjectApi: V_PlantProjectApi,

  ) { }

  getSites() {
    return this.siteService.find({}).pipe(
      map(
        (res: SiteInterface[]) => {
          return res;
        }));
  }

  getPlants(site) {
    return this.plantService.find({
      where: {
        siteId: site
      }
    });
  }

  getProduct() {
    return this.productService.find({}).pipe(
      map(
        (res: ProductInterface[]) => {
          return res;
        }));
  }

  getIgnoreProduct(site, product) {
    return this.nuddRfqIgnoreService.find({
      where: {
        site: site,
        product: product,
      }
    });
  }

  getProjectCode(data) {
    return this.v_PlantProjectApi.find({
      where: {
        productType: data
      }
    }).pipe(
      map(
        (res: ProjectInterface[]) => {
          return res;
        }));
  }

  getNotRfqProjectCode(data) {
    return this.v_PlantProjectApi.find({
      where: {
        productType: data,
        isRfq: '0'
      }
    }).pipe(
      map(
        (res: ProjectInterface[]) => {
          return res;
        }));
  }

  getProjectName(data) {
    return this.modelService.find({
      fields: {
        id: true
      },
      where: {
        projectId: { inq: data }
      }
    }).pipe(
      map(
        (res: ModelInterface[]) => {
          return res;
        }));
  }

  getDimension(data) {
    return this.dimensionService.find({
      where: {
        productId: data
      }
    }).pipe(
      map(
        (res: DimensionInterface[]) => {
          return res;
        }));
  }

  getModels(site) {
    return this.siteModelService.find({
      include: {
        relation: 'model'
      },
      where: {
        siteId: site
      }
    }).pipe(
      map(
        (res) => {
          return res;
        }));
  }

  getProjects(models, productId) {
    return this.projectService.find({
      where: {
        productId: productId,
      }
    }).pipe(
      map(
        (res: SiteModelInterface[]) => {
          return res;
        }));
  }

  getModelResultId(site, projectName) {
    return this.siteModelService.find({
      where: {
        siteId: site,
        modelId: { inq: projectName }
      },
      include: {
        relation: 'modelResults',
        scope: {
          include: {
            relation: 'facts'
          }
        }
      }
    }).pipe(
      map(
        (res) => {
          return res;
        }));
  }

}
