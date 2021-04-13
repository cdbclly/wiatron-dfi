/* tslint:disable */

declare var Object: any;
export interface KPI_logInterface {
  "id"?: number;
  "kpiId": number;
  "name": string;
  "plantId"?: string;
  "stageId"?: string;
  "modelId"?: string;
  "threshold1"?: string;
  "threshold2"?: string;
  "updateUser"?: string;
  "updateTime"?: string;
  "pcs"?: number;
  "upn"?: string;
  "groupId"?: string;
  "upperCpk"?: number;
  "lowerCpk"?: number;
  "actions"?: string;
}

export class KPI_log implements KPI_logInterface {
  "id": number;
  "kpiId": number;
  "name": string;
  "plantId": string;
  "stageId": string;
  "modelId": string;
  "threshold1": string;
  "threshold2": string;
  "updateUser": string;
  "updateTime": string;
  "pcs": number;
  "upn": string;
  "groupId": string;
  "upperCpk": number;
  "lowerCpk": number;
  "actions": string;
  constructor(data?: KPI_logInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `KPI_log`.
   */
  public static getModelName() {
    return "KPI_log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of KPI_log for dynamic purposes.
  **/
  public static factory(data: KPI_logInterface): KPI_log{
    return new KPI_log(data);
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
      name: 'KPI_log',
      plural: 'KPI_logs',
      path: 'KPI_logs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "kpiId": {
          name: 'kpiId',
          type: 'number'
        },
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
        "updateUser": {
          name: 'updateUser',
          type: 'string'
        },
        "updateTime": {
          name: 'updateTime',
          type: 'string'
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
