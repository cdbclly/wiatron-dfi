import { Injectable } from '@angular/core';
import { PlantApi, ModelApi, ProductApi, Model, WorkflowApi } from '@service/dfi-sdk';
import { PartApi, View_ModelMaterialPartApi, ModelMaterialPartApi, MaterialApi, ModelMaterialPart, Material, PartInterface, } from '@service/dfq_sdk/sdk';
import { MemberApi } from '@service/dfc_sdk/sdk';


@Injectable({
  providedIn: 'root'
})
export class MboardService {

  constructor(
    private model: ModelApi,
    private Member: MemberApi,
    private product: ProductApi,
    private material: MaterialApi,
    private view_ModelMaterialPartService: View_ModelMaterialPartApi,
    private partService: PartApi,
    private plantService: PlantApi,
    private workflowService: WorkflowApi
  ) { }

  getPlants() {
    return this.plantService.find({});
  }

  getProduct() {
    return this.product.find();
  }

  // remark
  getParts(sitePlant, product) {
    return this.partService.find({
      where: {
        plantId: sitePlant,
        productId: product,
      }
    });
  }

  updatePart(id, workflowId) {
    return this.partService.patchAttributes(id, workflowId);
  }

  getMaterial() {
    return this.material.find();
  }

  queryForm(product, sitePlant, partId?) {
    return this.partService.find<PartInterface>({
      where: {
        productId: product,
        plantId: sitePlant,
        partId: partId
      },
      order: 'defectNum DESC'
    });
  }

  addPartData(form) {
    return this.partService.upsert(form);
  }

  editeItemData(id, editData) {
    return this.partService.patchAttributes(id, editData);
  }

  findMaterialId(name, productId) {
    return this.material.find<Material>({
      where: {
        name: name,
        productId: productId,
      }
    });
  }

  findSuperVisor(picID) {
    return this.Member.find({
      where: {
        EmpID: picID
      }
    });
  }
  getWorlkflow(plant, product) {
    return this.workflowService.findOne(
      {
        where: {
          desc: 'RFIMB不良率:' + plant + product
        },
        include: {
          relation: 'workflowSigns'
        },
        order: 'id DESC'

      }
    );
  }
}




