/* tslint:disable */
// import {
//   Fact
// } from '../index';

import { Fact } from "@service/mrr-sdk";

declare var Object: any;
export interface View_ModelResultInterface {
  "site"?: string;
  "project"?: string;
  "rfqProjectId"?: string;
  "dueDate"?: Date;
  "product"?: string;
  "model"?: string;
  "status"?: number;
  "businessGroup"?: string;
  "businessUnit"?: string;
  "customer"?: string;
  "projectCreatedOn"?: Date;
  "id"?: number;
  facts?: Fact[];
}

export class View_ModelResult implements View_ModelResultInterface {
  "site": string;
  "project": string;
  "rfqProjectId": string;
  "dueDate": Date;
  "product": string;
  "model": string;
  "status": number;
  "businessGroup": string;
  "businessUnit": string;
  "customer": string;
  "projectCreatedOn": Date;
  "id": number;
  facts: Fact[];
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
        "site": {
          name: 'site',
          type: 'string'
        },
        "project": {
          name: 'project',
          type: 'string'
        },
        "rfqProjectId": {
          name: 'rfqProjectId',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "status": {
          name: 'status',
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
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "projectCreatedOn": {
          name: 'projectCreatedOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        facts: {
          name: 'facts',
          type: 'Fact[]',
          model: 'Fact',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelResultId'
        },
      }
    }
  }
}
