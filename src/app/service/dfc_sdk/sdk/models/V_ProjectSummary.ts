/* tslint:disable */

declare var Object: any;
export interface V_ProjectSummaryInterface {
  "Plant"?: string;
  "Customer"?: string;
  "ModelId"?: number;
  "ModelName"?: string;
  "ModelType"?: string;
  "ProjectCodeID"?: string;
  "ProjectCode"?: string;
  "MPDate"?: Date;
  "BU"?: string;
  "FCST"?: number;
  "quote"?: number;
  "ProjectNameID"?: string;
  "ProjectName"?: string;
  "CurrentStage"?: string;
  "CurrentStageSort"?: string;
  "StageID"?: string;
  "Stage"?: string;
  "StageSort"?: string;
  "Status"?: number;
  "StageWorkHourUploaded"?: boolean;
}

export class V_ProjectSummary implements V_ProjectSummaryInterface {
  "Plant": string;
  "Customer": string;
  "ModelId": number;
  "ModelName": string;
  "ModelType": string;
  "ProjectCodeID": string;
  "ProjectCode": string;
  "MPDate": Date;
  "BU": string;
  "FCST": number;
  "quote": number;
  "ProjectNameID": string;
  "ProjectName": string;
  "CurrentStage": string;
  "CurrentStageSort": string;
  "StageID": string;
  "Stage": string;
  "StageSort": string;
  "Status": number;
  "StageWorkHourUploaded": boolean;
  constructor(data?: V_ProjectSummaryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `V_ProjectSummary`.
   */
  public static getModelName() {
    return "V_ProjectSummary";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of V_ProjectSummary for dynamic purposes.
  **/
  public static factory(data: V_ProjectSummaryInterface): V_ProjectSummary{
    return new V_ProjectSummary(data);
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
      name: 'V_ProjectSummary',
      plural: 'V_ProjectSummaries',
      path: 'V_ProjectSummaries',
      idName: 'StageID',
      properties: {
        "Plant": {
          name: 'Plant',
          type: 'string'
        },
        "Customer": {
          name: 'Customer',
          type: 'string'
        },
        "ModelId": {
          name: 'ModelId',
          type: 'number'
        },
        "ModelName": {
          name: 'ModelName',
          type: 'string'
        },
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
        "ProjectCodeID": {
          name: 'ProjectCodeID',
          type: 'string'
        },
        "ProjectCode": {
          name: 'ProjectCode',
          type: 'string'
        },
        "MPDate": {
          name: 'MPDate',
          type: 'Date'
        },
        "BU": {
          name: 'BU',
          type: 'string'
        },
        "FCST": {
          name: 'FCST',
          type: 'number'
        },
        "quote": {
          name: 'quote',
          type: 'number'
        },
        "ProjectNameID": {
          name: 'ProjectNameID',
          type: 'string'
        },
        "ProjectName": {
          name: 'ProjectName',
          type: 'string'
        },
        "CurrentStage": {
          name: 'CurrentStage',
          type: 'string'
        },
        "CurrentStageSort": {
          name: 'CurrentStageSort',
          type: 'string'
        },
        "StageID": {
          name: 'StageID',
          type: 'string'
        },
        "Stage": {
          name: 'Stage',
          type: 'string'
        },
        "StageSort": {
          name: 'StageSort',
          type: 'string'
        },
        "Status": {
          name: 'Status',
          type: 'number'
        },
        "StageWorkHourUploaded": {
          name: 'StageWorkHourUploaded',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
