/* tslint:disable */

import { Product } from "@service/dfi-sdk";
import { Process } from "@service/dfc_sdk/sdk";

declare var Object: any;
export interface MaterialInterface {
  "desc"?: string;
  "yieldRate"?: number;
  "id"?: number;
  "productId"?: string;
  processes?: Process[];
  product?: Product;
}

export class Material implements MaterialInterface {
  "desc": string;
  "yieldRate": number;
  "id": number;
  "productId": string;
  processes: Process[];
  product: Product;
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
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
      },
      relations: {
        processes: {
          name: 'processes',
          type: 'Process[]',
          model: 'Process',
          relationType: 'hasMany',
          modelThrough: 'ProcessMaterial',
          keyThrough: 'processId',
          keyFrom: 'id',
          keyTo: 'materialId'
        },
        product: {
          name: 'product',
          type: 'Product',
          model: 'Product',
          relationType: 'belongsTo',
                  keyFrom: 'productId',
          keyTo: 'id'
        },
      }
    }
  }
}
