/* tslint:disable */

declare var Object: any;
export interface DPMOEEGROUPTARGETInterface {
  "id"?: number;
  "site"?: string;
  "plant"?: string;
  "kpiid"?: string;
  "type"?: string;
  "group"?: string;
  "shifttype"?: string;
  "period"?: string;
  "periodtype"?: string;
  "oeetype"?: string;
  "target"?: number;
  "uom"?: string;
  "threshold"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
}

export class DPMOEEGROUPTARGET implements DPMOEEGROUPTARGETInterface {
  "id": number;
  "site": string;
  "plant": string;
  "kpiid": string;
  "type": string;
  "group": string;
  "shifttype": string;
  "period": string;
  "periodtype": string;
  "oeetype": string;
  "target": number;
  "uom": string;
  "threshold": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  constructor(data?: DPMOEEGROUPTARGETInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOEEGROUPTARGET`.
   */
  public static getModelName() {
    return "DPMOEEGROUPTARGET";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOEEGROUPTARGET for dynamic purposes.
  **/
  public static factory(data: DPMOEEGROUPTARGETInterface): DPMOEEGROUPTARGET{
    return new DPMOEEGROUPTARGET(data);
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
      name: 'DPMOEEGROUPTARGET',
      plural: 'DPMOEEGROUPTARGET',
      path: 'DPMOEEGROUPTARGET',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "group": {
          name: 'group',
          type: 'string'
        },
        "shifttype": {
          name: 'shifttype',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "periodtype": {
          name: 'periodtype',
          type: 'string'
        },
        "oeetype": {
          name: 'oeetype',
          type: 'string'
        },
        "target": {
          name: 'target',
          type: 'number'
        },
        "uom": {
          name: 'uom',
          type: 'string'
        },
        "threshold": {
          name: 'threshold',
          type: 'number',
          default: 0.95
        },
        "createuser": {
          name: 'createuser',
          type: 'string'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "updateuser": {
          name: 'updateuser',
          type: 'string'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
