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
import { DRate } from '../../models/DRate';


/**
 * Api services for the `DRate` model.
 */
@Injectable()
export class DRateApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  models, auth, errorHandler);
  }

  /**
   * 觸發追蹤資料
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{any}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{boolean}` - 
   */
  public setTrackBackData(data: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/dRates/setTrackBackData";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof data !== 'undefined' && data !== null) _urlParams.data = data;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * D/R Top10
   *
   * @param {string} type 
   *
   * @param {object} selectObject 
   *
   * @param {number} startTime 時間格式要補到13位
   *
   * @param {number} endTime 時間格式要補到13位
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{boolean}` - 
   */
  public getTop10(type: any, selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/dRates/getTop10";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof type !== 'undefined' && type !== null) _urlParams.type = type;
    if (typeof selectObject !== 'undefined' && selectObject !== null) _urlParams.selectObject = selectObject;
    if (typeof startTime !== 'undefined' && startTime !== null) _urlParams.startTime = startTime;
    if (typeof endTime !== 'undefined' && endTime !== null) _urlParams.endTime = endTime;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * D/R 取得每月趨勢圖圖表資料
   *
   * @param {object} selectObject 
   *
   * @param {number} startTime 時間格式要補到13位
   *
   * @param {number} endTime 時間格式要補到13位
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{boolean}` - 
   */
  public getMonthTrend(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/dRates/getMonthTrend";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof selectObject !== 'undefined' && selectObject !== null) _urlParams.selectObject = selectObject;
    if (typeof startTime !== 'undefined' && startTime !== null) _urlParams.startTime = startTime;
    if (typeof endTime !== 'undefined' && endTime !== null) _urlParams.endTime = endTime;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `DRate`.
   */
  public getModelName() {
    return "DRate";
  }
}
