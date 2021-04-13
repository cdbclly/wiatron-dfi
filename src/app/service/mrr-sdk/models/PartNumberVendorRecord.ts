/* tslint:disable */
import {
  PartNumberVendor,
  VendorRecord,
  YieldRateRecord
} from '../index';

declare var Object: any;
export interface PartNumberVendorRecordInterface {
  "plantId": string;
  "partNumberVendorId": number;
  "dateCode"?: Date;
  "id"?: number;
  "stageId"?: string;
  "vendorRecordSubmitDate"?: Date;
  "vendorRecordStatus"?: number;
  "createDate"?: Date;
  partNumberVendor?: PartNumberVendor;
  vendorRecords?: VendorRecord[];
  yieldRateRecords?: YieldRateRecord[];
}

export class PartNumberVendorRecord implements PartNumberVendorRecordInterface {
  "plantId": string;
  "partNumberVendorId": number;
  "dateCode": Date;
  "id": number;
  "stageId": string;
  "vendorRecordSubmitDate": Date;
  "vendorRecordStatus": number;
  "createDate": Date;
  partNumberVendor: PartNumberVendor;
  vendorRecords: VendorRecord[];
  yieldRateRecords: YieldRateRecord[];
  constructor(data?: PartNumberVendorRecordInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendorRecord`.
   */
  public static getModelName() {
    return "PartNumberVendorRecord";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumberVendorRecord for dynamic purposes.
  **/
  public static factory(data: PartNumberVendorRecordInterface): PartNumberVendorRecord{
    return new PartNumberVendorRecord(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'PartNumberVendorRecord',
      plural: 'PartNumberVendorRecords',
      path: 'PartNumberVendorRecords',
      idName: 'id',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "dateCode": {
          name: 'dateCode',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "vendorRecordSubmitDate": {
          name: 'vendorRecordSubmitDate',
          type: 'Date'
        },
        "vendorRecordStatus": {
          name: 'vendorRecordStatus',
          type: 'number'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
      },
      relations: {
        partNumberVendor: {
          name: 'partNumberVendor',
          type: 'PartNumberVendor',
          model: 'PartNumberVendor',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberVendorId',
          keyTo: 'id'
        },
        vendorRecords: {
          name: 'vendorRecords',
          type: 'VendorRecord[]',
          model: 'VendorRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorRecordId'
        },
        yieldRateRecords: {
          name: 'yieldRateRecords',
          type: 'YieldRateRecord[]',
          model: 'YieldRateRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorRecordId'
        },
      }
    }
  }
}
