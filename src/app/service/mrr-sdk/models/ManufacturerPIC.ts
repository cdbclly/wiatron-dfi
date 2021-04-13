/* tslint:disable */
import {
  Manufacturer
} from '../index';

declare var Object: any;
export interface ManufacturerPICInterface {
  "manufacturerId": string;
  "plantId"?: string;
  "name": string;
  "email": string;
  "supervisorId"?: number;
  "isLeave"?: boolean;
  "id"?: number;
  manufacturer?: Manufacturer;
}

export class ManufacturerPIC implements ManufacturerPICInterface {
  "manufacturerId": string;
  "plantId": string;
  "name": string;
  "email": string;
  "supervisorId": number;
  "isLeave": boolean;
  "id": number;
  manufacturer: Manufacturer;
  constructor(data?: ManufacturerPICInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ManufacturerPIC`.
   */
  public static getModelName() {
    return "ManufacturerPIC";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ManufacturerPIC for dynamic purposes.
  **/
  public static factory(data: ManufacturerPICInterface): ManufacturerPIC{
    return new ManufacturerPIC(data);
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
      name: 'ManufacturerPIC',
      plural: 'ManufacturerPICs',
      path: 'ManufacturerPICs',
      idName: 'id',
      properties: {
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "supervisorId": {
          name: 'supervisorId',
          type: 'number'
        },
        "isLeave": {
          name: 'isLeave',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
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
      }
    }
  }
}
