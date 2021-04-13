/* tslint:disable */

declare var Object: any;
export interface VendorDocumentCategoryInterface {
  "id"?: number;
  "name"?: string;
}

export class VendorDocumentCategory implements VendorDocumentCategoryInterface {
  "id": number;
  "name": string;
  constructor(data?: VendorDocumentCategoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorDocumentCategory`.
   */
  public static getModelName() {
    return "VendorDocumentCategory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorDocumentCategory for dynamic purposes.
  **/
  public static factory(data: VendorDocumentCategoryInterface): VendorDocumentCategory{
    return new VendorDocumentCategory(data);
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
      name: 'VendorDocumentCategory',
      plural: 'VendorDocumentCategorys',
      path: 'VendorDocumentCategorys',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
