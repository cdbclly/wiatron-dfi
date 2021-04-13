/* tslint:disable */
import {
  ProjectNameProfile
} from '../index';

declare var Object: any;
export interface ProjectModuleInterface {
  "moduleName"?: string;
  "enabled"?: boolean;
  "remark"?: string;
  "id"?: number;
  "projectNameProfileId"?: number;
  ProjectNameProfile?: ProjectNameProfile;
}

export class ProjectModule implements ProjectModuleInterface {
  "moduleName": string;
  "enabled": boolean;
  "remark": string;
  "id": number;
  "projectNameProfileId": number;
  ProjectNameProfile: ProjectNameProfile;
  constructor(data?: ProjectModuleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectModule`.
   */
  public static getModelName() {
    return "ProjectModule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectModule for dynamic purposes.
  **/
  public static factory(data: ProjectModuleInterface): ProjectModule{
    return new ProjectModule(data);
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
      name: 'ProjectModule',
      plural: 'ProjectModules',
      path: 'ProjectModules',
      idName: 'id',
      properties: {
        "moduleName": {
          name: 'moduleName',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "projectNameProfileId": {
          name: 'projectNameProfileId',
          type: 'number'
        },
      },
      relations: {
        ProjectNameProfile: {
          name: 'ProjectNameProfile',
          type: 'ProjectNameProfile',
          model: 'ProjectNameProfile',
          relationType: 'belongsTo',
                  keyFrom: 'projectNameProfileId',
          keyTo: 'ProjectNameID'
        },
      }
    }
  }
}
