/* tslint:disable */

declare var Object: any;
export interface ProductTypeStageScoreInterface {
  "productType"?: string;
  "sign"?: string;
  "C3Score"?: number;
  "C4Score"?: number;
  "C5Score"?: number;
  "id"?: number;
}

export class ProductTypeStageScore implements ProductTypeStageScoreInterface {
  "productType": string;
  "sign": string;
  "C3Score": number;
  "C4Score": number;
  "C5Score": number;
  "id": number;
  constructor(data?: ProductTypeStageScoreInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProductTypeStageScore`.
   */
  public static getModelName() {
    return "ProductTypeStageScore";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProductTypeStageScore for dynamic purposes.
  **/
  public static factory(data: ProductTypeStageScoreInterface): ProductTypeStageScore{
    return new ProductTypeStageScore(data);
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
      name: 'ProductTypeStageScore',
      plural: 'ProductTypeStageScores',
      path: 'ProductTypeStageScores',
      idName: 'id',
      properties: {
        "productType": {
          name: 'productType',
          type: 'string'
        },
        "sign": {
          name: 'sign',
          type: 'string'
        },
        "C3Score": {
          name: 'C3Score',
          type: 'number'
        },
        "C4Score": {
          name: 'C4Score',
          type: 'number'
        },
        "C5Score": {
          name: 'C5Score',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
