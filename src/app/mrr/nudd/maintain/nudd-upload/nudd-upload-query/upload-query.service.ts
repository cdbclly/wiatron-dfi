import { DimensionInterface } from './../../../../../service/mrr-sdk/models/Dimension';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductInterface, SiteApi, SiteInterface, PlantApi, PlantInterface, ProjectInterface, ModelInterface, ProductApi, ProjectApi, ModelApi, ModelResultApi, SiteModelApi, SiteModelInterface, DimensionApi, V_PlantProjectApi } from '@service/mrr-sdk';

@Injectable({
  providedIn: 'root'
})
export class UploadQueryService {

  constructor(
    private productService: ProductApi,
    private projectService: ProjectApi,
    private modelService: ModelApi,
    private dimensionService: DimensionApi,
    private siteService: SiteApi,
    private siteModelService: SiteModelApi,
    private v_PlantProjectApi: V_PlantProjectApi
  ) { }

  getSites() {
    return this.siteService.find({}).pipe(
      map(
        (res: SiteInterface[]) => {
          return res;
        }));
  }

  getProduct() {
    return this.productService.find({}).pipe(
      map(
        (res: ProductInterface[]) => {
          return res;
        }));
  }

  getProjectCode(data) {
    // return this.projectService.find({
    //   where: {
    //     productId: data
    //   }
    // }).pipe(
    //   map(
    //     (res: ProjectInterface[]) => {
    //       return res;
    //     }));
    return this.v_PlantProjectApi.find({
      where: {
        productId: data
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

  // include: {
  //   relation: 'siteModel',
  //   scope: {
  //     include: [{
  //       relation: 'site',
  //       scope: {
  //         where: {
  //           id: site
  //         }
  //       }
  //     },
  //     {
  //       relation: 'model',
  //       scope: {
  //         where: {
  //           id: projectName,
  //         }
  //       }
  //     }]
  //   }
  // }

  getModelResultId(site, projectName) {
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
    }).pipe(
      map(
        (res) => {
          return res;
        }));
  }

}

