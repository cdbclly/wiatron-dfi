/* tslint:disable */
import {
  PartNumber
} from '../index';

declare var Object: any;
export interface MaterialYieldRateInterface {
  "plantId"?: string;
  "customer"?: string;
  "modelFamily"?: string;
  "model"?: string;
  "materialId"?: string;
  "manufactureDate"?: string;
  "inputQty"?: number;
  "defectQty"?: number;
  "yieldRate"?: number;
  partNumber?: PartNumber;
}

export class MaterialYieldRate implements MaterialYieldRateInterface {
  "plantId": string;
  "customer": string;
  "modelFamily": string;
  "model": string;
  "materialId": string;
  "manufactureDate": string;
  "inputQty": number;
  "defectQty": number;
  "yieldRate": number;
  partNumber: PartNumber;
  constructor(data?: MaterialYieldRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MaterialYieldRate`.
   */
  public static getModelName() {
    return "MaterialYieldRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MaterialYieldRate for dynamic purposes.
  **/
  public static factory(data: MaterialYieldRateInterface): MaterialYieldRate{
    return new MaterialYieldRate(data);
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
      name: 'MaterialYieldRate',
      plural: 'MaterialYieldRates',
      path: 'MaterialYieldRates',
      idName: 'plantId',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "modelFamily": {
          name: 'modelFamily',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'string'
        },
        "inputQty": {
          name: 'inputQty',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
      },
      relations: {
        partNumber: {
          name: 'partNumber',
          type: 'PartNumber',
          model: 'PartNumber',
          relationType: 'belongsTo',
                  keyFrom: 'materialId',
          keyTo: 'id'
        },
      }
    }
  }
}
