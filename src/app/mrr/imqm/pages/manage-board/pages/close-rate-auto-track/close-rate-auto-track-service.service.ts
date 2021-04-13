import { Injectable } from '@angular/core';
import { AbnormalApi, TraceBackApi, EarlyWarningApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloseRateAutoTrackServiceService {

  constructor(private abnormalService: AbnormalApi,
    private traceBackService: TraceBackApi,
    private earlyWarnService: EarlyWarningApi) { }

  getAbnormalFormList(data, startTime, endTime) {
    return this.abnormalService.getList(data, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getTraceBackFormList(data, startTime, endTime) {
    return this.traceBackService.getList(data, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getEarlyWarnFormList(data, startTime, endTime) {
    return this.earlyWarnService.getList(data, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }

  getAbnormalRawDataBySN(sn) {
    return this.abnormalService.get(sn).pipe(map((res) => {
      return res['result'];
    })).toPromise();
  }

  getEarlyWarnRawDataBySN(sn) {
    return this.earlyWarnService.get(sn).pipe(map((res) => {
      return res['result'];
    })).toPromise();
  }

  getTraceBackRawDataBySN(sn) {
    return this.traceBackService.get(sn).pipe(map((res) => {
      return res['result'];
    })).toPromise();
  }

  closeAbnormalForm(sn) {
    return this.abnormalService.closedAbnormal(sn).pipe(res => {
      return res;
    });
  }

  closeEarlyWarnForm(sn) {
    return this.earlyWarnService.closedEarlywarning(sn).pipe(res => {
      return res;
    });
  }

  closeTraceBackForm(sn) {
    return this.traceBackService.closedTraceback(sn).pipe(res => {
      return res;
    });
  }

  rejectAbnormalForm(sn) {
    return this.abnormalService.rejectAbnormal(sn).pipe(res => {
      return res;
    });
  }

  rejectEarlyWarnForm(sn) {
    return this.earlyWarnService.rejectEarlywarning(sn).pipe(res => {
      return res;
    });
  }

  rejectTraceBackForm(sn) {
    return this.traceBackService.rejectTraceback(sn).pipe(res => {
      return res;
    });
  }
}
