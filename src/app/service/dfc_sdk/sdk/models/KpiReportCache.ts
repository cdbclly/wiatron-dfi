/* tslint:disable */

declare var Object: any;
export interface KpiReportCacheInterface {
  "plant"?: string;
  "bu"?: string;
  "customer"?: string;
  "productType"?: string;
  "projectCodeId"?: string;
  "projectCode"?: string;
  "projectNameId"?: number;
  "projectName"?: string;
  "modelId"?: number;
  "modelName"?: string;
  "stageId"?: number;
  "stage"?: string;
  "quote"?: number;
  "factoryActualMoh"?: number;
  "factoryActualOperationTime"?: number;
  "militaryFlag"?: boolean;
  "targetSignFlag"?: boolean;
  "optTime"?: number;
  "targetOptTime"?: number;
  "currentMoh"?: number;
  "targetMoh"?: number;
}

export class KpiReportCache implements KpiReportCacheInterface {
  "plant": string;
  "bu": string;
  "customer": string;
  "productType": string;
  "projectCodeId": string;
  "projectCode": string;
  "projectNameId": number;
  "projectName": string;
  "modelId": number;
  "modelName": string;
  "stageId": number;
  "stage": string;
  "quote": number;
  "factoryActualMoh": number;
  "factoryActualOperationTime": number;
  "militaryFlag": boolean;
  "targetSignFlag": boolean;
  "optTime": number;
  "targetOptTime": number;
  "currentMoh": number;
  "targetMoh": number;
  constructor(data?: KpiReportCacheInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `KpiReportCache`.
   */
  public static getModelName() {
    return "KpiReportCache";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of KpiReportCache for dynamic purposes.
  **/
  public static factory(data: KpiReportCacheInterface): KpiReportCache{
    return new KpiReportCache(data);
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
      name: 'KpiReportCache',
      plural: 'KpiReportCaches',
      path: 'KpiReportCaches',
      idName: 'stageId',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "productType": {
          name: 'productType',
          type: 'string'
        },
        "projectCodeId": {
          name: 'projectCodeId',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectNameId": {
          name: 'projectNameId',
          type: 'number'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
          type: 'number'
        },
        "modelName": {
          name: 'modelName',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'number'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "quote": {
          name: 'quote',
          type: 'number'
        },
        "factoryActualMoh": {
          name: 'factoryActualMoh',
          type: 'number'
        },
        "factoryActualOperationTime": {
          name: 'factoryActualOperationTime',
          type: 'number'
        },
        "militaryFlag": {
          name: 'militaryFlag',
          type: 'boolean'
        },
        "targetSignFlag": {
          name: 'targetSignFlag',
          type: 'boolean'
        },
        "optTime": {
          name: 'optTime',
          type: 'number'
        },
        "targetOptTime": {
          name: 'targetOptTime',
          type: 'number'
        },
        "currentMoh": {
          name: 'currentMoh',
          type: 'number'
        },
        "targetMoh": {
          name: 'targetMoh',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
