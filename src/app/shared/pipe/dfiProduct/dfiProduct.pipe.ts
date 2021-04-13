import { Pipe, PipeTransform } from '@angular/core';
import { ProductTypeMappingApi } from '@service/dfi-sdk';

@Pipe({
  name: 'dfiProduct'
})

export class DFiProductPipe implements PipeTransform {
  data;
  constructor(
    private productTypeMappingApi: ProductTypeMappingApi,
  ) {
    this.productTypeMappingApi.find({where: {isManual : {'neq': [1] }}}).toPromise().then(res => this.data = res);
  }
  async transform(plmProduct: string): Promise<string> {
    if (plmProduct) {
      let item;
      if (!this.data) {
        await this.productTypeMappingApi.find({where: {isManual : {'neq': [1] }}}).toPromise().then(
          res => item = res.find(data => data['plmProductType'] === plmProduct)
        );
      } else {
        item = this.data.find(data => data.plmProductType === plmProduct);
      }
      if (item) {
        return item.dfiProductType;
      } else {
        return plmProduct;
      }
    }
  }
}
