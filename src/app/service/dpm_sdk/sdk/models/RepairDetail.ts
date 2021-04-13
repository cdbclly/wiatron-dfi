/* tslint:disable */

declare var Object: any;
export interface RepairDetailInterface {
  "plant"?: string;
  "mfgType"?: string;
  "model"?: string;
  "reasonType"?: string;
  "description"?: string;
  "line"?: string;
  "trnDate"?: Date;
  "qty"?: number;
  "updated"?: Date;
  "id"?: number;
}

export class RepairDetail implements RepairDetailInterface {
  "plant": string;
  "mfgType": string;
  "model": string;
  "reasonType": string;
  "description": string;
  "line": string;
  "trnDate": Date;
  "qty": number;
  "updated": Date;
  "id": number;
  constructor(data?: RepairDetailInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RepairDetail`.
   */
  public static getModelName() {
    return "RepairDetail";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RepairDetail for dynamic purposes.
  **/
  public static factory(data: RepairDetailInterface): RepairDetail{
    return new RepairDetail(data);
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
      name: 'RepairDetail',
      plural: 'RepairDetails',
      path: 'RepairDetails',
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
        "description": {
          name: 'description',
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
