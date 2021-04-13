/* tslint:disable */
import {
  KPI_log
} from '../index';

declare var Object: any;
export interface KPIInterface {
  "name"?: string;
  "plantId"?: string;
  "stageId"?: string;
  "modelId"?: string;
  "threshold1"?: string;
  "threshold2"?: string;
  "updatedUser"?: string;
  "createdTime"?: number;
  "updatedTime"?: number;
  "pcs"?: number;
  "upn"?: string;
  "groupId"?: string;
  "upperCpk"?: number;
  "lowerCpk"?: number;
  "id"?: number;
  kPILogs?: KPI_log[];
}

export class KPI implements KPIInterface {
  "name": string;
  "plantId": string;
  "stageId": string;
  "modelId": string;
  "threshold1": string;
  "threshold2": string;
  "updatedUser": string;
  "createdTime": number;
  "updatedTime": number;
  "pcs": number;
  "upn": string;
  "groupId": string;
  "upperCpk": number;
  "lowerCpk": number;
  "id": number;
  kPILogs: KPI_log[];
  constructor(data?: KPIInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `KPI`.
   */
  public static getModelName() {
    return "KPI";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of KPI for dynamic purposes.
  **/
  public static factory(data: KPIInterface): KPI{
    return new KPI(data);
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
      name: 'KPI',
      plural: 'KPIs',
      path: 'KPIs',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "threshold1": {
          name: 'threshold1',
          type: 'string'
        },
        "threshold2": {
          name: 'threshold2',
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
        "pcs": {
          name: 'pcs',
          type: 'number'
        },
        "upn": {
          name: 'upn',
          type: 'string'
        },
        "groupId": {
          name: 'groupId',
          type: 'string'
        },
        "upperCpk": {
          name: 'upperCpk',
          type: 'number'
        },
        "lowerCpk": {
          name: 'lowerCpk',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        kPILogs: {
          name: 'kPILogs',
          type: 'KPI_log[]',
          model: 'KPI_log',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'kpiId'
        },
      }
    }
  }
}
