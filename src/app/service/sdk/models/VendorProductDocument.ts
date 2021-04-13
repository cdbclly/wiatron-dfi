/* tslint:disable */

declare var Object: any;
export interface VendorProductDocumentInterface {
  "id"?: number;
  "vendorDocumentId": number;
  "pass"?: boolean;
  "plant"?: string;
  "updateDate"?: Date;
  "updateBy"?: string;
  "createDate"?: Date;
  "createBy"?: string;
}

export class VendorProductDocument implements VendorProductDocumentInterface {
  "id": number;
  "vendorDocumentId": number;
  "pass": boolean;
  "plant": string;
  "updateDate": Date;
  "updateBy": string;
  "createDate": Date;
  "createBy": string;
  constructor(data?: VendorProductDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorProductDocument`.
   */
  public static getModelName() {
    return "VendorProductDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorProductDocument for dynamic purposes.
  **/
  public static factory(data: VendorProductDocumentInterface): VendorProductDocument{
    return new VendorProductDocument(data);
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
      name: 'VendorProductDocument',
      plural: 'VendorProductDocuments',
      path: 'VendorProductDocuments',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "vendorDocumentId": {
          name: 'vendorDocumentId',
          type: 'number'
        },
        "pass": {
          name: 'pass',
          type: 'boolean',
          default: false
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
