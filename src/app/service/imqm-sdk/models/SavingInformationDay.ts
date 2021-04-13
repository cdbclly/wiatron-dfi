/* tslint:disable */

declare var Object: any;
export interface SavingInformationDayInterface {
  "site": string;
  "plant": string;
  "time": number;
  "type": string;
  "value": number;
}

export class SavingInformationDay implements SavingInformationDayInterface {
  "site": string;
  "plant": string;
  "time": number;
  "type": string;
  "value": number;
  constructor(data?: SavingInformationDayInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SavingInformationDay`.
   */
  public static getModelName() {
    return "SavingInformationDay";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SavingInformationDay for dynamic purposes.
  **/
  public static factory(data: SavingInformationDayInterface): SavingInformationDay{
    return new SavingInformationDay(data);
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
      name: 'SavingInformationDay',
      plural: 'y',
      path: 'y',
      idName: 'site',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "time": {
          name: 'time',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
