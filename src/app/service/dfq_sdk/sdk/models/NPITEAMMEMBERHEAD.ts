/* tslint:disable */
import {
  NPITEAMMEMBERLIST
} from '../index';

declare var Object: any;
export interface NPITEAMMEMBERHEADInterface {
  "SITE"?: string;
  "PLANT"?: string;
  "MODEL"?: string;
  "ISSUER"?: string;
  "LISTID": string;
  "CREATEDBY"?: string;
  "CREATEDATE"?: Date;
  "UPDATEDBY"?: string;
  "UPDATEDATE"?: Date;
  "ALERTFLAG"?: string;
  "EMAIL"?: string;
  list?: NPITEAMMEMBERLIST[];
}

export class NPITEAMMEMBERHEAD implements NPITEAMMEMBERHEADInterface {
  "SITE": string;
  "PLANT": string;
  "MODEL": string;
  "ISSUER": string;
  "LISTID": string;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  "ALERTFLAG": string;
  "EMAIL": string;
  list: NPITEAMMEMBERLIST[];
  constructor(data?: NPITEAMMEMBERHEADInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPITEAMMEMBERHEAD`.
   */
  public static getModelName() {
    return "NPITEAMMEMBERHEAD";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPITEAMMEMBERHEAD for dynamic purposes.
  **/
  public static factory(data: NPITEAMMEMBERHEADInterface): NPITEAMMEMBERHEAD{
    return new NPITEAMMEMBERHEAD(data);
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
      name: 'NPITEAMMEMBERHEAD',
      plural: 'NPITEAMMEMBERHEADs',
      path: 'NPITEAMMEMBERHEADs',
      idName: 'LISTID',
      properties: {
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
        "ISSUER": {
          name: 'ISSUER',
          type: 'string'
        },
        "LISTID": {
          name: 'LISTID',
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
        "ALERTFLAG": {
          name: 'ALERTFLAG',
          type: 'string'
        },
        "EMAIL": {
          name: 'EMAIL',
          type: 'string'
        },
      },
      relations: {
        list: {
          name: 'list',
          type: 'NPITEAMMEMBERLIST[]',
          model: 'NPITEAMMEMBERLIST',
          relationType: 'hasMany',
                  keyFrom: 'LISTID',
          keyTo: 'LISTID'
        },
      }
    }
  }
}
