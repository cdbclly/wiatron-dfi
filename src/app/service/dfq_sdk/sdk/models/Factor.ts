/* tslint:disable */
import {
  FactorType,
  ModelMaterial
} from '../index';

declare var Object: any;
export interface FactorInterface {
  "name"?: string;
  "dfcId"?: number;
  "id"?: number;
  "factorTypeId"?: number;
  factorType?: FactorType;
  modelMaterials?: ModelMaterial[];
  viewModelmaterials?: any[];
}

export class Factor implements FactorInterface {
  "name": string;
  "dfcId": number;
  "id": number;
  "factorTypeId": number;
  factorType: FactorType;
  modelMaterials: ModelMaterial[];
  viewModelmaterials: any[];
  constructor(data?: FactorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Factor`.
   */
  public static getModelName() {
    return "Factor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Factor for dynamic purposes.
  **/
  public static factory(data: FactorInterface): Factor{
    return new Factor(data);
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
      name: 'Factor',
      plural: 'Factors',
      path: 'Factors',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "dfcId": {
          name: 'dfcId',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "factorTypeId": {
          name: 'factorTypeId',
          type: 'number'
        },
      },
      relations: {
        factorType: {
          name: 'factorType',
          type: 'FactorType',
          model: 'FactorType',
          relationType: 'belongsTo',
                  keyFrom: 'factorTypeId',
          keyTo: 'id'
        },
        modelMaterials: {
          name: 'modelMaterials',
          type: 'ModelMaterial[]',
          model: 'ModelMaterial',
          relationType: 'hasMany',
          modelThrough: 'ModelMaterialFactor',
          keyThrough: 'modelMaterialId',
          keyFrom: 'id',
          keyTo: 'factorId'
        },
        viewModelmaterials: {
          name: 'viewModelmaterials',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
          modelThrough: 'ModelMaterialFactor',
          keyThrough: 'viewModelmaterialId',
          keyFrom: 'id',
          keyTo: 'factorId'
        },
      }
    }
  }
}
