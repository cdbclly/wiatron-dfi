/* tslint:disable */
import {
  ExitMeetingResult
} from '../index';

declare var Object: any;
export interface NPICHECKLIST_EM_HEADInterface {
  "id"?: number;
  "SITE"?: string;
  "PLANT"?: string;
  "MODEL"?: string;
  "STAGE"?: string;
  "VERSION"?: string;
  "MEETINGDATE"?: Date;
  "EXITMEETINGID"?: string;
  "SIGNSTATUS"?: number;
  "DUEDATE"?: Date;
  "DOCNO"?: string;
  "CREATEDBY"?: string;
  "CREATEDATE"?: Date;
  "UPDATEDBY"?: string;
  "UPDATEDATE"?: Date;
  exitMeetingResults?: ExitMeetingResult[];
}

export class NPICHECKLIST_EM_HEAD implements NPICHECKLIST_EM_HEADInterface {
  "id": number;
  "SITE": string;
  "PLANT": string;
  "MODEL": string;
  "STAGE": string;
  "VERSION": string;
  "MEETINGDATE": Date;
  "EXITMEETINGID": string;
  "SIGNSTATUS": number;
  "DUEDATE": Date;
  "DOCNO": string;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  exitMeetingResults: ExitMeetingResult[];
  constructor(data?: NPICHECKLIST_EM_HEADInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPICHECKLIST_EM_HEAD`.
   */
  public static getModelName() {
    return "NPICHECKLIST_EM_HEAD";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPICHECKLIST_EM_HEAD for dynamic purposes.
  **/
  public static factory(data: NPICHECKLIST_EM_HEADInterface): NPICHECKLIST_EM_HEAD{
    return new NPICHECKLIST_EM_HEAD(data);
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
      name: 'NPICHECKLIST_EM_HEAD',
      plural: 'NPICHECKLIST_EM_HEADs',
      path: 'NPICHECKLIST_EM_HEADs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "MODEL": {
          name: 'MODEL',
          type: 'string'
        },
        "STAGE": {
          name: 'STAGE',
          type: 'string'
        },
        "VERSION": {
          name: 'VERSION',
          type: 'string'
        },
        "MEETINGDATE": {
          name: 'MEETINGDATE',
          type: 'Date'
        },
        "EXITMEETINGID": {
          name: 'EXITMEETINGID',
          type: 'string'
        },
        "SIGNSTATUS": {
          name: 'SIGNSTATUS',
          type: 'number'
        },
        "DUEDATE": {
          name: 'DUEDATE',
          type: 'Date'
        },
        "DOCNO": {
          name: 'DOCNO',
          type: 'string'
        },
        "CREATEDBY": {
          name: 'CREATEDBY',
          type: 'string'
        },
        "CREATEDATE": {
          name: 'CREATEDATE',
          type: 'Date'
        },
        "UPDATEDBY": {
          name: 'UPDATEDBY',
          type: 'string'
        },
        "UPDATEDATE": {
          name: 'UPDATEDATE',
          type: 'Date'
        },
      },
      relations: {
        exitMeetingResults: {
          name: 'exitMeetingResults',
          type: 'ExitMeetingResult[]',
          model: 'ExitMeetingResult',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'exitMeetingId'
        },
      }
    }
  }
}
