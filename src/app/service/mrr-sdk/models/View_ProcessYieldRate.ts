/* tslint:disable */

declare var Object: any;
export interface View_ProcessYieldRateInterface {
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
  "order"?: number;
  "operationId"?: number;
  "operationName"?: string;
  "partNumberVendorOperationId"?: number;
  "sqmTargetYield"?: number;
  "vendorTargetYield"?: number;
  "sqmTargetYieldId"?: number;
  "vendorTargetYieldId"?: number;
  "yieldRateRecordId"?: number;
  "vendorRecordId"?: number;
  "input"?: number;
  "output"?: number;
  "remark"?: string;
  "actual"?: number;
}

export class View_ProcessYieldRate implements View_ProcessYieldRateInterface {
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
  "order": number;
  "operationId": number;
  "operationName": string;
  "partNumberVendorOperationId": number;
  "sqmTargetYield": number;
  "vendorTargetYield": number;
  "sqmTargetYieldId": number;
  "vendorTargetYieldId": number;
  "yieldRateRecordId": number;
  "vendorRecordId": number;
  "input": number;
  "output": number;
  "remark": string;
  "actual": number;
  constructor(data?: View_ProcessYieldRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ProcessYieldRate`.
   */
  public static getModelName() {
    return "View_ProcessYieldRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ProcessYieldRate for dynamic purposes.
  **/
  public static factory(data: View_ProcessYieldRateInterface): View_ProcessYieldRate{
    return new View_ProcessYieldRate(data);
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
      name: 'View_ProcessYieldRate',
      plural: 'View_ProcessYieldRates',
      path: 'View_ProcessYieldRates',
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
        "order": {
          name: 'order',
          type: 'number'
        },
        "operationId": {
          name: 'operationId',
          type: 'number'
        },
        "operationName": {
          name: 'operationName',
          type: 'string'
        },
        "partNumberVendorOperationId": {
          name: 'partNumberVendorOperationId',
          type: 'number'
        },
        "sqmTargetYield": {
          name: 'sqmTargetYield',
          type: 'number'
        },
        "vendorTargetYield": {
          name: 'vendorTargetYield',
          type: 'number'
        },
        "sqmTargetYieldId": {
          name: 'sqmTargetYieldId',
          type: 'number'
        },
        "vendorTargetYieldId": {
          name: 'vendorTargetYieldId',
          type: 'number'
        },
        "yieldRateRecordId": {
          name: 'yieldRateRecordId',
          type: 'number'
        },
        "vendorRecordId": {
          name: 'vendorRecordId',
          type: 'number'
        },
        "input": {
          name: 'input',
          type: 'number'
        },
        "output": {
          name: 'output',
          type: 'number'
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "actual": {
          name: 'actual',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
