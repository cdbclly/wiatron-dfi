import { Injectable } from '@angular/core';
import { RecipientApi, Recipient_LogApi,KPIApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class SpcAnalyzeService {

  constructor(
    private kpiService: KPIApi,
  ) { }

  getAddModelStage(plant) {
    return this.kpiService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }
}
