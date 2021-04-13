import { Injectable } from '@angular/core';
import { KPIApi } from '@service/skyeye_sdk';
import { HttpClient } from '@angular/common/http';
import { KPI_logApi } from '@service/skyeye_sdk/services/custom/KPI_log';
// 订阅
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainTainService {
    private subject: ReplaySubject<any> = new ReplaySubject<any>();
    constructor(
    private kpiService: KPIApi,
    private _http: HttpClient,
    private kpilogService: KPI_logApi
  ) { }

// 发送的消息
public  sendData(message: any): void {
  this.subject.next(message);
 }

 // 需要接收的信息
 public getData(): Observable<any> {
     return this.subject.asObservable();
 }


  // 数组对象去重
  getRidoffDuplicates(ObjectArray) {
    const obj = {};
    // debugger;
    const peon = ObjectArray.reduce((cur, next) => {
      // debugger;
      // if (next.name !== 'rf cpk' && next.name !== 'assy fixturecpk') {
      //   obj[next.name + next.plantId + next.modelId + next.stageId] ? '' :
      //     obj[next.name + next.plantId + next.modelId + next.stageId] = true && cur.push(next);
      //   return cur;
      // } else {
      //   obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2] ? '' :
      //     obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2] = true && cur.push(next);
      //   return cur;
      // }

      if (next.name === 'rf cpk') {
        obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2 + next.upn] ? '' :
          obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2 + next.upn] = true && cur.push(next);
        return cur;
      } else if (next.name === 'assy fixturecpk') {
        obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2] ? '' :
          obj[next.name + next.plantId + next.modelId + next.stageId + next.threshold1 + next.threshold2] = true && cur.push(next);
        return cur;
      } else if (next.name === 'retry rate') {
        obj[next.name + next.plantId + next.modelId + next.stageId + next.upn] ? '' :
        obj[next.name + next.plantId + next.modelId + next.stageId + next.upn] = true && cur.push(next);
      return cur;
      } else {
        obj[next.name + next.plantId + next.modelId + next.stageId] ? '' :
        obj[next.name + next.plantId + next.modelId + next.stageId] = true && cur.push(next);
      return cur;
      }


    }, []);
    console.log(peon);
    return peon;
  }

    // 获取config中的模板文件
    getTemplateFile() {
      return this._http.get('../../../../../assets/skyeye/templateFile.json?' + 'noCache =' + new Date().getTime());
    }

  // 刪除該筆資料
  deleteCurRow(id) {
    return this.kpiService.deleteById(id).toPromise();
  }

  getLogDetail(id) {
    return this.kpilogService.find({where: {groupId: id}, order: 'updateTime'});
  }

  getAddModelStage(plant) {
    return this.kpiService.find({where: {plantId: plant}, fields: {modelId: true, stageId: true}});
  }
}
