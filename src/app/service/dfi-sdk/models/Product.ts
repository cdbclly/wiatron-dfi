/* tslint:disable */
import {
  Customer
} from '../index';

declare var Object: any;
export interface ProductInterface {
  "id": string;
  customers?: Customer[];
}

export class Product implements ProductInterface {
  "id": string;
  customers: Customer[];
  constructor(data?: ProductInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Product`.
   */
  public static getModelName() {
    return "Product";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Product for dynamic purposes.
  **/
  public static factory(data: ProductInterface): Product{
    return new Product(data);
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
      name: 'Product',
      plural: 'Products',
      path: 'Products',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        customers: {
          name: 'customers',
          type: 'Customer[]',
          model: 'Customer',
          relationType: 'hasMany',
          modelThrough: 'Project',
          keyThrough: 'customerId',
          keyFrom: 'id',
          keyTo: 'productId'
        },
      }
    }
  }
}
