/* tslint:disable */
import {
  Project
} from '../index';

declare var Object: any;
export interface ModelInterface {
  "id": string;
  "projectId"?: string;
  project?: Project;
}

export class Model implements ModelInterface {
  "id": string;
  "projectId": string;
  project: Project;
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
        project: {
          name: 'project',
          type: 'Project',
          model: 'Project',
          relationType: 'belongsTo',
                  keyFrom: 'projectId',
          keyTo: 'id'
        },
      }
    }
  }
}
