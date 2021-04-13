/* tslint:disable */

declare var Object: any;
export interface ProjectPartNumberInterface {
  "id"?: number;
  "projectId"?: string;
  "partNumberId"?: string;
  "createDate"?: Date;
  "createBy"?: string;
  "updateDate"?: Date;
  "updateBy"?: string;
  "source"?: string;
  "pass"?: boolean;
  "nickName"?: string;
  "isDelete"?: boolean;
}

export class ProjectPartNumber implements ProjectPartNumberInterface {
  "id": number;
  "projectId": string;
  "partNumberId": string;
  "createDate": Date;
  "createBy": string;
  "updateDate": Date;
  "updateBy": string;
  "source": string;
  "pass": boolean;
  "nickName": string;
  "isDelete": boolean;
  constructor(data?: ProjectPartNumberInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectPartNumber`.
   */
  public static getModelName() {
    return "ProjectPartNumber";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectPartNumber for dynamic purposes.
  **/
  public static factory(data: ProjectPartNumberInterface): ProjectPartNumber{
    return new ProjectPartNumber(data);
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
      name: 'ProjectPartNumber',
      plural: 'ProjectPartNumbers',
      path: 'ProjectPartNumbers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "partNumberId": {
          name: 'partNumberId',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "source": {
          name: 'source',
          type: 'string'
        },
        "pass": {
          name: 'pass',
          type: 'boolean'
        },
        "nickName": {
          name: 'nickName',
          type: 'string'
        },
        "isDelete": {
          name: 'isDelete',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
