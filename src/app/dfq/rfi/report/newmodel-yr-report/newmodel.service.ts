import { ProjectCodeProfileApi } from './../../../../service/dfc_sdk/sdk/services/custom/ProjectCodeProfile';
import { Injectable } from '@angular/core';
import { View_ModelMaterialApi, View_ModelYieldRateApi } from '@service/dfq_sdk/sdk';
import { whenRendered } from '@angular/core/src/render3';
import { Site } from '@service/mrr-sdk';
import { ProjectCodeProfile } from '@service/dfc_sdk/sdk';
@Injectable({
  providedIn: 'root'
})
export class NewmodelService {

  constructor(
    private view_ModelMaterialService: View_ModelMaterialApi,
    private view_yieldRateService: View_ModelYieldRateApi,
    private ProjectCodeProFileService: ProjectCodeProfileApi
  ) { }


  getModelMaterial(filter) {
    return this.view_ModelMaterialService.find(filter);
  }

  getModelbyProduct(sitePlant, product) {
    const site = sitePlant.split('-')[0];
    const plant = sitePlant.split('-')[1];
    return this.view_yieldRateService.find(
      {
        where: {
          site: site,
          plant: plant,
          product: product
        }
      });
  }

  getProjectCodeProFile(plant, projrct) {
   return this.ProjectCodeProFileService.find<ProjectCodeProfile>({
      where: {
        Plant: plant,
        ProjectCode: projrct
      }
    });
  }
}
