import { Injectable } from '@angular/core';
import { AbnormalApi, EarlyWarningApi, TraceBackApi, YieldRateApi, ParameterSettingApi, DRateApi, SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SummaryReportService {

  constructor(
    private abnormalService: AbnormalApi,
    private earlyWarningService: EarlyWarningApi,
    private traceBackService: TraceBackApi,
    private yrService: YieldRateApi,
    private paramService: ParameterSettingApi,
    private drateService: DRateApi,
    private selectService: SelectMenuApi

  ) { }

  async getBoardData(type, data, startDate, endData) {

    // return this.http.get('./../../../../../../../assets/temp-data/summary.json').toPromise();
    const abnormalTopList = await this.abnormalService.getListByGroup(type, data, startDate, endData).toPromise();
    // const earlyWarnTopList = await this.earlyWarningService.getListByGroup(type, data, startDate, endData).toPromise();
    const traceBackTopList = await this.traceBackService.getListByGroup(type, data, startDate, endData).toPromise();
    const yrRateVendor = await this.yrService.getTop10(type, data, startDate * 1000, endData * 1000).toPromise();
    const pdDRateVendor = await this.drateService.getTop10(type, data, startDate * 1000, endData * 1000).toPromise();
    return {abnormalList: abnormalTopList['result'], traceBackList: traceBackTopList['result'],
    yrTopRate: yrRateVendor['result'], pdTopRate: pdDRateVendor['result']};
  }

  getYrTarget(site, plant, model, partNo) {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: '*', model: model,
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getEarlyListByVendor(site, plant, vendor, startTime, endTime) {
    return this.earlyWarningService.getListByGroup('vendor', {site: site, plant: plant, vendor: vendor}, startTime, endTime).toPromise();
  }

  getSelectInfoByPartNo(partNo) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }

}
