/* tslint:disable */

declare var Object: any;
export interface WorkflowSignatoryInterface {
  "stage"?: number;
  "stageDesc"?: string;
  "picId"?: string;
  "isDynamic"?: number;
  "id"?: number;
  "workflowFormMappingId"?: number;
}

export class WorkflowSignatory implements WorkflowSignatoryInterface {
  "stage": number;
  "stageDesc": string;
  "picId": string;
  "isDynamic": number;
  "id": number;
  "workflowFormMappingId": number;
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
          type: 'number'
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
      }
    }
  }
}
