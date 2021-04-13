/* tslint:disable */

declare var Object: any;
export interface DPMFPYRInterface {
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
  "fpyr"?: number;
  "starttime"?: Date;
  "endtime"?: Date;
}

export class DPMFPYR implements DPMFPYRInterface {
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
  "fpyr": number;
  "starttime": Date;
  "endtime": Date;
  constructor(data?: DPMFPYRInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMFPYR`.
   */
  public static getModelName() {
    return "DPMFPYR";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMFPYR for dynamic purposes.
  **/
  public static factory(data: DPMFPYRInterface): DPMFPYR{
    return new DPMFPYR(data);
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
      name: 'DPMFPYR',
      plural: 'DPMFPYR',
      path: 'DPMFPYR',
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
        "fpyr": {
          name: 'fpyr',
          type: 'number'
        },
        "starttime": {
          name: 'starttime',
          type: 'Date'
        },
        "endtime": {
          name: 'endtime',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
