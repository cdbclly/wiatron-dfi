import { Injectable } from '@angular/core';
import { AbnormalApi, EarlyWarningApi, FakeRawdataApi, TraceBackApi, TraceBackReplyApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormsListService {

  constructor(private abnormalService: AbnormalApi, private earlyService: EarlyWarningApi,
              private traceService: TraceBackApi,
              private fakeDataService: FakeRawdataApi,
              private traceReplyService: TraceBackReplyApi) { }

  getAbnormalRawData(sn) {
    return this.abnormalService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getEarlyWarnRawData(sn) {
    return this.earlyService.get(sn).pipe(map((res) => {
      return res['result'];
    })).toPromise();
  }

  getTraceBackRawData(sn) {
    return this.traceService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getFakeDataRawData(sn) {
    return this.fakeDataService.get(sn).pipe(map((res) => {
      return res['result'];
    }));
  }

  getTraceReplayList(sn) {
    return this.traceReplyService.find({where: {number: sn}});
  }
}
