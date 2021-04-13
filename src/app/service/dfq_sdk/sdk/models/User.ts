/* tslint:disable */
import {
  AccessToken
} from '../index';

declare var Object: any;
export interface UserInterface {
  "site"?: string;
  "plant"?: string;
  "username"?: string;
  "userCnName"?: string;
  "userEnName"?: string;
  "realm"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "password"?: string;
  accessTokens?: AccessToken[];
}

export class User implements UserInterface {
  "site": string;
  "plant": string;
  "username": string;
  "userCnName": string;
  "userEnName": string;
  "realm": string;
  "email": string;
  "emailVerified": boolean;
  "password": string;
  accessTokens: AccessToken[];
  constructor(data?: UserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User`.
   */
  public static getModelName() {
    return "User";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of User for dynamic purposes.
  **/
  public static factory(data: UserInterface): User{
    return new User(data);
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
      name: 'User',
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
          type: 'AccessToken[]',
          model: 'AccessToken',
          relationType: 'hasMany',
                  keyFrom: 'username',
          keyTo: 'userId'
        },
      }
    }
  }
}
