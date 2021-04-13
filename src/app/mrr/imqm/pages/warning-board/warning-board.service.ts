import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EarlyWarningApi, SelectMenuApi, ParameterSettingApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarningBoardService {

  constructor(private _http: HttpClient,
    private earlyWarnService: EarlyWarningApi,
    private selectService: SelectMenuApi,
    private paramService: ParameterSettingApi
  ) { }

  getInitialData() {
    return this._http.get('./../../../../../assets/temp-data/warning-board.json').toPromise();
  }

  getEarlyWarnList(type, data, startTime, endTime) {
      return this.earlyWarnService.getListByGroup(type, data, startTime, endTime).pipe(map((res) => {
        return res['result'];
      }));
  }

  getEarlyWarnForms(data, startTime, endTime) {
    return this.earlyWarnService.getList(data, startTime, endTime).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarnRawDataBySN(sn) {
    return this.earlyWarnService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getSelectInfoByPartNo(partNo) {
    // console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }

  getYrTarget(site, plant, model, partNo) {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: '*', model: model,
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

}
