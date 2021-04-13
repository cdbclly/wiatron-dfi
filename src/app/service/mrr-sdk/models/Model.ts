/* tslint:disable */
import {
  Plant,
  ModelDocument,
  PartDocument,
  Project,
  Site
} from '../index';

declare var Object: any;
export interface ModelInterface {
  "id": string;
  "projectId"?: string;
  plants?: Plant[];
  modelDocuments?: ModelDocument[];
  partDocuments?: PartDocument[];
  project?: Project;
  sites?: Site[];
}

export class Model implements ModelInterface {
  "id": string;
  "projectId": string;
  plants: Plant[];
  modelDocuments: ModelDocument[];
  partDocuments: PartDocument[];
  project: Project;
  sites: Site[];
  constructor(data?: ModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Model`.
   */
  public static getModelName() {
    return "Model";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Model for dynamic purposes.
  **/
  public static factory(data: ModelInterface): Model{
    return new Model(data);
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
      name: 'Model',
      plural: 'Models',
      path: 'Models',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
      },
      relations: {
        plants: {
          name: 'plants',
          type: 'Plant[]',
          model: 'Plant',
          relationType: 'hasMany',
          modelThrough: 'PlantModel',
          keyThrough: 'plantId',
          keyFrom: 'id',
          keyTo: 'modelId'
        },
        modelDocuments: {
          name: 'modelDocuments',
          type: 'ModelDocument[]',
          model: 'ModelDocument',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelId'
        },
        partDocuments: {
          name: 'partDocuments',
          type: 'PartDocument[]',
          model: 'PartDocument',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelId'
        },
        project: {
          name: 'project',
          type: 'Project',
          model: 'Project',
          relationType: 'belongsTo',
                  keyFrom: 'projectId',
          keyTo: 'id'
        },
        sites: {
          name: 'sites',
          type: 'Site[]',
          model: 'Site',
          relationType: 'hasMany',
          modelThrough: 'SiteModel',
          keyThrough: 'siteId',
          keyFrom: 'id',
          keyTo: 'modelId'
        },
      }
    }
  }
}
