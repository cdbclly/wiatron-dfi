/* tslint:disable */

declare var Object: any;
export interface VendorDocumentInterface {
  "id"?: number;
  "name"?: string;
  "createdDate"?: Date;
  "updatedDate"?: Date;
  "createdBy"?: string;
  "updatedBy"?: string;
  "isDelete"?: boolean;
  "isEnable"?: boolean;
  "site"?: string;
  "userName"?: string;
  "vendorDocumentSubCategoryId"?: number;
  "vendorDocumentCategoryId"?: number;
}

export class VendorDocument implements VendorDocumentInterface {
  "id": number;
  "name": string;
  "createdDate": Date;
  "updatedDate": Date;
  "createdBy": string;
  "updatedBy": string;
  "isDelete": boolean;
  "isEnable": boolean;
  "site": string;
  "userName": string;
  "vendorDocumentSubCategoryId": number;
  "vendorDocumentCategoryId": number;
  constructor(data?: VendorDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorDocument`.
   */
  public static getModelName() {
    return "VendorDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorDocument for dynamic purposes.
  **/
  public static factory(data: VendorDocumentInterface): VendorDocument{
    return new VendorDocument(data);
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
      name: 'VendorDocument',
      plural: 'VendorDocuments',
      path: 'VendorDocuments',
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
        "createdDate": {
          name: 'createdDate',
          type: 'Date'
        },
        "updatedDate": {
          name: 'updatedDate',
          type: 'Date'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "isDelete": {
          name: 'isDelete',
          type: 'boolean',
          default: false
        },
        "isEnable": {
          name: 'isEnable',
          type: 'boolean',
          default: true
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "userName": {
          name: 'userName',
          type: 'string'
        },
        "vendorDocumentSubCategoryId": {
          name: 'vendorDocumentSubCategoryId',
          type: 'number'
        },
        "vendorDocumentCategoryId": {
          name: 'vendorDocumentCategoryId',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
