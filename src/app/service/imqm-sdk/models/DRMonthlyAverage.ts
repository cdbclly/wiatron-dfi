/* tslint:disable */

declare var Object: any;
export interface DRMonthlyAverageInterface {
  "id"?: number;
}

export class DRMonthlyAverage implements DRMonthlyAverageInterface {
  "id": number;
  constructor(data?: DRMonthlyAverageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DRMonthlyAverage`.
   */
  public static getModelName() {
    return "DRMonthlyAverage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DRMonthlyAverage for dynamic purposes.
  **/
  public static factory(data: DRMonthlyAverageInterface): DRMonthlyAverage{
    return new DRMonthlyAverage(data);
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
      name: 'DRMonthlyAverage',
      plural: 'DRMonthlyAverages',
      path: 'DRMonthlyAverages',
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
