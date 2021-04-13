/* tslint:disable */

declare var Object: any;
export interface DfcDashboardInterface {
  "plant"?: string;
  "bu"?: string;
  "customer"?: string;
  "product"?: string;
  "rfqProjectCode"?: string;
  "rfqProjectName"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "projectNameId"?: number;
  "plmStatus"?: string;
  "isPlmProject"?: boolean;
  "isTargetSigned"?: boolean;
  "rfqDueday"?: Date;
  "c0Dueday"?: Date;
  "c1Dueday"?: Date;
  "c2Dueday"?: Date;
  "c3Dueday"?: Date;
  "c4Dueday"?: Date;
  "c5Dueday"?: Date;
  "c6Dueday"?: Date;
  "targetWorkHours"?: number;
  "actualWorkHours"?: number;
}

export class DfcDashboard implements DfcDashboardInterface {
  "plant": string;
  "bu": string;
  "customer": string;
  "product": string;
  "rfqProjectCode": string;
  "rfqProjectName": string;
  "projectCode": string;
  "projectName": string;
  "projectNameId": number;
  "plmStatus": string;
  "isPlmProject": boolean;
  "isTargetSigned": boolean;
  "rfqDueday": Date;
  "c0Dueday": Date;
  "c1Dueday": Date;
  "c2Dueday": Date;
  "c3Dueday": Date;
  "c4Dueday": Date;
  "c5Dueday": Date;
  "c6Dueday": Date;
  "targetWorkHours": number;
  "actualWorkHours": number;
  constructor(data?: DfcDashboardInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DfcDashboard`.
   */
  public static getModelName() {
    return "DfcDashboard";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DfcDashboard for dynamic purposes.
  **/
  public static factory(data: DfcDashboardInterface): DfcDashboard{
    return new DfcDashboard(data);
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
      name: 'DfcDashboard',
      plural: 'DfcDashboards',
      path: 'DfcDashboards',
      idName: 'projectNameId',
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
        "product": {
          name: 'product',
          type: 'string'
        },
        "rfqProjectCode": {
          name: 'rfqProjectCode',
          type: 'string'
        },
        "rfqProjectName": {
          name: 'rfqProjectName',
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
        "projectNameId": {
          name: 'projectNameId',
          type: 'number'
        },
        "plmStatus": {
          name: 'plmStatus',
          type: 'string'
        },
        "isPlmProject": {
          name: 'isPlmProject',
          type: 'boolean'
        },
        "isTargetSigned": {
          name: 'isTargetSigned',
          type: 'boolean'
        },
        "rfqDueday": {
          name: 'rfqDueday',
          type: 'Date'
        },
        "c0Dueday": {
          name: 'c0Dueday',
          type: 'Date'
        },
        "c1Dueday": {
          name: 'c1Dueday',
          type: 'Date'
        },
        "c2Dueday": {
          name: 'c2Dueday',
          type: 'Date'
        },
        "c3Dueday": {
          name: 'c3Dueday',
          type: 'Date'
        },
        "c4Dueday": {
          name: 'c4Dueday',
          type: 'Date'
        },
        "c5Dueday": {
          name: 'c5Dueday',
          type: 'Date'
        },
        "c6Dueday": {
          name: 'c6Dueday',
          type: 'Date'
        },
        "targetWorkHours": {
          name: 'targetWorkHours',
          type: 'number'
        },
        "actualWorkHours": {
          name: 'actualWorkHours',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
