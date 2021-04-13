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
import { PartNumberVendor } from '../../models/PartNumberVendor';
import { SocketConnection } from '../../sockets/socket.connections';
import { PartNumber } from '../../models/PartNumber';
import { Manufacturer } from '../../models/Manufacturer';
import { Vendor } from '../../models/Vendor';
import { PartNumberVendorOperation } from '../../models/PartNumberVendorOperation';
import { PartNumberVendorRecord } from '../../models/PartNumberVendorRecord';
import { SqmsIqcRecord } from '../../models/SqmsIqcRecord';


/**
 * Api services for the `PartNumberVendor` model.
 */
@Injectable()
export class PartNumberVendorApi extends BaseLoopBackApi {

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
   * Fetches belongsTo relation partNumber.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getPartNumber(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumber";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation manufacturer.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getManufacturer(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/manufacturer";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation vendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getVendor(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/vendor";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Find a related item by id for partNumberVendorOperations.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorOperations
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public findByIdPartNumberVendorOperations(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Delete a related item by id for partNumberVendorOperations.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorOperations
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public destroyByIdPartNumberVendorOperations(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Update a related item by id for partNumberVendorOperations.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorOperations
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public updateByIdPartNumberVendorOperations(id: any, fk: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Find a related item by id for partNumberVendorRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorRecords
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public findByIdPartNumberVendorRecords(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Delete a related item by id for partNumberVendorRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorRecords
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public destroyByIdPartNumberVendorRecords(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Update a related item by id for partNumberVendorRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for partNumberVendorRecords
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public updateByIdPartNumberVendorRecords(id: any, fk: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Find a related item by id for sqmsIqcRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for sqmsIqcRecords
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public findByIdSqmsIqcRecords(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Delete a related item by id for sqmsIqcRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for sqmsIqcRecords
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public destroyByIdSqmsIqcRecords(id: any, fk: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Update a related item by id for sqmsIqcRecords.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {any} fk Foreign key for sqmsIqcRecords
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public updateByIdSqmsIqcRecords(id: any, fk: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PUT";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Queries partNumberVendorOperations of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} filter 
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getPartNumberVendorOperations(id: any, filter: LoopBackFilter = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filter !== 'undefined' && filter !== null) _urlParams.filter = filter;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Creates a new instance in partNumberVendorOperations of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createPartNumberVendorOperations(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations";
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
   * Deletes all partNumberVendorOperations of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public deletePartNumberVendorOperations(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Counts partNumberVendorOperations of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} where Criteria to match model instances
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public countPartNumberVendorOperations(id: any, where: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations/count";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof where !== 'undefined' && where !== null) _urlParams.where = where;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Queries partNumberVendorRecords of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} filter 
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getPartNumberVendorRecords(id: any, filter: LoopBackFilter = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filter !== 'undefined' && filter !== null) _urlParams.filter = filter;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Creates a new instance in partNumberVendorRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createPartNumberVendorRecords(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords";
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
   * Deletes all partNumberVendorRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public deletePartNumberVendorRecords(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Counts partNumberVendorRecords of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} where Criteria to match model instances
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public countPartNumberVendorRecords(id: any, where: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords/count";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof where !== 'undefined' && where !== null) _urlParams.where = where;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Queries sqmsIqcRecords of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} filter 
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getSqmsIqcRecords(id: any, filter: LoopBackFilter = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filter !== 'undefined' && filter !== null) _urlParams.filter = filter;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Creates a new instance in sqmsIqcRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createSqmsIqcRecords(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords";
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
   * Deletes all sqmsIqcRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public deleteSqmsIqcRecords(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Counts sqmsIqcRecords of PartNumberVendor.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} where Criteria to match model instances
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public countSqmsIqcRecords(id: any, where: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords/count";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof where !== 'undefined' && where !== null) _urlParams.where = where;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
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
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors";
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
   * @param {any} id PartNumberVendor id
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
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id";
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
   * patchOrCreateBaseData (PartNumber, Vendor, Manufacturer, ProjectPartNumber, PartNumberVendor)
   *
   * @param {object} data Request data.
   *
   *  - `partNumberId` – `{string}` - 
   *
   *  - `partId` – `{number}` - 
   *
   *  - `vendorId` – `{string}` - 
   *
   *  - `vendorName` – `{string}` - 
   *
   *  - `manufacturerId` – `{string}` - 
   *
   *  - `projectCode` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public patchOrCreateBaseData(partNumberId: any, partId: any = {}, vendorId: any, vendorName: any = {}, manufacturerId: any, projectCode: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/patchOrCreateBaseData";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof partNumberId !== 'undefined' && partNumberId !== null) _urlParams.partNumberId = partNumberId;
    if (typeof partId !== 'undefined' && partId !== null) _urlParams.partId = partId;
    if (typeof vendorId !== 'undefined' && vendorId !== null) _urlParams.vendorId = vendorId;
    if (typeof vendorName !== 'undefined' && vendorName !== null) _urlParams.vendorName = vendorName;
    if (typeof manufacturerId !== 'undefined' && manufacturerId !== null) _urlParams.manufacturerId = manufacturerId;
    if (typeof projectCode !== 'undefined' && projectCode !== null) _urlParams.projectCode = projectCode;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * getLatestOperationList (partNumberVendorId, plantId, stageId, endDate=null)
   *
   * @param {number} partNumberVendorId 
   *
   * @param {string} plantId 
   *
   * @param {string} stageId 
   *
   * @param {date} endDate 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getLatestOperationList(partNumberVendorId: any, plantId: any, stageId: any, endDate: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/getLatestOperationList";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof partNumberVendorId !== 'undefined' && partNumberVendorId !== null) _urlParams.partNumberVendorId = partNumberVendorId;
    if (typeof plantId !== 'undefined' && plantId !== null) _urlParams.plantId = plantId;
    if (typeof stageId !== 'undefined' && stageId !== null) _urlParams.stageId = stageId;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * updateOperationList (partNumberVendorId, plantId, stageId, operationList)
   *
   * @param {object} data Request data.
   *
   *  - `partNumberVendorId` – `{number}` - 
   *
   *  - `plantId` – `{string}` - 
   *
   *  - `stageId` – `{string}` - 
   *
   *  - `operationList` – `{any}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public updateOperationList(partNumberVendorId: any, plantId: any, stageId: any, operationList: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/updateOperationList";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof partNumberVendorId !== 'undefined' && partNumberVendorId !== null) _urlParams.partNumberVendorId = partNumberVendorId;
    if (typeof plantId !== 'undefined' && plantId !== null) _urlParams.plantId = plantId;
    if (typeof stageId !== 'undefined' && stageId !== null) _urlParams.stageId = stageId;
    if (typeof operationList !== 'undefined' && operationList !== null) _urlParams.operationList = operationList;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * getLatestOperationListWithYield (partNumberVendorId, plantId, stageId, endDate=null)
   *
   * @param {number} partNumberVendorId 
   *
   * @param {string} plantId 
   *
   * @param {string} stageId 
   *
   * @param {date} endDate 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public getLatestOperationListWithYield(partNumberVendorId: any, plantId: any, stageId: any, endDate: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/getLatestOperationListWithYield";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof partNumberVendorId !== 'undefined' && partNumberVendorId !== null) _urlParams.partNumberVendorId = partNumberVendorId;
    if (typeof plantId !== 'undefined' && plantId !== null) _urlParams.plantId = plantId;
    if (typeof stageId !== 'undefined' && stageId !== null) _urlParams.stageId = stageId;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * copyOperationList
   *
   * @param {object} data Request data.
   *
   *  - `srcPartNumberVendorId` – `{number}` - 
   *
   *  - `srcPlantId` – `{string}` - 
   *
   *  - `srcStageId` – `{string}` - 
   *
   *  - `dstPartNumberVendorId` – `{number}` - 
   *
   *  - `dstPlantId` – `{string}` - 
   *
   *  - `dstStageId` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public copyOperationList(srcPartNumberVendorId: any, srcPlantId: any, srcStageId: any, dstPartNumberVendorId: any, dstPlantId: any, dstStageId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/copyOperationList";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof srcPartNumberVendorId !== 'undefined' && srcPartNumberVendorId !== null) _urlParams.srcPartNumberVendorId = srcPartNumberVendorId;
    if (typeof srcPlantId !== 'undefined' && srcPlantId !== null) _urlParams.srcPlantId = srcPlantId;
    if (typeof srcStageId !== 'undefined' && srcStageId !== null) _urlParams.srcStageId = srcStageId;
    if (typeof dstPartNumberVendorId !== 'undefined' && dstPartNumberVendorId !== null) _urlParams.dstPartNumberVendorId = dstPartNumberVendorId;
    if (typeof dstPlantId !== 'undefined' && dstPlantId !== null) _urlParams.dstPlantId = dstPlantId;
    if (typeof dstStageId !== 'undefined' && dstStageId !== null) _urlParams.dstStageId = dstStageId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Creates a new instance in partNumberVendorOperations of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createManyPartNumberVendorOperations(id: any, data: any[] = [], customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorOperations";
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
   * Creates a new instance in partNumberVendorRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createManyPartNumberVendorRecords(id: any, data: any[] = [], customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/partNumberVendorRecords";
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
   * Creates a new instance in sqmsIqcRecords of this model.
   *
   * @param {any} id PartNumberVendor id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PartNumberVendor` object.)
   * </em>
   */
  public createManySqmsIqcRecords(id: any, data: any[] = [], customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/PartNumberVendors/:id/sqmsIqcRecords";
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
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendor`.
   */
  public getModelName() {
    return "PartNumberVendor";
  }
}
