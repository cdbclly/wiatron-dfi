import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { YieldRateApi, ParameterSettingApi, AbnormalApi, EarlyWarningApi, TraceBackApi, DRateApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MachineModelService {

  constructor(
    private http: HttpClient,
    private yieldRateService: YieldRateApi,
    private drateService: DRateApi,
    private paramService: ParameterSettingApi,
    private abnormalService: AbnormalApi,
    private earlyWarningService: EarlyWarningApi,
    private traceBackService: TraceBackApi,
    private selectService: SelectMenuApi
  ) { }

  async getInitData(cur_site ?, cur_plant ?) {
    let yieldRateData, pdDrData, abnormalData, earlyWarningData, ngData;
    let startDate;
    let endDate;
    const site = cur_site ? cur_site : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
    const plant = cur_plant ? cur_plant : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
    const curTime = new Date().getTime();
    const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
    const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();

    if (curTime > day8 && curTime < night8 ) {
      startDate = day8;
      endDate = night8;
    } else {
      startDate = night8;
      endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
    }
    console.log(startDate, endDate);

    // for test
    // startDate = 1561958176000;
    // endDate = 1564636576000;

    // 取得頁面初始數據
    yieldRateData = await this.yieldRateService.getTop10('model', {site: site, plant: plant}, startDate, endDate).toPromise();
    pdDrData = await this.drateService.getTop10('model', {site: site, plant: plant}, startDate, endDate).toPromise();
    abnormalData = await this.abnormalService.getListByGroup('model', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();
    earlyWarningData = await this.earlyWarningService.getListByGroup('model', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();
    ngData = await this.traceBackService.getListByGroup('model', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();

    return {yieldRateData: yieldRateData['result'], pdDrData: pdDrData['result'], abnormalData: abnormalData['result'], earlyWarningData: earlyWarningData['result'], ngData: ngData['result']};
  }

  getInitial() {
    return this.http.get('./../../../../../../../assets/temp-data/machineModel.json').toPromise();
  }

  /**取得YR圖表的資料 */
  getYrTarget(site, plant, model, partNo) {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: '*', model: model,
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  /**取得YR料號資料 */
  getPartNumYrByModel(site, plant, model, startDate, endDate) {
    return this.yieldRateService.getTop10('partNumber', {site: site, plant: plant, model: model}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  /**取得DR料號資料 */
  getPartNumYrBymodelDR(site, plant, model, startDate, endDate) {
    return this.drateService.getTop10('partNumber', {site: site, plant: plant, model: model}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  /**取得不良品資料 */
  getDefectLossAnalyze(site, plant, model, startDate, endDate, partNum?) {
    return this.yieldRateService.getFailureAnalysis({site: site, plant: plant, model: model, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  /**取得異常圖詳細資料 */
  getAbnormalList(site, plant, model, startTime, endTime) {
    return this.abnormalService.getList({site: site, plant: plant, model: model}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  /**取得預警圖資料 */
  getEarlyListByModel(site, plant, model, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('model', {site: site, plant: plant, model: model}, startTime, endTime).toPromise();
  }

  /**取得預警圖詳細資料 */
  getEarlyWarningList(site, plant, model, startTime, endTime) {
    return this.earlyWarningService.getList({site: site, plant: plant, model: model}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTraceBackList(site, plant, model, status, startTime, endTime) {
    console.log({site: site, plant: plant, model: model, status: status}, startTime, endTime);
    return this.traceBackService.getList({site: site, plant: plant, model: model, status: status}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getEarlyWarnRawDataBySN(sn) {
    return this.earlyWarningService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getAbnormalRawDataBySN(sn) {
    return this.abnormalService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTraceBackRawDataBySN(sn) {
    return this.traceBackService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getSelectInfoByPartNo(partNo) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }
}

@Injectable()
export class MachineModelResolve implements Resolve<any> {

  constructor(
    private _service: MachineModelService
  ) { }

  resolve(_route: ActivatedRouteSnapshot) {
    return this._service.getInitData();
  }
}
