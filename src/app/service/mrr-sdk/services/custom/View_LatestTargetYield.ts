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
import { View_LatestTargetYield } from '../../models/View_LatestTargetYield';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `View_LatestTargetYield` model.
 */
@Injectable()
export class View_LatestTargetYieldApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
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
   * This usually means the response is a `View_LatestTargetYield` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/View_LatestTargetYields";
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
   * @param {any} id View_LatestTargetYield id
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
   * This usually means the response is a `View_LatestTargetYield` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/View_LatestTargetYields/:id";
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
   * getLastTargetYieldExt (result filtered by ExternalUser)
   *
   * @param {string} plant 
   *
   * @param {string} customer 
   *
   * @param {string} product 
   *
   * @param {string} manufacturer 
   *
   * @param {string} vendorCode 
   *
   * @param {string} partNumber 
   *
   * @param {string} stage 
   *
   * @param {string} projectCode 
   *
   * @param {string} projectName 
   *
   * @param {object} options 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `View_LatestTargetYield` object.)
   * </em>
   */
  public getLastTargetYieldExt(plant: any = {}, customer: any = {}, product: any = {}, manufacturer: any = {}, vendorCode: any = {}, partNumber: any = {}, stage: any = {}, projectCode: any = {}, projectName: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/View_LatestTargetYields/getLastTargetYieldExt";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof plant !== 'undefined' && plant !== null) _urlParams.plant = plant;
    if (typeof customer !== 'undefined' && customer !== null) _urlParams.customer = customer;
    if (typeof product !== 'undefined' && product !== null) _urlParams.product = product;
    if (typeof manufacturer !== 'undefined' && manufacturer !== null) _urlParams.manufacturer = manufacturer;
    if (typeof vendorCode !== 'undefined' && vendorCode !== null) _urlParams.vendorCode = vendorCode;
    if (typeof partNumber !== 'undefined' && partNumber !== null) _urlParams.partNumber = partNumber;
    if (typeof stage !== 'undefined' && stage !== null) _urlParams.stage = stage;
    if (typeof projectCode !== 'undefined' && projectCode !== null) _urlParams.projectCode = projectCode;
    if (typeof projectName !== 'undefined' && projectName !== null) _urlParams.projectName = projectName;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `View_LatestTargetYield`.
   */
  public getModelName() {
    return "View_LatestTargetYield";
  }
}
