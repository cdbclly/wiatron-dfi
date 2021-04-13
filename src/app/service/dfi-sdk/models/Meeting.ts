/* tslint:disable */
import {
  Attendance
} from '../index';

declare var Object: any;
export interface MeetingInterface {
  "yearmonth"?: string;
  "projectSummaryPath"?: string;
  "projectStatusPath"?: string;
  "updatedOn"?: Date;
  "updatedBy"?: string;
  "id"?: number;
  attendances?: Attendance[];
}

export class Meeting implements MeetingInterface {
  "yearmonth": string;
  "projectSummaryPath": string;
  "projectStatusPath": string;
  "updatedOn": Date;
  "updatedBy": string;
  "id": number;
  attendances: Attendance[];
  constructor(data?: MeetingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Meeting`.
   */
  public static getModelName() {
    return "Meeting";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Meeting for dynamic purposes.
  **/
  public static factory(data: MeetingInterface): Meeting{
    return new Meeting(data);
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
      name: 'Meeting',
      plural: 'Meetings',
      path: 'Meetings',
      idName: 'id',
      properties: {
        "yearmonth": {
          name: 'yearmonth',
          type: 'string'
        },
        "projectSummaryPath": {
          name: 'projectSummaryPath',
          type: 'string'
        },
        "projectStatusPath": {
          name: 'projectStatusPath',
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
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        attendances: {
          name: 'attendances',
          type: 'Attendance[]',
          model: 'Attendance',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'meetingId'
        },
      }
    }
  }
}
