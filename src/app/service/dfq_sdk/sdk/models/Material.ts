/* tslint:disable */
import {
  FactorType,
  View_ModelMaterial
} from '../index';

declare var Object: any;
export interface MaterialInterface {
  "name"?: string;
  "productId"?: string;
  "enabled"?: boolean;
  "id"?: number;
  factorTypes?: FactorType[];
  viewModelmaterials?: View_ModelMaterial[];
}

export class Material implements MaterialInterface {
  "name": string;
  "productId": string;
  "enabled": boolean;
  "id": number;
  factorTypes: FactorType[];
  viewModelmaterials: View_ModelMaterial[];
  constructor(data?: MaterialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Material`.
   */
  public static getModelName() {
    return "Material";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Material for dynamic purposes.
  **/
  public static factory(data: MaterialInterface): Material{
    return new Material(data);
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
      name: 'Material',
      plural: 'Materials',
      path: 'Materials',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean',
          default: true
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        factorTypes: {
          name: 'factorTypes',
          type: 'FactorType[]',
          model: 'FactorType',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'materialId'
        },
        viewModelmaterials: {
          name: 'viewModelmaterials',
          type: 'View_ModelMaterial[]',
          model: 'View_ModelMaterial',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'materialId'
        },
      }
    }
  }
}
