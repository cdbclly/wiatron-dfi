/* tslint:disable */
import {
  DPMPDTISSUES,
  USER
} from '../index';

declare var Object: any;
export interface TipInterface {
  "issueid"?: string;
  "desc"?: string;
  "duedate"?: Date;
  "id"?: number;
  "pic"?: string;
  dpmpdtissues?: DPMPDTISSUES;
  pics?: USER;
}

export class Tip implements TipInterface {
  "issueid": string;
  "desc": string;
  "duedate": Date;
  "id": number;
  "pic": string;
  dpmpdtissues: DPMPDTISSUES;
  pics: USER;
  constructor(data?: TipInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Tip`.
   */
  public static getModelName() {
    return "Tip";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Tip for dynamic purposes.
  **/
  public static factory(data: TipInterface): Tip{
    return new Tip(data);
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
      name: 'Tip',
      plural: 'Tips',
      path: 'Tips',
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
        dpmpdtissues: {
          name: 'dpmpdtissues',
          type: 'DPMPDTISSUES',
          model: 'DPMPDTISSUES',
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
