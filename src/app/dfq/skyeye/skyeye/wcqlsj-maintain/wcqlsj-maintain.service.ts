import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Wcq_Screw_ParameterApi, Wcq_Screw_Parameter_LogApi,KPIApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class WcqlsjMaintainService {

  constructor(
    private Wcq_Screw_Parameter: Wcq_Screw_ParameterApi,
    private kpiService: KPIApi,
    private _http: HttpClient,
    private Wcq_Screw_Parameter_Log: Wcq_Screw_Parameter_LogApi
  ) { }

  getTemplateFile() {
    return this._http.get('../../../../../assets/skyeye/wcqlsjTemplate.json?' + 'noCache =' + new Date().getTime());
  }

  getLogDetail(id) {
    return this.Wcq_Screw_Parameter_Log.find({where: {wcqId: id}, order: 'updatedTime'});
  }

    // 刪除該筆資料
  deleteCurRow(id) {
      return this.Wcq_Screw_Parameter.deleteById(id).toPromise();
  }
  
  getAddModelStage(plant) {
      return this.kpiService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }
}
