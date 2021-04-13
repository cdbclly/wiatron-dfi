/* tslint:disable */
import {
  PartDocument,
  Product
} from '../index';

declare var Object: any;
export interface PartInterface {
  "name"?: string;
  "id"?: number;
  "productId"?: string;
  partDocuments?: PartDocument[];
  product?: Product;
}

export class Part implements PartInterface {
  "name": string;
  "id": number;
  "productId": string;
  partDocuments: PartDocument[];
  product: Product;
  constructor(data?: PartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Part`.
   */
  public static getModelName() {
    return "Part";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Part for dynamic purposes.
  **/
  public static factory(data: PartInterface): Part{
    return new Part(data);
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
      name: 'Part',
      plural: 'Parts',
      path: 'Parts',
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
        partDocuments: {
          name: 'partDocuments',
          type: 'PartDocument[]',
          model: 'PartDocument',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partId'
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
