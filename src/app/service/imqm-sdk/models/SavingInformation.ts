/* tslint:disable */

declare var Object: any;
export interface SavingInformationInterface {
  "id": number;
  "site": string;
  "plant": string;
  "time": number;
  "type": string;
  "value": number;
  "grandTotal": number;
}

export class SavingInformation implements SavingInformationInterface {
  "id": number;
  "site": string;
  "plant": string;
  "time": number;
  "type": string;
  "value": number;
  "grandTotal": number;
  constructor(data?: SavingInformationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SavingInformation`.
   */
  public static getModelName() {
    return "SavingInformation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SavingInformation for dynamic purposes.
  **/
  public static factory(data: SavingInformationInterface): SavingInformation{
    return new SavingInformation(data);
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
      name: 'SavingInformation',
      plural: 'SavingInformations',
      path: 'SavingInformations',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
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
        "grandTotal": {
          name: 'grandTotal',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
