/* tslint:disable */

declare var Object: any;
export interface VendorDocumentSubCategoryInterface {
  "id"?: number;
  "name"?: string;
  "categoryId": number;
}

export class VendorDocumentSubCategory implements VendorDocumentSubCategoryInterface {
  "id": number;
  "name": string;
  "categoryId": number;
  constructor(data?: VendorDocumentSubCategoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorDocumentSubCategory`.
   */
  public static getModelName() {
    return "VendorDocumentSubCategory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorDocumentSubCategory for dynamic purposes.
  **/
  public static factory(data: VendorDocumentSubCategoryInterface): VendorDocumentSubCategory{
    return new VendorDocumentSubCategory(data);
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
      name: 'VendorDocumentSubCategory',
      plural: 'VendorDocumentSubCategorys',
      path: 'VendorDocumentSubCategorys',
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
        "categoryId": {
          name: 'categoryId',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
