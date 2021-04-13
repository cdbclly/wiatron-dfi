/* tslint:disable */
import {
  Material
} from '../index';

declare var Object: any;
export interface ModelMaterialUploadInterface {
  "siteId"?: string;
  "plantId"?: string;
  "workflowId"?: number;
  "modelId"?: string;
  "yieldRate"?: string;
  "pic"?: string;
  "updateOn"?: Date;
  "id"?: number;
  "materialId"?: number;
  material?: Material;
}

export class ModelMaterialUpload implements ModelMaterialUploadInterface {
  "siteId": string;
  "plantId": string;
  "workflowId": number;
  "modelId": string;
  "yieldRate": string;
  "pic": string;
  "updateOn": Date;
  "id": number;
  "materialId": number;
  material: Material;
  constructor(data?: ModelMaterialUploadInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelMaterialUpload`.
   */
  public static getModelName() {
    return "ModelMaterialUpload";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelMaterialUpload for dynamic purposes.
  **/
  public static factory(data: ModelMaterialUploadInterface): ModelMaterialUpload{
    return new ModelMaterialUpload(data);
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
      name: 'ModelMaterialUpload',
      plural: 'ModelMaterialUploads',
      path: 'ModelMaterialUploads',
      idName: 'id',
      properties: {
        "siteId": {
          name: 'siteId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'string'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
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
