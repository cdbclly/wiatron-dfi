/* tslint:disable */
import {
  PartNumberVendor,
  PartNumber,
  ManufacturerPIC,
  MaterialUsage
} from '../index';

declare var Object: any;
export interface ManufacturerInterface {
  "id": string;
  partNumberVendors?: PartNumberVendor[];
  partNumbers?: PartNumber[];
  manufacturerPICs?: ManufacturerPIC[];
  materialUsages?: MaterialUsage[];
}

export class Manufacturer implements ManufacturerInterface {
  "id": string;
  partNumberVendors: PartNumberVendor[];
  partNumbers: PartNumber[];
  manufacturerPICs: ManufacturerPIC[];
  materialUsages: MaterialUsage[];
  constructor(data?: ManufacturerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Manufacturer`.
   */
  public static getModelName() {
    return "Manufacturer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Manufacturer for dynamic purposes.
  **/
  public static factory(data: ManufacturerInterface): Manufacturer{
    return new Manufacturer(data);
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
      name: 'Manufacturer',
      plural: 'Manufacturers',
      path: 'Manufacturers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        partNumberVendors: {
          name: 'partNumberVendors',
          type: 'PartNumberVendor[]',
          model: 'PartNumberVendor',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'manufacturerId'
        },
        partNumbers: {
          name: 'partNumbers',
          type: 'PartNumber[]',
          model: 'PartNumber',
          relationType: 'hasMany',
          modelThrough: 'PartNumberVendor',
          keyThrough: 'partNumberId',
          keyFrom: 'id',
          keyTo: 'manufacturerId'
        },
        manufacturerPICs: {
          name: 'manufacturerPICs',
          type: 'ManufacturerPIC[]',
          model: 'ManufacturerPIC',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'manufacturerId'
        },
        materialUsages: {
          name: 'materialUsages',
          type: 'MaterialUsage[]',
          model: 'MaterialUsage',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'manufacturerId'
        },
      }
    }
  }
}
