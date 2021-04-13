/* tslint:disable */

declare var Object: any;
export interface ModelOperationTimeInterface {
  "StageID": number;
  "ProcessCode": string;
  "CostTime": number;
}

export class ModelOperationTime implements ModelOperationTimeInterface {
  "StageID": number;
  "ProcessCode": string;
  "CostTime": number;
  constructor(data?: ModelOperationTimeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelOperationTime`.
   */
  public static getModelName() {
    return "ModelOperationTime";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelOperationTime for dynamic purposes.
  **/
  public static factory(data: ModelOperationTimeInterface): ModelOperationTime{
    return new ModelOperationTime(data);
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
      name: 'ModelOperationTime',
      plural: 'ModelOperationTimes',
      path: 'ModelOperationTimes',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "ProcessCode": {
          name: 'ProcessCode',
          type: 'string'
        },
        "CostTime": {
          name: 'CostTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
