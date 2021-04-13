/* tslint:disable */

import { ModelResult } from "@service/mrr-sdk";

declare var Object: any;
export interface FactLogInterface {
  "value"?: string;
  "riskLevel"?: number;
  "pointName"?: string;
  "sideName"?: string;
  "dimensionName"?: string;
  "partName"?: string;
  "id"?: number;
  "modelResultId"?: number;
  modelResult?: ModelResult;
}

export class FactLog implements FactLogInterface {
  "value": string;
  "riskLevel": number;
  "pointName": string;
  "sideName": string;
  "dimensionName": string;
  "partName": string;
  "id": number;
  "modelResultId": number;
  modelResult: ModelResult;
  constructor(data?: FactLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactLog`.
   */
  public static getModelName() {
    return "FactLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactLog for dynamic purposes.
  **/
  public static factory(data: FactLogInterface): FactLog{
    return new FactLog(data);
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
      name: 'FactLog',
      plural: 'FactLogs',
      path: 'FactLogs',
      idName: 'id',
      properties: {
        "value": {
          name: 'value',
          type: 'string'
        },
        "riskLevel": {
          name: 'riskLevel',
          type: 'number'
        },
        "pointName": {
          name: 'pointName',
          type: 'string'
        },
        "sideName": {
          name: 'sideName',
          type: 'string'
        },
        "dimensionName": {
          name: 'dimensionName',
          type: 'string'
        },
        "partName": {
          name: 'partName',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelResultId": {
          name: 'modelResultId',
          type: 'number'
        },
      },
      relations: {
        modelResult: {
          name: 'modelResult',
          type: 'ModelResult',
          model: 'ModelResult',
          relationType: 'belongsTo',
                  keyFrom: 'modelResultId',
          keyTo: 'id'
        },
      }
    }
  }
}
