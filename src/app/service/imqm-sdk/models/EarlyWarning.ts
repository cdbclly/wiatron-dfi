/* tslint:disable */

declare var Object: any;
export interface EarlyWarningInterface {
  "number": string;
  "type": string;
  "status": string;
  "reason"?: string;
  "countermeasures"?: string;
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
  "insertTime"?: Date;
  "updateTime"?: number;
}

export class EarlyWarning implements EarlyWarningInterface {
  "number": string;
  "type": string;
  "status": string;
  "reason": string;
  "countermeasures": string;
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
  "insertTime": Date;
  "updateTime": number;
  constructor(data?: EarlyWarningInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EarlyWarning`.
   */
  public static getModelName() {
    return "EarlyWarning";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EarlyWarning for dynamic purposes.
  **/
  public static factory(data: EarlyWarningInterface): EarlyWarning{
    return new EarlyWarning(data);
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
      name: 'EarlyWarning',
      plural: 'EarlyWarnings',
      path: 'EarlyWarnings',
      idName: 'id',
      properties: {
        "number": {
          name: 'number',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "reason": {
          name: 'reason',
          type: 'string'
        },
        "countermeasures": {
          name: 'countermeasures',
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
        "insertTime": {
          name: 'insertTime',
          type: 'Date'
        },
        "updateTime": {
          name: 'updateTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
