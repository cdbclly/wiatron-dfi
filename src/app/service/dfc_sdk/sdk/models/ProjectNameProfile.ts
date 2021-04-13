/* tslint:disable */
import {
  ProjectCodeProfile,
  MilitaryOrderSign,
  V_ProjectSelect,
  BasicModel,
  GroupModel,
  ProjectModule
} from '../index';

declare var Object: any;
export interface ProjectNameProfileInterface {
  "ProjectNameID"?: number;
  "ProjectCodeID"?: string;
  "ProjectName"?: string;
  "ProjectCode"?: string;
  "RfqProjectCode"?: string;
  "RfqProjectName"?: string;
  "IsRfq": boolean;
  "IsPLMProject": boolean;
  "IsPlmRfqCopied"?: boolean;
  "IsTargetSigned"?: boolean;
  "Status"?: number;
  "Remark"?: string;
  "LastModified"?: Date;
  projectCodeProfile?: ProjectCodeProfile;
  militaryOrders?: MilitaryOrderSign;
  vProjectSelect?: V_ProjectSelect;
  basicModels?: BasicModel[];
  groupModels?: GroupModel[];
  projectModules?: ProjectModule[];
}

export class ProjectNameProfile implements ProjectNameProfileInterface {
  "ProjectNameID": number;
  "ProjectCodeID": string;
  "ProjectName": string;
  "ProjectCode": string;
  "RfqProjectCode": string;
  "RfqProjectName": string;
  "IsRfq": boolean;
  "IsPLMProject": boolean;
  "IsPlmRfqCopied": boolean;
  "IsTargetSigned": boolean;
  "Status": number;
  "Remark": string;
  "LastModified": Date;
  projectCodeProfile: ProjectCodeProfile;
  militaryOrders: MilitaryOrderSign;
  vProjectSelect: V_ProjectSelect;
  basicModels: BasicModel[];
  groupModels: GroupModel[];
  projectModules: ProjectModule[];
  constructor(data?: ProjectNameProfileInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectNameProfile`.
   */
  public static getModelName() {
    return "ProjectNameProfile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectNameProfile for dynamic purposes.
  **/
  public static factory(data: ProjectNameProfileInterface): ProjectNameProfile{
    return new ProjectNameProfile(data);
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
      name: 'ProjectNameProfile',
      plural: 'ProjectNameProfiles',
      path: 'ProjectNameProfiles',
      idName: 'ProjectNameID',
      properties: {
        "ProjectNameID": {
          name: 'ProjectNameID',
          type: 'number'
        },
        "ProjectCodeID": {
          name: 'ProjectCodeID',
          type: 'string'
        },
        "ProjectName": {
          name: 'ProjectName',
          type: 'string'
        },
        "ProjectCode": {
          name: 'ProjectCode',
          type: 'string'
        },
        "RfqProjectCode": {
          name: 'RfqProjectCode',
          type: 'string'
        },
        "RfqProjectName": {
          name: 'RfqProjectName',
          type: 'string'
        },
        "IsRfq": {
          name: 'IsRfq',
          type: 'boolean',
          default: false
        },
        "IsPLMProject": {
          name: 'IsPLMProject',
          type: 'boolean',
          default: false
        },
        "IsPlmRfqCopied": {
          name: 'IsPlmRfqCopied',
          type: 'boolean',
          default: false
        },
        "IsTargetSigned": {
          name: 'IsTargetSigned',
          type: 'boolean',
          default: false
        },
        "Status": {
          name: 'Status',
          type: 'number'
        },
        "Remark": {
          name: 'Remark',
          type: 'string'
        },
        "LastModified": {
          name: 'LastModified',
          type: 'Date'
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
        militaryOrders: {
          name: 'militaryOrders',
          type: 'MilitaryOrderSign',
          model: 'MilitaryOrderSign',
          relationType: 'hasOne',
                  keyFrom: 'ProjectNameID',
          keyTo: 'projectNameID'
        },
        vProjectSelect: {
          name: 'vProjectSelect',
          type: 'V_ProjectSelect',
          model: 'V_ProjectSelect',
          relationType: 'hasOne',
                  keyFrom: 'ProjectNameID',
          keyTo: 'ProjectNameID'
        },
        basicModels: {
          name: 'basicModels',
          type: 'BasicModel[]',
          model: 'BasicModel',
          relationType: 'hasMany',
                  keyFrom: 'ProjectNameID',
          keyTo: 'projectNameId'
        },
        groupModels: {
          name: 'groupModels',
          type: 'GroupModel[]',
          model: 'GroupModel',
          relationType: 'hasMany',
                  keyFrom: 'ProjectNameID',
          keyTo: 'projectNameId'
        },
        projectModules: {
          name: 'projectModules',
          type: 'ProjectModule[]',
          model: 'ProjectModule',
          relationType: 'hasMany',
                  keyFrom: 'ProjectNameID',
          keyTo: 'projectNameProfileId'
        },
      }
    }
  }
}
