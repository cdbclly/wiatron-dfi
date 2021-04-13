/* tslint:disable */

declare var Object: any;
export interface ParameterSettingInterface {
  "type": string;
  "site"?: string;
  "plant"?: string;
  "product"?: string;
  "model"?: string;
  "productName"?: string;
  "partNumber"?: string;
  "text"?: string;
  "drMonthlyAverage"?: number;
  "numberStopsMonthlyAverage"?: number;
  "yrTarget"?: number;
  "spcCalculationFrequency"?: number;
  "automaticTraceability"?: number;
  "cpkCriteria"?: number;
  "vendorReplyDeadline"?: number;
  "fakeRawdataCount"?: number;
  "sqmsWeb"?: string;
  "id": string;
}

export class ParameterSetting implements ParameterSettingInterface {
  "type": string;
  "site": string;
  "plant": string;
  "product": string;
  "model": string;
  "productName": string;
  "partNumber": string;
  "text": string;
  "drMonthlyAverage": number;
  "numberStopsMonthlyAverage": number;
  "yrTarget": number;
  "spcCalculationFrequency": number;
  "automaticTraceability": number;
  "cpkCriteria": number;
  "vendorReplyDeadline": number;
  "fakeRawdataCount": number;
  "sqmsWeb": string;
  "id": string;
  constructor(data?: ParameterSettingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ParameterSetting`.
   */
  public static getModelName() {
    return "ParameterSetting";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ParameterSetting for dynamic purposes.
  **/
  public static factory(data: ParameterSettingInterface): ParameterSetting{
    return new ParameterSetting(data);
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
      name: 'ParameterSetting',
      plural: 'ParameterSettings',
      path: 'ParameterSettings',
      idName: 'type',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string',
          default: '*'
        },
        "product": {
          name: 'product',
          type: 'string',
          default: '*'
        },
        "model": {
          name: 'model',
          type: 'string',
          default: '*'
        },
        "productName": {
          name: 'productName',
          type: 'string',
          default: '*'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string',
          default: '*'
        },
        "text": {
          name: 'text',
          type: 'string'
        },
        "drMonthlyAverage": {
          name: 'drMonthlyAverage',
          type: 'number'
        },
        "numberStopsMonthlyAverage": {
          name: 'numberStopsMonthlyAverage',
          type: 'number'
        },
        "yrTarget": {
          name: 'yrTarget',
          type: 'number'
        },
        "spcCalculationFrequency": {
          name: 'spcCalculationFrequency',
          type: 'number'
        },
        "automaticTraceability": {
          name: 'automaticTraceability',
          type: 'number'
        },
        "cpkCriteria": {
          name: 'cpkCriteria',
          type: 'number'
        },
        "vendorReplyDeadline": {
          name: 'vendorReplyDeadline',
          type: 'number'
        },
        "fakeRawdataCount": {
          name: 'fakeRawdataCount',
          type: 'number'
        },
        "sqmsWeb": {
          name: 'sqmsWeb',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
