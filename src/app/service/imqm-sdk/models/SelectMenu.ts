/* tslint:disable */

declare var Object: any;
export interface SelectMenuInterface {
  "id"?: string;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "isBarcode"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
}

export class SelectMenu implements SelectMenuInterface {
  "id": string;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "isBarcode": number;
  "updatedUser": string;
  "updatedTime": number;
  constructor(data?: SelectMenuInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SelectMenu`.
   */
  public static getModelName() {
    return "SelectMenu";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SelectMenu for dynamic purposes.
  **/
  public static factory(data: SelectMenuInterface): SelectMenu{
    return new SelectMenu(data);
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
      name: 'SelectMenu',
      plural: 'SelectMenus',
      path: 'SelectMenus',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
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
        "isBarcode": {
          name: 'isBarcode',
          type: 'number'
        },
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
