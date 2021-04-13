import { Injectable } from '@angular/core';
import { ProductApi, ProcessApi, OperationApi, MaterialApi, ProcessOperationApi, ProcessMaterialApi } from '@service/mrr-sdk';
@Injectable({
  providedIn: 'root'
})
export class IdbookMaintainService {

  constructor(private productService: ProductApi,
    private processService: ProcessApi,
    private operationService: OperationApi,
    private materialService: MaterialApi,
    private processOperationService: ProcessOperationApi,
    private processMaterialService: ProcessMaterialApi) { }

  getProcess(id) {
    return this.productService.getProcesses(id, {
      include: ['materials', 'operations']
    });
  }

  addProcess(param) {
    return this.processService.create(param);
  }

  deleProcessById(id) {
    return this.processService.deleteById(id);
  }

  addOperation(param) {
    return this.operationService.create(param);
  }

  addMaterial(param) {
    return this.materialService.create(param);
  }

  deleteMaterial(id) {
    return this.materialService.deleteById(id);
  }

  deleteOperation(id) {
    return this.operationService.deleteById(id);
  }

  getAllMaterial() {
    return this.materialService.find();
  }

  getAllOperation() {
    return this.operationService.find();
  }
// 通過產品別獲取material
  getMaterials(id) {
    return this.materialService.find({
      where: {
        productId: id
      }
    });
  }
// 通過產品別獲取operation
  getOperations(id) {
    return this.operationService.find({
      where: {
        productId: id
      }
    });
  }

  getNewMaterial(data) {
  return this.materialService.upsert(data);
}
  getNewOperation(id) {
  return this.operationService.upsert(id);
}
  deleteProcessOperation(id) {
    return this.processOperationService.deleteById(id);
  }

  deleteProcessMaterial(id) {
    return this.processMaterialService.deleteById(id);
  }

  createProcessOperation(param) {
    return this.processOperationService.create(param);
  }

  createProcessMaterial(param) {
    return this.processMaterialService.create(param);
  }

  findProcessOperation(pId, oId) {
    return this.processOperationService.find({
      where: {
        processId: pId,
        operationId: oId
      }
    });
  }

  findProcessMaterial(pId, mId) {
    return this.processMaterialService.find({
      where: {
        processId: pId,
        materialId: mId
      }
    });
  }
}
