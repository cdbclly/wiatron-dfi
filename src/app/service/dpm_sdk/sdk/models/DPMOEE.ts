/* tslint:disable */

declare var Object: any;
export interface DPMOEEInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "mfgtype"?: string;
  "customer"?: string;
  "line"?: string;
  "earnedhour"?: number;
  "machinehour"?: number;
  "oee1"?: number;
  "oee2"?: number;
  "totalpresenttime"?: number;
}

export class DPMOEE implements DPMOEEInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "mfgtype": string;
  "customer": string;
  "line": string;
  "earnedhour": number;
  "machinehour": number;
  "oee1": number;
  "oee2": number;
  "totalpresenttime": number;
  constructor(data?: DPMOEEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOEE`.
   */
  public static getModelName() {
    return "DPMOEE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOEE for dynamic purposes.
  **/
  public static factory(data: DPMOEEInterface): DPMOEE{
    return new DPMOEE(data);
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
      name: 'DPMOEE',
      plural: 'dpmoee',
      path: 'dpmoee',
      idName: 'syncid',
      properties: {
        "syncid": {
          name: 'syncid',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "syncaction": {
          name: 'syncaction',
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
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "earnedhour": {
          name: 'earnedhour',
          type: 'number'
        },
        "machinehour": {
          name: 'machinehour',
          type: 'number'
        },
        "oee1": {
          name: 'oee1',
          type: 'number'
        },
        "oee2": {
          name: 'oee2',
          type: 'number'
        },
        "totalpresenttime": {
          name: 'totalpresenttime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
