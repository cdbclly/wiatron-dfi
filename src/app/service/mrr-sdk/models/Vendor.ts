/* tslint:disable */
import {
  PartNumberVendor,
  PartNumber,
  MaterialUsage
} from '../index';

declare var Object: any;
export interface VendorInterface {
  "id": string;
  "name"?: string;
  PartNumberVendors?: PartNumberVendor[];
  PartNumbers?: PartNumber[];
  materialUsages?: MaterialUsage[];
}

export class Vendor implements VendorInterface {
  "id": string;
  "name": string;
  PartNumberVendors: PartNumberVendor[];
  PartNumbers: PartNumber[];
  materialUsages: MaterialUsage[];
  constructor(data?: VendorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Vendor`.
   */
  public static getModelName() {
    return "Vendor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Vendor for dynamic purposes.
  **/
  public static factory(data: VendorInterface): Vendor{
    return new Vendor(data);
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
      name: 'Vendor',
      plural: 'Vendors',
      path: 'Vendors',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
      },
      relations: {
        PartNumberVendors: {
          name: 'PartNumberVendors',
          type: 'PartNumberVendor[]',
          model: 'PartNumberVendor',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'vendorId'
        },
        PartNumbers: {
          name: 'PartNumbers',
          type: 'PartNumber[]',
          model: 'PartNumber',
          relationType: 'hasMany',
          modelThrough: 'PartNumberVendor',
          keyThrough: 'partNumberId',
          keyFrom: 'id',
          keyTo: 'vendorId'
        },
        materialUsages: {
          name: 'materialUsages',
          type: 'MaterialUsage[]',
          model: 'MaterialUsage',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'vendorId'
        },
      }
    }
  }
}
