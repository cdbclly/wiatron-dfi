/* tslint:disable */

declare var Object: any;
export interface NPICHECKLIST_EMInterface {
  "SEQ": number;
  "EXITMEETINGID": string;
  "CHECKPOINT"?: string;
  "ITEMDESC"?: string;
  "PROCESS": string;
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
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  "ALLOWEDITFLAG"?: number;
  "ACTION"?: string;
  "MUSTDO"?: number;
  "SITE"?: string;
}

export class NPICHECKLIST_EM implements NPICHECKLIST_EMInterface {
  "SEQ": number;
  "EXITMEETINGID": string;
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
  "UPDATEDATE": Date;
  "ALLOWEDITFLAG": number;
  "ACTION": string;
  "MUSTDO": number;
  "SITE": string;
  constructor(data?: NPICHECKLIST_EMInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPICHECKLIST_EM`.
   */
  public static getModelName() {
    return "NPICHECKLIST_EM";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPICHECKLIST_EM for dynamic purposes.
  **/
  public static factory(data: NPICHECKLIST_EMInterface): NPICHECKLIST_EM{
    return new NPICHECKLIST_EM(data);
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
      name: 'NPICHECKLIST_EM',
      plural: 'NPICHECKLIST_EMs',
      path: 'NPICHECKLIST_EMs',
      idName: 'SEQ',
      properties: {
        "SEQ": {
          name: 'SEQ',
          type: 'number'
        },
        "EXITMEETINGID": {
          name: 'EXITMEETINGID',
          type: 'string'
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
        "UPDATEDATE": {
          name: 'UPDATEDATE',
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
          type: 'number'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
