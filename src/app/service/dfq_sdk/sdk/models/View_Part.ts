/* tslint:disable */

declare var Object: any;
export interface View_PartInterface {
  "partId"?: string;
  "workflowId"?: number;
  "status"?: string;
  "workflowCreatedBy"?: string;
  "productId"?: string;
  "plantId"?: string;
  "defectNum"?: number;
  "total"?: number;
  "modifiedBy"?: string;
  "modified"?: Date;
  "id"?: number;
}

export class View_Part implements View_PartInterface {
  "partId": string;
  "workflowId": number;
  "status": string;
  "workflowCreatedBy": string;
  "productId": string;
  "plantId": string;
  "defectNum": number;
  "total": number;
  "modifiedBy": string;
  "modified": Date;
  "id": number;
  constructor(data?: View_PartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_Part`.
   */
  public static getModelName() {
    return "View_Part";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_Part for dynamic purposes.
  **/
  public static factory(data: View_PartInterface): View_Part{
    return new View_Part(data);
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
      name: 'View_Part',
      plural: 'View_Parts',
      path: 'View_Parts',
      idName: 'id',
      properties: {
        "partId": {
          name: 'partId',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "workflowCreatedBy": {
          name: 'workflowCreatedBy',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "defectNum": {
          name: 'defectNum',
          type: 'number'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "modifiedBy": {
          name: 'modifiedBy',
          type: 'string'
        },
        "modified": {
          name: 'modified',
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
