/* tslint:disable */

declare var Object: any;
export interface SummaryRateInterface {
  "id"?: number;
}

export class SummaryRate implements SummaryRateInterface {
  "id": number;
  constructor(data?: SummaryRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SummaryRate`.
   */
  public static getModelName() {
    return "SummaryRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SummaryRate for dynamic purposes.
  **/
  public static factory(data: SummaryRateInterface): SummaryRate{
    return new SummaryRate(data);
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
      name: 'SummaryRate',
      plural: 'SummaryRates',
      path: 'SummaryRates',
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
