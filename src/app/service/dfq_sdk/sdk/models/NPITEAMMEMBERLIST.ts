/* tslint:disable */
import {
  NPITEAMMEMBERHEAD
} from '../index';

declare var Object: any;
export interface NPITEAMMEMBERLISTInterface {
  "LISTID"?: string;
  "ROLE"?: string;
  "NAME_EN"?: string;
  "MEMBERSITE"?: string;
  "EMPLOYEEID"?: string;
  "NAME_CH"?: string;
  "EXTNO"?: string;
  "MOBILENO"?: string;
  "SHORTNO"?: string;
  "EMAIL"?: string;
  "SENIORITY"?: string;
  "EP"?: string;
  "REMARK"?: string;
  "REDREMARKFLAG"?: number;
  "CREATEDBY"?: string;
  "CREATEDATE"?: Date;
  "UPDATEDBY"?: string;
  "UPDATEDATE"?: Date;
  "SEQ"?: number;
  "JOB"?: string;
  "SHIFT"?: string;
  "ALLIEEXPERIECEYR"?: number;
  "MEETING_ATTENDANCE"?: string;
  "ISLEADER"?: string;
  "SITE"?: string;
  "id"?: number;
  head?: NPITEAMMEMBERHEAD;
}

export class NPITEAMMEMBERLIST implements NPITEAMMEMBERLISTInterface {
  "LISTID": string;
  "ROLE": string;
  "NAME_EN": string;
  "MEMBERSITE": string;
  "EMPLOYEEID": string;
  "NAME_CH": string;
  "EXTNO": string;
  "MOBILENO": string;
  "SHORTNO": string;
  "EMAIL": string;
  "SENIORITY": string;
  "EP": string;
  "REMARK": string;
  "REDREMARKFLAG": number;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  "SEQ": number;
  "JOB": string;
  "SHIFT": string;
  "ALLIEEXPERIECEYR": number;
  "MEETING_ATTENDANCE": string;
  "ISLEADER": string;
  "SITE": string;
  "id": number;
  head: NPITEAMMEMBERHEAD;
  constructor(data?: NPITEAMMEMBERLISTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPITEAMMEMBERLIST`.
   */
  public static getModelName() {
    return "NPITEAMMEMBERLIST";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPITEAMMEMBERLIST for dynamic purposes.
  **/
  public static factory(data: NPITEAMMEMBERLISTInterface): NPITEAMMEMBERLIST{
    return new NPITEAMMEMBERLIST(data);
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
      name: 'NPITEAMMEMBERLIST',
      plural: 'NPITEAMMEMBERLISTs',
      path: 'NPITEAMMEMBERLISTs',
      idName: 'id',
      properties: {
        "LISTID": {
          name: 'LISTID',
          type: 'string'
        },
        "ROLE": {
          name: 'ROLE',
          type: 'string'
        },
        "NAME_EN": {
          name: 'NAME_EN',
          type: 'string'
        },
        "MEMBERSITE": {
          name: 'MEMBERSITE',
          type: 'string'
        },
        "EMPLOYEEID": {
          name: 'EMPLOYEEID',
          type: 'string'
        },
        "NAME_CH": {
          name: 'NAME_CH',
          type: 'string'
        },
        "EXTNO": {
          name: 'EXTNO',
          type: 'string'
        },
        "MOBILENO": {
          name: 'MOBILENO',
          type: 'string'
        },
        "SHORTNO": {
          name: 'SHORTNO',
          type: 'string'
        },
        "EMAIL": {
          name: 'EMAIL',
          type: 'string'
        },
        "SENIORITY": {
          name: 'SENIORITY',
          type: 'string'
        },
        "EP": {
          name: 'EP',
          type: 'string'
        },
        "REMARK": {
          name: 'REMARK',
          type: 'string'
        },
        "REDREMARKFLAG": {
          name: 'REDREMARKFLAG',
          type: 'number'
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
        "SEQ": {
          name: 'SEQ',
          type: 'number'
        },
        "JOB": {
          name: 'JOB',
          type: 'string'
        },
        "SHIFT": {
          name: 'SHIFT',
          type: 'string'
        },
        "ALLIEEXPERIECEYR": {
          name: 'ALLIEEXPERIECEYR',
          type: 'number'
        },
        "MEETING_ATTENDANCE": {
          name: 'MEETING_ATTENDANCE',
          type: 'string'
        },
        "ISLEADER": {
          name: 'ISLEADER',
          type: 'string'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        head: {
          name: 'head',
          type: 'NPITEAMMEMBERHEAD',
          model: 'NPITEAMMEMBERHEAD',
          relationType: 'belongsTo',
                  keyFrom: 'LISTID',
          keyTo: 'LISTID'
        },
      }
    }
  }
}
