/* tslint:disable */

declare var Object: any;
export interface ProjectStageSkipReasonInterface {
  "projectCode"?: string;
  "productId"?: string;
  "plantName"?: string;
  "stage"?: string;
  "remark"?: string;
  "createBy"?: string;
  "createDate"?: Date;
  "id"?: number;
}

export class ProjectStageSkipReason implements ProjectStageSkipReasonInterface {
  "projectCode": string;
  "productId": string;
  "plantName": string;
  "stage": string;
  "remark": string;
  "createBy": string;
  "createDate": Date;
  "id": number;
  constructor(data?: ProjectStageSkipReasonInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectStageSkipReason`.
   */
  public static getModelName() {
    return "ProjectStageSkipReason";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectStageSkipReason for dynamic purposes.
  **/
  public static factory(data: ProjectStageSkipReasonInterface): ProjectStageSkipReason{
    return new ProjectStageSkipReason(data);
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
      name: 'ProjectStageSkipReason',
      plural: 'ProjectStageSkipReasons',
      path: 'ProjectStageSkipReasons',
      idName: 'id',
      properties: {
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "plantName": {
          name: 'plantName',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
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
