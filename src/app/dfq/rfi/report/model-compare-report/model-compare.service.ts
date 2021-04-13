import { Injectable } from '@angular/core';
import { View_ModelMaterialUploadApi, View_ModelMaterialUpload, MaterialApi, Material, FactorTypeApi, FactorType } from '@service/dfq_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class ModelCompareService {
  constructor(
    private view_ModelMaterialUpload: View_ModelMaterialUploadApi,
    private material: MaterialApi,
    private factorType: FactorTypeApi) { }
  getSelect(material, product) {
    return this.view_ModelMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        product: product,
        materialId: material
      }
    });
  }

  getFromData(product, material, models) {
    return this.view_ModelMaterialUpload.find<View_ModelMaterialUpload>({
      where: {
        product: product,
        materialId: material,
        modelId: {
          inq: models
        }
      }
    });
  }
  getSelectMaterial(id) {
    return this.material.find<Material>({
      where: {
        id: id
      }
    });
  }

  getMaterial(product) {
    return this.material.find<Material>({
      where: {
        productId: product
      }
    });
  }

  getFactorType(materialId) {
    return this.factorType.find<FactorType>({
      where: {
        materialId: materialId
      }
    });
  }
}
