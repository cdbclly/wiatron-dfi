/* tslint:disable */
import {
  ExitMeetingResult
} from '../index';

declare var Object: any;
export interface CheckListLogInterface {
  "ID"?: number;
  "EXITMEETINGID"?: string;
  "SEQ"?: number;
  "CHECKPOINT"?: string;
  "ITEMDESC"?: string;
  "PROCESS"?: string;
  "CHECKFUNCTIONPIC"?: string;
  "CHECKFUNCTIONROLE"?: string;
  "JUDGMENT"?: number;
  "PROBLEMDESC"?: string;
  "TAKEACTIONROLE"?: string;
  "TAKEACTIONPIC"?: string;
  "TARGETDATE"?: Date;
  "ACTUALDATE"?: Date;
  "ATTACHMENTFILENAME"?: string;
  "REMARK"?: string;
  "CREATEDBY"?: string;
  "CREATEDATE"?: Date;
  "UPDATEDBY"?: string;
  "UPDATEDDATE"?: Date;
  "ALLOWEDITFLAG"?: number;
  "ACTION"?: string;
  "MUSTDO"?: boolean;
  "SITE"?: string;
  "exitMeetingResultId"?: number;
  exitMeetingResult?: ExitMeetingResult;
}

export class CheckListLog implements CheckListLogInterface {
  "ID": number;
  "EXITMEETINGID": string;
  "SEQ": number;
  "CHECKPOINT": string;
  "ITEMDESC": string;
  "PROCESS": string;
  "CHECKFUNCTIONPIC": string;
  "CHECKFUNCTIONROLE": string;
  "JUDGMENT": number;
  "PROBLEMDESC": string;
  "TAKEACTIONROLE": string;
  "TAKEACTIONPIC": string;
  "TARGETDATE": Date;
  "ACTUALDATE": Date;
  "ATTACHMENTFILENAME": string;
  "REMARK": string;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDDATE": Date;
  "ALLOWEDITFLAG": number;
  "ACTION": string;
  "MUSTDO": boolean;
  "SITE": string;
  "exitMeetingResultId": number;
  exitMeetingResult: ExitMeetingResult;
  constructor(data?: CheckListLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CheckListLog`.
   */
  public static getModelName() {
    return "CheckListLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CheckListLog for dynamic purposes.
  **/
  public static factory(data: CheckListLogInterface): CheckListLog{
    return new CheckListLog(data);
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
      name: 'CheckListLog',
      plural: 'CheckListLogs',
      path: 'CheckListLogs',
      idName: 'ID',
      properties: {
        "ID": {
          name: 'ID',
          type: 'number'
        },
        "EXITMEETINGID": {
          name: 'EXITMEETINGID',
          type: 'string'
        },
        "SEQ": {
          name: 'SEQ',
          type: 'number'
        },
        "CHECKPOINT": {
          name: 'CHECKPOINT',
          type: 'string'
        },
        "ITEMDESC": {
          name: 'ITEMDESC',
          type: 'string'
        },
        "PROCESS": {
          name: 'PROCESS',
          type: 'string'
        },
        "CHECKFUNCTIONPIC": {
          name: 'CHECKFUNCTIONPIC',
          type: 'string'
        },
        "CHECKFUNCTIONROLE": {
          name: 'CHECKFUNCTIONROLE',
          type: 'string'
        },
        "JUDGMENT": {
          name: 'JUDGMENT',
          type: 'number'
        },
        "PROBLEMDESC": {
          name: 'PROBLEMDESC',
          type: 'string'
        },
        "TAKEACTIONROLE": {
          name: 'TAKEACTIONROLE',
          type: 'string'
        },
        "TAKEACTIONPIC": {
          name: 'TAKEACTIONPIC',
          type: 'string'
        },
        "TARGETDATE": {
          name: 'TARGETDATE',
          type: 'Date'
        },
        "ACTUALDATE": {
          name: 'ACTUALDATE',
          type: 'Date'
        },
        "ATTACHMENTFILENAME": {
          name: 'ATTACHMENTFILENAME',
          type: 'string'
        },
        "REMARK": {
          name: 'REMARK',
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
        "UPDATEDDATE": {
          name: 'UPDATEDDATE',
          type: 'Date'
        },
        "ALLOWEDITFLAG": {
          name: 'ALLOWEDITFLAG',
          type: 'number'
        },
        "ACTION": {
          name: 'ACTION',
          type: 'string'
        },
        "MUSTDO": {
          name: 'MUSTDO',
          type: 'boolean'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "exitMeetingResultId": {
          name: 'exitMeetingResultId',
          type: 'number'
        },
      },
      relations: {
        exitMeetingResult: {
          name: 'exitMeetingResult',
          type: 'ExitMeetingResult',
          model: 'ExitMeetingResult',
          relationType: 'belongsTo',
                  keyFrom: 'exitMeetingResultId',
          keyTo: 'id'
        },
      }
    }
  }
}
