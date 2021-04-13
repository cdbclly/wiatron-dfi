/* tslint:disable */
import {
  Material
} from '../index';

declare var Object: any;
export interface View_ModelMaterialUploadInterface {
  "id"?: number;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "product"?: string;
  "modelId"?: string;
  "workflowId"?: number;
  "materialName"?: string;
  "yieldRate"?: number;
  "pic"?: string;
  "status"?: string;
  "updateOn"?: string;
  "materialId"?: number;
  material?: Material;
}

export class View_ModelMaterialUpload implements View_ModelMaterialUploadInterface {
  "id": number;
  "site": string;
  "plant": string;
  "customer": string;
  "product": string;
  "modelId": string;
  "workflowId": number;
  "materialName": string;
  "yieldRate": number;
  "pic": string;
  "status": string;
  "updateOn": string;
  "materialId": number;
  material: Material;
  constructor(data?: View_ModelMaterialUploadInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelMaterialUpload`.
   */
  public static getModelName() {
    return "View_ModelMaterialUpload";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelMaterialUpload for dynamic purposes.
  **/
  public static factory(data: View_ModelMaterialUploadInterface): View_ModelMaterialUpload{
    return new View_ModelMaterialUpload(data);
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
      name: 'View_ModelMaterialUpload',
      plural: 'View_ModelMaterialUploads',
      path: 'View_ModelMaterialUploads',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "product": {
          name: 'product',
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
        "materialName": {
          name: 'materialName',
          type: 'string'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'number'
        },
      },
      relations: {
        material: {
          name: 'material',
          type: 'Material',
          model: 'Material',
          relationType: 'belongsTo',
                  keyFrom: 'materialId',
          keyTo: 'id'
        },
      }
    }
  }
}
