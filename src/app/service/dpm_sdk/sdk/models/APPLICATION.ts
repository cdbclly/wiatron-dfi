/* tslint:disable */

declare var Object: any;
export interface APPLICATIONInterface {
  "APPLICATIONID": string;
  "SITE"?: string;
  "PLANT"?: string;
  "NAME"?: string;
  "VERSION"?: string;
}

export class APPLICATION implements APPLICATIONInterface {
  "APPLICATIONID": string;
  "SITE": string;
  "PLANT": string;
  "NAME": string;
  "VERSION": string;
  constructor(data?: APPLICATIONInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `APPLICATION`.
   */
  public static getModelName() {
    return "APPLICATION";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of APPLICATION for dynamic purposes.
  **/
  public static factory(data: APPLICATIONInterface): APPLICATION{
    return new APPLICATION(data);
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
      name: 'APPLICATION',
      plural: 'APPLICATION',
      path: 'APPLICATION',
      idName: 'APPLICATIONID',
      properties: {
        "APPLICATIONID": {
          name: 'APPLICATIONID',
          type: 'string'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "NAME": {
          name: 'NAME',
          type: 'string'
        },
        "VERSION": {
          name: 'VERSION',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
