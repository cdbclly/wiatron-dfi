/* tslint:disable */
import {
  Workflow,
  Member
} from '../index';

declare var Object: any;
export interface WorkflowSignInterface {
  "role"?: string;
  "comment"?: string;
  "previousWorkflowSignId"?: number;
  "nextWorkflowSignId"?: number;
  "isAgree"?: boolean;
  "updateOn"?: Date;
  "workflowId": number;
  "userId": string;
  "id"?: number;
  workflow?: Workflow;
  next?: WorkflowSign;
  previous?: WorkflowSign;
  member?: Member;
}

export class WorkflowSign implements WorkflowSignInterface {
  "role": string;
  "comment": string;
  "previousWorkflowSignId": number;
  "nextWorkflowSignId": number;
  "isAgree": boolean;
  "updateOn": Date;
  "workflowId": number;
  "userId": string;
  "id": number;
  workflow: Workflow;
  next: WorkflowSign;
  previous: WorkflowSign;
  member: Member;
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
          type: 'boolean'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'Date'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "id": {
          name: 'id',
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
        next: {
          name: 'next',
          type: 'WorkflowSign',
          model: 'WorkflowSign',
          relationType: 'belongsTo',
                  keyFrom: 'nextWorkflowSignId',
          keyTo: 'id'
        },
        previous: {
          name: 'previous',
          type: 'WorkflowSign',
          model: 'WorkflowSign',
          relationType: 'belongsTo',
                  keyFrom: 'previousWorkflowSignId',
          keyTo: 'id'
        },
        member: {
          name: 'member',
          type: 'Member',
          model: 'Member',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'EmpID'
        },
      }
    }
  }
}
