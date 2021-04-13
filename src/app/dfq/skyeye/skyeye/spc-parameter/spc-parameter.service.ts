import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Spc_MaintainApi, Spc_Maintain_LogApi,KPIApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class SpcParameterService {

  constructor(
    private Spc_Maintain: Spc_MaintainApi,
    private kpiService: KPIApi,
    private _http: HttpClient,
    private Spc_Maintain_Log: Spc_Maintain_LogApi
  ) { }

      // 获取config中的模板文件
  getTemplateFile() {
    return this._http.get('../../../../../assets/skyeye/spcTemplate.json?' + 'noCache =' + new Date().getTime());
  }

  getLogDetail(id) {
    return this.Spc_Maintain_Log.find({where: {spcId: id}, order: 'updateTime'});
  }

    // 刪除該筆資料
  deleteCurRow(id) {
      return this.Spc_Maintain.deleteById(id).toPromise();
  }
  
  getAddModelStage(plant) {
      return this.kpiService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }
}