/* tslint:disable */

declare var Object: any;
export interface ModelOperationsLogInterface {
  "Time"?: Date;
  "StageID"?: number;
  "FactorDetailID"?: number;
  "Count"?: number;
  "id"?: number;
}

export class ModelOperationsLog implements ModelOperationsLogInterface {
  "Time": Date;
  "StageID": number;
  "FactorDetailID": number;
  "Count": number;
  "id": number;
  constructor(data?: ModelOperationsLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelOperationsLog`.
   */
  public static getModelName() {
    return "ModelOperationsLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelOperationsLog for dynamic purposes.
  **/
  public static factory(data: ModelOperationsLogInterface): ModelOperationsLog{
    return new ModelOperationsLog(data);
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
      name: 'ModelOperationsLog',
      plural: 'ModelOperationsLogs',
      path: 'ModelOperationsLogs',
      idName: 'id',
      properties: {
        "Time": {
          name: 'Time',
          type: 'Date'
        },
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
        "Count": {
          name: 'Count',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
