import { Injectable } from '@angular/core';
import {
  BasicModelApi,
  GroupModelApi
} from '@service/dfc_sdk/sdk';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WorkhourQueryService {
  datawh = [];
  stage;
  totleTime = 0;
  totleTarget = 0;
  Time;
  stageList = ['RFQ', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  constructor(
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi
  ) { }

  // query 查詢工時和目標工時
  getWH(model: string, process: string, stageShowFlag: boolean): Observable<any> {
    this.datawh = [];
    this.totleTime = 0;
    this.totleTarget = 0;
    // 1.判斷是 groupModel還是 basicModel, 并查詢出對應的 Stage
    const modelType = model.split('-');
    // 2.分组, 单独计算为 group的与 model的
    if (modelType[0].includes('G')) { // groupModel
      return forkJoin(
        this.groupModelApi.GetOpTimeReport(modelType[1], 'RFQ'),
        this.groupModelApi.GetOpTimeReport(modelType[1], 'C2'),
        this.groupModelApi.GetOpTimeReport(modelType[1], 'C3'),
        this.groupModelApi.GetOpTimeReport(modelType[1], 'C4'),
        this.groupModelApi.GetOpTimeReport(modelType[1], 'C5'),
        this.groupModelApi.GetOpTimeReport(modelType[1], 'C6')
      ).pipe(map(reports => {
        this.getData(reports, process, stageShowFlag);
        return this.datawh;
      }));
    } else { // basicModel
      return forkJoin(
        this.basicModelApi.GetOpTimeReport(modelType[1], 'RFQ', true),
        this.basicModelApi.GetOpTimeReport(modelType[1], 'C2', true),
        this.basicModelApi.GetOpTimeReport(modelType[1], 'C3', true),
        this.basicModelApi.GetOpTimeReport(modelType[1], 'C4', true),
        this.basicModelApi.GetOpTimeReport(modelType[1], 'C5', true),
        this.basicModelApi.GetOpTimeReport(modelType[1], 'C6', true)
      ).pipe(map(reports => {
        this.getData(reports, process, stageShowFlag);
        return this.datawh;
      }));
    }
  }

  private getData(reports: any[], process, stageShowFlag: boolean) {
    reports.forEach((report, index) => {
      let ttlTime = 0;
      let ttlTarget = 0;
      const operationTime = report['result']['operationTime'];
      if (!!operationTime && JSON.stringify(operationTime) !== '{}') {
        if (!process) { // process 為空 計算 所有的製程
          for (const key in operationTime) {
            if (operationTime.hasOwnProperty(key)) {
              const pTime = operationTime[key];
              if (!key.endsWith('M')) {
                ttlTime += (!pTime['costTime'] ? 0 : pTime['costTime']);
                ttlTarget += (!pTime['targetCostTime'] ? 0 : pTime['targetCostTime']);
              }
            }
          }
        } else { // 計算單一製程
          ttlTime = !operationTime[process]['costTime'] ? 0 : operationTime[process]['costTime'];
          ttlTarget = !operationTime[process]['targetCostTime'] ? 0 : operationTime[process]['targetCostTime'];
        }
        if (stageShowFlag || (!stageShowFlag && !['C0', 'C1'].includes(this.stageList[index]))) {
          const targetData = {
            Stage: this.stageList[index],
            time: ttlTime.toFixed(2),
            target: ttlTarget.toFixed(2)
          };
          this.datawh.push(targetData);
        }
      }
    });
  }
}
