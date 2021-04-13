/* tslint:disable */
import {
  ModelMaterial,
  Factor
} from '../index';

declare var Object: any;
export interface ModelMaterialFactorInterface {
  "id"?: number;
  "modelMaterialId"?: number;
  "factorId"?: number;
  modelMaterial?: ModelMaterial;
  factor?: Factor;
}

export class ModelMaterialFactor implements ModelMaterialFactorInterface {
  "id": number;
  "modelMaterialId": number;
  "factorId": number;
  modelMaterial: ModelMaterial;
  factor: Factor;
  constructor(data?: ModelMaterialFactorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelMaterialFactor`.
   */
  public static getModelName() {
    return "ModelMaterialFactor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelMaterialFactor for dynamic purposes.
  **/
  public static factory(data: ModelMaterialFactorInterface): ModelMaterialFactor{
    return new ModelMaterialFactor(data);
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
      name: 'ModelMaterialFactor',
      plural: 'ModelMaterialFactors',
      path: 'ModelMaterialFactors',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelMaterialId": {
          name: 'modelMaterialId',
          type: 'number'
        },
        "factorId": {
          name: 'factorId',
          type: 'number'
        },
      },
      relations: {
        modelMaterial: {
          name: 'modelMaterial',
          type: 'ModelMaterial',
          model: 'ModelMaterial',
          relationType: 'belongsTo',
                  keyFrom: 'modelMaterialId',
          keyTo: 'id'
        },
        factor: {
          name: 'factor',
          type: 'Factor',
          model: 'Factor',
          relationType: 'belongsTo',
                  keyFrom: 'factorId',
          keyTo: 'id'
        },
      }
    }
  }
}
