/* tslint:disable */

import { ProcessType, PartDocument, Product } from "@service/mrr-sdk";

declare var Object: any;
export interface DimensionInterface {
  "name"?: string;
  "id"?: number;
  "productId"?: string;
  processTypes?: ProcessType[];
  partDocuments?: PartDocument[];
  product?: Product;
}

export class Dimension implements DimensionInterface {
  "name": string;
  "id": number;
  "productId": string;
  processTypes: ProcessType[];
  partDocuments: PartDocument[];
  product: Product;
  constructor(data?: DimensionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dimension`.
   */
  public static getModelName() {
    return "Dimension";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dimension for dynamic purposes.
  **/
  public static factory(data: DimensionInterface): Dimension{
    return new Dimension(data);
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
      name: 'Dimension',
      plural: 'Dimensions',
      path: 'Dimensions',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
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
        processTypes: {
          name: 'processTypes',
          type: 'ProcessType[]',
          model: 'ProcessType',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'dimensionId'
        },
        partDocuments: {
          name: 'partDocuments',
          type: 'PartDocument[]',
          model: 'PartDocument',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'dimensionId'
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
