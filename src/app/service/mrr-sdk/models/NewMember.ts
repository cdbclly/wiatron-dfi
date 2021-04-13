/* tslint:disable */
import {
  ProjectCodeProfile
} from '../index';

declare var Object: any;
export interface NewMemberInterface {
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
  projectMember?: ProjectCodeProfile[];
}

export class NewMember implements NewMemberInterface {
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
  projectMember: ProjectCodeProfile[];
  constructor(data?: NewMemberInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NewMember`.
   */
  public static getModelName() {
    return "NewMember";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NewMember for dynamic purposes.
  **/
  public static factory(data: NewMemberInterface): NewMember{
    return new NewMember(data);
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
      name: 'NewMember',
      plural: 'NewMembers',
      path: 'NewMembers',
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
        projectMember: {
          name: 'projectMember',
          type: 'ProjectCodeProfile[]',
          model: 'ProjectCodeProfile',
          relationType: 'hasMany',
          modelThrough: 'ProjectMember',
          keyThrough: 'projectCodeProfileId',
          keyFrom: 'EmpID',
          keyTo: 'MemberID'
        },
      }
    }
  }
}
