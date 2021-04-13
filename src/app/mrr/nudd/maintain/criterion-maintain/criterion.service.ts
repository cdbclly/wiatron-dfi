import { Injectable } from '@angular/core';
import { ProductApi, ProcessTypeApi, DesignItemApi, SideApi, PointApi, DimensionApi, RiskApi, DesignItem } from '@service/mrr-sdk';

@Injectable({
  providedIn: 'root'
})
export class CriterionService {

  constructor(private processTypeApi: ProcessTypeApi,
    private designItemApi: DesignItemApi,
    private sideService: SideApi,
    private pointService: PointApi,
    private productSercvice: ProductApi,
    private dimensionService: DimensionApi,
    private riskService: RiskApi) { }

  getProcessData(form) {
    return this.processTypeApi.find(form);
  }

  getDesignItemData(form) {
    return this.designItemApi.find(form);
  }

  getSideData(form) {
    return this.sideService.find(form);
  }

  updateProcessType(data) {
    return this.processTypeApi.upsert(data);
  }

  updateDesignItem(data) {
    return this.designItemApi.upsert(data);
  }

  updateSide(data) {
    return this.sideService.upsert(data);
  }

  updatePoint(data) {
    return this.pointService.upsert(data);
  }

  getDesignItem(id) {
    return this.designItemApi.find({
      where: {
        id: id
      }
    });
  }

  // getProcess(index) {
  //   return this.dimensionService.getProcessTypes(index);
  // }
  getProcess(id) {
    return this.processTypeApi.find({
      where: {
        dimensionId: id
      },
      include: {
        relation: 'designItems'
      }
    });
  }

  addProcess(param) {
    return this.processTypeApi.create(param);
  }

  // getDesisgnItem(id) {
  //   return this.processTypeApi.getDesignItems(id);
  // }
  getDesisgnItem(id) {
    return this.designItemApi.find({
      where: {
        processTypeId: id
      },
      include: {
        relation: 'sides'
      }
    });
  }

  addDesisgnItem(param) {
    return this.designItemApi.create(param);
  }

  getRisk(id) {
    return this.designItemApi.getRisks(id);
  }

  addRisk(param) {
    return this.riskService.upsert(param);
  }

  // getSide(id) {
  //   return this.designItemApi.getSides(id);
  // }
  getSide(id) {
    return this.sideService.find({
      where: {
        designItemId: id
      },
      include: {
        relation: 'points'
      }
    });
  }

  addSide(param) {
    return this.sideService.create(param);
  }

  getPoint(id) {
    return this.sideService.getPoints(id);
  }

  addPoint(param) {
    return this.pointService.create(param);
  }

  getProduct() {
    return this.productSercvice.find();
  }

  getdimension(product) {
    return this.dimensionService.find({
      where: {
        productId: product
      }
    });
  }

  // 刪除
  deleteDesignItem(id) {
    return this.designItemApi.deleteById(id);
  }

  deleteSide(id) {
    return this.sideService.deleteById(id);
  }

  deletePoint(id) {
    return this.pointService.deleteById(id);
  }

}
