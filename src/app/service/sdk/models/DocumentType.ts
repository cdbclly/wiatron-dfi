/* tslint:disable */

declare var Object: any;
export interface DocumentTypeInterface {
  "typeId"?: number;
  "typeName"?: string;
  documents?: Document[];
}

export class DocumentType implements DocumentTypeInterface {
  "typeId": number;
  "typeName": string;
  documents: Document[];
  constructor(data?: DocumentTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DocumentType`.
   */
  public static getModelName() {
    return "DocumentType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DocumentType for dynamic purposes.
  **/
  public static factory(data: DocumentTypeInterface): DocumentType{
    return new DocumentType(data);
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
      name: 'DocumentType',
      plural: 'DocumentTypes',
      path: 'DocumentTypes',
      idName: 'typeId',
      properties: {
        "typeId": {
          name: 'typeId',
          type: 'number'
        },
        "typeName": {
          name: 'typeName',
          type: 'string'
        },
      },
      relations: {
        documents: {
          name: 'documents',
          type: 'Document[]',
          model: 'Document',
          relationType: 'hasMany',
                  keyFrom: 'typeId',
          keyTo: 'documentTypeId'
        },
      }
    }
  }
}
