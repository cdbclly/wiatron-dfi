/* tslint:disable */
import {
  ProjectCodeProfile
} from '../index';

declare var Object: any;
export interface ProjectNameProfileInterface {
  "ProjectNameID"?: number;
  "ProjectCodeID"?: string;
  "ProjectName"?: string;
  "ProjectCode"?: string;
  "RfqProjectCode"?: string;
  "RfqProjectName"?: string;
  "FCST"?: number;
  "RunIn"?: number;
  "IsRfq": boolean;
  "IsPLMProject": boolean;
  "Status"?: number;
  "Remark"?: string;
  projectCodeProfile?: ProjectCodeProfile;
}

export class ProjectNameProfile implements ProjectNameProfileInterface {
  "ProjectNameID": number;
  "ProjectCodeID": string;
  "ProjectName": string;
  "ProjectCode": string;
  "RfqProjectCode": string;
  "RfqProjectName": string;
  "FCST": number;
  "RunIn": number;
  "IsRfq": boolean;
  "IsPLMProject": boolean;
  "Status": number;
  "Remark": string;
  projectCodeProfile: ProjectCodeProfile;
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
        "FCST": {
          name: 'FCST',
          type: 'number'
        },
        "RunIn": {
          name: 'RunIn',
          type: 'number'
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
        "Status": {
          name: 'Status',
          type: 'number'
        },
        "Remark": {
          name: 'Remark',
          type: 'string'
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
      }
    }
  }
}
