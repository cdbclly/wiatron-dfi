/* tslint:disable */
import {
  PartNumberVendor
} from '../index';

declare var Object: any;
export interface SqmsIqcRecordInterface {
  "plantId": string;
  "partNumberVendorId": number;
  "dateCode"?: Date;
  "id"?: number;
  "lotQty"?: number;
  "sampleQty"?: number;
  "defectQty"?: number;
  "resultPass"?: number;
  "updatedOn"?: Date;
  partNumberVendor?: PartNumberVendor;
}

export class SqmsIqcRecord implements SqmsIqcRecordInterface {
  "plantId": string;
  "partNumberVendorId": number;
  "dateCode": Date;
  "id": number;
  "lotQty": number;
  "sampleQty": number;
  "defectQty": number;
  "resultPass": number;
  "updatedOn": Date;
  partNumberVendor: PartNumberVendor;
  constructor(data?: SqmsIqcRecordInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SqmsIqcRecord`.
   */
  public static getModelName() {
    return "SqmsIqcRecord";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SqmsIqcRecord for dynamic purposes.
  **/
  public static factory(data: SqmsIqcRecordInterface): SqmsIqcRecord{
    return new SqmsIqcRecord(data);
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
      name: 'SqmsIqcRecord',
      plural: 'SqmsIqcRecords',
      path: 'SqmsIqcRecords',
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
        "lotQty": {
          name: 'lotQty',
          type: 'number'
        },
        "sampleQty": {
          name: 'sampleQty',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "resultPass": {
          name: 'resultPass',
          type: 'number'
        },
        "updatedOn": {
          name: 'updatedOn',
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
      }
    }
  }
}
