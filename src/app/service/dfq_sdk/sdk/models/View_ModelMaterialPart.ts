/* tslint:disable */

declare var Object: any;
export interface View_ModelMaterialPartInterface {
  "id"?: number;
  "plantId"?: string;
  "productId"?: string;
  "projectId"?: string;
  "modelId"?: string;
  "workflowId"?: number;
  "partId"?: string;
  "usageAmount"?: number;
  "defectNum"?: number;
  "total"?: number;
  "yieldRate"?: number;
  "totalYieldRate"?: number;
}

export class View_ModelMaterialPart implements View_ModelMaterialPartInterface {
  "id": number;
  "plantId": string;
  "productId": string;
  "projectId": string;
  "modelId": string;
  "workflowId": number;
  "partId": string;
  "usageAmount": number;
  "defectNum": number;
  "total": number;
  "yieldRate": number;
  "totalYieldRate": number;
  constructor(data?: View_ModelMaterialPartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelMaterialPart`.
   */
  public static getModelName() {
    return "View_ModelMaterialPart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelMaterialPart for dynamic purposes.
  **/
  public static factory(data: View_ModelMaterialPartInterface): View_ModelMaterialPart{
    return new View_ModelMaterialPart(data);
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
      name: 'View_ModelMaterialPart',
      plural: 'View_ModelMaterialParts',
      path: 'View_ModelMaterialParts',
      idName: 'plantId',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "partId": {
          name: 'partId',
          type: 'string'
        },
        "usageAmount": {
          name: 'usageAmount',
          type: 'number'
        },
        "defectNum": {
          name: 'defectNum',
          type: 'number'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "totalYieldRate": {
          name: 'totalYieldRate',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
