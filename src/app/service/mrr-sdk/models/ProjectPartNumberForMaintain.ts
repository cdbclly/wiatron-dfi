/* tslint:disable */

declare var Object: any;
export interface ProjectPartNumberForMaintainInterface {
  "projectId"?: string;
  "partNumber"?: string;
  "bomUsage"?: string;
  "blocked"?: boolean;
  "lifeCycleState"?: string;
  "createDate"?: Date;
  "updateDate"?: Date;
  "gendesc"?: string;
  "id"?: number;
}

export class ProjectPartNumberForMaintain implements ProjectPartNumberForMaintainInterface {
  "projectId": string;
  "partNumber": string;
  "bomUsage": string;
  "blocked": boolean;
  "lifeCycleState": string;
  "createDate": Date;
  "updateDate": Date;
  "gendesc": string;
  "id": number;
  constructor(data?: ProjectPartNumberForMaintainInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectPartNumberForMaintain`.
   */
  public static getModelName() {
    return "ProjectPartNumberForMaintain";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectPartNumberForMaintain for dynamic purposes.
  **/
  public static factory(data: ProjectPartNumberForMaintainInterface): ProjectPartNumberForMaintain{
    return new ProjectPartNumberForMaintain(data);
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
      name: 'ProjectPartNumberForMaintain',
      plural: 'ProjectPartNumberForMaintains',
      path: 'ProjectPartNumberForMaintains',
      idName: 'id',
      properties: {
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "bomUsage": {
          name: 'bomUsage',
          type: 'string'
        },
        "blocked": {
          name: 'blocked',
          type: 'boolean'
        },
        "lifeCycleState": {
          name: 'lifeCycleState',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "gendesc": {
          name: 'gendesc',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
