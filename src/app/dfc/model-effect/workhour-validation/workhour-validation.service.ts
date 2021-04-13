import { Injectable } from '@angular/core';
import { V_ProjectSummaryApi } from '../../../service/dfc_sdk/sdk/services/custom/V_ProjectSummary';
import { BasicModelApi } from '../../../service/dfc_sdk/sdk/services/custom/BasicModel';
import { DataVerificationApi } from '../../../service/dfc_sdk/sdk/services/custom/DataVerification';
import { MOHGapApi } from '../../../service/dfc_sdk/sdk/services/custom/MOHGap';
import { OperationTimeGapApi } from '../../../service/dfc_sdk/sdk/services/custom/OperationTimeGap';

@Injectable({
  providedIn: 'root'
})
export class WorkhourValidationService {

  constructor(private proSumApi: V_ProjectSummaryApi,
    private basicModelApi: BasicModelApi,
    private dvApi: DataVerificationApi,
    private MOHGapApi: MOHGapApi,
    private optApi: OperationTimeGapApi) { }

  async getDataByOneId(stageID) {
    let result = await this.dvApi.getDetails('"' + stageID + '"').toPromise();
    if (result.length > 0) {
      result = result[0];
      result['isMOHVisible'] = false;
      result['isWorkHourVisible'] = false;
      if (result['FactoryActualMOH']) {
        result['FactoryActualMOH'] = this.formatFloat(result['FactoryActualMOH'], 2);
      } else {
        result['FactoryActualMOH'] = null;
      }
      if (result['FactoryActualOperationTime']) {
        result['FactoryActualOperationTime'] = this.formatFloat(result['FactoryActualOperationTime'], 2);
      } else {
        result['FactoryActualOperationTime'] = null;
      }
      if (result['StageMOH'] || result['StageMOH'] === 0) {
        result['StageMOH'] = this.formatFloat(result['StageMOH'], 2);
      }
      result['totalStageOperationTime'] = this.formatFloat(this.getStageOperationTime(result['StageOperationTime']), 2);
      result['standard'] = this.isReachedStandard(result['StageMOH'], result['totalStageOperationTime'],
        result['FactoryActualMOH'], result['FactoryActualOperationTime']);
      console.log(result);
      return result;
    }
    return null;
  }

  async getData(obj) {
    const data = await this.proSumApi.find({ fields: { StageID: true }, where: this.parseToWhere(obj) }).toPromise();
    let ids: string = '';
    if (!!data && data.length > 0) {
      data.forEach(e => {
        ids = ids + ',' + e['StageID'];
      });
      ids = ids.substring(1);
      ids = '"' + ids + '"';
      let result = await this.dvApi.getDetails(ids).toPromise();
      let tableDta = [];
      result.forEach(element => {
        let tmp = {};
        tmp['StageID'] = element['StageID'];
        tmp['MOHGaps'] = element['MOHGaps'];
        tmp['OperationTimeGaps'] = element['OperationTimeGaps'];
        tmp['isMOHVisible'] = false;
        tmp['isWorkHourVisible'] = false;
        tmp['StageInfo'] = element['StageInfo'];
        tmp['Month'] = element['Month'];
        if (element['FactoryActualMOH']) {
          tmp['FactoryActualMOH'] = this.formatFloat(element['FactoryActualMOH'], 2);
        } else {
          element['FactoryActualMOH'] = null;
        }
        if (element['FactoryActualOperationTime']) {
          tmp['FactoryActualOperationTime'] = this.formatFloat(element['FactoryActualOperationTime'], 2);
        } else {
          element['FactoryActualOperationTime'] = null;
        }
        if (element['StageMOH'] || element['StageMOH'] === 0) {
          tmp['StageMOH'] = this.formatFloat(element['StageMOH'], 2);
        } else {
          tmp['StageMOHError'] = element['StageMOHError'];
        }
        tmp['totalStageOperationTime'] = this.formatFloat(this.getStageOperationTime(element['StageOperationTime']), 2);
        tmp['standard'] = this.isReachedStandard(tmp['StageMOH'], tmp['totalStageOperationTime'],
          tmp['FactoryActualMOH'], tmp['FactoryActualOperationTime']);
        if (obj.status === null) {
          tableDta.push(tmp);
        } else if (tmp['standard'].isReached && obj.status === 'yes') {
          tableDta.push(tmp);
        } else if (!tmp['standard'].isReached && obj.status === 'no') {
          tableDta.push(tmp);
        };

      });
      return tableDta;
    }
    return [];
  }

