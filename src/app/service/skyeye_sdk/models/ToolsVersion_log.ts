/* tslint:disable */

declare var Object: any;
export interface ToolsVersion_logInterface {
  "id"?: number;
  "toolsVersionId": number;
  "site": string;
  "plant": string;
  "modelname": string;
  "stationtype": string;
  "monumber"?: string;
  "groupId"?: string;
  "updatedUser"?: string;
  "updatedTime"?: string;
  "actions"?: string;
}

export class ToolsVersion_log implements ToolsVersion_logInterface {
  "id": number;
  "toolsVersionId": number;
  "site": string;
  "plant": string;
  "modelname": string;
  "stationtype": string;
  "monumber": string;
  "groupId": string;
  "updatedUser": string;
  "updatedTime": string;
  "actions": string;
  constructor(data?: ToolsVersion_logInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ToolsVersion_log`.
   */
  public static getModelName() {
    return "ToolsVersion_log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ToolsVersion_log for dynamic purposes.
  **/
  public static factory(data: ToolsVersion_logInterface): ToolsVersion_log{
    return new ToolsVersion_log(data);
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
      name: 'ToolsVersion_log',
      plural: 'ToolsVersion_logs',
      path: 'ToolsVersion_logs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "toolsVersionId": {
          name: 'toolsVersionId',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "modelname": {
          name: 'modelname',
          type: 'string'
        },
        "stationtype": {
          name: 'stationtype',
          type: 'string'
        },
        "monumber": {
          name: 'monumber',
          type: 'string'
        },
        "groupId": {
          name: 'groupId',
          type: 'string'
        },
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'string'
        },
        "actions": {
          name: 'actions',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
