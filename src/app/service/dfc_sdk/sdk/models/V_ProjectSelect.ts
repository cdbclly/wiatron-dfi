/* tslint:disable */
import {
  ProjectNameProfile
} from '../index';

declare var Object: any;
export interface V_ProjectSelectInterface {
  "Plant"?: string;
  "Customer"?: string;
  "ModelType"?: string;
  "ProjectCodeID"?: string;
  "ProjectCode"?: string;
  "BU"?: string;
  "ProjectNameID"?: number;
  "ProjectName"?: string;
  "RfqProjectCode"?: string;
  "RfqProjectName"?: string;
  "Status"?: number;
  "IsRfq"?: boolean;
  "IsPLMProject"?: boolean;
  "CurrentStage"?: string;
  projectNameProfile?: ProjectNameProfile;
}

export class V_ProjectSelect implements V_ProjectSelectInterface {
  "Plant": string;
  "Customer": string;
  "ModelType": string;
  "ProjectCodeID": string;
  "ProjectCode": string;
  "BU": string;
  "ProjectNameID": number;
  "ProjectName": string;
  "RfqProjectCode": string;
  "RfqProjectName": string;
  "Status": number;
  "IsRfq": boolean;
  "IsPLMProject": boolean;
  "CurrentStage": string;
  projectNameProfile: ProjectNameProfile;
  constructor(data?: V_ProjectSelectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `V_ProjectSelect`.
   */
  public static getModelName() {
    return "V_ProjectSelect";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of V_ProjectSelect for dynamic purposes.
  **/
  public static factory(data: V_ProjectSelectInterface): V_ProjectSelect{
    return new V_ProjectSelect(data);
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
      name: 'V_ProjectSelect',
      plural: 'V_ProjectSelects',
      path: 'V_ProjectSelects',
      idName: 'ProjectNameID',
      properties: {
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
        "ProjectCodeID": {
          name: 'ProjectCodeID',
          type: 'string'
        },
        "ProjectCode": {
          name: 'ProjectCode',
          type: 'string'
        },
        "BU": {
          name: 'BU',
          type: 'string'
        },
        "ProjectNameID": {
          name: 'ProjectNameID',
          type: 'number'
        },
        "ProjectName": {
          name: 'ProjectName',
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
        "Status": {
          name: 'Status',
          type: 'number'
        },
        "IsRfq": {
          name: 'IsRfq',
          type: 'boolean'
        },
        "IsPLMProject": {
          name: 'IsPLMProject',
          type: 'boolean'
        },
        "CurrentStage": {
          name: 'CurrentStage',
          type: 'string'
        },
      },
      relations: {
        projectNameProfile: {
          name: 'projectNameProfile',
          type: 'ProjectNameProfile',
          model: 'ProjectNameProfile',
          relationType: 'belongsTo',
                  keyFrom: 'ProjectNameID',
          keyTo: 'ProjectNameID'
        },
      }
    }
  }
}
