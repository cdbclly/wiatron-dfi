/* tslint:disable */

declare var Object: any;
export interface View_MassProductionInterface {
  "id"?: number;
  "cycleTimes"?: number;
  "frequency"?: number;
  "doneTimes"?: number;
  "isGain"?: number;
  "businessGroup"?: string;
  "businessUnit"?: string;
  "project"?: string;
  "profitCenter"?: string;
  "customer"?: string;
  "product"?: string;
  "site"?: string;
  "plant"?: string;
  "model"?: string;
  "isRfqProject"?: boolean;
  "startDate"?: Date;
  "c6DueDate"?: Date;
}

export class View_MassProduction implements View_MassProductionInterface {
  "id": number;
  "cycleTimes": number;
  "frequency": number;
  "doneTimes": number;
  "isGain": number;
  "businessGroup": string;
  "businessUnit": string;
  "project": string;
  "profitCenter": string;
  "customer": string;
  "product": string;
  "site": string;
  "plant": string;
  "model": string;
  "isRfqProject": boolean;
  "startDate": Date;
  "c6DueDate": Date;
  constructor(data?: View_MassProductionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_MassProduction`.
   */
  public static getModelName() {
    return "View_MassProduction";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_MassProduction for dynamic purposes.
  **/
  public static factory(data: View_MassProductionInterface): View_MassProduction{
    return new View_MassProduction(data);
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
      name: 'View_MassProduction',
      plural: 'View_MassProductions',
      path: 'View_MassProductions',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "cycleTimes": {
          name: 'cycleTimes',
          type: 'number'
        },
        "frequency": {
          name: 'frequency',
          type: 'number'
        },
        "doneTimes": {
          name: 'doneTimes',
          type: 'number'
        },
        "isGain": {
          name: 'isGain',
          type: 'number'
        },
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
        "model": {
          name: 'model',
          type: 'string'
        },
        "isRfqProject": {
          name: 'isRfqProject',
          type: 'boolean'
        },
        "startDate": {
          name: 'startDate',
          type: 'Date'
        },
        "c6DueDate": {
          name: 'c6DueDate',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
