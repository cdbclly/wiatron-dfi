/* tslint:disable */
import {
  TargetOperations
} from '../index';

declare var Object: any;
export interface ModelOperationsInterface {
  "ModelOperationID"?: number;
  "StageID"?: number;
  "Module"?: string;
  "FactorDetailID"?: number;
  "Count"?: number;
  "Version"?: number;
  targetOperation?: TargetOperations;
}

export class ModelOperations implements ModelOperationsInterface {
  "ModelOperationID": number;
  "StageID": number;
  "Module": string;
  "FactorDetailID": number;
  "Count": number;
  "Version": number;
  targetOperation: TargetOperations;
  constructor(data?: ModelOperationsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelOperations`.
   */
  public static getModelName() {
    return "ModelOperations";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelOperations for dynamic purposes.
  **/
  public static factory(data: ModelOperationsInterface): ModelOperations{
    return new ModelOperations(data);
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
      name: 'ModelOperations',
      plural: 'ModelOperations',
      path: 'ModelOperations',
      idName: 'ModelOperationID',
      properties: {
        "ModelOperationID": {
          name: 'ModelOperationID',
          type: 'number'
        },
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "Module": {
          name: 'Module',
          type: 'string'
        },
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
        "Count": {
          name: 'Count',
          type: 'number'
        },
        "Version": {
          name: 'Version',
          type: 'number'
        },
      },
      relations: {
        targetOperation: {
          name: 'targetOperation',
          type: 'TargetOperations',
          model: 'TargetOperations',
          relationType: 'hasOne',
                  keyFrom: 'ModelOperationID',
          keyTo: 'ModelOperationID'
        },
      }
    }
  }
}
