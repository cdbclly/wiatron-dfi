/* tslint:disable */
import {
  WorkflowFormMapping
} from '../index';

declare var Object: any;
export interface WorkflowSignatoryInterface {
  "id"?: number;
  "stage"?: number;
  "stageDesc"?: string;
  "picId"?: string;
  "isDynamic"?: boolean;
  "workflowFormMappingId"?: number;
  workflowFormMapping?: WorkflowFormMapping;
}

export class WorkflowSignatory implements WorkflowSignatoryInterface {
  "id": number;
  "stage": number;
  "stageDesc": string;
  "picId": string;
  "isDynamic": boolean;
  "workflowFormMappingId": number;
  workflowFormMapping: WorkflowFormMapping;
  constructor(data?: WorkflowSignatoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `WorkflowSignatory`.
   */
  public static getModelName() {
    return "WorkflowSignatory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of WorkflowSignatory for dynamic purposes.
  **/
  public static factory(data: WorkflowSignatoryInterface): WorkflowSignatory{
    return new WorkflowSignatory(data);
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
      name: 'WorkflowSignatory',
      plural: 'WorkflowSignatories',
      path: 'WorkflowSignatories',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "stage": {
          name: 'stage',
          type: 'number'
        },
        "stageDesc": {
          name: 'stageDesc',
          type: 'string'
        },
        "picId": {
          name: 'picId',
          type: 'string'
        },
        "isDynamic": {
          name: 'isDynamic',
          type: 'boolean'
        },
        "workflowFormMappingId": {
          name: 'workflowFormMappingId',
          type: 'number'
        },
      },
      relations: {
        workflowFormMapping: {
          name: 'workflowFormMapping',
          type: 'WorkflowFormMapping',
          model: 'WorkflowFormMapping',
          relationType: 'belongsTo',
                  keyFrom: 'workflowFormMappingId',
          keyTo: 'id'
        },
      }
    }
  }
}
