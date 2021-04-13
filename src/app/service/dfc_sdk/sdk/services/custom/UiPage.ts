/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UiPage } from '../../models/UiPage';


/**
 * Api services for the `UiPage` model.
 */
@Injectable()
export class UiPageApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  models, auth, errorHandler);
  }

  /**
   * KPI Report頁面表格數據查詢
   *
   * @param {object} data Request data.
   *
   *  - `plant` – `{string}` - 
   *
   *  - `bu` – `{string}` - 
   *
   *  - `custom` – `{string}` - 
   *
   *  - `modelType` – `{any}` - 
   *
   *  - `standard` – `{string}` - 
   *
   *  - `proCodeId` – `{any}` - 
   *
   *  - `proNameId` – `{any}` - 
   *
   *  - `models` – `{any}` - 
   *
   *  - `stages` – `{any}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `dataSet` – `{any}` - 
   */
  public KpiDataSet(plant: any = {}, bu: any = {}, custom: any = {}, modelType: any = {}, standard: any = {}, proCodeId: any = {}, proNameId: any = {}, models: any = {}, stages: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/UiPages/KpiDataSet";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof plant !== 'undefined' && plant !== null) _urlParams.plant = plant;
    if (typeof bu !== 'undefined' && bu !== null) _urlParams.bu = bu;
    if (typeof custom !== 'undefined' && custom !== null) _urlParams.custom = custom;
    if (typeof modelType !== 'undefined' && modelType !== null) _urlParams.modelType = modelType;
    if (typeof standard !== 'undefined' && standard !== null) _urlParams.standard = standard;
    if (typeof proCodeId !== 'undefined' && proCodeId !== null) _urlParams.proCodeId = proCodeId;
    if (typeof proNameId !== 'undefined' && proNameId !== null) _urlParams.proNameId = proNameId;
    if (typeof models !== 'undefined' && models !== null) _urlParams.models = models;
    if (typeof stages !== 'undefined' && stages !== null) _urlParams.stages = stages;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `UiPage`.
   */
  public getModelName() {
    return "UiPage";
  }
}
