/* tslint:disable */

declare var Object: any;
export interface YieldRateInterface {
  "id"?: number;
}

export class YieldRate implements YieldRateInterface {
  "id": number;
  constructor(data?: YieldRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `YieldRate`.
   */
  public static getModelName() {
    return "YieldRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of YieldRate for dynamic purposes.
  **/
  public static factory(data: YieldRateInterface): YieldRate{
    return new YieldRate(data);
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
      name: 'YieldRate',
      plural: 'YieldRates',
      path: 'YieldRates',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
