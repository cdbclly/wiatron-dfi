import { Injectable } from '@angular/core';
import { PartInterface, ProcessApi, ProcessInterface, ProcessMaterialApi, MaterialInterface, ProcessOperationApi, OperationInterface, PartApi, ProductApi } from '@service/mrr-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdbookanalyseService {

  constructor(private partService: PartApi,
    private ProcessService: ProcessApi,
    private MaterialService: ProcessMaterialApi,
    private operationService: ProcessOperationApi,
    private productService: ProductApi) { }

  getPart(product) {
    return this.productService.getParts(product).pipe(
      map(
        (res: PartInterface[]) => {
          return res;
        }));
  }

  getProcess(product) {
    return this.ProcessService.find({
      where: {
        productId: product
      }
    }).pipe(
      map(
        (res: ProcessInterface[]) => {
          return res;
        }));
  }

  getMaterial(v) {
    return this.ProcessService.getMaterials(v).pipe(
      map(
        (res: MaterialInterface[]) => {
          return res;
        }));
  }

  getOperation(v) {
    return this.ProcessService.getOperations(v).pipe(
      map(
        (res: OperationInterface[]) => {
          return res;
        }));
  }
}
