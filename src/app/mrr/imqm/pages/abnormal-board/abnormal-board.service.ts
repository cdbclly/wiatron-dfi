import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbnormalApi, SelectMenuApi, ParameterSettingApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AbnormalBoardService {

  constructor(private _http: HttpClient,
    private abnormalService: AbnormalApi,
    private selectService: SelectMenuApi,
    private paramService: ParameterSettingApi
  ) { }

  getInitailData() {
    return this._http.get('./../../../../../assets/temp-data/abnormal-board.json').toPromise();
  }

  getAbnormalList(type, data, startTime, endTime) {
    return this.abnormalService.getListByGroup(type, data, startTime, endTime).pipe(map((res) => {
      return res['result'];
    }));
 }

  getAbnormalForms(data, startTime, endTime) {
  return this.abnormalService.getList(data, startTime, endTime).pipe(map((res) => {
    return res['result'];
  }));
  }

  getAbnormalRawDataBySN(sn) {
  return this.abnormalService.get(sn).pipe(map((res) => {
    return res['result'];
  }));
 }

 getAbnormalWhere(data, startTime, endTime) {
  return this.abnormalService.find({ where: {
    ...data,
    executionTime: {
      between: [startTime, endTime]
    }
  }}).toPromise();
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
