import { Injectable } from '@angular/core';
import { AbnormalApi, TraceBackApi, EarlyWarningApi } from '@service/imqm-sdk';

@Injectable({
  providedIn: 'root'
})
export class FormsNosReportService {

  constructor(
    private anbormalService: AbnormalApi,
    private traceService: TraceBackApi,
    private earlyWarnService: EarlyWarningApi
  ) { }

  getAbnormalFormsDetail(formNo) {
    return this.anbormalService.get(formNo);
  }

  getTraceFormsDetail(formNo) {
    return this.traceService.get(formNo);
  }

  getEarlyWarnFormsDetail(formNo) {
    return this.earlyWarnService.get(formNo);
  }

}
