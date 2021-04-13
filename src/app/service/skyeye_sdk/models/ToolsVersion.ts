/* tslint:disable */
import {
  ToolsVersion_log
} from '../index';

declare var Object: any;
export interface ToolsVersionInterface {
  "site": string;
  "plant": string;
  "modelname": string;
  "stationtype": string;
  "monumber"?: string;
  "groupId"?: string;
  "updatedUser"?: string;
  "createdTime"?: number;
  "updatedTime"?: number;
  "id"?: number;
  ToolsVersionLogs?: ToolsVersion_log[];
}

export class ToolsVersion implements ToolsVersionInterface {
  "site": string;
  "plant": string;
  "modelname": string;
  "stationtype": string;
  "monumber": string;
  "groupId": string;
  "updatedUser": string;
  "createdTime": number;
  "updatedTime": number;
  "id": number;
  ToolsVersionLogs: ToolsVersion_log[];
  constructor(data?: ToolsVersionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ToolsVersion`.
   */
  public static getModelName() {
    return "ToolsVersion";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ToolsVersion for dynamic purposes.
  **/
  public static factory(data: ToolsVersionInterface): ToolsVersion{
    return new ToolsVersion(data);
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
      name: 'ToolsVersion',
      plural: 'ToolsVersions',
      path: 'ToolsVersions',
      idName: 'id',
      properties: {
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
        "createdTime": {
          name: 'createdTime',
          type: 'number'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        ToolsVersionLogs: {
          name: 'ToolsVersionLogs',
          type: 'ToolsVersion_log[]',
          model: 'ToolsVersion_log',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'toolsVersionId'
        },
      }
    }
  }
}
