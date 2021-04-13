/* tslint:disable */

declare var Object: any;
export interface DPMOEEISSUEGROUPInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "issuetype"?: string;
  "stophour"?: number;
  "totalstophour"?: number;
  "value"?: number;
}

export class DPMOEEISSUEGROUP implements DPMOEEISSUEGROUPInterface {
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
  "issuetype": string;
  "stophour": number;
  "totalstophour": number;
  "value": number;
  constructor(data?: DPMOEEISSUEGROUPInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOEEISSUEGROUP`.
   */
  public static getModelName() {
    return "DPMOEEISSUEGROUP";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOEEISSUEGROUP for dynamic purposes.
  **/
  public static factory(data: DPMOEEISSUEGROUPInterface): DPMOEEISSUEGROUP{
    return new DPMOEEISSUEGROUP(data);
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
      name: 'DPMOEEISSUEGROUP',
      plural: 'dpmoeeissuegroup',
      path: 'dpmoeeissuegroup',
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
        "issuetype": {
          name: 'issuetype',
          type: 'string'
        },
        "stophour": {
          name: 'stophour',
          type: 'number'
        },
        "totalstophour": {
          name: 'totalstophour',
          type: 'number'
        },
        "value": {
          name: 'value',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
