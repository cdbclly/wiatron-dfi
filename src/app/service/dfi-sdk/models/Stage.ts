/* tslint:disable */
import {
  Project
} from '../index';

declare var Object: any;
export interface StageInterface {
  "id": string;
  projects?: Project[];
}

export class Stage implements StageInterface {
  "id": string;
  projects: Project[];
  constructor(data?: StageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Stage`.
   */
  public static getModelName() {
    return "Stage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Stage for dynamic purposes.
  **/
  public static factory(data: StageInterface): Stage{
    return new Stage(data);
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
      name: 'Stage',
      plural: 'Stages',
      path: 'Stages',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        projects: {
          name: 'projects',
          type: 'Project[]',
          model: 'Project',
          relationType: 'hasMany',
          modelThrough: 'ProjectStage',
          keyThrough: 'projectId',
          keyFrom: 'id',
          keyTo: 'stageId'
        },
      }
    }
  }
}
