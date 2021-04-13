/* tslint:disable */
import {
  Material,
  Discussion,
  Factor
} from '../index';

declare var Object: any;
export interface ModelMaterialInterface {
  "siteId"?: string;
  "plantId"?: string;
  "modelId"?: string;
  "workflowId"?: number;
  "hasNewFactors"?: boolean;
  "yieldRate"?: string;
  "bestYieldRate"?: string;
  "createdOn"?: Date;
  "modifiedBy"?: string;
  "id"?: number;
  "materialId"?: number;
  material?: Material;
  discussion?: Discussion;
  factors?: Factor[];
}

export class ModelMaterial implements ModelMaterialInterface {
  "siteId": string;
  "plantId": string;
  "modelId": string;
  "workflowId": number;
  "hasNewFactors": boolean;
  "yieldRate": string;
  "bestYieldRate": string;
  "createdOn": Date;
  "modifiedBy": string;
  "id": number;
  "materialId": number;
  material: Material;
  discussion: Discussion;
  factors: Factor[];
  constructor(data?: ModelMaterialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelMaterial`.
   */
  public static getModelName() {
    return "ModelMaterial";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelMaterial for dynamic purposes.
  **/
  public static factory(data: ModelMaterialInterface): ModelMaterial{
    return new ModelMaterial(data);
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
      name: 'ModelMaterial',
      plural: 'ModelMaterials',
      path: 'ModelMaterials',
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
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "hasNewFactors": {
          name: 'hasNewFactors',
          type: 'boolean',
          default: false
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'string'
        },
        "bestYieldRate": {
          name: 'bestYieldRate',
          type: 'string'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "modifiedBy": {
          name: 'modifiedBy',
          type: 'string'
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
        discussion: {
          name: 'discussion',
          type: 'Discussion',
          model: 'Discussion',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'modelMaterialId'
        },
        factors: {
          name: 'factors',
          type: 'Factor[]',
          model: 'Factor',
          relationType: 'hasMany',
          modelThrough: 'ModelMaterialFactor',
          keyThrough: 'factorId',
          keyFrom: 'id',
          keyTo: 'modelMaterialId'
        },
      }
    }
  }
}
