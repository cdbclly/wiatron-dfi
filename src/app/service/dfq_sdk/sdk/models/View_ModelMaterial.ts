/* tslint:disable */
import {
  Material
} from '../index';

declare var Object: any;
export interface View_ModelMaterialInterface {
  "id"?: number;
  "site"?: string;
  "plant"?: string;
  "customer"?: string;
  "product"?: string;
  "project"?: string;
  "modelId"?: string;
  "materialName"?: string;
  "workflowId"?: number;
  "hasNewFactors"?: boolean;
  "originalId"?: number;
  "originalYieldRate"?: number;
  "yieldRate"?: number;
  "bestYieldRate"?: number;
  "createdOn"?: Date;
  "discussionId"?: number;
  "pic"?: string;
  "discussion"?: string;
  "duedate"?: string;
  "status"?: number;
  "isRfqProject"?: boolean;
  "c5Date"?: string;
  "materialId"?: number;
  material?: Material;
}

export class View_ModelMaterial implements View_ModelMaterialInterface {
  "id": number;
  "site": string;
  "plant": string;
  "customer": string;
  "product": string;
  "project": string;
  "modelId": string;
  "materialName": string;
  "workflowId": number;
  "hasNewFactors": boolean;
  "originalId": number;
  "originalYieldRate": number;
  "yieldRate": number;
  "bestYieldRate": number;
  "createdOn": Date;
  "discussionId": number;
  "pic": string;
  "discussion": string;
  "duedate": string;
  "status": number;
  "isRfqProject": boolean;
  "c5Date": string;
  "materialId": number;
  material: Material;
  constructor(data?: View_ModelMaterialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelMaterial`.
   */
  public static getModelName() {
    return "View_ModelMaterial";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelMaterial for dynamic purposes.
  **/
  public static factory(data: View_ModelMaterialInterface): View_ModelMaterial{
    return new View_ModelMaterial(data);
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
      name: 'View_ModelMaterial',
      plural: 'View_ModelMaterials',
      path: 'View_ModelMaterials',
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
        "project": {
          name: 'project',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "materialName": {
          name: 'materialName',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "hasNewFactors": {
          name: 'hasNewFactors',
          type: 'boolean'
        },
        "originalId": {
          name: 'originalId',
          type: 'number'
        },
        "originalYieldRate": {
          name: 'originalYieldRate',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "bestYieldRate": {
          name: 'bestYieldRate',
          type: 'number'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "discussionId": {
          name: 'discussionId',
          type: 'number'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "discussion": {
          name: 'discussion',
          type: 'string'
        },
        "duedate": {
          name: 'duedate',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "isRfqProject": {
          name: 'isRfqProject',
          type: 'boolean'
        },
        "c5Date": {
          name: 'c5Date',
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
