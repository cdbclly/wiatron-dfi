/* tslint:disable */

declare var Object: any;
export interface SavingInformationMachineInterface {
  "site": string;
  "plant": string;
  "machineId": string;
  "shift": string;
  "vendor": string;
}

export class SavingInformationMachine implements SavingInformationMachineInterface {
  "site": string;
  "plant": string;
  "machineId": string;
  "shift": string;
  "vendor": string;
  constructor(data?: SavingInformationMachineInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SavingInformationMachine`.
   */
  public static getModelName() {
    return "SavingInformationMachine";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SavingInformationMachine for dynamic purposes.
  **/
  public static factory(data: SavingInformationMachineInterface): SavingInformationMachine{
    return new SavingInformationMachine(data);
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
      name: 'SavingInformationMachine',
      plural: 'SavingInformationMachines',
      path: 'SavingInformationMachines',
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
        "machineId": {
          name: 'machineId',
          type: 'string'
        },
        "shift": {
          name: 'shift',
          type: 'string'
        },
        "vendor": {
          name: 'vendor',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
