/* tslint:disable */
import {
  Member
} from '../index';

declare var Object: any;
export interface View_WorkflowInterface {
  "description"?: string;
  "userId"?: string;
  "path"?: string;
  member?: Member;
}

export class View_Workflow implements View_WorkflowInterface {
  "description": string;
  "userId": string;
  "path": string;
  member: Member;
  constructor(data?: View_WorkflowInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_Workflow`.
   */
  public static getModelName() {
    return "View_Workflow";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_Workflow for dynamic purposes.
  **/
  public static factory(data: View_WorkflowInterface): View_Workflow{
    return new View_Workflow(data);
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
      name: 'View_Workflow',
      plural: 'View_Workflows',
      path: 'View_Workflows',
      idName: 'description',
      properties: {
        "description": {
          name: 'description',
          type: 'string'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "path": {
          name: 'path',
          type: 'string'
        },
      },
      relations: {
        member: {
          name: 'member',
          type: 'Member',
          model: 'Member',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'EmpID'
        },
      }
    }
  }
}
