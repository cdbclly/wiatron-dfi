/* tslint:disable */

declare var Object: any;
export interface DRateInterface {
  "id"?: number;
}

export class DRate implements DRateInterface {
  "id": number;
  constructor(data?: DRateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DRate`.
   */
  public static getModelName() {
    return "DRate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DRate for dynamic purposes.
  **/
  public static factory(data: DRateInterface): DRate{
    return new DRate(data);
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
      name: 'DRate',
      plural: 'DRates',
      path: 'DRates',
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
