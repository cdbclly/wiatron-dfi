/* tslint:disable */
import {
  ProjectNameProfile,
  GroupModelMapping
} from '../index';

declare var Object: any;
export interface GroupModelInterface {
  "groupModelId"?: number;
  "projectNameId"?: number;
  "groupModelName"?: string;
  "remark"?: string;
  "isMilitary"?: boolean;
  "parts"?: number;
  "quoat"?: number;
  projectNameProfile?: ProjectNameProfile;
  groupModelMappings?: GroupModelMapping[];
}

export class GroupModel implements GroupModelInterface {
  "groupModelId": number;
  "projectNameId": number;
  "groupModelName": string;
  "remark": string;
  "isMilitary": boolean;
  "parts": number;
  "quoat": number;
  projectNameProfile: ProjectNameProfile;
  groupModelMappings: GroupModelMapping[];
  constructor(data?: GroupModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `GroupModel`.
   */
  public static getModelName() {
    return "GroupModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of GroupModel for dynamic purposes.
  **/
  public static factory(data: GroupModelInterface): GroupModel{
    return new GroupModel(data);
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
      name: 'GroupModel',
      plural: 'GroupModels',
      path: 'GroupModels',
      idName: 'groupModelId',
      properties: {
        "groupModelId": {
          name: 'groupModelId',
          type: 'number'
        },
        "projectNameId": {
          name: 'projectNameId',
          type: 'number'
        },
        "groupModelName": {
          name: 'groupModelName',
          type: 'string'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "isMilitary": {
          name: 'isMilitary',
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
        groupModelMappings: {
          name: 'groupModelMappings',
          type: 'GroupModelMapping[]',
          model: 'GroupModelMapping',
          relationType: 'hasMany',
                  keyFrom: 'groupModelId',
          keyTo: 'groupModelId'
        },
      }
    }
  }
}
