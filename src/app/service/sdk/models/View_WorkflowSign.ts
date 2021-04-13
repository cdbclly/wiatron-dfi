/* tslint:disable */

declare var Object: any;
export interface View_WorkflowSignInterface {
  "id"?: string;
  "desc"?: string;
  "userId"?: string;
  "role"?: string;
  "isAgree"?: number;
  "comment"?: string;
  "updateOn"?: string;
}

export class View_WorkflowSign implements View_WorkflowSignInterface {
  "id": string;
  "desc": string;
  "userId": string;
  "role": string;
  "isAgree": number;
  "comment": string;
  "updateOn": string;
  constructor(data?: View_WorkflowSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_WorkflowSign`.
   */
  public static getModelName() {
    return "View_WorkflowSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_WorkflowSign for dynamic purposes.
  **/
  public static factory(data: View_WorkflowSignInterface): View_WorkflowSign{
    return new View_WorkflowSign(data);
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
      name: 'View_WorkflowSign',
      plural: 'View_WorkflowSigns',
      path: 'View_WorkflowSigns',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "desc": {
          name: 'desc',
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
          type: 'number'
        },
        "comment": {
          name: 'comment',
          type: 'string'
        },
        "updateOn": {
          name: 'updateOn',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
