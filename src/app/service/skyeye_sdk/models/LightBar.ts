/* tslint:disable */
import {
  LightBar_Log
} from '../index';

declare var Object: any;
export interface LightBarInterface {
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
  "createdTime"?: number;
  "id"?: number;
  lightBarLogs?: LightBar_Log[];
}

export class LightBar implements LightBarInterface {
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
  "createdTime": number;
  "id": number;
  lightBarLogs: LightBar_Log[];
  constructor(data?: LightBarInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LightBar`.
   */
  public static getModelName() {
    return "LightBar";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LightBar for dynamic purposes.
  **/
  public static factory(data: LightBarInterface): LightBar{
    return new LightBar(data);
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
      name: 'LightBar',
      plural: 'LightBars',
      path: 'LightBars',
      idName: 'id',
      properties: {
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
        "createdTime": {
          name: 'createdTime',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        lightBarLogs: {
          name: 'lightBarLogs',
          type: 'LightBar_Log[]',
          model: 'LightBar_Log',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'lightBarId'
        },
      }
    }
  }
}
