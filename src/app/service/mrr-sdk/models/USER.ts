/* tslint:disable */

declare var Object: any;
export interface USERInterface {
  "site"?: string;
  "plant"?: string;
  "username"?: string;
  "userCnName"?: string;
  "userEnName"?: string;
  "realm"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "password"?: string;
  accessTokens?: any[];
}

export class USER implements USERInterface {
  "site": string;
  "plant": string;
  "username": string;
  "userCnName": string;
  "userEnName": string;
  "realm": string;
  "email": string;
  "emailVerified": boolean;
  "password": string;
  accessTokens: any[];
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
      plural: 'Users',
      path: 'Users',
      idName: 'username',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "userCnName": {
          name: 'userCnName',
          type: 'string'
        },
        "userEnName": {
          name: 'userEnName',
          type: 'string'
        },
        "realm": {
          name: 'realm',
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
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'username',
          keyTo: 'userId'
        },
      }
    }
  }
}
