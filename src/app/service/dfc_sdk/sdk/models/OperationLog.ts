/* tslint:disable */

declare var Object: any;
export interface OperationLogInterface {
  "timestamp"?: Date;
  "userID"?: string;
  "APname"?: string;
  "data"?: string;
  "id"?: number;
}

export class OperationLog implements OperationLogInterface {
  "timestamp": Date;
  "userID": string;
  "APname": string;
  "data": string;
  "id": number;
  constructor(data?: OperationLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OperationLog`.
   */
  public static getModelName() {
    return "OperationLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OperationLog for dynamic purposes.
  **/
  public static factory(data: OperationLogInterface): OperationLog{
    return new OperationLog(data);
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
      name: 'OperationLog',
      plural: 'OperationLogs',
      path: 'OperationLogs',
      idName: 'id',
      properties: {
        "timestamp": {
          name: 'timestamp',
          type: 'Date'
        },
        "userID": {
          name: 'userID',
          type: 'string'
        },
        "APname": {
          name: 'APname',
          type: 'string'
        },
        "data": {
          name: 'data',
          type: 'string'
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
