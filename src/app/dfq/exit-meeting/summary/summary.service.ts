import { WorkflowApi } from '@service/dfi-sdk';
import { CheckListLogInterface } from 'app/service/dfq_sdk/sdk/models/CheckListLog';
import { NPICHECKLIST_EM_HEADInterface } from 'app/service/dfq_sdk/sdk/models/NPICHECKLIST_EM_HEAD';
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LoopBackConfig as DFQLoopBackConfig,
  CheckListLogApi,
  BusinessGroupApi,
  BusinessUnitApi,
  SiteApi,
  PlantApi,
  CustomerApi,
  NPICHECKLIST_EM_HEADApi,
  NPICHECKLIST_EMApi,
  ExitMeetingResultApi,
  NPIMODELApi } from '@service/dfq_sdk/sdk';
import { ProductApi, ProjectApi, ModelApi } from 'app/service/dfi-sdk';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  exitMeetingId: NPICHECKLIST_EM_HEADInterface[];

  constructor(
    private route: ActivatedRoute,
    private businessGroupService: BusinessGroupApi,
    private businessUnitService: BusinessUnitApi,
    private siteService: SiteApi,
    private plantService: PlantApi,
    private customerService: CustomerApi,
    private exitMeetingService: NPICHECKLIST_EM_HEADApi,
    private exitMeetingResultService: ExitMeetingResultApi,
    private signingService: WorkflowApi,
    private modelService: NPIMODELApi,
    private checkListLogService: CheckListLogApi,
    private productapi: ProductApi,
    private projectApi: ProjectApi,
    private modelApi: ModelApi

  ) {
  }


  getModelsByPlant(filter?) {
    return this.modelService.find(filter);
  }

  getModelsByCustomer(filter?) {
    return this.modelService.find(filter);
  }

  getModelsByBu(filter?) {
    return this.modelService.find(filter);
  }

  getCustomers() {
    return this.customerService.find({});
  }

  getPlants(filter?) {
    return this.plantService.find(filter);
  }

  getcusttomers(filter?) {
    return this.projectApi.find(filter);
  }

  getSites() {
    return this.siteService.find({});
  }

  getModule() {
    return this.productapi.find({});
  }

  getBus(filter?) {
    return this.businessUnitService.find(filter);
  }

  getBgs() {
    return this.businessGroupService.find({});
  }

  getMeetingId(form) {
    return this.exitMeetingService.find({
      fields: {
        EXITMEETINGID: true,
        STAGE: true,
        MODEL: true
      },
      where: {
        SITE: form.SITE,
        PLANT: form.PLANT,
        MODEL: { inq: form.MODEL },
        STAGE: { inq: form.STAGE },
        CREATEDATE: form.DATE
      }
    }).pipe(
      map(
        (res: NPICHECKLIST_EM_HEADInterface[]) => {
          return res;
        }));
  }

  getModel(filter?) {
    return this.projectApi.find(filter);
  }

  getExitMeetingResults(filter?) {
    return this.exitMeetingResultService.find(filter).toPromise().
      then();
  }

  getSigning(filter) {
    return this.signingService.find(filter).pipe(map((res: any[]) => {
      return res;
    }));
  }

  getColors(filter) {
    return this.checkListLogService.find(filter).pipe(map(
      (res: CheckListLogInterface[]) => {
        return {
          red: res.filter(item => item.JUDGMENT === 3),
          yellow: res.filter(item => item.JUDGMENT === 2),
          green: res.filter(item => item.JUDGMENT === 1)
        };
      }
    ));
  }

}
