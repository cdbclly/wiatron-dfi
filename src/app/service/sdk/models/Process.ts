import { Material } from '@service/dfc_sdk/sdk';
import { Operation, Product } from '@service/mrr-sdk';

/* tslint:disable */
declare var Object: any;
export interface ProcessInterface {
  "name"?: string;
  "id"?: number;
  "productId"?: string;
  materials?: Material[];
  operations?: Operation[];
  product?: Product;
}

export class Process implements ProcessInterface {
  "name": string;
  "id": number;
  "productId": string;
  materials: Material[];
  operations: Operation[];
  product: Product;
  constructor(data?: ProcessInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Process`.
   */
  public static getModelName() {
    return "Process";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Process for dynamic purposes.
  **/
  public static factory(data: ProcessInterface): Process{
    return new Process(data);
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
      name: 'Process',
      plural: 'Processes',
      path: 'Processes',
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
        materials: {
          name: 'materials',
          type: 'Material[]',
          model: 'Material',
          relationType: 'hasMany',
          modelThrough: 'ProcessMaterial',
          keyThrough: 'materialId',
          keyFrom: 'id',
          keyTo: 'processId'
        },
        operations: {
          name: 'operations',
          type: 'Operation[]',
          model: 'Operation',
          relationType: 'hasMany',
          modelThrough: 'ProcessOperation',
          keyThrough: 'operationId',
          keyFrom: 'id',
          keyTo: 'processId'
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
