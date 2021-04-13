/* tslint:disable */

declare var Object: any;
export interface DPMOFFLINETARGETInterface {
  "id"?: number;
  "site"?: string;
  "plantName"?: string;
  "period"?: string;
  "periodtype"?: string;
  "target"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
}

export class DPMOFFLINETARGET implements DPMOFFLINETARGETInterface {
  "id": number;
  "site": string;
  "plantName": string;
  "period": string;
  "periodtype": string;
  "target": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  constructor(data?: DPMOFFLINETARGETInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOFFLINETARGET`.
   */
  public static getModelName() {
    return "DPMOFFLINETARGET";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOFFLINETARGET for dynamic purposes.
  **/
  public static factory(data: DPMOFFLINETARGETInterface): DPMOFFLINETARGET{
    return new DPMOFFLINETARGET(data);
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
      name: 'DPMOFFLINETARGET',
      plural: 'DPMOFFLINETARGET',
      path: 'DPMOFFLINETARGET',
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
        "target": {
          name: 'target',
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
