/* tslint:disable */

declare var Object: any;
export interface View_ModelInterface {
  "businessGroup"?: string;
  "businessUnit"?: string;
  "project"?: string;
  "profitCenter"?: string;
  "customer"?: string;
  "product"?: string;
  "site"?: string;
  "plant"?: string;
  "plantName"?: string;
  "model"?: string;
  "isRfqProject"?: boolean;
  "PLMStatus"?: string;
}

export class View_Model implements View_ModelInterface {
  "businessGroup": string;
  "businessUnit": string;
  "project": string;
  "profitCenter": string;
  "customer": string;
  "product": string;
  "site": string;
  "plant": string;
  "plantName": string;
  "model": string;
  "isRfqProject": boolean;
  "PLMStatus": string;
  constructor(data?: View_ModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_Model`.
   */
  public static getModelName() {
    return "View_Model";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_Model for dynamic purposes.
  **/
  public static factory(data: View_ModelInterface): View_Model{
    return new View_Model(data);
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
      name: 'View_Model',
      plural: 'View_Models',
      path: 'View_Models',
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
        "profitCenter": {
          name: 'profitCenter',
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
        "model": {
          name: 'model',
          type: 'string'
        },
        "isRfqProject": {
          name: 'isRfqProject',
          type: 'boolean'
        },
        "PLMStatus": {
          name: 'PLMStatus',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
