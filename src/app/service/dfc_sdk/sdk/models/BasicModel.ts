/* tslint:disable */
import {
  ProjectNameProfile,
  Stage,
  GroupModelMapping
} from '../index';

declare var Object: any;
export interface BasicModelInterface {
  "modelId"?: number;
  "projectNameId"?: number;
  "modelName"?: string;
  "FCST"?: number;
  "remark"?: string;
  "isMilitary"?: boolean;
  "isTargetSignSent"?: boolean;
  "isTargetSignApproved"?: boolean;
  "parts"?: number;
  "quoat"?: number;
  projectNameProfile?: ProjectNameProfile;
  stages?: Stage[];
  groupModelMappings?: GroupModelMapping[];
}

export class BasicModel implements BasicModelInterface {
  "modelId": number;
  "projectNameId": number;
  "modelName": string;
  "FCST": number;
  "remark": string;
  "isMilitary": boolean;
  "isTargetSignSent": boolean;
  "isTargetSignApproved": boolean;
  "parts": number;
  "quoat": number;
  projectNameProfile: ProjectNameProfile;
  stages: Stage[];
  groupModelMappings: GroupModelMapping[];
  constructor(data?: BasicModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `BasicModel`.
   */
  public static getModelName() {
    return "BasicModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of BasicModel for dynamic purposes.
  **/
  public static factory(data: BasicModelInterface): BasicModel{
    return new BasicModel(data);
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
      name: 'BasicModel',
      plural: 'BasicModels',
      path: 'BasicModels',
      idName: 'modelId',
      properties: {
        "modelId": {
          name: 'modelId',
          type: 'number'
        },
        "projectNameId": {
          name: 'projectNameId',
          type: 'number'
        },
        "modelName": {
          name: 'modelName',
          type: 'string'
        },
        "FCST": {
          name: 'FCST',
          type: 'number'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "isMilitary": {
          name: 'isMilitary',
          type: 'boolean'
        },
        "isTargetSignSent": {
          name: 'isTargetSignSent',
          type: 'boolean'
        },
        "isTargetSignApproved": {
          name: 'isTargetSignApproved',
          type: 'boolean'
        },
        "parts": {
          name: 'parts',
          type: 'number'
        },
        "quoat": {
          name: 'quoat',
          type: 'number'
        },
      },
      relations: {
        projectNameProfile: {
          name: 'projectNameProfile',
          type: 'ProjectNameProfile',
          model: 'ProjectNameProfile',
          relationType: 'belongsTo',
                  keyFrom: 'projectNameId',
          keyTo: 'ProjectNameID'
        },
        stages: {
          name: 'stages',
          type: 'Stage[]',
          model: 'Stage',
          relationType: 'hasMany',
                  keyFrom: 'modelId',
          keyTo: 'ModelID'
        },
        groupModelMappings: {
          name: 'groupModelMappings',
          type: 'GroupModelMapping[]',
          model: 'GroupModelMapping',
          relationType: 'hasMany',
                  keyFrom: 'modelId',
          keyTo: 'modelId'
        },
      }
    }
  }
}
