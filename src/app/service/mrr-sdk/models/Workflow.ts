/* tslint:disable */
import {
  Fact,
  WorkflowSign
} from '../index';

declare var Object: any;
export interface WorkflowInterface {
  "desc"?: string;
  "current"?: number;
  "status"?: string;
  "remark"?: string;
  "routingParameter"?: string;
  "id"?: number;
  "workflowFormMappingId"?: number;
  facts?: Fact;
  workflowSigns?: WorkflowSign[];
}

export class Workflow implements WorkflowInterface {
  "desc": string;
  "current": number;
  "status": string;
  "remark": string;
  "routingParameter": string;
  "id": number;
  "workflowFormMappingId": number;
  facts: Fact;
  workflowSigns: WorkflowSign[];
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
          type: 'string'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "routingParameter": {
          name: 'routingParameter',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "workflowFormMappingId": {
          name: 'workflowFormMappingId',
          type: 'number'
        },
      },
      relations: {
        facts: {
          name: 'facts',
          type: 'Fact',
          model: 'Fact',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'workflowId'
        },
        workflowSigns: {
          name: 'workflowSigns',
          type: 'WorkflowSign[]',
          model: 'WorkflowSign',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'workflowId'
        },
      }
    }
  }
}
