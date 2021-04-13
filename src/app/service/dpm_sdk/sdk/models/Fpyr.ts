/* tslint:disable */

declare var Object: any;
export interface FpyrInterface {
  "plant"?: string;
  "mfgType"?: string;
  "modelFamily"?: string;
  "model"?: string;
  "line"?: string;
  "stage"?: string;
  "trnDate"?: string;
  "period"?: string;
  "inputQty"?: number;
  "outputQty"?: number;
  "defectQty"?: number;
  "updated"?: Date;
  "id"?: number;
}

export class Fpyr implements FpyrInterface {
  "plant": string;
  "mfgType": string;
  "modelFamily": string;
  "model": string;
  "line": string;
  "stage": string;
  "trnDate": string;
  "period": string;
  "inputQty": number;
  "outputQty": number;
  "defectQty": number;
  "updated": Date;
  "id": number;
  constructor(data?: FpyrInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Fpyr`.
   */
  public static getModelName() {
    return "Fpyr";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Fpyr for dynamic purposes.
  **/
  public static factory(data: FpyrInterface): Fpyr{
    return new Fpyr(data);
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
      name: 'Fpyr',
      plural: 'Fpyrs',
      path: 'Fpyrs',
      idName: 'id',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "mfgType": {
          name: 'mfgType',
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
        "line": {
          name: 'line',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "trnDate": {
          name: 'trnDate',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "inputQty": {
          name: 'inputQty',
          type: 'number'
        },
        "outputQty": {
          name: 'outputQty',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "updated": {
          name: 'updated',
          type: 'Date'
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
