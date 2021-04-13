import { Injectable } from '@angular/core';
import { DimensionApi, ProductApi, DesignItemApi, ProcessTypeApi, LessonLearnedApi, DimensionInterface } from '@service/mrr-sdk';
import { } from '@service/dfi-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LlUploadService {

  constructor(private productSercvice: ProductApi,
    private dimensionService: DimensionApi,
    private designService: DesignItemApi,
    private processTypeSerivce: ProcessTypeApi,
    private llSerivce: LessonLearnedApi) { }

  getProduct() {
    return this.productSercvice.find();
  }

  getdimension(data) {
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

  getProcessType(id) {
    return this.dimensionService.getProcessTypes(id);
  }

  getDesignById(id) {
    return this.processTypeSerivce.getDesignItems(id);
  }

  getLL() {
    return this.llSerivce.find();
  }

  getLLById(id) {
    return this.designService.getLessonLearneds(id);
  }

  addLL(param) {
    return this.llSerivce.upsert(param);
  }

  deleteLL(id) {
    return this.llSerivce.deleteById(id);
  }

}
