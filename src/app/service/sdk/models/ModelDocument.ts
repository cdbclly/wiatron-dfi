/* tslint:disable */
import {
  Model
} from '../index';

declare var Object: any;
export interface ModelDocumentInterface {
  "path"?: string;
  "id"?: number;
  "modelId"?: string;
  model?: Model;
}

export class ModelDocument implements ModelDocumentInterface {
  "path": string;
  "id": number;
  "modelId": string;
  model: Model;
  constructor(data?: ModelDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelDocument`.
   */
  public static getModelName() {
    return "ModelDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelDocument for dynamic purposes.
  **/
  public static factory(data: ModelDocumentInterface): ModelDocument{
    return new ModelDocument(data);
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
      name: 'ModelDocument',
      plural: 'ModelDocuments',
      path: 'ModelDocuments',
      idName: 'id',
      properties: {
        "path": {
          name: 'path',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
      },
      relations: {
        model: {
          name: 'model',
          type: 'Model',
          model: 'Model',
          relationType: 'belongsTo',
                  keyFrom: 'modelId',
          keyTo: 'id'
        },
      }
    }
  }
}
