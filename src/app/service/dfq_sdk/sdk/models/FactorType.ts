/* tslint:disable */
import {
  Factor,
  Material
} from '../index';

declare var Object: any;
export interface FactorTypeInterface {
  "name"?: string;
  "dfcId"?: number;
  "id"?: number;
  "materialId"?: number;
  factors?: Factor[];
  material?: Material;
}

export class FactorType implements FactorTypeInterface {
  "name": string;
  "dfcId": number;
  "id": number;
  "materialId": number;
  factors: Factor[];
  material: Material;
  constructor(data?: FactorTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactorType`.
   */
  public static getModelName() {
    return "FactorType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactorType for dynamic purposes.
  **/
  public static factory(data: FactorTypeInterface): FactorType{
    return new FactorType(data);
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
      name: 'FactorType',
      plural: 'FactorTypes',
      path: 'FactorTypes',
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
        "materialId": {
          name: 'materialId',
          type: 'number'
        },
      },
      relations: {
        factors: {
          name: 'factors',
          type: 'Factor[]',
          model: 'Factor',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'factorTypeId'
        },
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
