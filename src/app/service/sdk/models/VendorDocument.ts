/* tslint:disable */

declare var Object: any;
export interface VendorDocumentInterface {
  "id"?: number;
  "name"?: string;
  "createDate"?: Date;
  "updateDate"?: Date;
  "createBy"?: string;
  "updateBy"?: string;
  "isDelete"?: boolean;
  "isEnable"?: boolean;
}

export class VendorDocument implements VendorDocumentInterface {
  "id": number;
  "name": string;
  "createDate": Date;
  "updateDate": Date;
  "createBy": string;
  "updateBy": string;
  "isDelete": boolean;
  "isEnable": boolean;
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
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "updateBy": {
          name: 'updateBy',
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
      },
      relations: {
      }
    }
  }
}
