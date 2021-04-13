/* tslint:disable */
import {
  ProjectCodeProfile,
  Member
} from '../index';

declare var Object: any;
export interface ProjectMemberInterface {
  "id"?: number;
  "ProjectCodeID": string;
  "Role"?: string;
  "MemberID": string;
  "IsPLMData"?: boolean;
  projectCodeProfile?: ProjectCodeProfile;
  member?: Member;
}

export class ProjectMember implements ProjectMemberInterface {
  "id": number;
  "ProjectCodeID": string;
  "Role": string;
  "MemberID": string;
  "IsPLMData": boolean;
  projectCodeProfile: ProjectCodeProfile;
  member: Member;
  constructor(data?: ProjectMemberInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectMember`.
   */
  public static getModelName() {
    return "ProjectMember";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectMember for dynamic purposes.
  **/
  public static factory(data: ProjectMemberInterface): ProjectMember{
    return new ProjectMember(data);
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
      name: 'ProjectMember',
      plural: 'ProjectMembers',
      path: 'ProjectMembers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "ProjectCodeID": {
          name: 'ProjectCodeID',
          type: 'string'
        },
        "Role": {
          name: 'Role',
          type: 'string'
        },
        "MemberID": {
          name: 'MemberID',
          type: 'string'
        },
        "IsPLMData": {
          name: 'IsPLMData',
          type: 'boolean',
          default: false
        },
      },
      relations: {
        projectCodeProfile: {
          name: 'projectCodeProfile',
          type: 'ProjectCodeProfile',
          model: 'ProjectCodeProfile',
          relationType: 'belongsTo',
                  keyFrom: 'ProjectCodeID',
          keyTo: 'ProjectCodeID'
        },
        member: {
          name: 'member',
          type: 'Member',
          model: 'Member',
          relationType: 'belongsTo',
                  keyFrom: 'MemberID',
          keyTo: 'EmpID'
        },
      }
    }
  }
}
