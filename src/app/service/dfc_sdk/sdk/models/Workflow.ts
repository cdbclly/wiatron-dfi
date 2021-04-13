/* tslint:disable */
import {
  WorkflowSign,
  MilitaryOrderSign,
  TargetOperationSign,
  StandardOperationSign,
  WorkflowFormMapping
} from '../index';

declare var Object: any;
export interface WorkflowInterface {
  "id"?: number;
  "desc"?: string;
  "current"?: number;
  "status"?: number;
  "workflowFormMappingId"?: number;
  "routingParameter"?: string;
  currentUser?: WorkflowSign;
  workflowSigns?: WorkflowSign[];
  militaryOrderSigns?: MilitaryOrderSign;
  TargetOperationSigns?: TargetOperationSign;
  StandardOperationSigns?: StandardOperationSign;
  workflowFormMapping?: WorkflowFormMapping;
}

export class Workflow implements WorkflowInterface {
  "id": number;
  "desc": string;
  "current": number;
  "status": number;
  "workflowFormMappingId": number;
  "routingParameter": string;
  currentUser: WorkflowSign;
  workflowSigns: WorkflowSign[];
  militaryOrderSigns: MilitaryOrderSign;
  TargetOperationSigns: TargetOperationSign;
  StandardOperationSigns: StandardOperationSign;
  workflowFormMapping: WorkflowFormMapping;
  constructor(data?: WorkflowInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Workflow`.
   */
  public static getModelName() {
    return "Workflow";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Workflow for dynamic purposes.
  **/
  public static factory(data: WorkflowInterface): Workflow{
    return new Workflow(data);
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
      name: 'Workflow',
      plural: 'Workflows',
      path: 'Workflows',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "current": {
          name: 'current',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "workflowFormMappingId": {
          name: 'workflowFormMappingId',
          type: 'number'
        },
        "routingParameter": {
          name: 'routingParameter',
          type: 'string'
        },
      },
      relations: {
        currentUser: {
          name: 'currentUser',
          type: 'WorkflowSign',
          model: 'WorkflowSign',
          relationType: 'belongsTo',
                  keyFrom: 'current',
          keyTo: 'id'
        },
        workflowSigns: {
          name: 'workflowSigns',
          type: 'WorkflowSign[]',
          model: 'WorkflowSign',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowId'
        },
        militaryOrderSigns: {
          name: 'militaryOrderSigns',
          type: 'MilitaryOrderSign',
          model: 'MilitaryOrderSign',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'signID'
        },
        TargetOperationSigns: {
          name: 'TargetOperationSigns',
          type: 'TargetOperationSign',
          model: 'TargetOperationSign',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'signID'
        },
        StandardOperationSigns: {
          name: 'StandardOperationSigns',
          type: 'StandardOperationSign',
          model: 'StandardOperationSign',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'signID'
        },
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
