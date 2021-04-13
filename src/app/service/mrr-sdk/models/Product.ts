/* tslint:disable */
import {
  Customer,
  Part,
  Process,
  Dimension,
  Operation,
  Material,
  ProductDocument
} from '../index';

declare var Object: any;
export interface ProductInterface {
  "id": string;
  customers?: Customer[];
  parts?: Part[];
  processes?: Process[];
  dimensions?: Dimension[];
  operations?: Operation[];
  materials?: Material[];
  productDocument?: ProductDocument[];
}

export class Product implements ProductInterface {
  "id": string;
  customers: Customer[];
  parts: Part[];
  processes: Process[];
  dimensions: Dimension[];
  operations: Operation[];
  materials: Material[];
  productDocument: ProductDocument[];
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
        parts: {
          name: 'parts',
          type: 'Part[]',
          model: 'Part',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
        processes: {
          name: 'processes',
          type: 'Process[]',
          model: 'Process',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
        dimensions: {
          name: 'dimensions',
          type: 'Dimension[]',
          model: 'Dimension',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
        operations: {
          name: 'operations',
          type: 'Operation[]',
          model: 'Operation',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
        materials: {
          name: 'materials',
          type: 'Material[]',
          model: 'Material',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
        productDocument: {
          name: 'productDocument',
          type: 'ProductDocument[]',
          model: 'ProductDocument',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'productId'
        },
      }
    }
  }
}
