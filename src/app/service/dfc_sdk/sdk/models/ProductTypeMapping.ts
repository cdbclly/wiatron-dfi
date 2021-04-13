/* tslint:disable */

declare var Object: any;
export interface ProductTypeMappingInterface {
  "plmProductType"?: string;
  "dfiProductType"?: string;
  "isManual"?: boolean;
  "createdBy"?: string;
  "updatedBy"?: string;
  "createdDate"?: Date;
  "updatedDate"?: Date;
  "id"?: number;
}

export class ProductTypeMapping implements ProductTypeMappingInterface {
  "plmProductType": string;
  "dfiProductType": string;
  "isManual": boolean;
  "createdBy": string;
  "updatedBy": string;
  "createdDate": Date;
  "updatedDate": Date;
  "id": number;
  constructor(data?: ProductTypeMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProductTypeMapping`.
   */
  public static getModelName() {
    return "ProductTypeMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProductTypeMapping for dynamic purposes.
  **/
  public static factory(data: ProductTypeMappingInterface): ProductTypeMapping{
    return new ProductTypeMapping(data);
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
      name: 'ProductTypeMapping',
      plural: 'ProductTypeMappings',
      path: 'ProductTypeMappings',
      idName: 'id',
      properties: {
        "plmProductType": {
          name: 'plmProductType',
          type: 'string'
        },
        "dfiProductType": {
          name: 'dfiProductType',
          type: 'string'
        },
        "isManual": {
          name: 'isManual',
          type: 'boolean'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "createdDate": {
          name: 'createdDate',
          type: 'Date'
        },
        "updatedDate": {
          name: 'updatedDate',
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
