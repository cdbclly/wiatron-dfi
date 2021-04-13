/* tslint:disable */
import {
  TrackingIssuePic
} from '../index';

declare var Object: any;
export interface TrackingIssueInterface {
  "dueDate"?: Date;
  "status"?: string;
  "picReply"?: string;
  "description"?: string;
  "initiator"?: string;
  "closingTime"?: Date;
  "createdOn"?: Date;
  "id"?: number;
  trackingIssuePics?: TrackingIssuePic[];
}

export class TrackingIssue implements TrackingIssueInterface {
  "dueDate": Date;
  "status": string;
  "picReply": string;
  "description": string;
  "initiator": string;
  "closingTime": Date;
  "createdOn": Date;
  "id": number;
  trackingIssuePics: TrackingIssuePic[];
  constructor(data?: TrackingIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TrackingIssue`.
   */
  public static getModelName() {
    return "TrackingIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TrackingIssue for dynamic purposes.
  **/
  public static factory(data: TrackingIssueInterface): TrackingIssue{
    return new TrackingIssue(data);
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
      name: 'TrackingIssue',
      plural: 'TrackingIssues',
      path: 'TrackingIssues',
      idName: 'id',
      properties: {
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "picReply": {
          name: 'picReply',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "initiator": {
          name: 'initiator',
          type: 'string'
        },
        "closingTime": {
          name: 'closingTime',
          type: 'Date'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        trackingIssuePics: {
          name: 'trackingIssuePics',
          type: 'TrackingIssuePic[]',
          model: 'TrackingIssuePic',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'trackingIssueId'
        },
      }
    }
  }
}
