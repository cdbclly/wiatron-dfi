/* tslint:disable */
import {
  Process,
  Product
} from '../index';

declare var Object: any;
export interface OperationInterface {
  "name"?: string;
  "yieldRate"?: number;
  "id"?: number;
  "productId"?: string;
  processes?: Process[];
  product?: Product;
}

export class Operation implements OperationInterface {
  "name": string;
  "yieldRate": number;
  "id": number;
  "productId": string;
  processes: Process[];
  product: Product;
  constructor(data?: OperationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Operation`.
   */
  public static getModelName() {
    return "Operation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Operation for dynamic purposes.
  **/
  public static factory(data: OperationInterface): Operation{
    return new Operation(data);
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
      name: 'Operation',
      plural: 'Operations',
      path: 'Operations',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
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
          modelThrough: 'ProcessOperation',
          keyThrough: 'processId',
          keyFrom: 'id',
          keyTo: 'operationId'
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
