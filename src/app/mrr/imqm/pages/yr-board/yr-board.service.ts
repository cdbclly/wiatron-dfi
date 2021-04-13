import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { YieldRateApi, ParameterSettingApi, DRateApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class YrBoardService {

  constructor(
    private _http: HttpClient,
    private yrService: YieldRateApi,
    private paramService: ParameterSettingApi,
    private drService: DRateApi,
    private selectService: SelectMenuApi
  ) { }

  getYrTrend(data, startDate, endDate) {
    return this.yrService.getDayTrendYR(data, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getWeekTrend(data, startDate, endDate) {
    return this.yrService.getWeekTrend(data, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getMonthShiftTrend(data, startDate, endDate) {
    const startMonthDate = moment(startDate).startOf('month').valueOf();
    const endMonthDate = moment(endDate).endOf('month').valueOf();
    return this.yrService.getMonthShiftTrend(data, startMonthDate, endMonthDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTrendByGroup(queryType, periodType, data, startDate, endDate) {
    return this.yrService.getTrendByGroup(queryType, periodType, data, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getYrData(type, data, startDate, endDate) {
    return this.yrService.getTop10(type, data, startDate, endDate).pipe(map((res) => {
      console.log(res);
      return res['result'];
    }));
  }

  getDrData(type, data, startDate, endDate) {
    return this.drService.getTop10(type, data, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTarget(type, site, plant, model, partNumber?) {
    return this.paramService.getInfo({type: type, site: site, plant: plant, product: '*', model: model ? model : '*',
    productName: '*', partNumber: partNumber ? partNumber : '*'}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getDefectLoass(data, startDate, endDate) {
    return this.yrService.getFailureAnalysis(data, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getSelectInfoByPartNo(partNo, site, plant, product, customer) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo, site: site, plant: plant, product: product, customer: customer}}).toPromise();
  }

  getSelectInfoDrByPartNo(partNo, site, plant, product, customer) {
    return this.selectService.find({where: {partNumber: partNo, site: site, plant: plant, product: product, customer: customer}}).toPromise();
  }

  getPartNumYrByVendor(site, plant, vendor, startDate, endDate) {
    return this.yrService.getTop10('partNumber', {site: site, plant: plant, vendor: vendor}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumYrByModel(site, plant, model, startDate, endDate) {
    return this.yrService.getTop10('partNumber', {site: site, plant: plant, model: model}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByVendor(site, plant, vendor, startDate, endDate) {
    return this.drService.getTop10('partNumber', {site: site, plant: plant, vendor: vendor}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByModel(site, plant, model, startDate, endDate) {
    return this.drService.getTop10('partNumber', {site: site, plant: plant, model: model}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByProductName(site, plant, productName, startDate, endDate) {
    return this.drService.getTop10('partNumber', {site: site, plant: plant, productName: productName}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getDefectLossAnalyzeByVendor(site, plant, vendor, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, vendor: vendor, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getDefectLossAnalyzeByModel(site, plant, model, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, model: model, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }



  getPartNumYrByPartNumber(site, plant, partNo, startDate, endDate) {
    return this.yrService.getTop10('partNumber', {site: site, plant: plant, productName: partNo}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }


  getDefectLossAnalyzeBPartNumber(site, plant, model, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, model: model, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }



  // product:产品别， partNo:料号， productName: 品名
  getYrTargetByProductName(site, plant, productName, partNo, product = '*') {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: product,
    productName: 'productName', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }



  getDefectLossAnalyzeByPartNo(site, plant, partNum, startDate, endDate) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getYrTarget(site, plant, model, partNo, product = '*') {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: product, model: model,
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }


}
