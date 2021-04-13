import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolsVersionApi, ToolsVersion_logApi } from '@service/skyeye_sdk';

@Injectable({
  providedIn: 'root'
})
export class TestMaintainService {

  constructor(
    private _http: HttpClient,
    private ToolsVersionService: ToolsVersionApi,
    private ToolsVersionLogService: ToolsVersion_logApi,
  ) { }
  // 数组对象去重
  getRidoffDuplicates(ObjectArray) {
    const obj = {};
    // debugger;
    const peon = ObjectArray.reduce((cur, next) => {
      // debugger;
      obj[next.site + next.plant + next.modelname + next.stationtype] ? '' :
        obj[next.plantId + next.model] = true && cur.push(next);
      return cur;
    }, []);
    console.log(peon);
    return peon;
  }

  // 获取config中的模板文件
  getTemplateFile() {
    return this._http.get('../../../../../assets/skyeye/TestTemplate.json?' + 'noCache =' + new Date().getTime());
  }

  // 刪除該筆資料
  deleteCurRow(id) {
    return this.ToolsVersionService.deleteById(id).toPromise();
  }

  getLogDetail(id) {
    return this.ToolsVersionLogService.find({ where: { groupId: id }, order: 'updatedTime' });
  }

  getAddModelStage(plant) {
    return this.ToolsVersionService.find({ where: { plantId: plant }, fields: { modelId: true, stageId: true } });
  }
}
