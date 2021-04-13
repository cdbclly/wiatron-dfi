/* tslint:disable */
import {
  USER,
  FpyrTip
} from '../index';

declare var Object: any;
export interface DPMYRISSUEInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "issueid"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "model"?: string;
  "stage"?: string;
  "errorcode"?: string;
  "errdescription"?: string;
  "reasoncode"?: string;
  "reasondescription"?: string;
  "location"?: string;
  "qty"?: number;
  "status"?: number;
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
  tips?: FpyrTip[];
}

export class DPMYRISSUE implements DPMYRISSUEInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "issueid": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "customer": string;
  "mfgtype": string;
  "line": string;
  "model": string;
  "stage": string;
  "errorcode": string;
  "errdescription": string;
  "reasoncode": string;
  "reasondescription": string;
  "location": string;
  "qty": number;
  "status": number;
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
  tips: FpyrTip[];
  constructor(data?: DPMYRISSUEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMYRISSUE`.
   */
  public static getModelName() {
    return "DPMYRISSUE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMYRISSUE for dynamic purposes.
  **/
  public static factory(data: DPMYRISSUEInterface): DPMYRISSUE{
    return new DPMYRISSUE(data);
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
      name: 'DPMYRISSUE',
      plural: 'DPMYRISSUES',
      path: 'DPMYRISSUES',
      idName: 'issueid',
      properties: {
        "syncid": {
          name: 'syncid',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "syncaction": {
          name: 'syncaction',
          type: 'string'
        },
        "issueid": {
          name: 'issueid',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "periodtype": {
          name: 'periodtype',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "errorcode": {
          name: 'errorcode',
          type: 'string'
        },
        "errdescription": {
          name: 'errdescription',
          type: 'string'
        },
        "reasoncode": {
          name: 'reasoncode',
          type: 'string'
        },
        "reasondescription": {
          name: 'reasondescription',
          type: 'string'
        },
        "location": {
          name: 'location',
          type: 'string'
        },
        "qty": {
          name: 'qty',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number',
          default: 1
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
          type: 'FpyrTip[]',
          model: 'FpyrTip',
          relationType: 'hasMany',
                  keyFrom: 'issueid',
          keyTo: 'issueid'
        },
      }
    }
  }
}
