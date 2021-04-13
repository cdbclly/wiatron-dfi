/* tslint:disable */

declare var Object: any;
export interface ProjectRemarkInterface {
  "projectCode"?: string;
  "stage"?: string;
  "remark"?: string;
  "createBy"?: string;
  "createDate"?: Date;
  "id"?: number;
}

export class ProjectRemark implements ProjectRemarkInterface {
  "projectCode": string;
  "stage": string;
  "remark": string;
  "createBy": string;
  "createDate": Date;
  "id": number;
  constructor(data?: ProjectRemarkInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectRemark`.
   */
  public static getModelName() {
    return "ProjectRemark";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectRemark for dynamic purposes.
  **/
  public static factory(data: ProjectRemarkInterface): ProjectRemark{
    return new ProjectRemark(data);
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
      name: 'ProjectRemark',
      plural: 'ProjectRemarks',
      path: 'ProjectRemarks',
      idName: 'id',
      properties: {
        "projectCode": {
          name: 'projectCode',
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
