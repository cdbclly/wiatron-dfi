/* tslint:disable */
import {
  Plant
} from '../index';

declare var Object: any;
export interface FloorExecutionIssueInterface {
  "subsystemName"?: string;
  "description"?: string;
  "rootCause"?: string;
  "pic"?: string;
  "dueDate"?: Date;
  "actualCloseDay"?: Date;
  "status"?: number;
  "solution"?: string;
  "updatedOn"?: Date;
  "updatedBy"?: string;
  "createdOn"?: Date;
  "createdBy"?: string;
  "category"?: string;
  "priority"?: string;
  "id"?: number;
  "plantId"?: string;
  plant?: Plant;
}

export class FloorExecutionIssue implements FloorExecutionIssueInterface {
  "subsystemName": string;
  "description": string;
  "rootCause": string;
  "pic": string;
  "dueDate": Date;
  "actualCloseDay": Date;
  "status": number;
  "solution": string;
  "updatedOn": Date;
  "updatedBy": string;
  "createdOn": Date;
  "createdBy": string;
  "category": string;
  "priority": string;
  "id": number;
  "plantId": string;
  plant: Plant;
  constructor(data?: FloorExecutionIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FloorExecutionIssue`.
   */
  public static getModelName() {
    return "FloorExecutionIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FloorExecutionIssue for dynamic purposes.
  **/
  public static factory(data: FloorExecutionIssueInterface): FloorExecutionIssue{
    return new FloorExecutionIssue(data);
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
      name: 'FloorExecutionIssue',
      plural: 'FloorExecutionIssues',
      path: 'FloorExecutionIssues',
      idName: 'id',
      properties: {
        "subsystemName": {
          name: 'subsystemName',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "rootCause": {
          name: 'rootCause',
          type: 'string'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "actualCloseDay": {
          name: 'actualCloseDay',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "solution": {
          name: 'solution',
          type: 'string'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "category": {
          name: 'category',
          type: 'string'
        },
        "priority": {
          name: 'priority',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'Plant',
          model: 'Plant',
          relationType: 'belongsTo',
                  keyFrom: 'plantId',
          keyTo: 'id'
        },
      }
    }
  }
}
