/* tslint:disable */
import {
  CheckListLog
} from '../index';

declare var Object: any;
export interface View_ModelResultInterface {
  "id"?: number;
  "workflowId"?: number;
  "businessGroup"?: string;
  "businessUnit"?: string;
  "site"?: string;
  "plant"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "model"?: string;
  "stage"?: string;
  "customer"?: string;
  "product"?: string;
  "projectCreatedOn"?: Date;
  "exitDueDate"?: Date;
  "status"?: number;
  "signStatus"?: number;
  "exitMeetingId"?: string;
  "updatedOn"?: Date;
  checklist?: CheckListLog[];
}

export class View_ModelResult implements View_ModelResultInterface {
  "id": number;
  "workflowId": number;
  "businessGroup": string;
  "businessUnit": string;
  "site": string;
  "plant": string;
  "projectCode": string;
  "projectName": string;
  "model": string;
  "stage": string;
  "customer": string;
  "product": string;
  "projectCreatedOn": Date;
  "exitDueDate": Date;
  "status": number;
  "signStatus": number;
  "exitMeetingId": string;
  "updatedOn": Date;
  checklist: CheckListLog[];
  constructor(data?: View_ModelResultInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelResult`.
   */
  public static getModelName() {
    return "View_ModelResult";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelResult for dynamic purposes.
  **/
  public static factory(data: View_ModelResultInterface): View_ModelResult{
    return new View_ModelResult(data);
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
      name: 'View_ModelResult',
      plural: 'View_ModelResults',
      path: 'View_ModelResults',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "businessGroup": {
          name: 'businessGroup',
          type: 'string'
        },
        "businessUnit": {
          name: 'businessUnit',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "projectCreatedOn": {
          name: 'projectCreatedOn',
          type: 'Date'
        },
        "exitDueDate": {
          name: 'exitDueDate',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "signStatus": {
          name: 'signStatus',
          type: 'number'
        },
        "exitMeetingId": {
          name: 'exitMeetingId',
          type: 'string'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
      },
      relations: {
        checklist: {
          name: 'checklist',
          type: 'CheckListLog[]',
          model: 'CheckListLog',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'exitMeetingResultId'
        },
      }
    }
  }
}
