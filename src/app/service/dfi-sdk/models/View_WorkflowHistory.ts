/* tslint:disable */

declare var Object: any;
export interface View_WorkflowHistoryInterface {
  "formName"?: string;
  "formKey"?: string;
  "workflowId"?: number;
  "desc"?: string;
  "status"?: string;
  "userId"?: string;
  "role"?: string;
  "isAgree"?: boolean;
  "comment"?: string;
  "updateOn"?: Date;
  user?: any;
}

export class View_WorkflowHistory implements View_WorkflowHistoryInterface {
  "formName": string;
  "formKey": string;
  "workflowId": number;
  "desc": string;
  "status": string;
  "userId": string;
  "role": string;
  "isAgree": boolean;
  "comment": string;
  "updateOn": Date;
  user: any;
  constructor(data?: View_WorkflowHistoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_WorkflowHistory`.
   */
  public static getModelName() {
    return "View_WorkflowHistory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_WorkflowHistory for dynamic purposes.
  **/
  public static factory(data: View_WorkflowHistoryInterface): View_WorkflowHistory{
    return new View_WorkflowHistory(data);
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
      name: 'View_WorkflowHistory',
      plural: 'View_WorkflowHistories',
      path: 'View_WorkflowHistories',
      idName: 'formName',
      properties: {
        "formName": {
          name: 'formName',
          type: 'string'
        },
        "formKey": {
          name: 'formKey',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "role": {
          name: 'role',
          type: 'string'
        },
        "isAgree": {
          name: 'isAgree',
          type: 'boolean'
        },
        "comment": {
          name: 'comment',
          type: 'string'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'Date'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'username'
        },
      }
    }
  }
}
