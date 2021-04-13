/* tslint:disable */

declare var Object: any;
export interface View_RfiDashboardInterface {
  "businessGroup"?: string;
  "businessUnit"?: string;
  "project"?: string;
  "product"?: string;
  "site"?: string;
  "plant"?: string;
  "plantName"?: string;
  "projectNameId"?: string;
  "model"?: string;
  "useRfiModel"?: string;
  "customer"?: string;
  "status"?: string;
  "workflowUpdatedOn"?: Date;
  "PLMStatus"?: string;
  "rfqDueDate"?: Date;
  "color"?: string;
}

export class View_RfiDashboard implements View_RfiDashboardInterface {
  "businessGroup": string;
  "businessUnit": string;
  "project": string;
  "product": string;
  "site": string;
  "plant": string;
  "plantName": string;
  "projectNameId": string;
  "model": string;
  "useRfiModel": string;
  "customer": string;
  "status": string;
  "workflowUpdatedOn": Date;
  "PLMStatus": string;
  "rfqDueDate": Date;
  "color": string;
  constructor(data?: View_RfiDashboardInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_RfiDashboard`.
   */
  public static getModelName() {
    return "View_RfiDashboard";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_RfiDashboard for dynamic purposes.
  **/
  public static factory(data: View_RfiDashboardInterface): View_RfiDashboard{
    return new View_RfiDashboard(data);
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
      name: 'View_RfiDashboard',
      plural: 'View_RfiDashboards',
      path: 'View_RfiDashboards',
      idName: 'businessGroup',
      properties: {
        "businessGroup": {
          name: 'businessGroup',
          type: 'string'
        },
        "businessUnit": {
          name: 'businessUnit',
          type: 'string'
        },
        "project": {
          name: 'project',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "plantName": {
          name: 'plantName',
          type: 'string'
        },
        "projectNameId": {
          name: 'projectNameId',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "useRfiModel": {
          name: 'useRfiModel',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "workflowUpdatedOn": {
          name: 'workflowUpdatedOn',
          type: 'Date'
        },
        "PLMStatus": {
          name: 'PLMStatus',
          type: 'string'
        },
        "rfqDueDate": {
          name: 'rfqDueDate',
          type: 'Date'
        },
        "color": {
          name: 'color',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
