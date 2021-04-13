import { View_ModelYieldRateApi } from './../../../../service/dfq_sdk/sdk/services/custom/View_ModelYieldRate';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(
    private view_yieldRateService: View_ModelYieldRateApi
  ) { }

  getViewYield(sitePlant, bu?, customer?, product?) {
    let site;
    let plant;
    if (sitePlant) {
      site = sitePlant.split('-')[0];
      plant = sitePlant.split('-')[1];
    }
    if (!bu) {
      bu = undefined;
    }
    if (!customer) {
      customer = undefined;
    }
    if (!product) {
      product = undefined;
    }
    return this.view_yieldRateService.find({
      where: {
        site: site,
        plant: plant,
        businessUnit: bu,
        customer: customer,
        product: product,
      }
    });
  }

  getViewYieldByModels(models, sitePlant) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.view_yieldRateService.find({
      where: {
        model: { inq: models },
        site: site,
        plant: plant
      }
    });
  }

  getViewYieldNoModels(sitePlant, bu?, customer?, product?, models?) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    bu = bu ? bu : undefined;
    customer = customer ? customer : undefined;
    product = product ? product : undefined;
    let model;
    if (models.length) { model = { inq: models }; } else {
      model = undefined;
    }
    return this.view_yieldRateService.find({
      where: {
        site: site,
        plant: plant,
        businessUnit: bu,
        customer: customer,
        product: product,
        model: model,
      }
    });
  }

}
