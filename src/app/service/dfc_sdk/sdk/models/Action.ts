/* tslint:disable */

declare var Object: any;
export interface ActionInterface {
  "ActionCode"?: string;
  "Name"?: string;
}

export class Action implements ActionInterface {
  "ActionCode": string;
  "Name": string;
  constructor(data?: ActionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Action`.
   */
  public static getModelName() {
    return "Action";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Action for dynamic purposes.
  **/
  public static factory(data: ActionInterface): Action{
    return new Action(data);
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
      name: 'Action',
      plural: 'Actions',
      path: 'Actions',
      idName: 'ActionCode',
      properties: {
        "ActionCode": {
          name: 'ActionCode',
          type: 'string'
        },
        "Name": {
          name: 'Name',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
