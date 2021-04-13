/* tslint:disable */

declare var Object: any;
export interface NumberOfStopsInterface {
  "sequence": string;
  "plant": string;
  "manufacturer": string;
  "signDateTime": number;
}

export class NumberOfStops implements NumberOfStopsInterface {
  "sequence": string;
  "plant": string;
  "manufacturer": string;
  "signDateTime": number;
  constructor(data?: NumberOfStopsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NumberOfStops`.
   */
  public static getModelName() {
    return "NumberOfStops";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NumberOfStops for dynamic purposes.
  **/
  public static factory(data: NumberOfStopsInterface): NumberOfStops{
    return new NumberOfStops(data);
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
      name: 'NumberOfStops',
      plural: 'NumberOfStops',
      path: 'NumberOfStops',
      idName: 'sequence',
      properties: {
        "sequence": {
          name: 'sequence',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "manufacturer": {
          name: 'manufacturer',
          type: 'string'
        },
        "signDateTime": {
          name: 'signDateTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
