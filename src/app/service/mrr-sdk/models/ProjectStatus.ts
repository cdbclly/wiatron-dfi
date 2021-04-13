/* tslint:disable */

declare var Object: any;
export interface ProjectStatusInterface {
  "plantId"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "status"?: boolean;
}

export class ProjectStatus implements ProjectStatusInterface {
  "plantId": string;
  "projectCode": string;
  "projectName": string;
  "status": boolean;
  constructor(data?: ProjectStatusInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectStatus`.
   */
  public static getModelName() {
    return "ProjectStatus";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectStatus for dynamic purposes.
  **/
  public static factory(data: ProjectStatusInterface): ProjectStatus{
    return new ProjectStatus(data);
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
      name: 'ProjectStatus',
      plural: 'ProjectStatuses',
      path: 'ProjectStatuses',
      idName: 'plantId',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
