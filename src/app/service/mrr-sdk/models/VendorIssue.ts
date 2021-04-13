/* tslint:disable */
import {
  VendorRecord
} from '../index';

declare var Object: any;
export interface VendorIssueInterface {
  "id"?: number;
  "vendorRecordId": number;
  "issue"?: string;
  "defectQty"?: number;
  "input"?: number;
  "rootcause"?: string;
  "action"?: string;
  "owner"?: string;
  "dueDate"?: Date;
  "status"?: number;
  "filePath"?: string;
  vendorRecord?: VendorRecord;
}

export class VendorIssue implements VendorIssueInterface {
  "id": number;
  "vendorRecordId": number;
  "issue": string;
  "defectQty": number;
  "input": number;
  "rootcause": string;
  "action": string;
  "owner": string;
  "dueDate": Date;
  "status": number;
  "filePath": string;
  vendorRecord: VendorRecord;
  constructor(data?: VendorIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorIssue`.
   */
  public static getModelName() {
    return "VendorIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorIssue for dynamic purposes.
  **/
  public static factory(data: VendorIssueInterface): VendorIssue{
    return new VendorIssue(data);
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
      name: 'VendorIssue',
      plural: 'VendorIssues',
      path: 'VendorIssues',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "vendorRecordId": {
          name: 'vendorRecordId',
          type: 'number'
        },
        "issue": {
          name: 'issue',
          type: 'string'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "input": {
          name: 'input',
          type: 'number'
        },
        "rootcause": {
          name: 'rootcause',
          type: 'string'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "filePath": {
          name: 'filePath',
          type: 'string'
        },
      },
      relations: {
        vendorRecord: {
          name: 'vendorRecord',
          type: 'VendorRecord',
          model: 'VendorRecord',
          relationType: 'belongsTo',
                  keyFrom: 'vendorRecordId',
          keyTo: 'id'
        },
      }
    }
  }
}
