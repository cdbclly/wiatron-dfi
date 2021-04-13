/* tslint:disable */
import {
  Workflow,
  StandardOperationSignContent
} from '../index';

declare var Object: any;
export interface StandardOperationSignInterface {
  "signID": number;
  "sender"?: string;
  "status"?: number;
  "date"?: Date;
  "modelType"?: string;
  "process"?: string;
  "id"?: number;
  workflow?: Workflow;
  standardOperationSignContents?: StandardOperationSignContent[];
}

export class StandardOperationSign implements StandardOperationSignInterface {
  "signID": number;
  "sender": string;
  "status": number;
  "date": Date;
  "modelType": string;
  "process": string;
  "id": number;
  workflow: Workflow;
  standardOperationSignContents: StandardOperationSignContent[];
  constructor(data?: StandardOperationSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StandardOperationSign`.
   */
  public static getModelName() {
    return "StandardOperationSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StandardOperationSign for dynamic purposes.
  **/
  public static factory(data: StandardOperationSignInterface): StandardOperationSign{
    return new StandardOperationSign(data);
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
      name: 'StandardOperationSign',
      plural: 'StandardOperationSigns',
      path: 'StandardOperationSigns',
      idName: 'id',
      properties: {
        "signID": {
          name: 'signID',
          type: 'number'
        },
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "modelType": {
          name: 'modelType',
          type: 'string'
        },
        "process": {
          name: 'process',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        workflow: {
          name: 'workflow',
          type: 'Workflow',
          model: 'Workflow',
          relationType: 'belongsTo',
                  keyFrom: 'signID',
          keyTo: 'id'
        },
        standardOperationSignContents: {
          name: 'standardOperationSignContents',
          type: 'StandardOperationSignContent[]',
          model: 'StandardOperationSignContent',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'operationId'
        },
      }
    }
  }
}
