/* tslint:disable */
import {
  ROLEMAPPING,
  ROLE,
  DEPARTMENT,
  DPMKPI,
  DPMPDTISSUES,
  DPMYRISSUE,
  Tip,
  FpyrTip
} from '../index';

declare var Object: any;
export interface USERInterface {
  "USERID": string;
  "SITE"?: string;
  "PLANT"?: string;
  "USERNAME"?: string;
  "USERENNAME"?: string;
  "USERCNNAME"?: string;
  "DEPARTMENT"?: string;
  "DEPTDESC"?: string;
  "SUPERVISORID"?: string;
  "UPPERDEPTID"?: string;
  "OFFICERLEVEL"?: string;
  "EMAIL"?: string;
  "PHONE"?: string;
  "EXT"?: string;
  "EXPIRED"?: number;
  "TOKEN"?: string;
  "CREATEDATE"?: Date;
  "CREATEUSER"?: string;
  "UPDATEDATE"?: Date;
  "UPDATEUSER"?: string;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "department"?: string;
  "password"?: string;
  manager?: USER;
  accessTokens?: any[];
  rolemappings?: ROLEMAPPING[];
  principals?: ROLE[];
  dpmdepartment?: DEPARTMENT;
  kpiSettings?: DPMKPI[];
  issues?: DPMPDTISSUES[];
  yrissues?: DPMYRISSUE[];
  productivityTips?: Tip[];
  fpyrTips?: FpyrTip[];
}

export class USER implements USERInterface {
  "USERID": string;
  "SITE": string;
  "PLANT": string;
  "USERNAME": string;
  "USERENNAME": string;
  "USERCNNAME": string;
  "DEPARTMENT": string;
  "DEPTDESC": string;
  "SUPERVISORID": string;
  "UPPERDEPTID": string;
  "OFFICERLEVEL": string;
  "EMAIL": string;
  "PHONE": string;
  "EXT": string;
  "EXPIRED": number;
  "TOKEN": string;
  "CREATEDATE": Date;
  "CREATEUSER": string;
  "UPDATEDATE": Date;
  "UPDATEUSER": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "department": string;
  "password": string;
  manager: USER;
  accessTokens: any[];
  rolemappings: ROLEMAPPING[];
  principals: ROLE[];
  dpmdepartment: DEPARTMENT;
  kpiSettings: DPMKPI[];
  issues: DPMPDTISSUES[];
  yrissues: DPMYRISSUE[];
  productivityTips: Tip[];
  fpyrTips: FpyrTip[];
  constructor(data?: USERInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `USER`.
   */
  public static getModelName() {
    return "USER";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of USER for dynamic purposes.
  **/
  public static factory(data: USERInterface): USER{
    return new USER(data);
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
      name: 'USER',
      plural: 'USERS',
      path: 'USERS',
      idName: 'USERID',
      properties: {
        "USERID": {
          name: 'USERID',
          type: 'string'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "USERNAME": {
          name: 'USERNAME',
          type: 'string'
        },
        "USERENNAME": {
          name: 'USERENNAME',
          type: 'string'
        },
        "USERCNNAME": {
          name: 'USERCNNAME',
          type: 'string'
        },
        "DEPARTMENT": {
          name: 'DEPARTMENT',
          type: 'string'
        },
        "DEPTDESC": {
          name: 'DEPTDESC',
          type: 'string'
        },
        "SUPERVISORID": {
          name: 'SUPERVISORID',
          type: 'string'
        },
        "UPPERDEPTID": {
          name: 'UPPERDEPTID',
          type: 'string'
        },
        "OFFICERLEVEL": {
          name: 'OFFICERLEVEL',
          type: 'string'
        },
        "EMAIL": {
          name: 'EMAIL',
          type: 'string'
        },
        "PHONE": {
          name: 'PHONE',
          type: 'string'
        },
        "EXT": {
          name: 'EXT',
          type: 'string'
        },
        "EXPIRED": {
          name: 'EXPIRED',
          type: 'number'
        },
        "TOKEN": {
          name: 'TOKEN',
          type: 'string'
        },
        "CREATEDATE": {
          name: 'CREATEDATE',
          type: 'Date'
        },
        "CREATEUSER": {
          name: 'CREATEUSER',
          type: 'string'
        },
        "UPDATEDATE": {
          name: 'UPDATEDATE',
          type: 'Date'
        },
        "UPDATEUSER": {
          name: 'UPDATEUSER',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "department": {
          name: 'department',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        manager: {
          name: 'manager',
          type: 'USER',
          model: 'USER',
          relationType: 'belongsTo',
                  keyFrom: 'SUPERVISORID',
          keyTo: 'USERID'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'userId'
        },
        rolemappings: {
          name: 'rolemappings',
          type: 'ROLEMAPPING[]',
          model: 'ROLEMAPPING',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'principalId'
        },
        principals: {
          name: 'principals',
          type: 'ROLE[]',
          model: 'ROLE',
          relationType: 'hasMany',
          modelThrough: 'ROLEMAPPING',
          keyThrough: 'rOLEId',
          keyFrom: 'USERID',
          keyTo: 'principalId'
        },
        dpmdepartment: {
          name: 'dpmdepartment',
          type: 'DEPARTMENT',
          model: 'DEPARTMENT',
          relationType: 'belongsTo',
                  keyFrom: 'department',
          keyTo: 'department'
        },
        kpiSettings: {
          name: 'kpiSettings',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
          modelThrough: 'DPMUSERKPI',
          keyThrough: 'dPMKPIId',
          keyFrom: 'USERID',
          keyTo: 'USERID'
        },
        issues: {
          name: 'issues',
          type: 'DPMPDTISSUES[]',
          model: 'DPMPDTISSUES',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'pic'
        },
        yrissues: {
          name: 'yrissues',
          type: 'DPMYRISSUE[]',
          model: 'DPMYRISSUE',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'pic'
        },
        productivityTips: {
          name: 'productivityTips',
          type: 'Tip[]',
          model: 'Tip',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'pic'
        },
        fpyrTips: {
          name: 'fpyrTips',
          type: 'FpyrTip[]',
          model: 'FpyrTip',
          relationType: 'hasMany',
                  keyFrom: 'USERID',
          keyTo: 'pic'
        },
      }
    }
  }
}
