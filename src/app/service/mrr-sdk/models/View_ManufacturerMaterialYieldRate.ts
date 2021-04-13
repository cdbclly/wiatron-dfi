/* tslint:disable */

declare var Object: any;
export interface View_ManufacturerMaterialYieldRateInterface {
  "partNumberVendorRecordId"?: number;
  "dateCode"?: Date;
  "plant"?: string;
  "customer"?: string;
  "product"?: string;
  "manufacturer"?: string;
  "vendorCode"?: string;
  "partNumberVendorId"?: number;
  "partNumber"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "stage"?: string;
  "partId"?: number;
  "part"?: string;
  "materialActualYield"?: number;
  "vendorSubmitDate"?: Date;
  "vendorRecordStatus"?: number;
}

export class View_ManufacturerMaterialYieldRate implements View_ManufacturerMaterialYieldRateInterface {
  "partNumberVendorRecordId": number;
  "dateCode": Date;
  "plant": string;
  "customer": string;
  "product": string;
  "manufacturer": string;
  "vendorCode": string;
  "partNumberVendorId": number;
  "partNumber": string;
  "projectCode": string;
  "projectName": string;
  "stage": string;
  "partId": number;
  "part": string;
  "materialActualYield": number;
  "vendorSubmitDate": Date;
  "vendorRecordStatus": number;
  constructor(data?: View_ManufacturerMaterialYieldRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ManufacturerMaterialYieldRate`.
   */
  public static getModelName() {
    return "View_ManufacturerMaterialYieldRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ManufacturerMaterialYieldRate for dynamic purposes.
  **/
  public static factory(data: View_ManufacturerMaterialYieldRateInterface): View_ManufacturerMaterialYieldRate{
    return new View_ManufacturerMaterialYieldRate(data);
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
      name: 'View_ManufacturerMaterialYieldRate',
      plural: 'View_ManufacturerMaterialYieldRates',
      path: 'View_ManufacturerMaterialYieldRates',
      idName: 'partNumberVendorRecordId',
      properties: {
        "partNumberVendorRecordId": {
          name: 'partNumberVendorRecordId',
          type: 'number'
        },
        "dateCode": {
          name: 'dateCode',
          type: 'Date'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "manufacturer": {
          name: 'manufacturer',
          type: 'string'
        },
        "vendorCode": {
          name: 'vendorCode',
          type: 'string'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "partId": {
          name: 'partId',
          type: 'number'
        },
        "part": {
          name: 'part',
          type: 'string'
        },
        "materialActualYield": {
          name: 'materialActualYield',
          type: 'number'
        },
        "vendorSubmitDate": {
          name: 'vendorSubmitDate',
          type: 'Date'
        },
        "vendorRecordStatus": {
          name: 'vendorRecordStatus',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
