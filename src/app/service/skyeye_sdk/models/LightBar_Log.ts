/* tslint:disable */

declare var Object: any;
export interface LightBar_LogInterface {
  "id"?: number;
  "lightBarId": number;
  "plantId"?: string;
  "model"?: string;
  "upperLimit"?: number;
  "lowerLimit"?: number;
  "maNumber"?: number;
  "period"?: number;
  "dualWaveJudge"?: number;
  "codeJudge"?: number;
  "spacingValue"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
  "actions"?: string;
}

export class LightBar_Log implements LightBar_LogInterface {
  "id": number;
  "lightBarId": number;
  "plantId": string;
  "model": string;
  "upperLimit": number;
  "lowerLimit": number;
  "maNumber": number;
  "period": number;
  "dualWaveJudge": number;
  "codeJudge": number;
  "spacingValue": number;
  "updatedUser": string;
  "updatedTime": number;
  "actions": string;
  constructor(data?: LightBar_LogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LightBar_Log`.
   */
  public static getModelName() {
    return "LightBar_Log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LightBar_Log for dynamic purposes.
  **/
  public static factory(data: LightBar_LogInterface): LightBar_Log{
    return new LightBar_Log(data);
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
      name: 'LightBar_Log',
      plural: 'LightBar_Logs',
      path: 'LightBar_Logs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "lightBarId": {
          name: 'lightBarId',
          type: 'number'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "upperLimit": {
          name: 'upperLimit',
          type: 'number'
        },
        "lowerLimit": {
          name: 'lowerLimit',
          type: 'number'
        },
        "maNumber": {
          name: 'maNumber',
          type: 'number'
        },
        "period": {
          name: 'period',
          type: 'number'
        },
        "dualWaveJudge": {
          name: 'dualWaveJudge',
          type: 'number'
        },
        "codeJudge": {
          name: 'codeJudge',
          type: 'number'
        },
        "spacingValue": {
          name: 'spacingValue',
          type: 'number'
        },
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
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
