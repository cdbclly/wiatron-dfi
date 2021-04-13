/* tslint:disable */

declare var Object: any;
export interface TraceBackInterface {
  "number": string;
  "status": string;
  "executionTime": number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "rawData": string;
  "unitSerialNumber"?: string;
}

export class TraceBack implements TraceBackInterface {
  "number": string;
  "status": string;
  "executionTime": number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "rawData": string;
  "unitSerialNumber": string;
  constructor(data?: TraceBackInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TraceBack`.
   */
  public static getModelName() {
    return "TraceBack";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TraceBack for dynamic purposes.
  **/
  public static factory(data: TraceBackInterface): TraceBack{
    return new TraceBack(data);
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
      name: 'TraceBack',
      plural: 'TraceBacks',
      path: 'TraceBacks',
      idName: 'id',
      properties: {
        "number": {
          name: 'number',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "executionTime": {
          name: 'executionTime',
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
        "rawData": {
          name: 'rawData',
          type: 'string'
        },
        "unitSerialNumber": {
          name: 'unitSerialNumber',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
