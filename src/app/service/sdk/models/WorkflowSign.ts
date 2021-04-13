/* tslint:disable */
import {
  Workflow,
  WorkflowCounterSign
} from '../index';

declare var Object: any;
export interface WorkflowSignInterface {
  "userId"?: string;
  "role"?: string;
  "comment"?: string;
  "previousWorkflowSignId"?: number;
  "nextWorkflowSignId"?: number;
  "isAgree"?: number;
  "updateOn"?: Date;
  "id"?: number;
  "workflowId"?: number;
  workflow?: Workflow;
  workflowCounterSigns?: WorkflowCounterSign[];
}

export class WorkflowSign implements WorkflowSignInterface {
  "userId": string;
  "role": string;
  "comment": string;
  "previousWorkflowSignId": number;
  "nextWorkflowSignId": number;
  "isAgree": number;
  "updateOn": Date;
  "id": number;
  "workflowId": number;
  workflow: Workflow;
  workflowCounterSigns: WorkflowCounterSign[];
  constructor(data?: WorkflowSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `WorkflowSign`.
   */
  public static getModelName() {
    return "WorkflowSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of WorkflowSign for dynamic purposes.
  **/
  public static factory(data: WorkflowSignInterface): WorkflowSign{
    return new WorkflowSign(data);
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
      name: 'WorkflowSign',
      plural: 'WorkflowSigns',
      path: 'WorkflowSigns',
      idName: 'id',
      properties: {
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "role": {
          name: 'role',
          type: 'string'
        },
        "comment": {
          name: 'comment',
          type: 'string'
        },
        "previousWorkflowSignId": {
          name: 'previousWorkflowSignId',
          type: 'number'
        },
        "nextWorkflowSignId": {
          name: 'nextWorkflowSignId',
          type: 'number'
        },
        "isAgree": {
          name: 'isAgree',
          type: 'number'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
      },
      relations: {
        workflow: {
          name: 'workflow',
          type: 'Workflow',
          model: 'Workflow',
          relationType: 'belongsTo',
                  keyFrom: 'workflowId',
          keyTo: 'id'
        },
        workflowCounterSigns: {
          name: 'workflowCounterSigns',
          type: 'WorkflowCounterSign[]',
          model: 'WorkflowCounterSign',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowSignId'
        },
      }
    }
  }
}
