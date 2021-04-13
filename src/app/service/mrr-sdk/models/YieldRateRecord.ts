/* tslint:disable */
import {
  PartNumberVendorRecord,
  PartNumberVendorOperation,
  SqmTargetYield,
  VendorTargetYield
} from '../index';

declare var Object: any;
export interface YieldRateRecordInterface {
  "partNumberVendorRecordId": number;
  "partNumberVendorOperationId": number;
  "id"?: number;
  "sqmTargetYieldId"?: number;
  "vendorTargetYieldId"?: number;
  partNumberVendorRecord?: PartNumberVendorRecord;
  partNumberVendorOperation?: PartNumberVendorOperation;
  sqmTargetYield?: SqmTargetYield;
  vendorTargetYield?: VendorTargetYield;
}

export class YieldRateRecord implements YieldRateRecordInterface {
  "partNumberVendorRecordId": number;
  "partNumberVendorOperationId": number;
  "id": number;
  "sqmTargetYieldId": number;
  "vendorTargetYieldId": number;
  partNumberVendorRecord: PartNumberVendorRecord;
  partNumberVendorOperation: PartNumberVendorOperation;
  sqmTargetYield: SqmTargetYield;
  vendorTargetYield: VendorTargetYield;
  constructor(data?: YieldRateRecordInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `YieldRateRecord`.
   */
  public static getModelName() {
    return "YieldRateRecord";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of YieldRateRecord for dynamic purposes.
  **/
  public static factory(data: YieldRateRecordInterface): YieldRateRecord{
    return new YieldRateRecord(data);
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
      name: 'YieldRateRecord',
      plural: 'YieldRateRecords',
      path: 'YieldRateRecords',
      idName: 'id',
      properties: {
        "partNumberVendorRecordId": {
          name: 'partNumberVendorRecordId',
          type: 'number'
        },
        "partNumberVendorOperationId": {
          name: 'partNumberVendorOperationId',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "sqmTargetYieldId": {
          name: 'sqmTargetYieldId',
          type: 'number'
        },
        "vendorTargetYieldId": {
          name: 'vendorTargetYieldId',
          type: 'number'
        },
      },
      relations: {
        partNumberVendorRecord: {
          name: 'partNumberVendorRecord',
          type: 'PartNumberVendorRecord',
          model: 'PartNumberVendorRecord',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberVendorRecordId',
          keyTo: 'id'
        },
        partNumberVendorOperation: {
          name: 'partNumberVendorOperation',
          type: 'PartNumberVendorOperation',
          model: 'PartNumberVendorOperation',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberVendorOperationId',
          keyTo: 'id'
        },
        sqmTargetYield: {
          name: 'sqmTargetYield',
          type: 'SqmTargetYield',
          model: 'SqmTargetYield',
          relationType: 'belongsTo',
                  keyFrom: 'sqmTargetYieldId',
          keyTo: 'id'
        },
        vendorTargetYield: {
          name: 'vendorTargetYield',
          type: 'VendorTargetYield',
          model: 'VendorTargetYield',
          relationType: 'belongsTo',
                  keyFrom: 'vendorTargetYieldId',
          keyTo: 'id'
        },
      }
    }
  }
}
