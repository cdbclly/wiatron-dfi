/* tslint:disable */

declare var Object: any;
export interface RepairMasterInterface {
  "plant"?: string;
  "mfgType"?: string;
  "model"?: string;
  "reasonType"?: string;
  "line"?: string;
  "trnDate"?: Date;
  "qty"?: number;
  "updated"?: Date;
  "id"?: number;
}

export class RepairMaster implements RepairMasterInterface {
  "plant": string;
  "mfgType": string;
  "model": string;
  "reasonType": string;
  "line": string;
  "trnDate": Date;
  "qty": number;
  "updated": Date;
  "id": number;
  constructor(data?: RepairMasterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RepairMaster`.
   */
  public static getModelName() {
    return "RepairMaster";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RepairMaster for dynamic purposes.
  **/
  public static factory(data: RepairMasterInterface): RepairMaster{
    return new RepairMaster(data);
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
      name: 'RepairMaster',
      plural: 'RepairMasters',
      path: 'RepairMasters',
      idName: 'id',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "mfgType": {
          name: 'mfgType',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "reasonType": {
          name: 'reasonType',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "trnDate": {
          name: 'trnDate',
          type: 'Date'
        },
        "qty": {
          name: 'qty',
          type: 'number'
        },
        "updated": {
          name: 'updated',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
