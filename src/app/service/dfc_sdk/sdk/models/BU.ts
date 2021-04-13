/* tslint:disable */

declare var Object: any;
export interface BUInterface {
  "ProfitCenter": string;
  "BU": string;
  "BG": string;
}

export class BU implements BUInterface {
  "ProfitCenter": string;
  "BU": string;
  "BG": string;
  constructor(data?: BUInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `BU`.
   */
  public static getModelName() {
    return "BU";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of BU for dynamic purposes.
  **/
  public static factory(data: BUInterface): BU{
    return new BU(data);
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
      name: 'BU',
      plural: 'BUs',
      path: 'BUs',
      idName: 'ProfitCenter',
      properties: {
        "ProfitCenter": {
          name: 'ProfitCenter',
          type: 'string'
        },
        "BU": {
          name: 'BU',
          type: 'string'
        },
        "BG": {
          name: 'BG',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
