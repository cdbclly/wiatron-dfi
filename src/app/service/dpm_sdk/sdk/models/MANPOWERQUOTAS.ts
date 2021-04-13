/* tslint:disable */

declare var Object: any;
export interface MANPOWERQUOTASInterface {
  "id"?: number;
  "site"?: string;
  "plantName"?: string;
  "period"?: string;
  "periodtype"?: string;
  "manpower"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
}

export class MANPOWERQUOTAS implements MANPOWERQUOTASInterface {
  "id": number;
  "site": string;
  "plantName": string;
  "period": string;
  "periodtype": string;
  "manpower": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  constructor(data?: MANPOWERQUOTASInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MANPOWERQUOTAS`.
   */
  public static getModelName() {
    return "MANPOWERQUOTAS";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MANPOWERQUOTAS for dynamic purposes.
  **/
  public static factory(data: MANPOWERQUOTASInterface): MANPOWERQUOTAS{
    return new MANPOWERQUOTAS(data);
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
      name: 'MANPOWERQUOTAS',
      plural: 'MANPOWERQUOTAS',
      path: 'MANPOWERQUOTAS',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plantName": {
          name: 'plantName',
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
        "manpower": {
          name: 'manpower',
          type: 'number'
        },
        "createuser": {
          name: 'createuser',
          type: 'string'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "updateuser": {
          name: 'updateuser',
          type: 'string'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
