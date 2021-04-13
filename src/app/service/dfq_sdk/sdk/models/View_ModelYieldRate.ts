/* tslint:disable */

declare var Object: any;
export interface View_ModelYieldRateInterface {
  "businessGroup"?: string;
  "businessUnit"?: string;
  "project"?: string;
  "baProject"?: string;
  "product"?: string;
  "site"?: string;
  "plant"?: string;
  "model"?: string;
  "baModel"?: string;
  "customer"?: string;
  "status"?: string;
  "originalYieldRate"?: number;
  "improvedYieldRate"?: number;
  "bestYieldRate"?: number;
}

export class View_ModelYieldRate implements View_ModelYieldRateInterface {
  "businessGroup": string;
  "businessUnit": string;
  "project": string;
  "baProject": string;
  "product": string;
  "site": string;
  "plant": string;
  "model": string;
  "baModel": string;
  "customer": string;
  "status": string;
  "originalYieldRate": number;
  "improvedYieldRate": number;
  "bestYieldRate": number;
  constructor(data?: View_ModelYieldRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelYieldRate`.
   */
  public static getModelName() {
    return "View_ModelYieldRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelYieldRate for dynamic purposes.
  **/
  public static factory(data: View_ModelYieldRateInterface): View_ModelYieldRate{
    return new View_ModelYieldRate(data);
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
      name: 'View_ModelYieldRate',
      plural: 'View_ModelYieldRates',
      path: 'View_ModelYieldRates',
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
        "baProject": {
          name: 'baProject',
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
        "model": {
          name: 'model',
          type: 'string'
        },
        "baModel": {
          name: 'baModel',
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
        "originalYieldRate": {
          name: 'originalYieldRate',
          type: 'number'
        },
        "improvedYieldRate": {
          name: 'improvedYieldRate',
          type: 'number'
        },
        "bestYieldRate": {
          name: 'bestYieldRate',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
