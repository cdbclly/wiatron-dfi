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
import { YieldRate } from '../../models/YieldRate';


/**
 * Api services for the `YieldRate` model.
 */
@Injectable()
export class YieldRateApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  models, auth, errorHandler);
  }

  /**
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `YieldRate` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id YieldRate id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `YieldRate` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 取得group後的資料，時間格式要補到13位
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
   *  - `result` – `{object}` - 
   */
  public getTop10(type: any, selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getTop10";
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
   * 材料成品不良分析
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
  public getFailureAnalysis(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getFailureAnalysis";
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
   * 取得每日趨勢圖圖表資料
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
   *  - `result` – `{object}` - 
   */
  public getDayTrendYR(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getDayTrendYR";
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
   * 取得每月趨勢圖圖表資料
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
   *  - `result` – `{object}` - 
   */
  public getMonthTrend(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getMonthTrend";
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
   * 取得iMQM total的input總數，時間格式要補到13位
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
   *  - `result` – `{object}` - 
   */
  public getInputTotal(type: any, selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getInputTotal";
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
   * 測試新增es
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public postEs(customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/postEs";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 確認是否有Count
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public checkCreateVendorIndex(customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/checkCreateVendorIndex";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * 取得iMQM rawdata数据
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
   *  - `result` – `{object}` - 
   */
  public getRawdataList(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getRawdataList";
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
   * 取得良率每月趨勢圖白班 夜班圖表資料
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
   *  - `result` – `{object}` - 
   */
  public getMonthShiftTrend(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getMonthShiftTrend";
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
   * 取得良率每周趨勢圖圖表資料
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
   *  - `result` – `{object}` - 
   */
  public getWeekTrend(selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getWeekTrend";
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
   * 取得group後的資料，時間格式要補到13位
   *
   * @param {string} queryType 
   *
   * @param {string} timeType 
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
   *  - `result` – `{object}` - 
   */
  public getTrendByGroup(queryType: any, timeType: any, selectObject: any, startTime: any, endTime: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/YieldRates/getTrendByGroup";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof queryType !== 'undefined' && queryType !== null) _urlParams.queryType = queryType;
    if (typeof timeType !== 'undefined' && timeType !== null) _urlParams.timeType = timeType;
    if (typeof selectObject !== 'undefined' && selectObject !== null) _urlParams.selectObject = selectObject;
    if (typeof startTime !== 'undefined' && startTime !== null) _urlParams.startTime = startTime;
    if (typeof endTime !== 'undefined' && endTime !== null) _urlParams.endTime = endTime;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `YieldRate`.
   */
  public getModelName() {
    return "YieldRate";
  }
}
