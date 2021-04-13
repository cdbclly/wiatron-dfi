/* tslint:disable */
import {
  WorkflowSign
} from '../index';

declare var Object: any;
export interface WorkflowCounterSignInterface {
  "userId"?: string;
  "comment"?: string;
  "isAgree"?: number;
  "updateOn"?: Date;
  "id"?: number;
  "workflowSignId"?: number;
  workflowSign?: WorkflowSign;
}

export class WorkflowCounterSign implements WorkflowCounterSignInterface {
  "userId": string;
  "comment": string;
  "isAgree": number;
  "updateOn": Date;
  "id": number;
  "workflowSignId": number;
  workflowSign: WorkflowSign;
  constructor(data?: WorkflowCounterSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `WorkflowCounterSign`.
   */
  public static getModelName() {
    return "WorkflowCounterSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of WorkflowCounterSign for dynamic purposes.
  **/
  public static factory(data: WorkflowCounterSignInterface): WorkflowCounterSign{
    return new WorkflowCounterSign(data);
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
      name: 'WorkflowCounterSign',
      plural: 'WorkflowCounterSigns',
      path: 'WorkflowCounterSigns',
      idName: 'id',
      properties: {
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "comment": {
          name: 'comment',
          type: 'string'
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
        "workflowSignId": {
          name: 'workflowSignId',
          type: 'number'
        },
      },
      relations: {
        workflowSign: {
          name: 'workflowSign',
          type: 'WorkflowSign',
          model: 'WorkflowSign',
          relationType: 'belongsTo',
                  keyFrom: 'workflowSignId',
          keyTo: 'id'
        },
      }
    }
  }
}
