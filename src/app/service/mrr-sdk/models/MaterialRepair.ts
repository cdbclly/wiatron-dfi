/* tslint:disable */

declare var Object: any;
export interface MaterialRepairInterface {
  "plantId"?: string;
  "customer"?: string;
  "modelFamily"?: string;
  "model"?: string;
  "materialId"?: string;
  "repairDate"?: string;
  "manufactureDate"?: string;
  "qty"?: number;
  "updated"?: string;
  "id"?: number;
}

export class MaterialRepair implements MaterialRepairInterface {
  "plantId": string;
  "customer": string;
  "modelFamily": string;
  "model": string;
  "materialId": string;
  "repairDate": string;
  "manufactureDate": string;
  "qty": number;
  "updated": string;
  "id": number;
  constructor(data?: MaterialRepairInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MaterialRepair`.
   */
  public static getModelName() {
    return "MaterialRepair";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MaterialRepair for dynamic purposes.
  **/
  public static factory(data: MaterialRepairInterface): MaterialRepair{
    return new MaterialRepair(data);
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
      name: 'MaterialRepair',
      plural: 'MaterialRepairs',
      path: 'MaterialRepairs',
      idName: 'id',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "modelFamily": {
          name: 'modelFamily',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "repairDate": {
          name: 'repairDate',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'string'
        },
        "qty": {
          name: 'qty',
          type: 'number'
        },
        "updated": {
          name: 'updated',
          type: 'string'
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
