import { Injectable } from '@angular/core';
import { ProductApi, DimensionApi, DesignItemApi, ProcessTypeApi, ProcessType } from '@service/mrr-sdk';

@Injectable({
  providedIn: 'root'
})
export class PictureUploadService {

  constructor(private productSercvice: ProductApi,
    private dimensionService: DimensionApi,
    private processTypeService: ProcessTypeApi,
    private designService: DesignItemApi) { }

  getProduct() {
    return this.productSercvice.find();
  }

  getdimension() {
    return this.dimensionService.find({
      where: {
        name: '3D'
      }
    });
  }

  getProcessType(id) {
    return this.processTypeService.find({
      where: {
        dimensionId : id,
        enabled: true
      }
    });
  }

  getDesign() {
    return this.dimensionService.find({
      include: {
        relation: 'processTypes',
        scope: {
          include: {
            relation: 'designItems',
          }
        }
      },
      where: {
        id: '3D',
      }
    });
  }

  getDesignById(id) {
    return this.processTypeService.getDesignItems(id);
  }
// 根據id查找圖片的路徑
  getDesignItem(id) {
    return this.designService.find({
      fields: 'picturePath',
      where: {
        id: id
      }
    });
  }
  addDesign(param) {
    const p = {
      'picturePath': param.picturePath
    };
    return this.designService.patchAttributes(param.id, p);
  }

  delete3D(id) {
    return this.designService.deleteById(id);
  }
}
