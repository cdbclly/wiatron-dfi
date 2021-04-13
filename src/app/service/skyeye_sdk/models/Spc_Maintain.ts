/* tslint:disable */

declare var Object: any;
export interface Spc_MaintainInterface {
  "site"?: string;
  "plantId"?: string;
  "machineModel"?: string;
  "model"?: string;
  "stageId"?: string;
  "tdName"?: string;
  "mdName"?: string;
  "createTime"?: number;
  "updateUser"?: string;
  "updateTime"?: number;
  "initialTime"?: number;
  "id"?: number;
}

export class Spc_Maintain implements Spc_MaintainInterface {
  "site": string;
  "plantId": string;
  "machineModel": string;
  "model": string;
  "stageId": string;
  "tdName": string;
  "mdName": string;
  "createTime": number;
  "updateUser": string;
  "updateTime": number;
  "initialTime": number;
  "id": number;
  constructor(data?: Spc_MaintainInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Spc_Maintain`.
   */
  public static getModelName() {
    return "Spc_Maintain";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Spc_Maintain for dynamic purposes.
  **/
  public static factory(data: Spc_MaintainInterface): Spc_Maintain{
    return new Spc_Maintain(data);
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
      name: 'Spc_Maintain',
      plural: 'Spc_Maintains',
      path: 'Spc_Maintains',
      idName: 'id',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "machineModel": {
          name: 'machineModel',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "tdName": {
          name: 'tdName',
          type: 'string'
        },
        "mdName": {
          name: 'mdName',
          type: 'string'
        },
        "createTime": {
          name: 'createTime',
          type: 'number'
        },
        "updateUser": {
          name: 'updateUser',
          type: 'string'
        },
        "updateTime": {
          name: 'updateTime',
          type: 'number'
        },
        "initialTime": {
          name: 'initialTime',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
