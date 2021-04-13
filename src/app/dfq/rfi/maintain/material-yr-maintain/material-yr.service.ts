import { Injectable } from '@angular/core';
import { ProductApi, WorkflowApi, View_ModelApi } from '@service/dfi-sdk';
import { ModelMaterialApi, ModelMaterialFactorApi, MaterialApi, View_ModelMaterialApi, ModelMaterialUploadApi, ModelMaterialUpload, View_ModelMaterialUploadApi, FactorApi, FactorTypeApi, View_ModelYieldRateApi, View_SFCDEFECTRATEDATAApi, View_MassProductionApi, ModelScheduleApi, SFCDEFECTRATEDATAApi, View_ModelMaterialUpload } from '@service/dfq_sdk/sdk';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class MaterialYrService {

  constructor(
    private productService: ProductApi,
    private materialService: MaterialApi,
    private modelMaterial: View_ModelMaterialApi,
    private modelMaterialUpload: View_ModelMaterialUploadApi,
    private modelMaterialUploadData: ModelMaterialUploadApi,
    private factorService: FactorApi,
    private factorTypeService: FactorTypeApi,
    private viewModelYieldRate: View_ModelYieldRateApi,
    private workflowService: WorkflowApi,
    private modelMaterialFactorService: ModelMaterialFactorApi,
    private modelMaterialService: ModelMaterialApi,
    private view_ModelService: View_ModelApi,
    private view_SfcService: View_SFCDEFECTRATEDATAApi,
    private SfcService: SFCDEFECTRATEDATAApi,
    private view_massProductService: View_MassProductionApi,
    private modelScheduleService: ModelScheduleApi
  ) { }

  getViewSFCDEFECTRATEDATA(form) {
    return this.view_SfcService.find(form);
  }

  updateSFCDEFECTRATEDATA(form) {
    return this.SfcService.upsert(form);
  }

  getMassProduction(form) {
    return this.view_massProductService.find(form);
  }

  updateModelSchedule(form) {
    return this.modelScheduleService.upsert(form);
  }

  getViewModel(site, plant, product, model) {
    return this.view_ModelService.find({
      where: {
        site: site,
        plant: plant,
        product: product,
        model: model,
        isRfqProject: false
      }
    });
  }

  updateHasNewFactors(id, form) {
    return this.modelMaterialService.patchAttributes(id, form);
  }

  getMaterialFactorsByFac(factors) {
    return this.modelMaterialFactorService.find({
      where: {
        factorId: { inq: factors }
      },
      include: {
        relation: 'modelMaterial'
      }
    });
  }
  getViewModel1(site, plant, product) {
    return this.view_ModelService.find({
      where: {
        site: site,
        plant: plant,
        product: product,
        isRfqProject: false
      }
    });
  }

  updateflow(id, form) {
    return this.workflowService.patchAttributes(id, form);
  }

  getSite(product) {
    return this.modelMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        product: product
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }
  getProduct() {
    return this.productService.find();
  }
  getModel(product, site, plant, customer?) {
    return this.modelMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        product: product,
        site: site,
        plant: plant,
        customer: customer
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }

  getCustomer(product, site?, plant?) {
    return this.modelMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        product: product,
        site: site,
        plant: plant
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }
  getMaterial(selectmaterial) {
    return this.materialService.find(

      {
        where: {
          name: selectmaterial,
        }
      });
  }
  getMaterial2(product) {
    return this.materialService.find({
      where: {
        productId: product
      },
      include: {
        relation: 'factorTypes',
        scope: {
          order: 'id ASC',
          include: {
            relation: 'factors'
          }
        }
      }
    });
  }
  getMaterial3(name, product) {
    return this.materialService.find({
      where: {
        name: name,
        productId: product
      }
    });
  }


  getModelMaterial() {
    return this.modelMaterialUpload.find({
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }

  getUploadId(models, materialId) {
    return this.modelMaterialUploadData.find({
      where: {
        materialId: materialId,
        modelId: { inq: models },
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }

  getFactorTypeS(materialIds) {
    return this.factorTypeService.find({
      where: {
        materialId: { inq: materialIds }
      },
      include: {
        relation: 'factors'
      },
      order: 'id ASC'
    });
  }

  getFactorType(product, materialIds, models, site?, plant?, customer? ) {
    if (!models) {
      return this.modelMaterialUpload.find({
        where: {
          product: product,
          materialId: { inq: materialIds },
          site: site,
          plant: plant,
          customer: customer,
        },
        include: {
          relation: 'material',
          scope: {
            include: {
              relation: 'factorTypes',
            }
          }
        },
        order: 'plant,modelId DESC'
      }).pipe(map(res => {
        return res = res.filter(item => item['modelId'] === res[0]['modelId']);
      }));
    } else {
      return this.modelMaterialUpload.find({
        where: {
          product: product,
          materialId: { inq: materialIds },
          site: site,
          plant: plant,
          modelId: { inq: models },
          customer: customer,
        },
        include: {
          relation: 'material',
          scope: {
            include: {
              relation: 'factorTypes',
            }
          }
        },
        order: 'plant,modelId DESC'
      });
    }

  }
  getFactorType2(product?, models?, status?) {

    return this.modelMaterialUpload.find({
      where: {
        product: product,
        modelId: models,
        status: status
      },
      order: 'workflowId DESC'
    });
  }

  getFactorByName(factorName, factorTypeId) {
    return this.factorService.findOne({
      where: {
        name: factorName,
        factorTypeId: factorTypeId
      }
    });
  }

  getFactorTypeByName(factorTypeName, materialId) {
    return this.factorTypeService.find({
      where: {
        name: factorTypeName,
        materialId: materialId
      }
    });
  }

  getFactor(factorId) {
    return this.factorService.findOne({
      where: {
        id: factorId
      }
    });
  }

  getEditmateril(id) {
    return this.modelMaterialUpload.find({
      where: {
        id: id,
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }
  // 更新Modelmaterial的一条数据
  updatepic(modelMaterialId, form) {
    return this.modelMaterialUploadData.patchAttributes(modelMaterialId, form);
  }

  updateModelMaterialUpload(id, form) {
    return this.modelMaterialUploadData.patchAttributes(id, form);
  }

  getUploadsByIds(ids) {
    return this.modelMaterialUploadData.find({
      where: {
        id: { inq: ids }
      }
    });
  }

  createModelMaterial(data) {
    return this.modelMaterialUploadData.upsert(data);
  }

  getModelUploadByModel(model) {
    return this.modelMaterialUploadData.find({
      where: {
        modelId: model
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      },
      order: 'id ASC'
    });
  }

  getModelUploadByModelSitePlant(model, site, plant) {
    return this.modelMaterialUploadData.find({
      where: {
        modelId: model,
        siteId: site,
        plantId: plant
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      },
      order: 'id ASC'
    });
  }

  getBaseDataDuc(model, materialId, site, plant) {
    return this.modelMaterialUploadData.find({
      where: {
        modelId: model,
        siteId: site,
        plantId: plant,
        materialId: materialId
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      },
      order: 'id ASC'
    });
  }

  // 根据查询表的id查找modelmaterial的数据
  findPicById(modelMaterialTd) {
    return this.modelMaterialUpload.find<ModelMaterialUpload>({
      where: {
        id: modelMaterialTd
      },
      include: {
        relation: 'material',
        scope: {
          include: {
            relation: 'factorTypes',
          }
        }
      }
    });
  }

  getViewModelMaterial(id) {
    return this.modelMaterial.find(
      {
        where: {
          id: id
        }
      }
    );
  }

  getViewModelMaterialNewFactor(product, materialName) {
    return this.modelMaterial.find(
      {
        where: {
          product: product,
          materialName: materialName,
          hasNewFactors: 1
        }
      }
    );
  }

  getViewModelYieldRate(site, plant, customer?, product?, model?, project?) {
    return this.viewModelYieldRate.find(
      {
        where: {
          site: site,
          plant: plant,
          customer: customer,
          product: product,
          model: model,
          project: project
        }
      }
    );
  }
  getViewMaterials() {
    return this.modelMaterial.find({});
  }

  getWorlkflow(model) {
    return this.workflowService.find(
      {
        where: {
          desc: 'RFI良率生成:' + model
        },
        include: {
          relation: 'workflowSigns'
        },
        order: 'id DESC'

      }
    );
  }

}
