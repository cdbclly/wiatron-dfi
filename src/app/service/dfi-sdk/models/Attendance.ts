/* tslint:disable */
import {
  Meeting
} from '../index';

declare var Object: any;
export interface AttendanceInterface {
  "status"?: number;
  "employeeId"?: string;
  "site"?: string;
  "id"?: number;
  "meetingId"?: number;
  meeting?: Meeting;
}

export class Attendance implements AttendanceInterface {
  "status": number;
  "employeeId": string;
  "site": string;
  "id": number;
  "meetingId": number;
  meeting: Meeting;
  constructor(data?: AttendanceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Attendance`.
   */
  public static getModelName() {
    return "Attendance";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Attendance for dynamic purposes.
  **/
  public static factory(data: AttendanceInterface): Attendance{
    return new Attendance(data);
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
      name: 'Attendance',
      plural: 'Attendances',
      path: 'Attendances',
      idName: 'id',
      properties: {
        "status": {
          name: 'status',
          type: 'number'
        },
        "employeeId": {
          name: 'employeeId',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "meetingId": {
          name: 'meetingId',
          type: 'number'
        },
      },
      relations: {
        meeting: {
          name: 'meeting',
          type: 'Meeting',
          model: 'Meeting',
          relationType: 'belongsTo',
                  keyFrom: 'meetingId',
          keyTo: 'id'
        },
      }
    }
  }
}
