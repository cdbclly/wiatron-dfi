import { Injectable } from '@angular/core';

import { LightBarApi, LightBar_LogApi } from '@service/skyeye_sdk';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LightBarFillService {

  constructor(
    private lightBarService: LightBarApi,
    private _http: HttpClient,
    private lightBarlogService: LightBar_LogApi
  ) { }

  // 数组对象去重
  getRidoffDuplicates(ObjectArray) {
    const obj = {};
    // debugger;
    const peon = ObjectArray.reduce((cur, next) => {
      // debugger;
      obj[next.plantId + next.model] ? '' :
      obj[next.plantId + next.model] = true && cur.push(next);
    return cur;
    }, []);
    console.log(peon);
    return peon;
  }

    // 获取config中的模板文件
    getTemplateFile() {
      return this._http.get('../../../../../assets/skyeye/lightBarTemplate.json?' + 'noCache =' + new Date().getTime());
    }

  // 刪除該筆資料
  deleteCurRow(id) {
    return this.lightBarService.deleteById(id).toPromise();
  }

  getLogDetail(id) {
    return this.lightBarlogService.find({where: {lightBarId: id}, order: 'updatedTime'});
  }

  getAddModelStage(plant) {
    return this.lightBarService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }

}
