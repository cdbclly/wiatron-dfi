import { Injectable } from '@angular/core';

// import { LightBarApi, LightBar_LogApi } from '@service/skyeye_sdk';
import { HttpClient } from '@angular/common/http';
import { CTQApi, CTQ_logApi } from '@service/skyeye_sdk';
@Injectable({
  providedIn: 'root'
})
export class SmartFactoryService {

  constructor(
    private CTQService: CTQApi,
    private _http: HttpClient,
    private CTQlogService: CTQ_logApi
  ) { }

   // 数组对象去重
   getRidoffDuplicates(ObjectArray) {
    const obj = {};
    // debugger;
    const peon = ObjectArray.reduce((cur, next) => {
      // debugger;
      obj[next.plant + next.project + next.modelname + next.stationtype + next.tdname + next.mdname] ? '' :
      obj[next.plant + next.project + next.modelname + next.stationtype + next.tdname + next.mdname] = true && cur.push(next);
    return cur;
    }, []);
    console.log(peon);
    return peon;
  }

    // 获取config中的模板文件
    getTemplateFile() {
      return this._http.get('../../../../../assets/skyeye/CTQTemplate.json?' + 'noCache =' + new Date().getTime());
    }

  // 刪除該筆資料
  deleteCurRow(id) {
    return this.CTQService.deleteById(id).toPromise();
  }

  getLogDetail(id) {
    return this.CTQlogService.find({where: {ctqId: id}, order: 'updatedTime'});
  }

  getAddModelStage(plant) {
    return this.CTQService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }
}
