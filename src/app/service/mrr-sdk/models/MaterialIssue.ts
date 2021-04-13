/* tslint:disable */

declare var Object: any;
export interface MaterialIssueInterface {
  "plantId"?: string;
  "customer"?: string;
  "modelFamily"?: string;
  "model"?: string;
  "materialId"?: string;
  "repairDate"?: Date;
  "manufactureDate"?: Date;
  "description"?: string;
  "rootCause"?: string;
  "defectQty"?: number;
  "updated"?: Date;
  "action"?: string;
  "owner"?: string;
  "dueDate"?: Date;
  "status"?: number;
  "filePath"?: string;
  "id"?: number;
}

export class MaterialIssue implements MaterialIssueInterface {
  "plantId": string;
  "customer": string;
  "modelFamily": string;
  "model": string;
  "materialId": string;
  "repairDate": Date;
  "manufactureDate": Date;
  "description": string;
  "rootCause": string;
  "defectQty": number;
  "updated": Date;
  "action": string;
  "owner": string;
  "dueDate": Date;
  "status": number;
  "filePath": string;
  "id": number;
  constructor(data?: MaterialIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MaterialIssue`.
   */
  public static getModelName() {
    return "MaterialIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MaterialIssue for dynamic purposes.
  **/
  public static factory(data: MaterialIssueInterface): MaterialIssue{
    return new MaterialIssue(data);
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
      name: 'MaterialIssue',
      plural: 'MaterialIssues',
      path: 'MaterialIssues',
      idName: 'id',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "modelFamily": {
          name: 'modelFamily',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "repairDate": {
          name: 'repairDate',
          type: 'Date'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'Date'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "rootCause": {
          name: 'rootCause',
          type: 'string'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "updated": {
          name: 'updated',
          type: 'Date'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "dueDate": {
          name: 'dueDate',
          type: 'Date'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "filePath": {
          name: 'filePath',
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
