/* tslint:disable */

declare var Object: any;
export interface DPMCSSRInterface {
  "plant"?: string;
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "site"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "stationtype"?: string;
  "customer"?: string;
  "unboundempnum"?: number;
  "boundempnum"?: number;
  "boundemptotal"?: number;
  "rate"?: number;
}

export class DPMCSSR implements DPMCSSRInterface {
  "plant": string;
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "site": string;
  "mfgtype": string;
  "line": string;
  "stationtype": string;
  "customer": string;
  "unboundempnum": number;
  "boundempnum": number;
  "boundemptotal": number;
  "rate": number;
  constructor(data?: DPMCSSRInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMCSSR`.
   */
  public static getModelName() {
    return "DPMCSSR";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMCSSR for dynamic purposes.
  **/
  public static factory(data: DPMCSSRInterface): DPMCSSR{
    return new DPMCSSR(data);
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
      name: 'DPMCSSR',
      plural: 'DPMCSSR',
      path: 'DPMCSSR',
      idName: 'syncid',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
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
        "site": {
          name: 'site',
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
        "stationtype": {
          name: 'stationtype',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "unboundempnum": {
          name: 'unboundempnum',
          type: 'number'
        },
        "boundempnum": {
          name: 'boundempnum',
          type: 'number'
        },
        "boundemptotal": {
          name: 'boundemptotal',
          type: 'number'
        },
        "rate": {
          name: 'rate',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
