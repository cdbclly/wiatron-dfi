/* tslint:disable */

declare var Object: any;
export interface Spc_Maintain_LogInterface {
  "spcId": number;
  "site"?: string;
  "plantId"?: string;
  "machineModel"?: string;
  "model"?: string;
  "stageId"?: string;
  "tdName"?: string;
  "mdName"?: string;
  "updateUser"?: string;
  "updateTime"?: number;
  "initialTime"?: number;
  "action"?: string;
  "id"?: number;
}

export class Spc_Maintain_Log implements Spc_Maintain_LogInterface {
  "spcId": number;
  "site": string;
  "plantId": string;
  "machineModel": string;
  "model": string;
  "stageId": string;
  "tdName": string;
  "mdName": string;
  "updateUser": string;
  "updateTime": number;
  "initialTime": number;
  "action": string;
  "id": number;
  constructor(data?: Spc_Maintain_LogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Spc_Maintain_Log`.
   */
  public static getModelName() {
    return "Spc_Maintain_Log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Spc_Maintain_Log for dynamic purposes.
  **/
  public static factory(data: Spc_Maintain_LogInterface): Spc_Maintain_Log{
    return new Spc_Maintain_Log(data);
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
      name: 'Spc_Maintain_Log',
      plural: 'Spc_Maintain_Logs',
      path: 'Spc_Maintain_Logs',
      idName: 'id',
      properties: {
        "spcId": {
          name: 'spcId',
          type: 'number'
        },
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
        "action": {
          name: 'action',
          type: 'string'
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
