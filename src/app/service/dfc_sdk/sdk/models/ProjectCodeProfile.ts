/* tslint:disable */
import {
  ProjectNameProfile,
  ProjectMember,
  Member,
  BU
} from '../index';

declare var Object: any;
export interface ProjectCodeProfileInterface {
  "ProjectCodeID": string;
  "ProjectCode": string;
  "Status"?: boolean;
  "Plant"?: string;
  "Customer"?: string;
  "ModelType"?: string;
  "PLMProjectStatus"?: string;
  "PLMProjectLastUpdate"?: Date;
  "ProfitCenter"?: string;
  "RfqDueDay"?: Date;
  "C1DueDay"?: Date;
  "C2DueDay"?: Date;
  "C3DueDay"?: Date;
  "C4DueDay"?: Date;
  "C5DueDay"?: Date;
  "C6DueDay"?: Date;
  "IsRfq"?: boolean;
  "IsSentEmail"?: boolean;
  "CreateDate"?: Date;
  "ProjectPM"?: string;
  "SentDueDayEmail"?: string;
  "LastModified"?: Date;
  projectNames?: ProjectNameProfile[];
  member?: ProjectMember[];
  members?: Member[];
  BU?: BU;
}

export class ProjectCodeProfile implements ProjectCodeProfileInterface {
  "ProjectCodeID": string;
  "ProjectCode": string;
  "Status": boolean;
  "Plant": string;
  "Customer": string;
  "ModelType": string;
  "PLMProjectStatus": string;
  "PLMProjectLastUpdate": Date;
  "ProfitCenter": string;
  "RfqDueDay": Date;
  "C1DueDay": Date;
  "C2DueDay": Date;
  "C3DueDay": Date;
  "C4DueDay": Date;
  "C5DueDay": Date;
  "C6DueDay": Date;
  "IsRfq": boolean;
  "IsSentEmail": boolean;
  "CreateDate": Date;
  "ProjectPM": string;
  "SentDueDayEmail": string;
  "LastModified": Date;
  projectNames: ProjectNameProfile[];
  member: ProjectMember[];
  members: Member[];
  BU: BU;
  constructor(data?: ProjectCodeProfileInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectCodeProfile`.
   */
  public static getModelName() {
    return "ProjectCodeProfile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectCodeProfile for dynamic purposes.
  **/
  public static factory(data: ProjectCodeProfileInterface): ProjectCodeProfile{
    return new ProjectCodeProfile(data);
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
      name: 'ProjectCodeProfile',
      plural: 'ProjectCodeProfiles',
      path: 'ProjectCodeProfiles',
      idName: 'ProjectCodeID',
      properties: {
        "ProjectCodeID": {
          name: 'ProjectCodeID',
          type: 'string'
        },
        "ProjectCode": {
          name: 'ProjectCode',
          type: 'string'
        },
        "Status": {
          name: 'Status',
          type: 'boolean',
          default: false
        },
        "Plant": {
          name: 'Plant',
          type: 'string'
        },
        "Customer": {
          name: 'Customer',
          type: 'string'
        },
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
        "PLMProjectStatus": {
          name: 'PLMProjectStatus',
          type: 'string'
        },
        "PLMProjectLastUpdate": {
          name: 'PLMProjectLastUpdate',
          type: 'Date'
        },
        "ProfitCenter": {
          name: 'ProfitCenter',
          type: 'string'
        },
        "RfqDueDay": {
          name: 'RfqDueDay',
          type: 'Date'
        },
        "C1DueDay": {
          name: 'C1DueDay',
          type: 'Date'
        },
        "C2DueDay": {
          name: 'C2DueDay',
          type: 'Date'
        },
        "C3DueDay": {
          name: 'C3DueDay',
          type: 'Date'
        },
        "C4DueDay": {
          name: 'C4DueDay',
          type: 'Date'
        },
        "C5DueDay": {
          name: 'C5DueDay',
          type: 'Date'
        },
        "C6DueDay": {
          name: 'C6DueDay',
          type: 'Date'
        },
        "IsRfq": {
          name: 'IsRfq',
          type: 'boolean'
        },
        "IsSentEmail": {
          name: 'IsSentEmail',
          type: 'boolean'
        },
        "CreateDate": {
          name: 'CreateDate',
          type: 'Date'
        },
        "ProjectPM": {
          name: 'ProjectPM',
          type: 'string'
        },
        "SentDueDayEmail": {
          name: 'SentDueDayEmail',
          type: 'string'
        },
        "LastModified": {
          name: 'LastModified',
          type: 'Date'
        },
      },
      relations: {
        projectNames: {
          name: 'projectNames',
          type: 'ProjectNameProfile[]',
          model: 'ProjectNameProfile',
          relationType: 'hasMany',
                  keyFrom: 'ProjectCodeID',
          keyTo: 'ProjectCodeID'
        },
        member: {
          name: 'member',
          type: 'ProjectMember[]',
          model: 'ProjectMember',
          relationType: 'hasMany',
                  keyFrom: 'ProjectCodeID',
          keyTo: 'ProjectCodeID'
        },
        members: {
          name: 'members',
          type: 'Member[]',
          model: 'Member',
          relationType: 'hasMany',
          modelThrough: 'ProjectMember',
          keyThrough: 'memberId',
          keyFrom: 'ProjectCodeID',
          keyTo: 'ProjectCodeID'
        },
        BU: {
          name: 'BU',
          type: 'BU',
          model: 'BU',
          relationType: 'belongsTo',
                  keyFrom: 'ProfitCenter',
          keyTo: 'ProfitCenter'
        },
      }
    }
  }
}
