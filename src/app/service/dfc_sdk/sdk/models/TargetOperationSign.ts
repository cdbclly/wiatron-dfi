/* tslint:disable */
import {
  Workflow,
  Member
} from '../index';

declare var Object: any;
export interface TargetOperationSignInterface {
  "stageID": number;
  "process": string;
  "signID": number;
  "sender"?: string;
  "date"?: Date;
  "id"?: number;
  workflow?: Workflow;
  senderInfo?: Member;
}

export class TargetOperationSign implements TargetOperationSignInterface {
  "stageID": number;
  "process": string;
  "signID": number;
  "sender": string;
  "date": Date;
  "id": number;
  workflow: Workflow;
  senderInfo: Member;
  constructor(data?: TargetOperationSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TargetOperationSign`.
   */
  public static getModelName() {
    return "TargetOperationSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TargetOperationSign for dynamic purposes.
  **/
  public static factory(data: TargetOperationSignInterface): TargetOperationSign{
    return new TargetOperationSign(data);
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
      name: 'TargetOperationSign',
      plural: 'TargetOperationSigns',
      path: 'TargetOperationSigns',
      idName: 'id',
      properties: {
        "stageID": {
          name: 'stageID',
          type: 'number'
        },
        "process": {
          name: 'process',
          type: 'string'
        },
        "signID": {
          name: 'signID',
          type: 'number',
          default: 0
        },
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
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
        senderInfo: {
          name: 'senderInfo',
          type: 'Member',
          model: 'Member',
          relationType: 'belongsTo',
                  keyFrom: 'sender',
          keyTo: 'EmpID'
        },
      }
    }
  }
}
