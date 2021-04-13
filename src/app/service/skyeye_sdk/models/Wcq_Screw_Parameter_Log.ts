/* tslint:disable */

declare var Object: any;
export interface Wcq_Screw_Parameter_LogInterface {
  "wcqId"?: number;
  "site"?: string;
  "plantId"?: string;
  "machineSn"?: string;
  "stance"?: string;
  "monitorPro"?: string;
  "model"?: string;
  "maxKgf"?: number;
  "minKgf"?: number;
  "updateUser"?: string;
  "updatedTime"?: number;
  "action"?: string;
  "id"?: number;
}

export class Wcq_Screw_Parameter_Log implements Wcq_Screw_Parameter_LogInterface {
  "wcqId": number;
  "site": string;
  "plantId": string;
  "machineSn": string;
  "stance": string;
  "monitorPro": string;
  "model": string;
  "maxKgf": number;
  "minKgf": number;
  "updateUser": string;
  "updatedTime": number;
  "action": string;
  "id": number;
  constructor(data?: Wcq_Screw_Parameter_LogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Wcq_Screw_Parameter_Log`.
   */
  public static getModelName() {
    return "Wcq_Screw_Parameter_Log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Wcq_Screw_Parameter_Log for dynamic purposes.
  **/
  public static factory(data: Wcq_Screw_Parameter_LogInterface): Wcq_Screw_Parameter_Log{
    return new Wcq_Screw_Parameter_Log(data);
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
      name: 'Wcq_Screw_Parameter_Log',
      plural: 'Wcq_Screw_Parameter_Logs',
      path: 'Wcq_Screw_Parameter_Logs',
      idName: 'id',
      properties: {
        "wcqId": {
          name: 'wcqId',
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
        "machineSn": {
          name: 'machineSn',
          type: 'string'
        },
        "stance": {
          name: 'stance',
          type: 'string'
        },
        "monitorPro": {
          name: 'monitorPro',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "maxKgf": {
          name: 'maxKgf',
          type: 'number'
        },
        "minKgf": {
          name: 'minKgf',
          type: 'number'
        },
        "updateUser": {
          name: 'updateUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
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
