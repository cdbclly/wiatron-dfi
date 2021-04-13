/* tslint:disable */

declare var Object: any;
export interface ParameterSettingLogInterface {
  "id"?: number;
  "parameterSettingId": string;
  "type"?: string;
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
  "time": number;
  "userId": string;
}

export class ParameterSettingLog implements ParameterSettingLogInterface {
  "id": number;
  "parameterSettingId": string;
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
  "time": number;
  "userId": string;
  constructor(data?: ParameterSettingLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ParameterSettingLog`.
   */
  public static getModelName() {
    return "ParameterSettingLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ParameterSettingLog for dynamic purposes.
  **/
  public static factory(data: ParameterSettingLogInterface): ParameterSettingLog{
    return new ParameterSettingLog(data);
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
      name: 'ParameterSettingLog',
      plural: 'ParameterSettingLogs',
      path: 'ParameterSettingLogs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "parameterSettingId": {
          name: 'parameterSettingId',
          type: 'string'
        },
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
        "time": {
          name: 'time',
          type: 'number'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
