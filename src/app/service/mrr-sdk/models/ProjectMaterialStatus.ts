/* tslint:disable */

declare var Object: any;
export interface ProjectMaterialStatusInterface {
  "plantId"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "materialId"?: string;
  "status"?: boolean;
}

export class ProjectMaterialStatus implements ProjectMaterialStatusInterface {
  "plantId": string;
  "projectCode": string;
  "projectName": string;
  "materialId": string;
  "status": boolean;
  constructor(data?: ProjectMaterialStatusInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectMaterialStatus`.
   */
  public static getModelName() {
    return "ProjectMaterialStatus";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectMaterialStatus for dynamic purposes.
  **/
  public static factory(data: ProjectMaterialStatusInterface): ProjectMaterialStatus{
    return new ProjectMaterialStatus(data);
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
      name: 'ProjectMaterialStatus',
      plural: 'ProjectMaterialStatuses',
      path: 'ProjectMaterialStatuses',
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
        "materialId": {
          name: 'materialId',
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
