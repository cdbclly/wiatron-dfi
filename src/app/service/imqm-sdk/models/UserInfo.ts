/* tslint:disable */

declare var Object: any;
export interface UserInfoInterface {
  "number": string;
  "site"?: string;
  "plant"?: string;
  "operablePlant"?: string;
  "name": string;
  "eMail"?: string;
  "rank": string;
  "groupId": number;
  "chineseName"?: string;
  "department"?: string;
  "weChat": boolean;
  "tel"?: string;
}

export class UserInfo implements UserInfoInterface {
  "number": string;
  "site": string;
  "plant": string;
  "operablePlant": string;
  "name": string;
  "eMail": string;
  "rank": string;
  "groupId": number;
  "chineseName": string;
  "department": string;
  "weChat": boolean;
  "tel": string;
  constructor(data?: UserInfoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserInfo`.
   */
  public static getModelName() {
    return "UserInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UserInfo for dynamic purposes.
  **/
  public static factory(data: UserInfoInterface): UserInfo{
    return new UserInfo(data);
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
      name: 'UserInfo',
      plural: 'UserInfos',
      path: 'UserInfos',
      idName: 'number',
      properties: {
        "number": {
          name: 'number',
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
        "operablePlant": {
          name: 'operablePlant',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "eMail": {
          name: 'eMail',
          type: 'string'
        },
        "rank": {
          name: 'rank',
          type: 'string'
        },
        "groupId": {
          name: 'groupId',
          type: 'number'
        },
        "chineseName": {
          name: 'chineseName',
          type: 'string'
        },
        "department": {
          name: 'department',
          type: 'string'
        },
        "weChat": {
          name: 'weChat',
          type: 'boolean'
        },
        "tel": {
          name: 'tel',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
