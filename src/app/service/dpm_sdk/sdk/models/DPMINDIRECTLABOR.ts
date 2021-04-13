/* tslint:disable */

declare var Object: any;
export interface DPMINDIRECTLABORInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "site"?: string;
  "plantname"?: string;
  "department"?: string;
  "period"?: string;
  "periodtype"?: string;
  "employedmanpower"?: number;
}

export class DPMINDIRECTLABOR implements DPMINDIRECTLABORInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "site": string;
  "plantname": string;
  "department": string;
  "period": string;
  "periodtype": string;
  "employedmanpower": number;
  constructor(data?: DPMINDIRECTLABORInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMINDIRECTLABOR`.
   */
  public static getModelName() {
    return "DPMINDIRECTLABOR";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMINDIRECTLABOR for dynamic purposes.
  **/
  public static factory(data: DPMINDIRECTLABORInterface): DPMINDIRECTLABOR{
    return new DPMINDIRECTLABOR(data);
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
      name: 'DPMINDIRECTLABOR',
      plural: 'DPMINDIRECTLABOR',
      path: 'DPMINDIRECTLABOR',
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
      },
      relations: {
      }
    }
  }
}
