/* tslint:disable */
import {
  Document,
  Product,
  NewModelDocument
} from '../index';

declare var Object: any;
export interface ProductDocumentInterface {
  "productDocumentId"?: number;
  "plant"?: string;
  "PIC"?: string;
  "PICLeader1"?: string;
  "PICUnit"?: string;
  "PICLeader2"?: string;
  "siteUser1"?: string;
  "siteUser2"?: string;
  "siteUser3"?: string;
  "siteUser4"?: string;
  "siteUser5"?: string;
  "C3"?: boolean;
  "C4"?: boolean;
  "C5"?: boolean;
  "documentId"?: number;
  "productId"?: string;
  document?: Document;
  product?: Product;
  modelDocument?: NewModelDocument[];
}

export class ProductDocument implements ProductDocumentInterface {
  "productDocumentId": number;
  "plant": string;
  "PIC": string;
  "PICLeader1": string;
  "PICUnit": string;
  "PICLeader2": string;
  "siteUser1": string;
  "siteUser2": string;
  "siteUser3": string;
  "siteUser4": string;
  "siteUser5": string;
  "C3": boolean;
  "C4": boolean;
  "C5": boolean;
  "documentId": number;
  "productId": string;
  document: Document;
  product: Product;
  modelDocument: NewModelDocument[];
  constructor(data?: ProductDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProductDocument`.
   */
  public static getModelName() {
    return "ProductDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProductDocument for dynamic purposes.
  **/
  public static factory(data: ProductDocumentInterface): ProductDocument{
    return new ProductDocument(data);
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
      name: 'ProductDocument',
      plural: 'ProductDocuments',
      path: 'ProductDocuments',
      idName: 'productDocumentId',
      properties: {
        "productDocumentId": {
          name: 'productDocumentId',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "PIC": {
          name: 'PIC',
          type: 'string'
        },
        "PICLeader1": {
          name: 'PICLeader1',
          type: 'string'
        },
        "PICUnit": {
          name: 'PICUnit',
          type: 'string'
        },
        "PICLeader2": {
          name: 'PICLeader2',
          type: 'string'
        },
        "siteUser1": {
          name: 'siteUser1',
          type: 'string'
        },
        "siteUser2": {
          name: 'siteUser2',
          type: 'string'
        },
        "siteUser3": {
          name: 'siteUser3',
          type: 'string'
        },
        "siteUser4": {
          name: 'siteUser4',
          type: 'string'
        },
        "siteUser5": {
          name: 'siteUser5',
          type: 'string'
        },
        "C3": {
          name: 'C3',
          type: 'boolean'
        },
        "C4": {
          name: 'C4',
          type: 'boolean'
        },
        "C5": {
          name: 'C5',
          type: 'boolean'
        },
        "documentId": {
          name: 'documentId',
          type: 'number'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
      },
      relations: {
        document: {
          name: 'document',
          type: 'Document',
          model: 'Document',
          relationType: 'belongsTo',
                  keyFrom: 'documentId',
          keyTo: 'documentId'
        },
        product: {
          name: 'product',
          type: 'Product',
          model: 'Product',
          relationType: 'belongsTo',
                  keyFrom: 'productId',
          keyTo: 'id'
        },
        modelDocument: {
          name: 'modelDocument',
          type: 'NewModelDocument[]',
          model: 'NewModelDocument',
          relationType: 'hasMany',
                  keyFrom: 'productDocumentId',
          keyTo: 'productDocumentId'
        },
      }
    }
  }
}
