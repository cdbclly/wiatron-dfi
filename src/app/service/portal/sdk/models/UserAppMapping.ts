/* tslint:disable */
import {
  User,
  App
} from '../index';

declare var Object: any;
export interface UserAppMappingInterface {
  "id"?: number;
  "userId"?: string;
  "appId"?: number;
  user?: User;
  app?: App;
}

export class UserAppMapping implements UserAppMappingInterface {
  "id": number;
  "userId": string;
  "appId": number;
  user: User;
  app: App;
  constructor(data?: UserAppMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserAppMapping`.
   */
  public static getModelName() {
    return "UserAppMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UserAppMapping for dynamic purposes.
  **/
  public static factory(data: UserAppMappingInterface): UserAppMapping{
    return new UserAppMapping(data);
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
      name: 'UserAppMapping',
      plural: 'UserAppMappings',
      path: 'UserAppMappings',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "appId": {
          name: 'appId',
          type: 'number'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'User',
          model: 'User',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'username'
        },
        app: {
          name: 'app',
          type: 'App',
          model: 'App',
          relationType: 'belongsTo',
                  keyFrom: 'appId',
          keyTo: 'id'
        },
      }
    }
  }
}
