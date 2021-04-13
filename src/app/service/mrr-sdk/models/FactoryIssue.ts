/* tslint:disable */
import {
  FactoryRecord
} from '../index';

declare var Object: any;
export interface FactoryIssueInterface {
  "id"?: number;
  "factoryRecordId": number;
  "issue"?: string;
  "input"?: number;
  "defectQty"?: number;
  "rootcause"?: string;
  "action"?: string;
  "owner"?: string;
  "dueDate"?: Date;
  "status"?: number;
  "filePath"?: string;
  factoryRecord?: FactoryRecord;
}

export class FactoryIssue implements FactoryIssueInterface {
  "id": number;
  "factoryRecordId": number;
  "issue": string;
  "input": number;
  "defectQty": number;
  "rootcause": string;
  "action": string;
  "owner": string;
  "dueDate": Date;
  "status": number;
  "filePath": string;
  factoryRecord: FactoryRecord;
  constructor(data?: FactoryIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactoryIssue`.
   */
  public static getModelName() {
    return "FactoryIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactoryIssue for dynamic purposes.
  **/
  public static factory(data: FactoryIssueInterface): FactoryIssue{
    return new FactoryIssue(data);
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
      name: 'FactoryIssue',
      plural: 'FactoryIssues',
      path: 'FactoryIssues',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "factoryRecordId": {
          name: 'factoryRecordId',
          type: 'number'
        },
        "issue": {
          name: 'issue',
          type: 'string'
        },
        "input": {
          name: 'input',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "rootcause": {
          name: 'rootcause',
          type: 'string'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "filePath": {
          name: 'filePath',
          type: 'string'
        },
      },
      relations: {
        factoryRecord: {
          name: 'factoryRecord',
          type: 'FactoryRecord',
          model: 'FactoryRecord',
          relationType: 'belongsTo',
                  keyFrom: 'factoryRecordId',
          keyTo: 'id'
        },
      }
    }
  }
}
