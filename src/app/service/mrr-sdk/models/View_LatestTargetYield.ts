/* tslint:disable */

declare var Object: any;
export interface View_LatestTargetYieldInterface {
  "plant"?: string;
  "customer"?: string;
  "product"?: string;
  "manufacturer"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "partNumber"?: string;
  "vendorCode"?: string;
  "stage"?: string;
  "parts"?: string;
  "order"?: number;
  "operation"?: string;
  "sqmTargetYield"?: number;
  "vendorTargetYield"?: number;
  "partId"?: number;
  "partNumberVendorId"?: number;
  "operationId"?: number;
  "partNumberVendorOperationId"?: number;
  "sqmTargetYieldId"?: number;
  "vendorTargetYieldId"?: number;
}

export class View_LatestTargetYield implements View_LatestTargetYieldInterface {
  "plant": string;
  "customer": string;
  "product": string;
  "manufacturer": string;
  "projectCode": string;
  "projectName": string;
  "partNumber": string;
  "vendorCode": string;
  "stage": string;
  "parts": string;
  "order": number;
  "operation": string;
  "sqmTargetYield": number;
  "vendorTargetYield": number;
  "partId": number;
  "partNumberVendorId": number;
  "operationId": number;
  "partNumberVendorOperationId": number;
  "sqmTargetYieldId": number;
  "vendorTargetYieldId": number;
  constructor(data?: View_LatestTargetYieldInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_LatestTargetYield`.
   */
  public static getModelName() {
    return "View_LatestTargetYield";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_LatestTargetYield for dynamic purposes.
  **/
  public static factory(data: View_LatestTargetYieldInterface): View_LatestTargetYield{
    return new View_LatestTargetYield(data);
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
      name: 'View_LatestTargetYield',
      plural: 'View_LatestTargetYields',
      path: 'View_LatestTargetYields',
      idName: 'partNumberVendorOperationId',
      properties: {
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
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "vendorCode": {
          name: 'vendorCode',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "parts": {
          name: 'parts',
          type: 'string'
        },
        "order": {
          name: 'order',
          type: 'number'
        },
        "operation": {
          name: 'operation',
          type: 'string'
        },
        "sqmTargetYield": {
          name: 'sqmTargetYield',
          type: 'number'
        },
        "vendorTargetYield": {
          name: 'vendorTargetYield',
          type: 'number'
        },
        "partId": {
          name: 'partId',
          type: 'number'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "operationId": {
          name: 'operationId',
          type: 'number'
        },
        "partNumberVendorOperationId": {
          name: 'partNumberVendorOperationId',
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
      },
      relations: {
      }
    }
  }
}
