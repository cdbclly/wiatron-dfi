/* tslint:disable */

declare var Object: any;
export interface DPMPRODUCTIVITYInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "customer"?: string;
  "productivity"?: number;
  "earnhour"?: number;
  "presenthour"?: number;
}

export class DPMPRODUCTIVITY implements DPMPRODUCTIVITYInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "mfgtype": string;
  "line": string;
  "customer": string;
  "productivity": number;
  "earnhour": number;
  "presenthour": number;
  constructor(data?: DPMPRODUCTIVITYInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMPRODUCTIVITY`.
   */
  public static getModelName() {
    return "DPMPRODUCTIVITY";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMPRODUCTIVITY for dynamic purposes.
  **/
  public static factory(data: DPMPRODUCTIVITYInterface): DPMPRODUCTIVITY{
    return new DPMPRODUCTIVITY(data);
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
      name: 'DPMPRODUCTIVITY',
      plural: 'dpmproductivity',
      path: 'dpmproductivity',
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
        "line": {
          name: 'line',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "productivity": {
          name: 'productivity',
          type: 'number'
        },
        "earnhour": {
          name: 'earnhour',
          type: 'number'
        },
        "presenthour": {
          name: 'presenthour',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
