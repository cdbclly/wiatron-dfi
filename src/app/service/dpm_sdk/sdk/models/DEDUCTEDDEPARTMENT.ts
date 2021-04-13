/* tslint:disable */

declare var Object: any;
export interface DEDUCTEDDEPARTMENTInterface {
  "id"?: number;
  "site"?: string;
  "plantName"?: string;
  "department"?: string;
  "period"?: string;
  "periodtype"?: string;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
}

export class DEDUCTEDDEPARTMENT implements DEDUCTEDDEPARTMENTInterface {
  "id": number;
  "site": string;
  "plantName": string;
  "department": string;
  "period": string;
  "periodtype": string;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  constructor(data?: DEDUCTEDDEPARTMENTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DEDUCTEDDEPARTMENT`.
   */
  public static getModelName() {
    return "DEDUCTEDDEPARTMENT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DEDUCTEDDEPARTMENT for dynamic purposes.
  **/
  public static factory(data: DEDUCTEDDEPARTMENTInterface): DEDUCTEDDEPARTMENT{
    return new DEDUCTEDDEPARTMENT(data);
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
      name: 'DEDUCTEDDEPARTMENT',
      plural: 'DEDUCTEDDEPARTMENT',
      path: 'DEDUCTEDDEPARTMENT',
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
