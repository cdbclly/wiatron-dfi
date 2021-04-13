/* tslint:disable */

declare var Object: any;
export interface View_MaterialYieldRateReportInterface {
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
  "inputQty"?: number;
  "factoryDefectQty"?: number;
  "yieldRate"?: number;
  "lotQty"?: number;
  "sampleQty"?: number;
  "iqcDefectQty"?: number;
  "result"?: string;
}

export class View_MaterialYieldRateReport implements View_MaterialYieldRateReportInterface {
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
  "inputQty": number;
  "factoryDefectQty": number;
  "yieldRate": number;
  "lotQty": number;
  "sampleQty": number;
  "iqcDefectQty": number;
  "result": string;
  constructor(data?: View_MaterialYieldRateReportInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_MaterialYieldRateReport`.
   */
  public static getModelName() {
    return "View_MaterialYieldRateReport";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_MaterialYieldRateReport for dynamic purposes.
  **/
  public static factory(data: View_MaterialYieldRateReportInterface): View_MaterialYieldRateReport{
    return new View_MaterialYieldRateReport(data);
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
      name: 'View_MaterialYieldRateReport',
      plural: 'View_MaterialYieldRateReports',
      path: 'View_MaterialYieldRateReports',
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
        "inputQty": {
          name: 'inputQty',
          type: 'number'
        },
        "factoryDefectQty": {
          name: 'factoryDefectQty',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "lotQty": {
          name: 'lotQty',
          type: 'number'
        },
        "sampleQty": {
          name: 'sampleQty',
          type: 'number'
        },
        "iqcDefectQty": {
          name: 'iqcDefectQty',
          type: 'number'
        },
        "result": {
          name: 'result',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
