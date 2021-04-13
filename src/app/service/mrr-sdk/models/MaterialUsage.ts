/* tslint:disable */
import {
  Manufacturer,
  Vendor
} from '../index';

declare var Object: any;
export interface MaterialUsageInterface {
  "materialId"?: string;
  "id"?: number;
  "manufacturerId"?: string;
  "vendorId"?: string;
  manufacturer?: Manufacturer;
  vendor?: Vendor;
}

export class MaterialUsage implements MaterialUsageInterface {
  "materialId": string;
  "id": number;
  "manufacturerId": string;
  "vendorId": string;
  manufacturer: Manufacturer;
  vendor: Vendor;
  constructor(data?: MaterialUsageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MaterialUsage`.
   */
  public static getModelName() {
    return "MaterialUsage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MaterialUsage for dynamic purposes.
  **/
  public static factory(data: MaterialUsageInterface): MaterialUsage{
    return new MaterialUsage(data);
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
      name: 'MaterialUsage',
      plural: 'MaterialUsages',
      path: 'MaterialUsages',
      idName: 'id',
      properties: {
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
      },
      relations: {
        manufacturer: {
          name: 'manufacturer',
          type: 'Manufacturer',
          model: 'Manufacturer',
          relationType: 'belongsTo',
                  keyFrom: 'manufacturerId',
          keyTo: 'id'
        },
        vendor: {
          name: 'vendor',
          type: 'Vendor',
          model: 'Vendor',
          relationType: 'belongsTo',
                  keyFrom: 'vendorId',
          keyTo: 'id'
        },
      }
    }
  }
}
