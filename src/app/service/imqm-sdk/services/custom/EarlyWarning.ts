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
import { EarlyWarning } from '../../models/EarlyWarning';


/**
 * Api services for the `EarlyWarning` model.
 */
@Injectable()
export class EarlyWarningApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  models, auth, errorHandler);
  }

  /**
   * 撈取預警的list
   *
   * @param {object} selectObject 
   *
   * @param {number} startTime 
   *
   * @param {number} endTime 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getList(selectObject: any = {}, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/getList";
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
   * 讀取CPK/SPC並修改流水號寫入DB
   *
   * @param {object} data Request data.
   *
   *  - `earlywarnData` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public postData(earlywarnData: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/postData";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof earlywarnData !== 'undefined' && earlywarnData !== null) _urlParams.earlywarnData = earlywarnData;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 拿單號獲取資料
   *
   * @param {string} number 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public get(number: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/get";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof number !== 'undefined' && number !== null) _urlParams.number = number;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 對搜尋類型(廠商.機種.料號)分類
   *
   * @param {string} queryType 
   *
   * @param {object} selectObject 
   *
   * @param {number} startTime 
   *
   * @param {number} endTime 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getListByGroup(queryType: any, selectObject: any = {}, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/getListByGroup";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof queryType !== 'undefined' && queryType !== null) _urlParams.queryType = queryType;
    if (typeof selectObject !== 'undefined' && selectObject !== null) _urlParams.selectObject = selectObject;
    if (typeof startTime !== 'undefined' && startTime !== null) _urlParams.startTime = startTime;
    if (typeof endTime !== 'undefined' && endTime !== null) _urlParams.endTime = endTime;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * reject預警單號
   *
   * @param {object} data Request data.
   *
   *  - `number` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public rejectEarlywarning(number: any, customHeaders?: Function): Observable<any> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/rejectEarlywarning";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof number !== 'undefined' && number !== null) _urlParams.number = number;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * closed異常單號
   *
   * @param {object} data Request data.
   *
   *  - `number` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public closedEarlywarning(number: any, customHeaders?: Function): Observable<any> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/closedEarlywarning";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof number !== 'undefined' && number !== null) _urlParams.number = number;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 更新原因及對策
   *
   * @param {object} data Request data.
   *
   *  - `number` – `{string}` - 
   *
   *  - `reason` – `{string}` - 
   *
   *  - `countermeasures` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public upsertReasonAndCountermeasures(number: any, reason: any = {}, countermeasures: any = {}, customHeaders?: Function): Observable<EarlyWarning> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/EarlyWarnings/upsertReasonAndCountermeasures";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof number !== 'undefined' && number !== null) _urlParams.number = number;
    if (typeof reason !== 'undefined' && reason !== null) _urlParams.reason = reason;
    if (typeof countermeasures !== 'undefined' && countermeasures !== null) _urlParams.countermeasures = countermeasures;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result.pipe(map((instance: EarlyWarning) => new EarlyWarning(instance)));
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `EarlyWarning`.
   */
  public getModelName() {
    return "EarlyWarning";
  }
}
