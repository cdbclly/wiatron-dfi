/* tslint:disable */

import { ProductDocument } from "@service/mrr-sdk";

declare var Object: any;
export interface DocumentInterface {
  "documentId"?: number;
  "documentName"?: string;
  "documentTypeId"?: number;
  documentType?: DocumentType;
  productDocuments?: ProductDocument[];
}

export class Document implements DocumentInterface {
  "documentId": number;
  "documentName": string;
  "documentTypeId": number;
  documentType: DocumentType;
  productDocuments: ProductDocument[];
  constructor(data?: DocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Document`.
   */
  public static getModelName() {
    return "Document";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Document for dynamic purposes.
  **/
  public static factory(data: DocumentInterface): Document{
    return new Document(data);
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
      name: 'Document',
      plural: 'Documents',
      path: 'Documents',
      idName: 'documentId',
      properties: {
        "documentId": {
          name: 'documentId',
          type: 'number'
        },
        "documentName": {
          name: 'documentName',
          type: 'string'
        },
        "documentTypeId": {
          name: 'documentTypeId',
          type: 'number'
        },
      },
      relations: {
        documentType: {
          name: 'documentType',
          type: 'DocumentType',
          model: 'DocumentType',
          relationType: 'belongsTo',
                  keyFrom: 'documentTypeId',
          keyTo: 'typeId'
        },
        productDocuments: {
          name: 'productDocuments',
          type: 'ProductDocument[]',
          model: 'ProductDocument',
          relationType: 'hasMany',
                  keyFrom: 'documentId',
          keyTo: 'documentId'
        },
      }
    }
  }
}
