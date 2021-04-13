/* tslint:disable */
import {
  Model,
  ProductDocument,
  V_PlantProject
} from '../index';

declare var Object: any;
export interface NewModelDocumentInterface {
  "Id"?: number;
  "filepath"?: string;
  "uploadDate"?: Date;
  "modelId"?: string;
  "productDocumentId"?: number;
  "uploadUser"?: string;
  "byPass"?: boolean;
  model?: Model;
  productDocument?: ProductDocument;
  vPlantProjects?: V_PlantProject;
}

export class NewModelDocument implements NewModelDocumentInterface {
  "Id": number;
  "filepath": string;
  "uploadDate": Date;
  "modelId": string;
  "productDocumentId": number;
  "uploadUser": string;
  "byPass": boolean;
  model: Model;
  productDocument: ProductDocument;
  vPlantProjects: V_PlantProject;
  constructor(data?: NewModelDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NewModelDocument`.
   */
  public static getModelName() {
    return "NewModelDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NewModelDocument for dynamic purposes.
  **/
  public static factory(data: NewModelDocumentInterface): NewModelDocument{
    return new NewModelDocument(data);
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
      name: 'NewModelDocument',
      plural: 'NewModelDocuments',
      path: 'NewModelDocuments',
      idName: 'Id',
      properties: {
        "Id": {
          name: 'Id',
          type: 'number'
        },
        "filepath": {
          name: 'filepath',
          type: 'string'
        },
        "uploadDate": {
          name: 'uploadDate',
          type: 'Date'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "productDocumentId": {
          name: 'productDocumentId',
          type: 'number'
        },
        "uploadUser": {
          name: 'uploadUser',
          type: 'string'
        },
        "byPass": {
          name: 'byPass',
          type: 'boolean'
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
        productDocument: {
          name: 'productDocument',
          type: 'ProductDocument',
          model: 'ProductDocument',
          relationType: 'belongsTo',
                  keyFrom: 'productDocumentId',
          keyTo: 'productDocumentId'
        },
        vPlantProjects: {
          name: 'vPlantProjects',
          type: 'V_PlantProject',
          model: 'V_PlantProject',
          relationType: 'belongsTo',
                  keyFrom: 'modelId',
          keyTo: 'projectName'
        },
      }
    }
  }
}
