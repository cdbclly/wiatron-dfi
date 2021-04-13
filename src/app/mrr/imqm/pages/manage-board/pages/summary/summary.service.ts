import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AbnormalApi, EarlyWarningApi, TraceBackApi, YieldRateApi, ParameterSettingApi, DRateApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
    private http: HttpClient,
    private abnormalService: AbnormalApi,
    private earlyWarningService: EarlyWarningApi,
    private traceBackService: TraceBackApi,
    private yrService: YieldRateApi,
    private paramService: ParameterSettingApi,
    private drateService: DRateApi,
    private selectService: SelectMenuApi
    ) { }

  getInitData() {
    return this.http.get('./../../../../../../../assets/temp-data/summary.json');
  }

  async getBoardData(type, data, startDate, endData) {

    // return this.http.get('./../../../../../../../assets/temp-data/summary.json').toPromise();
    const abnormalTopList = await this.abnormalService.getListByGroup(type, data, startDate, endData).toPromise();
    const earlyWarnTopList = await this.earlyWarningService.getListByGroup(type, data, startDate, endData).toPromise();
    const traceBackTopList = await this.traceBackService.getListByGroup(type, data, startDate, endData).toPromise();
    const yrRateVendor = await this.yrService.getTop10(type, data, startDate * 1000, endData * 1000).toPromise();
    const pdDRateVendor = await this.drateService.getTop10(type, data, startDate * 1000, endData * 1000).toPromise();
    return {abnormalList: abnormalTopList['result'], earlyWarnList: earlyWarnTopList['result'], traceBackList: traceBackTopList['result'],
    yrTopRate: yrRateVendor['result'], pdTopRate: pdDRateVendor['result']};
  }

  getAbnormalList(data, startTime, endTime) {
    // this.http.get('http://xxxx:xxx?filter[where][odo][gt]=5000');
    return this.abnormalService.getList(data, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getEarlyWarningList(data, startTime, endTime) {
    return this.earlyWarningService.getList(data, startTime, endTime).pipe(map((res) => {
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

// product:产品别， partNo:料号， productName: 品名
  getYrTargetByProductName(site, plant, productName, partNo, product = '*') {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: product,
    productName: 'productName', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getTraceBackList(data, startDate, endDate) {
    return this.traceBackService.getList(data, startDate, endDate).pipe(map((res) => {
      // console.log(res['result']);
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

  getDefectLossAnalyzeByVendor(site, plant, vendor, startDate, endDate, partNum?) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, vendor: vendor, partNumber: partNum}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByVendor(site, plant, vendor, startDate, endDate) {
    return this.drateService.getTop10('partNumber', {site: site, plant: plant, vendor: vendor}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByModel(site, plant, model, startDate, endDate) {
    return this.drateService.getTop10('partNumber', {site: site, plant: plant, model: model}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getPartNumDrByProductName(site, plant, productName, startDate, endDate) {
    return this.drateService.getTop10('partNumber', {site: site, plant: plant, productName: productName}, startDate, endDate).pipe(map((res) => {
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

  getDefectLossAnalyzeByPartNo(site, plant, partNo, startDate, endDate) {
    return this.yrService.getFailureAnalysis({site: site, plant: plant, partNumber: partNo}, startDate, endDate).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getEarlyListByVendor(site, plant, vendor, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('vendor', {site: site, plant: plant, vendor: vendor}, startTime, endTime).toPromise();
  }
   /**取得預警圖資料 */
   getEarlyListByModel(site, plant, model, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('model', {site: site, plant: plant, model: model}, startTime, endTime).toPromise();
  }

  getEarlyListByPartNo(site, plant, partNo, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('partNumber', {site: site, plant: plant,  partNumber: partNo}, startTime, endTime).toPromise();
  }

  getSelectInfoByPartNo(partNo) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }

}

@Injectable()
export class SummarylResolve implements Resolve<any> {

  constructor(
    private _service: SummaryService
  ) { }

  resolve(_route: ActivatedRouteSnapshot) {
    return this._service.getInitData();
  }
}
