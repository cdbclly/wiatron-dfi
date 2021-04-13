/* tslint:disable */

declare var Object: any;
export interface DPMDLBUFFERRATIOInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "site"?: string;
  "plantName"?: string;
  "department"?: string;
  "period"?: string;
  "periodtype"?: string;
  "employedmanpower"?: number;
  "attendancemanpower"?: number;
}

export class DPMDLBUFFERRATIO implements DPMDLBUFFERRATIOInterface {
  "syncid": number;
  "syncdate": Date;
  "site": string;
  "plantName": string;
  "department": string;
  "period": string;
  "periodtype": string;
  "employedmanpower": number;
  "attendancemanpower": number;
  constructor(data?: DPMDLBUFFERRATIOInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMDLBUFFERRATIO`.
   */
  public static getModelName() {
    return "DPMDLBUFFERRATIO";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMDLBUFFERRATIO for dynamic purposes.
  **/
  public static factory(data: DPMDLBUFFERRATIOInterface): DPMDLBUFFERRATIO{
    return new DPMDLBUFFERRATIO(data);
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
      name: 'DPMDLBUFFERRATIO',
      plural: 'DPMDLBUFFERRATIO',
      path: 'DPMDLBUFFERRATIO',
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
        "site": {
          name: 'site',
          type: 'string'
        },
        "plantName": {
          name: 'plantName',
          type: 'string'
        },
        "department": {
          name: 'department',
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
