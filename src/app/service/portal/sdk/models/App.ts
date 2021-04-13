/* tslint:disable */
import {
  Project
} from '../index';

declare var Object: any;
export interface AppInterface {
  "url"?: string;
  "id"?: number;
  "projectId"?: number;
  project?: Project;
}

export class App implements AppInterface {
  "url": string;
  "id": number;
  "projectId": number;
  project: Project;
  constructor(data?: AppInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App`.
   */
  public static getModelName() {
    return "App";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App for dynamic purposes.
  **/
  public static factory(data: AppInterface): App{
    return new App(data);
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
      name: 'App',
      plural: 'Apps',
      path: 'Apps',
      idName: 'id',
      properties: {
        "url": {
          name: 'url',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "projectId": {
          name: 'projectId',
          type: 'number'
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
