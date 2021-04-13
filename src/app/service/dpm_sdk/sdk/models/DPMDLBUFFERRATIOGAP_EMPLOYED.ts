/* tslint:disable */

declare var Object: any;
export interface DPMDLBUFFERRATIOGAP_EMPLOYEDInterface {
  "id"?: number;
  "site"?: string;
  "plantName"?: string;
  "period"?: string;
  "periodtype"?: string;
  "gap"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
}

export class DPMDLBUFFERRATIOGAP_EMPLOYED implements DPMDLBUFFERRATIOGAP_EMPLOYEDInterface {
  "id": number;
  "site": string;
  "plantName": string;
  "period": string;
  "periodtype": string;
  "gap": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  constructor(data?: DPMDLBUFFERRATIOGAP_EMPLOYEDInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMDLBUFFERRATIOGAP_EMPLOYED`.
   */
  public static getModelName() {
    return "DPMDLBUFFERRATIOGAP_EMPLOYED";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMDLBUFFERRATIOGAP_EMPLOYED for dynamic purposes.
  **/
  public static factory(data: DPMDLBUFFERRATIOGAP_EMPLOYEDInterface): DPMDLBUFFERRATIOGAP_EMPLOYED{
    return new DPMDLBUFFERRATIOGAP_EMPLOYED(data);
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
      name: 'DPMDLBUFFERRATIOGAP_EMPLOYED',
      plural: 'DPMDLBUFFERRATIOGAP_EMPLOYED',
      path: 'DPMDLBUFFERRATIOGAP_EMPLOYED',
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
        "gap": {
          name: 'gap',
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
