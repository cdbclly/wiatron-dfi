/* tslint:disable */
import {
  ProjectPartNumber,
  FactoryIssue,
  NuddItem
} from '../index';

declare var Object: any;
export interface FactoryRecordInterface {
  "plantId": string;
  "projectPartNumberId": number;
  "dateCode"?: Date;
  "id"?: number;
  "input"?: number;
  "defectQty"?: number;
  "updatedOn"?: Date;
  projectPartNumber?: ProjectPartNumber;
  factoryIssues?: FactoryIssue[];
  nuddItems?: NuddItem[];
}

export class FactoryRecord implements FactoryRecordInterface {
  "plantId": string;
  "projectPartNumberId": number;
  "dateCode": Date;
  "id": number;
  "input": number;
  "defectQty": number;
  "updatedOn": Date;
  projectPartNumber: ProjectPartNumber;
  factoryIssues: FactoryIssue[];
  nuddItems: NuddItem[];
  constructor(data?: FactoryRecordInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactoryRecord`.
   */
  public static getModelName() {
    return "FactoryRecord";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactoryRecord for dynamic purposes.
  **/
  public static factory(data: FactoryRecordInterface): FactoryRecord{
    return new FactoryRecord(data);
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
      name: 'FactoryRecord',
      plural: 'FactoryRecords',
      path: 'FactoryRecords',
      idName: 'id',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "projectPartNumberId": {
          name: 'projectPartNumberId',
          type: 'number'
        },
        "dateCode": {
          name: 'dateCode',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "input": {
          name: 'input',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
      },
      relations: {
        projectPartNumber: {
          name: 'projectPartNumber',
          type: 'ProjectPartNumber',
          model: 'ProjectPartNumber',
          relationType: 'belongsTo',
                  keyFrom: 'projectPartNumberId',
          keyTo: 'id'
        },
        factoryIssues: {
          name: 'factoryIssues',
          type: 'FactoryIssue[]',
          model: 'FactoryIssue',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'factoryRecordId'
        },
        nuddItems: {
          name: 'nuddItems',
          type: 'NuddItem[]',
          model: 'NuddItem',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'factoryRecordId'
        },
      }
    }
  }
}
