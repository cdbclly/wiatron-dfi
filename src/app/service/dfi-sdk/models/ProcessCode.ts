/* tslint:disable */
import {
  Plant,
  Product
} from '../index';

declare var Object: any;
export interface ProcessCodeInterface {
  "name"?: string;
  "id"?: number;
  "plantId"?: string;
  "productId"?: string;
  plant?: Plant;
  product?: Product;
}

export class ProcessCode implements ProcessCodeInterface {
  "name": string;
  "id": number;
  "plantId": string;
  "productId": string;
  plant: Plant;
  product: Product;
  constructor(data?: ProcessCodeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProcessCode`.
   */
  public static getModelName() {
    return "ProcessCode";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProcessCode for dynamic purposes.
  **/
  public static factory(data: ProcessCodeInterface): ProcessCode{
    return new ProcessCode(data);
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
      name: 'ProcessCode',
      plural: 'ProcessCodes',
      path: 'ProcessCodes',
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
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'Plant',
          model: 'Plant',
          relationType: 'belongsTo',
                  keyFrom: 'plantId',
          keyTo: 'id'
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
