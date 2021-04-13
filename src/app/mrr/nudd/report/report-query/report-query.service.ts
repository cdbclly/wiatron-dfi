import { View_ModelResultApi, V_PlantProjectApi } from '@service/mrr-sdk';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportQueryService {
  constructor(
    private modelResult: View_ModelResultApi,
    private v_PlantProjectApi: V_PlantProjectApi,
    ) {}

  // 查詢view_modelResult
  getViewModelResult() {
    return this.modelResult.find();
  }

  getModelResult(form) {
    return this.modelResult.find(form);
  }

  // 根據model和site查找modelResultId，帶出fact表
  getSiteModel(site, plant, models: Array<any>) {
    return this.modelResult.find({
      where: {
        site: site,
        plant: plant,
        model: { inq: models }
      },
      include: {
        relation: 'facts',
        scope: {
          where: {
            riskLevel: { gte: 16 }
          },
          include: {
            relation: 'workflow'
          }
        }
      }
    });
  }

  getProjectCode(form) {
    return this.v_PlantProjectApi.find(form);
  }

}
