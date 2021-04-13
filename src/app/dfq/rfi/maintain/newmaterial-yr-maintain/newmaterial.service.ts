import {
  View_ModelMaterialApi,
  View_ModelMaterial,
  FactorTypeApi,
  View_ModelMaterialUploadApi,
  ModelMaterialFactorApi,
  ModelMaterialFactor,
  View_ModelMaterialUpload,
  ModelMaterialUploadApi
} from '@service/dfq_sdk/sdk';
import { Injectable } from '@angular/core';
import { ModelApi, Model } from '@service/dfi-sdk';

@Injectable({
  providedIn: 'root'
})
export class NewmaterialService {
  constructor(
    private newMaterialService: View_ModelMaterialApi,
    private viewModeMaterialUpload: View_ModelMaterialUploadApi,
    private modelMaterialUpload: ModelMaterialUploadApi,
    private modelService: ModelApi,
    private factorTypeService: FactorTypeApi,
    private modelMaterialFactorService: ModelMaterialFactorApi
  ) { }

  getNewMaterialYr() {
    return this.newMaterialService.find<View_ModelMaterial>({
      where: {
        // isRfqProject: 0
        hasNewFactors: 1
      }
    });
  }

  getProjectId(selectProjectName) {
    return this.modelService.find<Model>({
      where: {
        id: selectProjectName
      }
    });
  }

  getCustomer(selectSite) {
    let site;
    let plant;
    if (selectSite) {
    site = selectSite.split('-')[0];
    plant = selectSite.split('-')[1];
    }
    return this.newMaterialService.find<View_ModelMaterial>({
      where: {
        site: site,
        plant: plant,
        // isRfqProject: 0
        hasNewFactors: 1
      }
    });
  }

  getProduct(selectSite, customer) {
    let site;
    let plant;
    if (selectSite) {
    site = selectSite.split('-')[0];
    plant = selectSite.split('-')[1];
    }
    return this.newMaterialService.find<View_ModelMaterial>({
      where: {
        site: site,
        plant: plant,
        customer: customer,
        // isRfqProject: 0
        hasNewFactors: 1
      }
    });
  }

  getModel(selectSite, customer, product) {
    let site;
    let plant;
    if (selectSite) {
    site = selectSite.split('-')[0];
    plant = selectSite.split('-')[1];
    }
    return this.newMaterialService.find<View_ModelMaterial>({
      where: {
        site: site,
        plant: plant,
        customer: customer,
        product: product,
        // isRfqProject: 0
        hasNewFactors: 1
      }
    });
  }

  // 根據廠別，客戶別，產品別，機種獲取資料
  getMaterialYr(sitePlant, customer, product, model, hasNewFactors, isRfqProject) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.newMaterialService.find({
      where: {
        site: site,
        plant: plant,
        customer: customer,
        product: product,
        modelId: model,
        hasNewFactors: hasNewFactors,
        // isRfqProject: isRfqProject
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes'
          }
        }
      }
    });
  }

  getViewMaterialUpLoad(sitePlant, customer, product, model, materialId) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.viewModeMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        site: site,
        plant: plant,
        customer: customer,
        product: product,
        modelId: model,
        materialId: materialId
      }
    });
  }

  updateViewMaterialUpLoad(data) {
    return this.modelMaterialUpload.upsert(data);
  }

  // 獲取對應物料的多個項目和因子
  getFactorType(materialId) {
    return this.factorTypeService.find({
      where: {
        materialId: materialId
      },
      order: 'id ASC'
    });
  }

  getFactors(id) {
    return this.modelMaterialFactorService.find<ModelMaterialFactor>({
      where: {
        modelMaterialId: id
      }
    });
  }
}
