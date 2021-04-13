import { PartApi, ModelMaterialFactorApi, View_ModelMaterialPartApi, View_ModelMaterialUploadApi, View_ModelMaterialApi, FactorApi, MaterialApi, DiscussionApi } from '@service/dfq_sdk/sdk';
import { ProductApi, PlantApi, CustomerApi, BusinessUnitApi, SiteModelApi, ProjectApi, ModelApi, View_ModelApi } from '@service/dfi-sdk';
import { Injectable } from '@angular/core';
import { ProjectNameProfileApi } from '@service/dfc_sdk/sdk';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YrQueryService {

  constructor(
    private plantService: PlantApi,
    private siteModelService: SiteModelApi,
    private productService: ProductApi,
    private buService: BusinessUnitApi,
    private projectService: ProjectApi,
    private modelService: ModelApi,
    private view_ModelMaterialService: View_ModelMaterialApi,
    private view_UploadService: View_ModelMaterialUploadApi,
    private factorService: FactorApi,
    private projectNameProfileService: ProjectNameProfileApi,
    private materialService: MaterialApi,
    private view_ModelMaterialPartService: View_ModelMaterialPartApi,
    private discussService: DiscussionApi,
    private customerService: CustomerApi,
    private view_ModelRfqService: View_ModelApi,
    private modelMaterialFactorService: ModelMaterialFactorApi,
    private partService: PartApi
  ) { }

  getMaterialFactorById(id) {
    return this.modelMaterialFactorService.find({
      where: {
        modelMaterialId: id
      }
    });
  }

  getDiscussion(modelMaterialId) {
    return this.discussService.findOne({
      where: {
        modelMaterialId: modelMaterialId
      }
    });
  }

  updateDiscussion(id, form) {
    return this.discussService.patchAttributes(id, form);
  }

  getMbByPart(modelId, plantId, product, part) {
    return this.view_ModelMaterialPartService.find({
      where: {
        modelId: modelId,
        productId: product,
        plantId: plantId,
        partId: part
      },
      order: 'defectNum DESC'
    });
  }

  getMb(modelId, plantId, product) {
    return this.view_ModelMaterialPartService.find({
      where: {
        modelId: modelId,
        productId: product,
        plantId: plantId
      },
      order: 'defectNum DESC'
    });
  }

  getDfqMb(plantId, product) {
    return this.partService.find({
      where: {
        productId: product,
        plantId: plantId
      }
    });
  }

  getMbByPlantStatus(plant, modelId) {
    return this.view_ModelMaterialPartService.find({
      where: {
        plantId: plant,
        modelId: modelId,
        status: 1
      },
      order: 'defectNum DESC'
    });
  }

  getDfcFactors(modelId, plant) {
    return this.projectNameProfileService.GetAllFactorDetail(modelId, plant, 'RFQ');
  }

  getFactorName(factors) {
    return this.factorService.find({
      where: {
        id: { inq: factors }
      },
      include: {
        relation: 'factorType'
      },
      order: 'factorTypeId ASC'
    });
  }

  getMaterialByProduct(product) {
    return this.materialService.find({
      where: {
        productId: product,
        enabled: true
      },
      include: {
        relation: 'factorTypes',
        scope: {
          oreder: 'id ASC'
        }
      }
    });
  }

  getMaterialId(materialName, product) {
    return this.materialService.find({
      where: {
        name: materialName,
        productId: product
      },
      include: {
        relation: 'factorTypes',
        scope: {
          oreder: 'id ASC'
        }
      }
    });
  }

  getFactorIdSingle(factorName, factorTypeId) {
    return this.factorService.find({
      where: {
        name: factorName,
        factorTypeId: factorTypeId
      }
    });
  }

  async getFactorId(factorNames, factorTypeIds) {
    const factors = [];
    for (let index = 0; index < factorNames.length; index++) {
      factors.push(await this.factorService.find({
        where: {
          name: factorNames[index],
          factorTypeId: factorTypeIds[index]
        }
      }).toPromise().then());
    }
    return forkJoin(factors);
  }

  getBaseData(product) {
    return this.view_UploadService.find({
      where: {
        product: product,
        status: '1'
      }
    });
  }

  getBaseDataByModel(model) {
    return this.view_UploadService.find({
      where: {
        modelId: model,
        status: '1'
      }
    });
  }

  getBaseDataByIds(ids, sitePlant) {
    if (sitePlant) {
      const site = sitePlant.split('-')[0];
      const plant = sitePlant.split('-')[1];
      return this.view_UploadService.find({
        where: {
          id: { inq: ids },
          site: site,
          plant: plant,
          status: '1'
        }
      });
    } else {
      return this.view_UploadService.find({
        where: {
          id: { inq: ids },
          status: '1'
        }
      });
    }
  }

  getBaseDataBySite(sitePlant, product) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.view_UploadService.find({
      where: {
        site: site,
        plant: plant,
        product: product,
        status: '1'
      }
    });
  }

  getUploadData(sitePlant?, product?, modelId?) {
    let site = undefined;
    let plant = undefined;
    if (sitePlant) {
      site = sitePlant.split('-')[0];
      plant = sitePlant.split('-')[1];
    }
    return this.view_UploadService.find(
      {
        where: {
          site: site,
          plant: plant,
          product: product,
          modelId: modelId,
          status: '1'
        }
      }
    );
  }

  getProduct() {
    return this.productService.find({});
  }

  getPlants() {
    return this.plantService.find({});
  }

  getBu() {
    return this.buService.find({});
  }

  getCustomers() {
    return this.customerService.find({});
  }

  getViewAllModel(site, plant, modelId) {
    return this.view_ModelMaterialService.find({
      where: {
        site: site,
        plant: plant,
        modelId: modelId
      },
      include: {
        relation: 'material'
      }
    });
  }

  getCustomer(projectId) {
    return this.projectService.find({
      where: {
        id: projectId
      }
    });
  }

  getProjects(sitePlant, productId) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.view_ModelRfqService.find({
      where: {
        product: productId,
        site: site,
        plant: plant,
        // PLMStatus: 'Active'
        // isRfqProject: true // if hold BA project
      }
    });
  }

  getProCode(models?) {
    return this.modelService.find({
      where: {
        id: {
          inq: models
        }
      },
      include: {
        relation: 'project'
      }
    });
  }

  getSiteModel(sitePlant, models) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.siteModelService.find(
      {
        where: {
          siteId: site,
          modelId: { inq: models }
        }
      }
    );
  }

  getSiteModelBySite(sitePlant) {
    const site = sitePlant.split('-')[0];
    return this.siteModelService.find(
      {
        where: {
          siteId: site,
        }
      }
    );
  }

}

