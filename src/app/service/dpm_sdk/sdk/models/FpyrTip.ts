/* tslint:disable */
import {
  DPMYRISSUE,
  USER
} from '../index';

declare var Object: any;
export interface FpyrTipInterface {
  "issueid"?: string;
  "desc"?: string;
  "duedate"?: Date;
  "id"?: number;
  "pic"?: string;
  dpmyrissues?: DPMYRISSUE;
  pics?: USER;
}

export class FpyrTip implements FpyrTipInterface {
  "issueid": string;
  "desc": string;
  "duedate": Date;
  "id": number;
  "pic": string;
  dpmyrissues: DPMYRISSUE;
  pics: USER;
  constructor(data?: FpyrTipInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FpyrTip`.
   */
  public static getModelName() {
    return "FpyrTip";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FpyrTip for dynamic purposes.
  **/
  public static factory(data: FpyrTipInterface): FpyrTip{
    return new FpyrTip(data);
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
      name: 'FpyrTip',
      plural: 'FpyrTips',
      path: 'FpyrTips',
      idName: 'id',
      properties: {
        "issueid": {
          name: 'issueid',
          type: 'string'
        },
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "duedate": {
          name: 'duedate',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
      },
      relations: {
        dpmyrissues: {
          name: 'dpmyrissues',
          type: 'DPMYRISSUE',
          model: 'DPMYRISSUE',
          relationType: 'belongsTo',
                  keyFrom: 'issueid',
          keyTo: 'issueid'
        },
        pics: {
          name: 'pics',
          type: 'USER',
          model: 'USER',
          relationType: 'belongsTo',
                  keyFrom: 'pic',
          keyTo: 'USERID'
        },
      }
    }
  }
}
