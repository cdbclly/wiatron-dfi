/* tslint:disable */
import {
  USER,
  FunctionGroup
} from '../index';

declare var Object: any;
export interface DEPARTMENTInterface {
  "department": string;
  "plantname"?: string;
  "deptdesc"?: string;
  "deptdesca"?: string;
  "managerid"?: string;
  "level"?: number;
  "uporgcode"?: string;
  "functiongroupid": number;
  member?: USER[];
  functiongoup?: FunctionGroup;
}

export class DEPARTMENT implements DEPARTMENTInterface {
  "department": string;
  "plantname": string;
  "deptdesc": string;
  "deptdesca": string;
  "managerid": string;
  "level": number;
  "uporgcode": string;
  "functiongroupid": number;
  member: USER[];
  functiongoup: FunctionGroup;
  constructor(data?: DEPARTMENTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DEPARTMENT`.
   */
  public static getModelName() {
    return "DEPARTMENT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DEPARTMENT for dynamic purposes.
  **/
  public static factory(data: DEPARTMENTInterface): DEPARTMENT{
    return new DEPARTMENT(data);
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
      name: 'DEPARTMENT',
      plural: 'DEPARTMENT',
      path: 'DEPARTMENT',
      idName: 'department',
      properties: {
        "department": {
          name: 'department',
          type: 'string'
        },
        "plantname": {
          name: 'plantname',
          type: 'string'
        },
        "deptdesc": {
          name: 'deptdesc',
          type: 'string'
        },
        "deptdesca": {
          name: 'deptdesca',
          type: 'string'
        },
        "managerid": {
          name: 'managerid',
          type: 'string'
        },
        "level": {
          name: 'level',
          type: 'number'
        },
        "uporgcode": {
          name: 'uporgcode',
          type: 'string'
        },
        "functiongroupid": {
          name: 'functiongroupid',
          type: 'number',
          default: 5
        },
      },
      relations: {
        member: {
          name: 'member',
          type: 'USER[]',
          model: 'USER',
          relationType: 'hasMany',
                  keyFrom: 'department',
          keyTo: 'department'
        },
        functiongoup: {
          name: 'functiongoup',
          type: 'FunctionGroup',
          model: 'FunctionGroup',
          relationType: 'belongsTo',
                  keyFrom: 'functiongroupid',
          keyTo: 'id'
        },
      }
    }
  }
}
