/* tslint:disable */
import {
  TrackingIssue
} from '../index';

declare var Object: any;
export interface TrackingIssuePicInterface {
  "employerId"?: string;
  "id"?: number;
  "trackingIssueId"?: number;
  trackingIssue?: TrackingIssue;
}

export class TrackingIssuePic implements TrackingIssuePicInterface {
  "employerId": string;
  "id": number;
  "trackingIssueId": number;
  trackingIssue: TrackingIssue;
  constructor(data?: TrackingIssuePicInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TrackingIssuePic`.
   */
  public static getModelName() {
    return "TrackingIssuePic";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TrackingIssuePic for dynamic purposes.
  **/
  public static factory(data: TrackingIssuePicInterface): TrackingIssuePic{
    return new TrackingIssuePic(data);
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
      name: 'TrackingIssuePic',
      plural: 'TrackingIssuePics',
      path: 'TrackingIssuePics',
      idName: 'id',
      properties: {
        "employerId": {
          name: 'employerId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "trackingIssueId": {
          name: 'trackingIssueId',
          type: 'number'
        },
      },
      relations: {
        trackingIssue: {
          name: 'trackingIssue',
          type: 'TrackingIssue',
          model: 'TrackingIssue',
          relationType: 'belongsTo',
                  keyFrom: 'trackingIssueId',
          keyTo: 'id'
        },
      }
    }
  }
}
