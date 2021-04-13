/* tslint:disable */
import {
  Stage,
  Project
} from '../index';

declare var Object: any;
export interface ProjectStageInterface {
  "completionDate"?: Date;
  "dueDate"?: Date;
  "id"?: number;
  "stageId"?: string;
  "projectId"?: string;
  stage?: Stage;
  project?: Project;
}

export class ProjectStage implements ProjectStageInterface {
  "completionDate": Date;
  "dueDate": Date;
  "id": number;
  "stageId": string;
  "projectId": string;
  stage: Stage;
  project: Project;
  constructor(data?: ProjectStageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectStage`.
   */
  public static getModelName() {
    return "ProjectStage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectStage for dynamic purposes.
  **/
  public static factory(data: ProjectStageInterface): ProjectStage{
    return new ProjectStage(data);
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
      name: 'ProjectStage',
      plural: 'ProjectStages',
      path: 'ProjectStages',
      idName: 'id',
      properties: {
        "completionDate": {
          name: 'completionDate',
          type: 'Date'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
      },
      relations: {
        stage: {
          name: 'stage',
          type: 'Stage',
          model: 'Stage',
          relationType: 'belongsTo',
                  keyFrom: 'stageId',
          keyTo: 'id'
        },
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
