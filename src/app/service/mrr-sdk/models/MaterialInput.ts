/* tslint:disable */
import {
  PartNumber
} from '../index';

declare var Object: any;
export interface MaterialInputInterface {
  "plantId"?: string;
  "customer"?: string;
  "modelFamily"?: string;
  "model"?: string;
  "materialId"?: string;
  "trnDate"?: string;
  "manufactureDate"?: string;
  "qty"?: number;
  "updated"?: string;
  "id"?: number;
  partNumber?: PartNumber;
}

export class MaterialInput implements MaterialInputInterface {
  "plantId": string;
  "customer": string;
  "modelFamily": string;
  "model": string;
  "materialId": string;
  "trnDate": string;
  "manufactureDate": string;
  "qty": number;
  "updated": string;
  "id": number;
  partNumber: PartNumber;
  constructor(data?: MaterialInputInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MaterialInput`.
   */
  public static getModelName() {
    return "MaterialInput";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MaterialInput for dynamic purposes.
  **/
  public static factory(data: MaterialInputInterface): MaterialInput{
    return new MaterialInput(data);
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
      name: 'MaterialInput',
      plural: 'MaterialInputs',
      path: 'MaterialInputs',
      idName: 'id',
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
        "trnDate": {
          name: 'trnDate',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'string'
        },
        "qty": {
          name: 'qty',
          type: 'number'
        },
        "updated": {
          name: 'updated',
          type: 'string'
        },
        "id": {
          name: 'id',
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
