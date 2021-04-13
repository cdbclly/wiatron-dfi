/* tslint:disable */

declare var Object: any;
export interface MemberInterface {
  "empID"?: string;
  "name"?: string;
  "eName"?: string;
  "email"?: string;
  "plant"?: string;
  "role"?: string;
  "site"?: string;
}

export class Member implements MemberInterface {
  "empID": string;
  "name": string;
  "eName": string;
  "email": string;
  "plant": string;
  "role": string;
  "site": string;
  constructor(data?: MemberInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Member`.
   */
  public static getModelName() {
    return "Member";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Member for dynamic purposes.
  **/
  public static factory(data: MemberInterface): Member{
    return new Member(data);
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
      name: 'Member',
      plural: 'Members',
      path: 'Members',
      idName: 'empID',
      properties: {
        "empID": {
          name: 'empID',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "eName": {
          name: 'eName',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "role": {
          name: 'role',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
