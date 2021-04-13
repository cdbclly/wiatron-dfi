/* tslint:disable */
import {
  Workflow
} from '../index';

declare var Object: any;
export interface RewardSignInterface {
  "signID"?: number;
  "version"?: string;
  "content"?: any;
  "date"?: Date;
  "sender"?: string;
  "currentVersion"?: boolean;
  "model"?: string;
  "id"?: number;
  workflow?: Workflow;
}

export class RewardSign implements RewardSignInterface {
  "signID": number;
  "version": string;
  "content": any;
  "date": Date;
  "sender": string;
  "currentVersion": boolean;
  "model": string;
  "id": number;
  workflow: Workflow;
  constructor(data?: RewardSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RewardSign`.
   */
  public static getModelName() {
    return "RewardSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RewardSign for dynamic purposes.
  **/
  public static factory(data: RewardSignInterface): RewardSign{
    return new RewardSign(data);
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
      name: 'RewardSign',
      plural: 'RewardSigns',
      path: 'RewardSigns',
      idName: 'id',
      properties: {
        "signID": {
          name: 'signID',
          type: 'number'
        },
        "version": {
          name: 'version',
          type: 'string'
        },
        "content": {
          name: 'content',
          type: 'any'
        },
        "date": {
          name: 'date',
          type: 'Date',
          default: new Date(0)
        },
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "currentVersion": {
          name: 'currentVersion',
          type: 'boolean',
          default: false
        },
        "model": {
          name: 'model',
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
      }
    }
  }
}
