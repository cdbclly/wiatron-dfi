/* tslint:disable */
import {
  Material
} from '../index';

declare var Object: any;
export interface ModelMaterialPartInterface {
  "usageAmount"?: number;
  "defectRate"?: number;
  "modelId"?: string;
  "partId"?: string;
  "id"?: number;
  "materialId"?: number;
  material?: Material;
}

export class ModelMaterialPart implements ModelMaterialPartInterface {
  "usageAmount": number;
  "defectRate": number;
  "modelId": string;
  "partId": string;
  "id": number;
  "materialId": number;
  material: Material;
  constructor(data?: ModelMaterialPartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelMaterialPart`.
   */
  public static getModelName() {
    return "ModelMaterialPart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelMaterialPart for dynamic purposes.
  **/
  public static factory(data: ModelMaterialPartInterface): ModelMaterialPart{
    return new ModelMaterialPart(data);
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
      name: 'ModelMaterialPart',
      plural: 'ModelMaterialParts',
      path: 'ModelMaterialParts',
      idName: 'id',
      properties: {
        "usageAmount": {
          name: 'usageAmount',
          type: 'number'
        },
        "defectRate": {
          name: 'defectRate',
          type: 'number'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "partId": {
          name: 'partId',
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
      }
    }
  }
}
