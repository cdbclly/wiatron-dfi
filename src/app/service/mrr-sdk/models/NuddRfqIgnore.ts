/* tslint:disable */

declare var Object: any;
export interface NuddRfqIgnoreInterface {
  "site"?: string;
  "product"?: string;
}

export class NuddRfqIgnore implements NuddRfqIgnoreInterface {
  "site": string;
  "product": string;
  constructor(data?: NuddRfqIgnoreInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NuddRfqIgnore`.
   */
  public static getModelName() {
    return "NuddRfqIgnore";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NuddRfqIgnore for dynamic purposes.
  **/
  public static factory(data: NuddRfqIgnoreInterface): NuddRfqIgnore{
    return new NuddRfqIgnore(data);
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
      name: 'NuddRfqIgnore',
      plural: 'NuddRfqIgnores',
      path: 'NuddRfqIgnores',
      idName: 'site',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
