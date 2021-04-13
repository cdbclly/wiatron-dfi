/* tslint:disable */
import {
  WorkflowFormMapping
} from '../index';

declare var Object: any;
export interface WorkflowFormInterface {
  "id": number;
  "name"?: string;
  "routingPath"?: string;
  "description"?: string;
  workflowFormMappings?: WorkflowFormMapping[];
}

export class WorkflowForm implements WorkflowFormInterface {
  "id": number;
  "name": string;
  "routingPath": string;
  "description": string;
  workflowFormMappings: WorkflowFormMapping[];
  constructor(data?: WorkflowFormInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `WorkflowForm`.
   */
  public static getModelName() {
    return "WorkflowForm";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of WorkflowForm for dynamic purposes.
  **/
  public static factory(data: WorkflowFormInterface): WorkflowForm{
    return new WorkflowForm(data);
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
      name: 'WorkflowForm',
      plural: 'WorkflowForms',
      path: 'WorkflowForms',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "routingPath": {
          name: 'routingPath',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
      },
      relations: {
        workflowFormMappings: {
          name: 'workflowFormMappings',
          type: 'WorkflowFormMapping[]',
          model: 'WorkflowFormMapping',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowFormId'
        },
      }
    }
  }
}