  getModelName(projectNameId) {
    return this.basicModelApi.find({ where: { projectNameId: { inq: projectNameId } }, fields: { modelName: true } });
  }

  isReachedStandard(stageMOHTime, totalStageOperationTime, MOHActualTime, WHActualTime) {
    let MOHTag: boolean = false, workHourTag: boolean = false;
    let MOHRatio: any = '無法計算';
    let workHourRadio: any = '無法計算';
    let result: any = {};
    if (typeof stageMOHTime === 'number' && typeof MOHActualTime === 'number') {
      MOHRatio = (((stageMOHTime - MOHActualTime) / stageMOHTime) * 100).toFixed(2);
      MOHTag = true;
    }
    if (typeof totalStageOperationTime === 'number' && !Number.isNaN(totalStageOperationTime)
      && typeof WHActualTime === 'number' && !Number.isNaN(WHActualTime)) {
      workHourRadio = (((totalStageOperationTime - WHActualTime) / totalStageOperationTime) * 100).toFixed(2);
      workHourTag = true;
    }
    result.MOHRatio = MOHRatio;
    result.workHourRadio = workHourRadio;
    if (MOHTag && workHourTag) {
      Math.abs(MOHRatio) <= (0.05 * 100) && Math.abs(workHourRadio) <= (0.05 * 100) ? result.isReached = true : result.isReached = false;
    } else {
      result.isReached = false;
    }
    return result;
  }

  parseToWhere(obj) {
    let where: any = {};
    for (let key in obj) {
      switch (key) {
        case 'bu':
          if (!!obj[key]) {
            where['BU'] = obj[key];
          }
          break;
        case 'plant':
          if (!!obj[key]) {
            where['Plant'] = obj[key];
          }
          break;
        case 'customer':
          if (!!obj[key]) {
            where['Customer'] = obj[key];
          }
          break;
        case 'proName':
          if (!!obj[key] && obj[key].length > 0) {
            where['ProjectNameID'] = { inq: obj[key] };
          }
          break;
        case 'proCode':
          if (!!obj[key] && obj[key].length > 0) {
            where['ProjectCode'] = { inq: obj[key] };
          }
          break;
        case 'cFlow':
          if (!!obj[key] && obj[key].length > 0) {
            where['Stage'] = { inq: obj[key] };
          }
          break;
        case 'modelName':
          if (!!obj[key] && obj[key].length > 0) {
            where['ModelName'] = { inq: obj[key] };
          }
          break;
        case 'product':
          if (!!obj[key] && obj[key].length > 0) {
            where['ModelType'] = { inq: obj[key] };
          }
          break;
      }
    }
    return where;
  }

  getStageOperationTime(stageOperationTime) {
    let sum = 0.0;
    for (let key in stageOperationTime) {
      if (!this.isEndWithM(key)) {
        sum += stageOperationTime[key].costTime;
      }
    }
    return this.formatFloat(sum, 2);
  }

  formatFloat(fl: number, behindPoint: number): number {
    return Number.parseFloat(fl.toFixed(behindPoint));
  }

  isEndWithM(str: string) {
    return String.prototype.endsWith.call(str, 'M');
  }

  async updateDataValidation(obj) {
    let data = {
      StageID: obj.StageID,
      Month: obj.Month,
      FactoryActualMOH: obj.FactoryActualMOH,
      FactoryActualOperationTime: obj.FactoryActualOperationTime
    };
    return await this.dvApi.patchOrCreate(data).toPromise();
  }

  async upsertMOHGap(obj) {
    let result = [];
    if (!obj.MOHGaps) { return; }
    for (let i = 0; i < obj.MOHGaps.length; ++i) {
      let tempResult = await this.MOHGapApi.patchOrCreate(obj.MOHGaps[i]).toPromise();
      result.push(tempResult);
    }
    return result;
  }

  async upsertOperaTionGapTime(obj) {
    let result = [];
    if (!obj.OperationTimeGaps) { return; }
    for (let i = 0; i < obj.OperationTimeGaps.length; ++i) {
      let tempResult = await this.optApi.patchOrCreate(obj.OperationTimeGaps[i]).toPromise();
      result.push(tempResult);
    }
    return result;
  }
}
