/* tslint:disable */

declare var Object: any;
export interface Wcq_Screw_ParameterInterface {
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
  "createUser"?: string;
  "createTime"?: number;
  "id"?: number;
}

export class Wcq_Screw_Parameter implements Wcq_Screw_ParameterInterface {
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
  "createUser": string;
  "createTime": number;
  "id": number;
  constructor(data?: Wcq_Screw_ParameterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Wcq_Screw_Parameter`.
   */
  public static getModelName() {
    return "Wcq_Screw_Parameter";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Wcq_Screw_Parameter for dynamic purposes.
  **/
  public static factory(data: Wcq_Screw_ParameterInterface): Wcq_Screw_Parameter{
    return new Wcq_Screw_Parameter(data);
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
      name: 'Wcq_Screw_Parameter',
      plural: 'Wcq_Screw_Parameters',
      path: 'Wcq_Screw_Parameters',
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
        "createUser": {
          name: 'createUser',
          type: 'string'
        },
        "createTime": {
          name: 'createTime',
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
