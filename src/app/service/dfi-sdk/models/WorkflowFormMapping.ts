/* tslint:disable */
import {
  Workflow,
  WorkflowForm,
  WorkflowSignatory
} from '../index';

declare var Object: any;
export interface WorkflowFormMappingInterface {
  "model"?: string;
  "key"?: string;
  "id"?: number;
  "workflowFormId"?: number;
  workflows?: Workflow[];
  workflowForm?: WorkflowForm;
  workflowSignatories?: WorkflowSignatory[];
}

export class WorkflowFormMapping implements WorkflowFormMappingInterface {
  "model": string;
  "key": string;
  "id": number;
  "workflowFormId": number;
  workflows: Workflow[];
  workflowForm: WorkflowForm;
  workflowSignatories: WorkflowSignatory[];
  constructor(data?: WorkflowFormMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `WorkflowFormMapping`.
   */
  public static getModelName() {
    return "WorkflowFormMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of WorkflowFormMapping for dynamic purposes.
  **/
  public static factory(data: WorkflowFormMappingInterface): WorkflowFormMapping{
    return new WorkflowFormMapping(data);
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
      name: 'WorkflowFormMapping',
      plural: 'WorkflowFormMappings',
      path: 'WorkflowFormMappings',
      idName: 'id',
      properties: {
        "model": {
          name: 'model',
          type: 'string'
        },
        "key": {
          name: 'key',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "workflowFormId": {
          name: 'workflowFormId',
          type: 'number'
        },
      },
      relations: {
        workflows: {
          name: 'workflows',
          type: 'Workflow[]',
          model: 'Workflow',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowFormMappingId'
        },
        workflowForm: {
          name: 'workflowForm',
          type: 'WorkflowForm',
          model: 'WorkflowForm',
          relationType: 'belongsTo',
                  keyFrom: 'workflowFormId',
          keyTo: 'id'
        },
        workflowSignatories: {
          name: 'workflowSignatories',
          type: 'WorkflowSignatory[]',
          model: 'WorkflowSignatory',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowFormMappingId'
        },
      }
    }
  }
}
