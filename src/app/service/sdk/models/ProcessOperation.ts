import { Process } from '@service/dfc_sdk/sdk';
import { Operation } from '@service/mrr-sdk';

/* tslint:disable */
declare var Object: any;
export interface ProcessOperationInterface {
  "id"?: number;
  "processId"?: number;
  "operationId"?: number;
  process?: Process;
  operation?: Operation;
}

export class ProcessOperation implements ProcessOperationInterface {
  "id": number;
  "processId": number;
  "operationId": number;
  process: Process;
  operation: Operation;
  constructor(data?: ProcessOperationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProcessOperation`.
   */
  public static getModelName() {
    return "ProcessOperation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProcessOperation for dynamic purposes.
  **/
  public static factory(data: ProcessOperationInterface): ProcessOperation{
    return new ProcessOperation(data);
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
      name: 'ProcessOperation',
      plural: 'ProcessOperations',
      path: 'ProcessOperations',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "processId": {
          name: 'processId',
          type: 'number'
        },
        "operationId": {
          name: 'operationId',
          type: 'number'
        },
      },
      relations: {
        process: {
          name: 'process',
          type: 'Process',
          model: 'Process',
          relationType: 'belongsTo',
                  keyFrom: 'processId',
          keyTo: 'id'
        },
        operation: {
          name: 'operation',
          type: 'Operation',
          model: 'Operation',
          relationType: 'belongsTo',
                  keyFrom: 'operationId',
          keyTo: 'id'
        },
      }
    }
  }
}
