/* tslint:disable */

declare var Object: any;
export interface View_PieChartInterface {
  "plant"?: string;
  "bg"?: string;
  "productType"?: string;
  "projectCode"?: string;
  "currentStage"?: string;
  "c3Dueday"?: Date;
  "c4Dueday"?: Date;
  "c5Dueday"?: Date;
  "partNumber"?: string;
  "manufacturerId"?: string;
  "containerName"?: string;
  "partNumberVendorId"?: number;
  "stage"?: string;
  "total"?: number;
  "totalNotUploaded"?: number;
  "totalNotVerified"?: number;
  "totalFailed"?: number;
  "totalPassed"?: number;
  "moduleEnabled"?: boolean;
}

export class View_PieChart implements View_PieChartInterface {
  "plant": string;
  "bg": string;
  "productType": string;
  "projectCode": string;
  "currentStage": string;
  "c3Dueday": Date;
  "c4Dueday": Date;
  "c5Dueday": Date;
  "partNumber": string;
  "manufacturerId": string;
  "containerName": string;
  "partNumberVendorId": number;
  "stage": string;
  "total": number;
  "totalNotUploaded": number;
  "totalNotVerified": number;
  "totalFailed": number;
  "totalPassed": number;
  "moduleEnabled": boolean;
  constructor(data?: View_PieChartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_PieChart`.
   */
  public static getModelName() {
    return "View_PieChart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_PieChart for dynamic purposes.
  **/
  public static factory(data: View_PieChartInterface): View_PieChart{
    return new View_PieChart(data);
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
      name: 'View_PieChart',
      plural: 'View_PieCharts',
      path: 'View_PieCharts',
      idName: 'productType',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "bg": {
          name: 'bg',
          type: 'string'
        },
        "productType": {
          name: 'productType',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "currentStage": {
          name: 'currentStage',
          type: 'string'
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
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "containerName": {
          name: 'containerName',
          type: 'string'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "totalNotUploaded": {
          name: 'totalNotUploaded',
          type: 'number'
        },
        "totalNotVerified": {
          name: 'totalNotVerified',
          type: 'number'
        },
        "totalFailed": {
          name: 'totalFailed',
          type: 'number'
        },
        "totalPassed": {
          name: 'totalPassed',
          type: 'number'
        },
        "moduleEnabled": {
          name: 'moduleEnabled',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
