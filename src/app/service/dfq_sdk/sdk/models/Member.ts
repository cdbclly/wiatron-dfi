/* tslint:disable */

declare var Object: any;
export interface MemberInterface {
  "EmpID"?: string;
  "Name"?: string;
  "EName"?: string;
  "Email"?: string;
  "Site"?: string;
  "Plant"?: string;
  "Dept"?: string;
  "Role"?: string;
  "Ext"?: string;
  "Manager"?: string;
  "Password"?: string;
  "Group"?: number;
  "DFILeader"?: boolean;
  "DFIUser"?: boolean;
  "IsPlantLevel"?: boolean;
  "CanSignMilitaryOrder"?: boolean;
  "Supervisor"?: string;
}

export class Member implements MemberInterface {
  "EmpID": string;
  "Name": string;
  "EName": string;
  "Email": string;
  "Site": string;
  "Plant": string;
  "Dept": string;
  "Role": string;
  "Ext": string;
  "Manager": string;
  "Password": string;
  "Group": number;
  "DFILeader": boolean;
  "DFIUser": boolean;
  "IsPlantLevel": boolean;
  "CanSignMilitaryOrder": boolean;
  "Supervisor": string;
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
      idName: 'EmpID',
      properties: {
        "EmpID": {
          name: 'EmpID',
          type: 'string'
        },
        "Name": {
          name: 'Name',
          type: 'string'
        },
        "EName": {
          name: 'EName',
          type: 'string'
        },
        "Email": {
          name: 'Email',
          type: 'string'
        },
        "Site": {
          name: 'Site',
          type: 'string'
        },
        "Plant": {
          name: 'Plant',
          type: 'string'
        },
        "Dept": {
          name: 'Dept',
          type: 'string'
        },
        "Role": {
          name: 'Role',
          type: 'string'
        },
        "Ext": {
          name: 'Ext',
          type: 'string'
        },
        "Manager": {
          name: 'Manager',
          type: 'string'
        },
        "Password": {
          name: 'Password',
          type: 'string'
        },
        "Group": {
          name: 'Group',
          type: 'number'
        },
        "DFILeader": {
          name: 'DFILeader',
          type: 'boolean'
        },
        "DFIUser": {
          name: 'DFIUser',
          type: 'boolean'
        },
        "IsPlantLevel": {
          name: 'IsPlantLevel',
          type: 'boolean'
        },
        "CanSignMilitaryOrder": {
          name: 'CanSignMilitaryOrder',
          type: 'boolean'
        },
        "Supervisor": {
          name: 'Supervisor',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
