/* tslint:disable */
import {
  NPICHECKLIST_EM_HEAD,
  CheckListLog
} from '../index';

declare var Object: any;
export interface ExitMeetingResultInterface {
  "exitMeetingId"?: number;
  "workflowId"?: number;
  "status"?: number;
  "signStatus"?: number;
  "updatedDate"?: Date;
  "updatedBy"?: string;
  "id"?: number;
  exitMeeting?: NPICHECKLIST_EM_HEAD;
  checkListLogs?: CheckListLog[];
}

export class ExitMeetingResult implements ExitMeetingResultInterface {
  "exitMeetingId": number;
  "workflowId": number;
  "status": number;
  "signStatus": number;
  "updatedDate": Date;
  "updatedBy": string;
  "id": number;
  exitMeeting: NPICHECKLIST_EM_HEAD;
  checkListLogs: CheckListLog[];
  constructor(data?: ExitMeetingResultInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ExitMeetingResult`.
   */
  public static getModelName() {
    return "ExitMeetingResult";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ExitMeetingResult for dynamic purposes.
  **/
  public static factory(data: ExitMeetingResultInterface): ExitMeetingResult{
    return new ExitMeetingResult(data);
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
      name: 'ExitMeetingResult',
      plural: 'ExitMeetingResults',
      path: 'ExitMeetingResults',
      idName: 'id',
      properties: {
        "exitMeetingId": {
          name: 'exitMeetingId',
          type: 'number'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "signStatus": {
          name: 'signStatus',
          type: 'number'
        },
        "updatedDate": {
          name: 'updatedDate',
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
        exitMeeting: {
          name: 'exitMeeting',
          type: 'NPICHECKLIST_EM_HEAD',
          model: 'NPICHECKLIST_EM_HEAD',
          relationType: 'belongsTo',
                  keyFrom: 'exitMeetingId',
          keyTo: 'id'
        },
        checkListLogs: {
          name: 'checkListLogs',
          type: 'CheckListLog[]',
          model: 'CheckListLog',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'exitMeetingResultId'
        },
      }
    }
  }
}
