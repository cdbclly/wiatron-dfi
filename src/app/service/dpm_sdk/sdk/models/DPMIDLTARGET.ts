/* tslint:disable */

declare var Object: any;
export interface DPMIDLTARGETInterface {
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

export class DPMIDLTARGET implements DPMIDLTARGETInterface {
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
  constructor(data?: DPMIDLTARGETInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMIDLTARGET`.
   */
  public static getModelName() {
    return "DPMIDLTARGET";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMIDLTARGET for dynamic purposes.
  **/
  public static factory(data: DPMIDLTARGETInterface): DPMIDLTARGET{
    return new DPMIDLTARGET(data);
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
      name: 'DPMIDLTARGET',
      plural: 'DPMIDLTARGET',
      path: 'DPMIDLTARGET',
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
