/* tslint:disable */

declare var Object: any;
export interface RawDataTempInterface {
  "id"?: number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "unitSerialNumber": string;
  "rawData"?: string;
  "isMapping"?: number;
  "updatedTime"?: number;
  "executionTime"?: number;
}

export class RawDataTemp implements RawDataTempInterface {
  "id": number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "unitSerialNumber": string;
  "rawData": string;
  "isMapping": number;
  "updatedTime": number;
  "executionTime": number;
  constructor(data?: RawDataTempInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RawDataTemp`.
   */
  public static getModelName() {
    return "RawDataTemp";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RawDataTemp for dynamic purposes.
  **/
  public static factory(data: RawDataTempInterface): RawDataTemp{
    return new RawDataTemp(data);
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
      name: 'RawDataTemp',
      plural: 'RawDataTemps',
      path: 'RawDataTemps',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "vendor": {
          name: 'vendor',
          type: 'string'
        },
        "productName": {
          name: 'productName',
          type: 'string'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "unitSerialNumber": {
          name: 'unitSerialNumber',
          type: 'string'
        },
        "rawData": {
          name: 'rawData',
          type: 'string'
        },
        "isMapping": {
          name: 'isMapping',
          type: 'number'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'number'
        },
        "executionTime": {
          name: 'executionTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
