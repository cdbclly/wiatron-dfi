/* tslint:disable */
import {
  App
} from '../index';

declare var Object: any;
export interface ProjectInterface {
  "name"?: string;
  "id"?: number;
  apps?: App[];
}

export class Project implements ProjectInterface {
  "name": string;
  "id": number;
  apps: App[];
  constructor(data?: ProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Project`.
   */
  public static getModelName() {
    return "Project";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Project for dynamic purposes.
  **/
  public static factory(data: ProjectInterface): Project{
    return new Project(data);
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
      name: 'Project',
      plural: 'Projects',
      path: 'Projects',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        apps: {
          name: 'apps',
          type: 'App[]',
          model: 'App',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'projectId'
        },
      }
    }
  }
}
