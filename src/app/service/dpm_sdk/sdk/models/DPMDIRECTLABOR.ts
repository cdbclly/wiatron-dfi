/* tslint:disable */

declare var Object: any;
export interface DPMDIRECTLABORInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "site"?: string;
  "plantname"?: string;
  "department"?: string;
  "shiftid"?: string;
  "period"?: string;
  "periodtype"?: string;
  "employedmanpower"?: number;
  "attendancemanpower"?: number;
}

export class DPMDIRECTLABOR implements DPMDIRECTLABORInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "site": string;
  "plantname": string;
  "department": string;
  "shiftid": string;
  "period": string;
  "periodtype": string;
  "employedmanpower": number;
  "attendancemanpower": number;
  constructor(data?: DPMDIRECTLABORInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMDIRECTLABOR`.
   */
  public static getModelName() {
    return "DPMDIRECTLABOR";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMDIRECTLABOR for dynamic purposes.
  **/
  public static factory(data: DPMDIRECTLABORInterface): DPMDIRECTLABOR{
    return new DPMDIRECTLABOR(data);
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
      name: 'DPMDIRECTLABOR',
      plural: 'DPMDIRECTLABOR',
      path: 'DPMDIRECTLABOR',
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
        "site": {
          name: 'site',
          type: 'string'
        },
        "plantname": {
          name: 'plantname',
          type: 'string'
        },
        "department": {
          name: 'department',
          type: 'string'
        },
        "shiftid": {
          name: 'shiftid',
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
        "employedmanpower": {
          name: 'employedmanpower',
          type: 'number'
        },
        "attendancemanpower": {
          name: 'attendancemanpower',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
