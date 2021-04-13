/* tslint:disable */

declare var Object: any;
export interface DPMFPYRSTATIONInterface {
  "site"?: string;
  "plant"?: string;
  "period"?: string;
  "periodtype"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "station"?: string;
  "ngqty"?: number;
  "inputqty"?: number;
  "passqty"?: number;
}

export class DPMFPYRSTATION implements DPMFPYRSTATIONInterface {
  "site": string;
  "plant": string;
  "period": string;
  "periodtype": string;
  "customer": string;
  "mfgtype": string;
  "line": string;
  "station": string;
  "ngqty": number;
  "inputqty": number;
  "passqty": number;
  constructor(data?: DPMFPYRSTATIONInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMFPYRSTATION`.
   */
  public static getModelName() {
    return "DPMFPYRSTATION";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMFPYRSTATION for dynamic purposes.
  **/
  public static factory(data: DPMFPYRSTATIONInterface): DPMFPYRSTATION{
    return new DPMFPYRSTATION(data);
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
      name: 'DPMFPYRSTATION',
      plural: 'DPMFPYRSTATIONs',
      path: 'DPMFPYRSTATIONs',
      idName: 'site',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
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
        "station": {
          name: 'station',
          type: 'string'
        },
        "ngqty": {
          name: 'ngqty',
          type: 'number'
        },
        "inputqty": {
          name: 'inputqty',
          type: 'number'
        },
        "passqty": {
          name: 'passqty',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
