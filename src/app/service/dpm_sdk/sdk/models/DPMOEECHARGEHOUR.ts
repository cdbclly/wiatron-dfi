/* tslint:disable */

declare var Object: any;
export interface DPMOEECHARGEHOURInterface {
  "id"?: number;
  "syncdate"?: Date;
  "plant"?: string;
  "shift"?: string;
  "line"?: string;
  "shifttype"?: string;
  "shiftdate"?: string;
  "upn"?: string;
  "stophour"?: number;
  "idlehands"?: string;
  "model"?: number;
  "bu"?: number;
  "code"?: number;
  "codedescription"?: number;
  "action"?: number;
  "position"?: number;
  "totalstoptime"?: number;
  "oeetype"?: number;
  "oeelosstype"?: number;
  "oeelosssubtype"?: number;
}

export class DPMOEECHARGEHOUR implements DPMOEECHARGEHOURInterface {
  "id": number;
  "syncdate": Date;
  "plant": string;
  "shift": string;
  "line": string;
  "shifttype": string;
  "shiftdate": string;
  "upn": string;
  "stophour": number;
  "idlehands": string;
  "model": number;
  "bu": number;
  "code": number;
  "codedescription": number;
  "action": number;
  "position": number;
  "totalstoptime": number;
  "oeetype": number;
  "oeelosstype": number;
  "oeelosssubtype": number;
  constructor(data?: DPMOEECHARGEHOURInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOEECHARGEHOUR`.
   */
  public static getModelName() {
    return "DPMOEECHARGEHOUR";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOEECHARGEHOUR for dynamic purposes.
  **/
  public static factory(data: DPMOEECHARGEHOURInterface): DPMOEECHARGEHOUR{
    return new DPMOEECHARGEHOUR(data);
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
      name: 'DPMOEECHARGEHOUR',
      plural: 'dpmoeechargehour',
      path: 'dpmoeechargehour',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "shift": {
          name: 'shift',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "shifttype": {
          name: 'shifttype',
          type: 'string'
        },
        "shiftdate": {
          name: 'shiftdate',
          type: 'string'
        },
        "upn": {
          name: 'upn',
          type: 'string'
        },
        "stophour": {
          name: 'stophour',
          type: 'number'
        },
        "idlehands": {
          name: 'idlehands',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'number'
        },
        "bu": {
          name: 'bu',
          type: 'number'
        },
        "code": {
          name: 'code',
          type: 'number'
        },
        "codedescription": {
          name: 'codedescription',
          type: 'number'
        },
        "action": {
          name: 'action',
          type: 'number'
        },
        "position": {
          name: 'position',
          type: 'number'
        },
        "totalstoptime": {
          name: 'totalstoptime',
          type: 'number'
        },
        "oeetype": {
          name: 'oeetype',
          type: 'number'
        },
        "oeelosstype": {
          name: 'oeelosstype',
          type: 'number'
        },
        "oeelosssubtype": {
          name: 'oeelosssubtype',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
