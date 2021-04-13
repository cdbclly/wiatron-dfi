/* tslint:disable */

declare var Object: any;
export interface DPMUPHInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "dateid"?: string;
  "process"?: string;
  "line"?: string;
  "shift"?: string;
  "starttime"?: Date;
  "endtime"?: Date;
  "output"?: number;
  "target"?: number;
  "uph"?: number;
}

export class DPMUPH implements DPMUPHInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "customer": string;
  "mfgtype": string;
  "dateid": string;
  "process": string;
  "line": string;
  "shift": string;
  "starttime": Date;
  "endtime": Date;
  "output": number;
  "target": number;
  "uph": number;
  constructor(data?: DPMUPHInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMUPH`.
   */
  public static getModelName() {
    return "DPMUPH";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMUPH for dynamic purposes.
  **/
  public static factory(data: DPMUPHInterface): DPMUPH{
    return new DPMUPH(data);
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
      name: 'DPMUPH',
      plural: 'dpmuph',
      path: 'dpmuph',
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
        "dateid": {
          name: 'dateid',
          type: 'string'
        },
        "process": {
          name: 'process',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "shift": {
          name: 'shift',
          type: 'string'
        },
        "starttime": {
          name: 'starttime',
          type: 'Date'
        },
        "endtime": {
          name: 'endtime',
          type: 'Date'
        },
        "output": {
          name: 'output',
          type: 'number'
        },
        "target": {
          name: 'target',
          type: 'number'
        },
        "uph": {
          name: 'uph',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
