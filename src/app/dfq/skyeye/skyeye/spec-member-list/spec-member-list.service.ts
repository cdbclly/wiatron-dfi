import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipientApi, Recipient_LogApi,KPIApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class SpecMemberListService {

  constructor(
    private RecipientService: RecipientApi,
    private kpiService: KPIApi,
    private _http: HttpClient,
    private RecipientlogService: Recipient_LogApi
  ) { }

  // 获取config中的模板文件
  getTemplateFile() {
    return this._http.get('../../../../../assets/skyeye/recipientTemplate.json?' + 'noCache =' + new Date().getTime());
  }

  getLogDetail(id) {
    return this.RecipientlogService.find({where: {recipientId: id}, order: 'updatedTime'});
  }

    // 刪除該筆資料
    deleteCurRow(id) {
      return this.RecipientService.deleteById(id).toPromise();
    }
  
    getAddModelStage(plant) {
      return this.kpiService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
    }
}
