/* tslint:disable */
import {
  StandardOperationSign
} from '../index';

declare var Object: any;
export interface StandardOperationSignContentInterface {
  "key"?: any;
  "action"?: string;
  "value"?: string;
  "done"?: boolean;
  "id"?: number;
  "operationId"?: number;
  standardOperationSign?: StandardOperationSign;
}

export class StandardOperationSignContent implements StandardOperationSignContentInterface {
  "key": any;
  "action": string;
  "value": string;
  "done": boolean;
  "id": number;
  "operationId": number;
  standardOperationSign: StandardOperationSign;
  constructor(data?: StandardOperationSignContentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StandardOperationSignContent`.
   */
  public static getModelName() {
    return "StandardOperationSignContent";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StandardOperationSignContent for dynamic purposes.
  **/
  public static factory(data: StandardOperationSignContentInterface): StandardOperationSignContent{
    return new StandardOperationSignContent(data);
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
      name: 'StandardOperationSignContent',
      plural: 'StandardOperationSignContents',
      path: 'StandardOperationSignContents',
      idName: 'id',
      properties: {
        "key": {
          name: 'key',
          type: 'any'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'string'
        },
        "done": {
          name: 'done',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "operationId": {
          name: 'operationId',
          type: 'number'
        },
      },
      relations: {
        standardOperationSign: {
          name: 'standardOperationSign',
          type: 'StandardOperationSign',
          model: 'StandardOperationSign',
          relationType: 'belongsTo',
                  keyFrom: 'operationId',
          keyTo: 'id'
        },
      }
    }
  }
}
