/* tslint:disable */

declare var Object: any;
export interface DPMUPPHInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "output"?: number;
  "presenthour"?: number;
  "upph"?: number;
}

export class DPMUPPH implements DPMUPPHInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "customer": string;
  "mfgtype": string;
  "line": string;
  "output": number;
  "presenthour": number;
  "upph": number;
  constructor(data?: DPMUPPHInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMUPPH`.
   */
  public static getModelName() {
    return "DPMUPPH";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMUPPH for dynamic purposes.
  **/
  public static factory(data: DPMUPPHInterface): DPMUPPH{
    return new DPMUPPH(data);
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
      name: 'DPMUPPH',
      plural: 'dpmupph',
      path: 'dpmupph',
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
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "output": {
          name: 'output',
          type: 'number'
        },
        "presenthour": {
          name: 'presenthour',
          type: 'number'
        },
        "upph": {
          name: 'upph',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
