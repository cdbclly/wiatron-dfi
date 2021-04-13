/* tslint:disable */
import {
  Vendor,
  Manufacturer
} from '../index';

declare var Object: any;
export interface ExternalUserInterface {
  "username"?: string;
  "vendorId"?: string;
  "manufacturerId"?: string;
  "email"?: string;
  "updatedOn"?: Date;
  "updatedBy"?: string;
  "password"?: string;
  accessTokens?: any[];
  vendor?: Vendor;
  manufacturer?: Manufacturer;
}

export class ExternalUser implements ExternalUserInterface {
  "username": string;
  "vendorId": string;
  "manufacturerId": string;
  "email": string;
  "updatedOn": Date;
  "updatedBy": string;
  "password": string;
  accessTokens: any[];
  vendor: Vendor;
  manufacturer: Manufacturer;
  constructor(data?: ExternalUserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ExternalUser`.
   */
  public static getModelName() {
    return "ExternalUser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ExternalUser for dynamic purposes.
  **/
  public static factory(data: ExternalUserInterface): ExternalUser{
    return new ExternalUser(data);
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
      name: 'ExternalUser',
      plural: 'ExternalUsers',
      path: 'ExternalUsers',
      idName: 'username',
      properties: {
        "username": {
          name: 'username',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'username',
          keyTo: 'userId'
        },
        vendor: {
          name: 'vendor',
          type: 'Vendor',
          model: 'Vendor',
          relationType: 'belongsTo',
                  keyFrom: 'vendorId',
          keyTo: 'id'
        },
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
