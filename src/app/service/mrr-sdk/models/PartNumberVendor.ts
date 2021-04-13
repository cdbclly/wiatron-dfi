/* tslint:disable */
import {
  PartNumber,
  Manufacturer,
  Vendor,
  PartNumberVendorOperation,
  PartNumberVendorRecord,
  SqmsIqcRecord
} from '../index';

declare var Object: any;
export interface PartNumberVendorInterface {
  "id"?: number;
  "partNumberId": string;
  "vendorId": string;
  "manufacturerId": string;
  "projectPartNumberId"?: number;
  "failDesc"?: string;
  "approveValidation"?: string;
  "createDate"?: Date;
  "createBy"?: string;
  "updateDate"?: Date;
  "updateBy"?: string;
  "containerName"?: string;
  "lastMailSentDate"?: Date;
  partNumber?: PartNumber;
  manufacturer?: Manufacturer;
  vendor?: Vendor;
  partNumberVendorOperations?: PartNumberVendorOperation[];
  partNumberVendorRecords?: PartNumberVendorRecord[];
  sqmsIqcRecords?: SqmsIqcRecord[];
}

export class PartNumberVendor implements PartNumberVendorInterface {
  "id": number;
  "partNumberId": string;
  "vendorId": string;
  "manufacturerId": string;
  "projectPartNumberId": number;
  "failDesc": string;
  "approveValidation": string;
  "createDate": Date;
  "createBy": string;
  "updateDate": Date;
  "updateBy": string;
  "containerName": string;
  "lastMailSentDate": Date;
  partNumber: PartNumber;
  manufacturer: Manufacturer;
  vendor: Vendor;
  partNumberVendorOperations: PartNumberVendorOperation[];
  partNumberVendorRecords: PartNumberVendorRecord[];
  sqmsIqcRecords: SqmsIqcRecord[];
  constructor(data?: PartNumberVendorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendor`.
   */
  public static getModelName() {
    return "PartNumberVendor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumberVendor for dynamic purposes.
  **/
  public static factory(data: PartNumberVendorInterface): PartNumberVendor{
    return new PartNumberVendor(data);
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
      name: 'PartNumberVendor',
      plural: 'PartNumberVendors',
      path: 'PartNumberVendors',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "partNumberId": {
          name: 'partNumberId',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "projectPartNumberId": {
          name: 'projectPartNumberId',
          type: 'number'
        },
        "failDesc": {
          name: 'failDesc',
          type: 'string'
        },
        "approveValidation": {
          name: 'approveValidation',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "containerName": {
          name: 'containerName',
          type: 'string'
        },
        "lastMailSentDate": {
          name: 'lastMailSentDate',
          type: 'Date'
        },
      },
      relations: {
        partNumber: {
          name: 'partNumber',
          type: 'PartNumber',
          model: 'PartNumber',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberId',
          keyTo: 'id'
        },
        manufacturer: {
          name: 'manufacturer',
          type: 'Manufacturer',
          model: 'Manufacturer',
          relationType: 'belongsTo',
                  keyFrom: 'manufacturerId',
          keyTo: 'id'
        },
        vendor: {
          name: 'vendor',
          type: 'Vendor',
          model: 'Vendor',
          relationType: 'belongsTo',
                  keyFrom: 'vendorId',
          keyTo: 'id'
        },
        partNumberVendorOperations: {
          name: 'partNumberVendorOperations',
          type: 'PartNumberVendorOperation[]',
          model: 'PartNumberVendorOperation',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorId'
        },
        partNumberVendorRecords: {
          name: 'partNumberVendorRecords',
          type: 'PartNumberVendorRecord[]',
          model: 'PartNumberVendorRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorId'
        },
        sqmsIqcRecords: {
          name: 'sqmsIqcRecords',
          type: 'SqmsIqcRecord[]',
          model: 'SqmsIqcRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorId'
        },
      }
    }
  }
}
