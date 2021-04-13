/* tslint:disable */
import {
  USER,
  Tip
} from '../index';

declare var Object: any;
export interface DPMPDTISSUESInterface {
  "syncid"?: number;
  "issueid"?: string;
  "syncdate"?: Date;
  "syncaction"?: string;
  "site"?: string;
  "line"?: string;
  "plant"?: string;
  "mfgtype"?: string;
  "shiftdate"?: Date;
  "shiftid"?: string;
  "bu"?: string;
  "model"?: string;
  "losshour"?: number;
  "code"?: string;
  "codedescription"?: string;
  "issue"?: string;
  "status"?: number;
  "fromnumber"?: string;
  "datafrom"?: number;
  "meeting"?: number;
  "pic"?: string;
  "rootcause"?: string;
  "action"?: string;
  "duedate"?: Date;
  "remark"?: string;
  "createdate"?: Date;
  "createuser"?: string;
  "updatedate"?: Date;
  "updateuser"?: string;
  pics?: USER;
  tips?: Tip[];
}

export class DPMPDTISSUES implements DPMPDTISSUESInterface {
  "syncid": number;
  "issueid": string;
  "syncdate": Date;
  "syncaction": string;
  "site": string;
  "line": string;
  "plant": string;
  "mfgtype": string;
  "shiftdate": Date;
  "shiftid": string;
  "bu": string;
  "model": string;
  "losshour": number;
  "code": string;
  "codedescription": string;
  "issue": string;
  "status": number;
  "fromnumber": string;
  "datafrom": number;
  "meeting": number;
  "pic": string;
  "rootcause": string;
  "action": string;
  "duedate": Date;
  "remark": string;
  "createdate": Date;
  "createuser": string;
  "updatedate": Date;
  "updateuser": string;
  pics: USER;
  tips: Tip[];
  constructor(data?: DPMPDTISSUESInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMPDTISSUES`.
   */
  public static getModelName() {
    return "DPMPDTISSUES";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMPDTISSUES for dynamic purposes.
  **/
  public static factory(data: DPMPDTISSUESInterface): DPMPDTISSUES{
    return new DPMPDTISSUES(data);
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
      name: 'DPMPDTISSUES',
      plural: 'dpmpdtissues',
      path: 'dpmpdtissues',
      idName: 'issueid',
      properties: {
        "syncid": {
          name: 'syncid',
          type: 'number'
        },
        "issueid": {
          name: 'issueid',
          type: 'string'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "syncaction": {
          name: 'syncaction',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "shiftdate": {
          name: 'shiftdate',
          type: 'Date'
        },
        "shiftid": {
          name: 'shiftid',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "losshour": {
          name: 'losshour',
          type: 'number'
        },
        "code": {
          name: 'code',
          type: 'string'
        },
        "codedescription": {
          name: 'codedescription',
          type: 'string'
        },
        "issue": {
          name: 'issue',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number',
          default: 1
        },
        "fromnumber": {
          name: 'fromnumber',
          type: 'string'
        },
        "datafrom": {
          name: 'datafrom',
          type: 'number'
        },
        "meeting": {
          name: 'meeting',
          type: 'number'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "rootcause": {
          name: 'rootcause',
          type: 'string'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "duedate": {
          name: 'duedate',
          type: 'Date'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "createuser": {
          name: 'createuser',
          type: 'string'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
        "updateuser": {
          name: 'updateuser',
          type: 'string'
        },
      },
      relations: {
        pics: {
          name: 'pics',
          type: 'USER',
          model: 'USER',
          relationType: 'belongsTo',
                  keyFrom: 'pic',
          keyTo: 'USERID'
        },
        tips: {
          name: 'tips',
          type: 'Tip[]',
          model: 'Tip',
          relationType: 'hasMany',
                  keyFrom: 'issueid',
          keyTo: 'issueid'
        },
      }
    }
  }
}
