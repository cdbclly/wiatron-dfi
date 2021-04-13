import { Injectable } from '@angular/core';
import { ProductApi } from '@service/dfi-sdk';
import { MaterialApi, FactorApi, View_ModelMaterialApi, View_ModelMaterial, FactorTypeApi, FactorType, Factor, Material, ModelMaterialApi, ModelMaterialUploadApi, ModelMaterial, ModelMaterialUpload, ModelMaterialFactorApi, View_ModelMaterialUploadApi } from '@service/dfq_sdk/sdk';

@Injectable({
  providedIn: 'root'
})
export class YrFactorService {

  constructor(
    private product: ProductApi,
    private material: MaterialApi,
    private factor: FactorApi,
    private viewModelMaterial: View_ModelMaterialApi,
    private factorType: FactorTypeApi,
    private modelMaterial: ModelMaterialApi,
    private modelMaterialUpload: View_ModelMaterialUploadApi,
    private modelMaterialFactor: ModelMaterialFactorApi,
  ) { }

  getProduct() {
    return this.product.find();
  }

  getMaterial(productId) {
    return this.material.find({
      where: {
        productId: productId
      }
    });
  }
  getFactorType(material) {
    return this.factorType.find({
      where: {
        materialId: material
      }
    });
  }
  getModelMaterialUpload(material) {
    return this.modelMaterialUpload.find<ModelMaterialUpload>({
      where: {
        materialId: material
      }
    }
    );
  }

  getModelMaterial(material) {
    return this.modelMaterial.find<ModelMaterial>({
      where: {
        materialId: material
      }
    }
    );
  }

  updateModelMaterialFactor(data) {
    return this.modelMaterialFactor.upsert(data);
  }

  queryForm(product, materialId, factorType) {
    return this.factorType.find<FactorType>({
      where: {
        materialId: materialId,
        id: factorType
      },
      order: 'id ASC',
      include: [
        { relation: 'factors' },
        {
          relation: 'material',
          scope: {
            where: {
              productId: product
            }
          }
        }
      ]
    });
  }
  queryForm2(product, materialId) {
    return this.material.find<Material>({
      where: {
        id: materialId,
        productId: product
      }
    });
  }
  queryForm3(product, factorType) {
    return this.factorType.find<FactorType>({
      where: {
        id: factorType
      },
      include: [
        { relation: 'factors' },
        {
          relation: 'material',
          scope: {
            where: {
              productId: product
            }
          }
        }
      ]
    });
  }
  productToMaterial(materialId, productId) {
    return this.material.find<Material>({
      where: {
        id: materialId,
        productId: productId
      },
      include: {
        relation: 'factorTypes',
        scope: {
          include: {
            relation: 'factors'
          }
        }
      }
    });
  }

  materialToType(material) {
    return this.factorType.find<FactorType>({
      where: {
        materialId: material
      },
      include: {
        relation: 'factors'
      },
      order: 'id DESC'

    });
  }
  typeToFactor(factorType) {
    return this.factor.find<Factor>({
      where: {
        factorTypeId: factorType
      }
    });
  }
  addMaterial(material) {
    return this.material.upsert<Material>(material);
  }
  updateMaterial(material) {
    return this.material.upsert(material);
  }
  addFactType(fType) {
    return this.factorType.upsert<FactorType>(fType);
  }
  updateFType(fType) {
    return this.factorType.upsert(fType);
  }
  addFactor(factor) {
    return this.factor.upsert<Factor>(factor);
  }
  updateFactor(factor) {
    return this.factor.upsert(factor);
  }
  downFile(product, material?, factorType?) {
    return this.material.find<Material>({
      where: {
        productId: product,
        id: material
      },
      include: {
        relation: 'factorTypes',
        scope: {
          where: {
            id: factorType
          },
          include: {
            relation: 'factors',
          }
        }
      }
    });
  }
  uploadFileData(product, material, factorType) {
    return this.factorType.find<FactorType>({
      where: {
        name: factorType
      },
      include: [
        { relation: 'factors' },
        {
          relation: 'material',
          scope: {
            where: {
              productId: product,
              name: material,
            }
          }
        }
      ]
    });
  }
  replaceMaterialDT(MaterialDT) {
    return this.material.upsert<Material>(MaterialDT);
  }

  findMaterial(productId, materialName) {
    return this.material.find<Material>({
      where: {
        productId: productId,
        name: materialName
      }
    });
  }
  findFactorType(materialId, FactorTypeName) {
    return this.factorType.find<FactorType>({
      where: {
        materialId: materialId,
        name: FactorTypeName
      }
    });
  }
  findFactor(factorTypeId, factorName) {
    return this.factor.find<Factor>({
      where: {
        factorTypeId: factorTypeId,
        name: factorName
      }
    });
  }
}
