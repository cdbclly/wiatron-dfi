/* tslint:disable */

declare var Object: any;
export interface SelectMenuLogInterface {
  "id"?: string;
  "menuId": string;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "updatedUser"?: string;
  "isBarcode"?: number;
  "updatedTime"?: number;
  "action"?: string;
}

export class SelectMenuLog implements SelectMenuLogInterface {
  "id": string;
  "menuId": string;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "updatedUser": string;
  "isBarcode": number;
  "updatedTime": number;
  "action": string;
  constructor(data?: SelectMenuLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SelectMenuLog`.
   */
  public static getModelName() {
    return "SelectMenuLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SelectMenuLog for dynamic purposes.
  **/
  public static factory(data: SelectMenuLogInterface): SelectMenuLog{
    return new SelectMenuLog(data);
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
      name: 'SelectMenuLog',
      plural: 'SelectMenuLogs',
      path: 'SelectMenuLogs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "menuId": {
          name: 'menuId',
          type: 'string'
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
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "isBarcode": {
          name: 'isBarcode',
          type: 'number'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'number'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
