import { Injectable } from '@angular/core';
import { FpyrApi, RepairMasterApi, RepairDetailApi } from '@service/dpm_sdk/sdk';
import { PlantApi, ProjectApi } from '@service/dfi-sdk';
import { BasicModelApi } from '@service/dfc_sdk/sdk';


@Injectable({
  providedIn: 'root'
})
export class YrTrackingService {

  constructor(
    private plantService: PlantApi,
    private projectService: ProjectApi,
    private basicModelService: BasicModelApi
  ) { }

  // json數組根據屬性分類
  groupByType(arr, param) {
    const map = {},
      dest = [];
    for (let i = 0; i < arr.length; i++) {
      const ai = arr[i];
      if (ai[param] && !map[ai[param]]) {
        dest.push({
          key: ai[param],
          data: [ai]
        });
        map[ai[param]] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          const dj = dest[j];
          if (dj.key === ai[param]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }

  getPlants() {
    return this.plantService.find();
  }

  getModelFamilies() {
    return this.projectService.find();
  }

  getModels() {
    return this.basicModelService.find();
  }


}
