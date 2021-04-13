/* tslint:disable */

declare var Object: any;
export interface InputInfoInterface {
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "input": number;
  "datetime": number;
}

export class InputInfo implements InputInfoInterface {
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "input": number;
  "datetime": number;
  constructor(data?: InputInfoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `InputInfo`.
   */
  public static getModelName() {
    return "InputInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of InputInfo for dynamic purposes.
  **/
  public static factory(data: InputInfoInterface): InputInfo{
    return new InputInfo(data);
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
      name: 'InputInfo',
      plural: 'InputInfos',
      path: 'InputInfos',
      idName: 'id',
      properties: {
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
        "input": {
          name: 'input',
          type: 'number'
        },
        "datetime": {
          name: 'datetime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
