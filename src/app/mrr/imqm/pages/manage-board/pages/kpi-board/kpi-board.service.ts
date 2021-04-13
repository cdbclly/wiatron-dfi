import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbnormalApi, EarlyWarningApi, TraceBackApi, DRateApi, ParameterSettingApi, NumberOfStopsApi, YieldRateApi,
         SavingInformationApi, VendorSavingInformationInfoApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { and } from '@angular/router/src/utils/collection';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class KpiBoardService {

  constructor(private http: HttpClient,
              private abnormalService: AbnormalApi,
              private earlWarningService: EarlyWarningApi,
              private traceService: TraceBackApi,
              private dRateService: DRateApi,
              private paraService: ParameterSettingApi,
              private stopNumService: NumberOfStopsApi,
              private yrService: YieldRateApi,
              private saveInfoService: SavingInformationApi,
              private vendorSaveInfo: VendorSavingInformationInfoApi) { }

   getInitData(site, plant, startTime, endTime) {
     // 本月
    const dateMonthStart = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
    const dateMonthEnd = new Date().getTime();
    console.log(dateMonthStart, dateMonthEnd);
    // 本年
    // const dateYearStart = new Date(`${moment().format('YYYY-01-01 00:00:00')}`).getTime();
    // const dateYearEnd = new Date().getTime();
    const dateYearStart = moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf();
    const dateYearEnd = moment().endOf('month').valueOf();
    console.log(dateYearStart, dateYearEnd);
    // 上个月
    const dateLastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
    // const dateLastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - 1,
    // new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate());
    const dateLastMonthEnd = new Date(`${moment().format('YYYY-MM-01 00:00:01')}`).getTime();
    console.log(dateLastMonthStart, dateLastMonthEnd);

    // debugger;
    // const warnCloseRate = await this.abnormalService.getList({site: 'WKS', plant: 'WKS-P1'}, startTime, endTime).toPromise().then(
    //   res => {
    //     const resResult = res['result'].reduce((pre, cur) => {
    //     (pre[cur['status']] !== undefined ? pre[cur['status']] : pre[cur['status']] = []).push(cur);
    //     return pre; }, {});
    //     console.log(res);
    //     return resResult;
    //   });
    // console.log(warnCloseRate);
    return forkJoin (
      this.abnormalService.getList({ site: site, plant: plant }, startTime ? startTime : Math.ceil(dateMonthStart / 1000), endTime ? endTime : Math.ceil(dateMonthEnd / 1000)),
      this.earlWarningService.getList({ site: site, plant: plant }, startTime ? startTime : Math.ceil(dateMonthStart / 1000), endTime ? endTime : Math.ceil(dateMonthEnd / 1000)),
      this.traceService.getList({ site: site, plant: plant }, startTime ? startTime : Math.ceil(dateMonthStart / 1000), endTime ? endTime : Math.ceil(dateMonthEnd / 1000)),
      this.dRateService.getMonthTrend({ site: site, plant: plant }, startTime ? startTime * 1000 : dateYearStart, endTime ? endTime * 1000 : dateYearEnd),
      this.paraService.getInfo({site: site, plant: plant, type: 'yrTarget'}),
      this.stopNumService.getGroupByMonth(plant, startTime ? startTime : Math.ceil(dateYearStart / 1000), endTime ? endTime : Math.floor(dateYearEnd / 1000)),
      this.stopNumService.getGroupByVendor(plant, startTime ? startTime : Math.ceil(dateYearStart / 1000), endTime ? endTime : Math.floor(dateYearEnd / 1000)),
      this.yrService.getMonthShiftTrend({site: site, plant: plant}, startTime ? startTime * 1000 : dateYearStart, endTime ? endTime * 1000 : dateYearEnd),
      this.saveInfoService.find({where: {and: [{ site: site}, { plant: plant}, {and: [{'time': {gte: startTime ? null : Math.ceil(dateLastMonthStart / 1000)}},
      {'time': {lte: endTime ? null : Math.ceil(dateLastMonthEnd / 1000)}}]}]}}),
      this.paraService.getInfo({site: site, plant: plant, type: 'average'}),
    ).pipe(
      map(res => {
        // debugger;
        const initData = {
          abnormal: null,
          earlWarning: null,
          trace: null,
          drRate: null,
          drBefore: null,
          yrTarget: null,
          stopNumBefore: null,
          stopNum: null,
          stopNumRank: null,
          yrRate: null,
          saveInfo: null };
        initData.abnormal = this.reduceCount(res[0].result);
        initData.earlWarning = this.reduceCount(res[1].result);
        initData.trace = this.reduceCount(res[2].result);
        console.log(initData);
        initData.drRate = res[3]['result'];
        initData.drBefore = res[9]['result'][0] ? res[9]['result'][0]['drMonthlyAverage'] : [];
        initData.stopNumBefore = res[9]['result'][0] ? res[9]['result'][0]['numberStopsMonthlyAverage'] : [];
        initData.yrTarget = res[4]['result'][0] ? res[4]['result'][0]['yrTarget'] : [];
        initData.stopNum = res[5]['result'];
        initData.stopNumRank = res[6]['result'];
        initData.yrRate = res[7]['result'];
        initData.saveInfo = res[8];
        return initData;
      })
    );
  }

  getAbnormalFormList(data, startTime, endTime) {
    return this.abnormalService.getList(data, startTime, endTime).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarningFormList(data, startTime, endTime) {
    return this.earlWarningService.getList(data, startTime, endTime).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTraceFormList(data, startTime, endTime) {
    return this.traceService.getList(data, startTime, endTime).pipe(map((res) => {
      return res['result'];
    }));
  }

  getVendorSaveInfo(site, plant) {
    return this.vendorSaveInfo.find({where: {and: [{site: 'WKS'}, {plant: 'WKS-P1'}]}});
  }

  reduceCount(res) {
    return res.reduce((pre, cur) => {
      pre[cur.status] = pre[cur.status] ? pre[cur.status] + 1 : 1;
      return pre;
    }, {});
  }

  getAbnormalRawDataBySN(sn) {
    return this.abnormalService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarnRawDataBySN(sn) {
    return this.earlWarningService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTraceBackRawDataBySN(sn) {
    return this.traceService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTarget(type, site, plant, model, partNumber?) {
    return this.paraService.getInfo({type: type, site: site, plant: plant, product: '*', model: model ? model : '*',
    productName: '*', partNumber: partNumber ? partNumber : '*'}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getDefectLoass(data, startDate, endDate) {
    return this.yrService.getFailureAnalysis(data, startDate, endDate).pipe(map((res) => {
      return res['result'];
    }));
  }

  getYrTrend(site, plant, startDate, endDate) {
    const startMonthDate = startDate ? startDate : moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf();
    const endMonthDate = endDate ? endDate : moment().endOf('month').valueOf();
    return this.yrService.getDayTrendYR({ site: site, plant: plant }, startMonthDate, endMonthDate).pipe(map((res) => {
      return res['result'];
    }));
  }

  getWeekTrend(site, plant, startDate, endDate) {
    const startMonthDate = startDate ? startDate : moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf();
    const endMonthDate = endDate ? endDate : moment().endOf('month').valueOf();
    return this.yrService.getWeekTrend({ site: site, plant: plant }, startMonthDate, endMonthDate).pipe(map((res) => {
      return res['result'];
    }));
  }

  getMonthShiftTrend(site, plant, startDate, endDate) {
    const startMonthDate = startDate ? startDate : moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf();
    const endMonthDate = endDate ? endDate : moment().endOf('month').valueOf();
    return this.yrService.getMonthShiftTrend({ site: site, plant: plant }, startMonthDate, endMonthDate).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTrendByGroup(queryType, periodType, data, startDate, endDate) {
    const startMonthDate = startDate ? startDate : moment().add(-1, 'year').add(1, 'month').startOf('month').valueOf();
    const endMonthDate = endDate ? endDate : moment().endOf('month').valueOf();
    return this.yrService.getTrendByGroup(queryType, periodType, data, startMonthDate, endMonthDate).pipe(map((res) => {
      return res['result'];
    }));
  }

}
