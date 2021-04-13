/* tslint:disable */
import {
  PartNumberVendorRecord,
  PartNumberVendorOperation,
  VendorIssue
} from '../index';

declare var Object: any;
export interface VendorRecordInterface {
  "partNumberVendorRecordId"?: number;
  "partNumberVendorOperationId"?: number;
  "id"?: number;
  "input"?: number;
  "output"?: number;
  "remark"?: string;
  partNumberVendorRecord?: PartNumberVendorRecord;
  partNumberVendorOperation?: PartNumberVendorOperation;
  vendorIssues?: VendorIssue[];
}

export class VendorRecord implements VendorRecordInterface {
  "partNumberVendorRecordId": number;
  "partNumberVendorOperationId": number;
  "id": number;
  "input": number;
  "output": number;
  "remark": string;
  partNumberVendorRecord: PartNumberVendorRecord;
  partNumberVendorOperation: PartNumberVendorOperation;
  vendorIssues: VendorIssue[];
  constructor(data?: VendorRecordInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorRecord`.
   */
  public static getModelName() {
    return "VendorRecord";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorRecord for dynamic purposes.
  **/
  public static factory(data: VendorRecordInterface): VendorRecord{
    return new VendorRecord(data);
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
      name: 'VendorRecord',
      plural: 'VendorRecords',
      path: 'VendorRecords',
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
        "input": {
          name: 'input',
          type: 'number'
        },
        "output": {
          name: 'output',
          type: 'number'
        },
        "remark": {
          name: 'remark',
          type: 'string'
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
        vendorIssues: {
          name: 'vendorIssues',
          type: 'VendorIssue[]',
          model: 'VendorIssue',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'vendorRecordId'
        },
      }
    }
  }
}
