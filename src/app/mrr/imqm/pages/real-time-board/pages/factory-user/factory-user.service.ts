import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AbnormalApi, EarlyWarningApi, TraceBackApi, YieldRateApi, ParameterSettingApi, DRateApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class FactoryUserService {

  constructor( private http: HttpClient,
    private abnormalService: AbnormalApi,
    private earlyWarningService: EarlyWarningApi,
    private traceBackService: TraceBackApi,
    private yrService: YieldRateApi,
    private drateService: DRateApi,
    private paramService: ParameterSettingApi,
    private selectService: SelectMenuApi
  ) { }

  async getInitData(cur_site ?, cur_plant ?) {
    const curTime = new Date().getTime();
    const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
    const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();
    let startDate;
    let endDate;
    const site = cur_site ? cur_site : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'] ? JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'] : 'WKS';
    const plant = cur_plant ? cur_plant : JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'] ? JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'] : 'WKS-P1';
    if (curTime > day8 && curTime < night8 ) {
      startDate = day8;
      endDate = night8;
    } else {
      startDate = night8;
      endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
    }
    // console.log(startDate, endDate);
    // for test
    // startDate = 1561958176000;
    // endDate = 1564636576000;
    // 獲取頁面初始數據
    const abnormalTopList = await this.abnormalService.getListByGroup('vendor', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();
    const earlyWarnTopList = await this.earlyWarningService.getListByGroup('vendor', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();
    const traceBackTopList = await this.traceBackService.getListByGroup('vendor', {site: site, plant: plant}, Math.ceil(startDate / 1000), Math.ceil(endDate / 1000)).toPromise();
    const yrRateVendor = await this.yrService.getTop10('vendor', {site: site, plant: plant} , startDate, endDate).toPromise();
    const pdDRateVendor = await this.drateService.getTop10('vendor', {site: site, plant: plant}, startDate, endDate).toPromise();
    console.log(pdDRateVendor);
    // debugger;
    return {abnormalList: abnormalTopList['result'], earlyWarnList: earlyWarnTopList['result'], traceBackList: traceBackTopList['result'],
    yrTopRate: yrRateVendor['result'], pdTopRate: pdDRateVendor['result']};
    // return this.http.get('./../../../../../../../assets/temp-data/material.json');
  }

  getInitial() {
    return this.http.get('./../../../../../../../assets/temp-data/material.json').toPromise();
  }

  getAbnormalList(site, plant, vender, startTime, endTime) {
    return this.abnormalService.getList({site: site, plant: plant, vendor: vender}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getEarlyListByVendor(site, plant, vendor, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('vendor', {site: site, plant: plant, vendor: vendor}, startTime, endTime).toPromise();
  }

  getYrTarget(site, plant, partNo) {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, model: '*',
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getPartNumYrByVendor(site, plant, vendor, startDate, endDate) {
    return this.yrService.getTop10('partNumber', {site: site, plant: plant, vendor: vendor}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumYrByVendorDR(site, plant, vendor, startDate, endDate) {
    return this.drateService.getTop10('partNumber', {site: site, plant: plant, vendor: vendor}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
      // return of([{key: 'DAZHI', ng: 1, count: 20, percent: '5.00'}])
    }));
  }

  getDefectLossAnalyze(site, plant, vendor, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, vendor: vendor, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getDefectLossAnalyzeDR(site, plant, vendor, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, vendor: vendor, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getAbnormalRawDataBySN(sn) {
    return this.abnormalService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarnRawDataBySN(sn) {
    return this.earlyWarningService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTraceBackRawDataBySN(sn) {
    return this.traceBackService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarningList(site, plant, vender, startTime, endTime) {
    return this.earlyWarningService.getList({site: site, plant: plant, vendor: vender}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTraceBackList(site, plant, vender, status, startTime, endTime) {
    return this.traceBackService.getList({site: site, plant: plant, vendor: vender, status: status}, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getSelectInfoByPartNo(partNo) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }

 }


@Injectable()
export class FactoryUserResolve implements Resolve<any> {

  constructor(
    private _service: FactoryUserService
  ) { }

  resolve(_route: ActivatedRouteSnapshot) {
    return this._service.getInitData();
  }
}
