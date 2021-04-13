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
import { MOHAddition } from '../../models/MOHAddition';


/**
 * Api services for the `MOHAddition` model.
 */
@Injectable()
export class MOHAdditionApi extends BaseLoopBackApi {

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
   * This usually means the response is a `MOHAddition` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/MOHAdditions";
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
   * @param {any} id MOHAddition id
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
   * This usually means the response is a `MOHAddition` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/MOHAdditions/:id";
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
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {String} plant 
   *
   * @param {String} bu 
   *
   * @param {String} customer 
   *
   * @param {String} productType 
   *
   * @param {String} projectCode 
   *
   * @param {String} projectName 
   *
   * @param {String} modelName 
   *
   * @param {String} stage 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `MOHAddition` object.)
   * </em>
   */
  public Download(plant: any = {}, bu: any = {}, customer: any = {}, productType: any = {}, projectCode: any = {}, projectName: any = {}, modelName: any = {}, stage: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/MOHAdditions/Download";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof plant !== 'undefined' && plant !== null) _urlParams.plant = plant;
    if (typeof bu !== 'undefined' && bu !== null) _urlParams.bu = bu;
    if (typeof customer !== 'undefined' && customer !== null) _urlParams.customer = customer;
    if (typeof productType !== 'undefined' && productType !== null) _urlParams.productType = productType;
    if (typeof projectCode !== 'undefined' && projectCode !== null) _urlParams.projectCode = projectCode;
    if (typeof projectName !== 'undefined' && projectName !== null) _urlParams.projectName = projectName;
    if (typeof modelName !== 'undefined' && modelName !== null) _urlParams.modelName = modelName;
    if (typeof stage !== 'undefined' && stage !== null) _urlParams.stage = stage;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {String} plant 
   *
   * @param {String} bu 
   *
   * @param {String} customer 
   *
   * @param {String} productType 
   *
   * @param {String} projectCode 
   *
   * @param {String} projectName 
   *
   * @param {String} modelName 
   *
   * @param {String} stage 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `MOHAddition` object.)
   * </em>
   */
  public GetList(plant: any = {}, bu: any = {}, customer: any = {}, productType: any = {}, projectCode: any = {}, projectName: any = {}, modelName: any = {}, stage: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/MOHAdditions/GetList";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof plant !== 'undefined' && plant !== null) _urlParams.plant = plant;
    if (typeof bu !== 'undefined' && bu !== null) _urlParams.bu = bu;
    if (typeof customer !== 'undefined' && customer !== null) _urlParams.customer = customer;
    if (typeof productType !== 'undefined' && productType !== null) _urlParams.productType = productType;
    if (typeof projectCode !== 'undefined' && projectCode !== null) _urlParams.projectCode = projectCode;
    if (typeof projectName !== 'undefined' && projectName !== null) _urlParams.projectName = projectName;
    if (typeof modelName !== 'undefined' && modelName !== null) _urlParams.modelName = modelName;
    if (typeof stage !== 'undefined' && stage !== null) _urlParams.stage = stage;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHAddition`.
   */
  public getModelName() {
    return "MOHAddition";
  }
}
