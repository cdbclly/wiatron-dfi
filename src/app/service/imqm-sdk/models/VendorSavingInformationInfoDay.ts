/* tslint:disable */

declare var Object: any;
export interface VendorSavingInformationInfoDayInterface {
  "site": string;
  "plant": string;
  "vendor": string;
  "equipmentQuantity": number;
  "saveValue": number;
  "time": number;
}

export class VendorSavingInformationInfoDay implements VendorSavingInformationInfoDayInterface {
  "site": string;
  "plant": string;
  "vendor": string;
  "equipmentQuantity": number;
  "saveValue": number;
  "time": number;
  constructor(data?: VendorSavingInformationInfoDayInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorSavingInformationInfoDay`.
   */
  public static getModelName() {
    return "VendorSavingInformationInfoDay";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorSavingInformationInfoDay for dynamic purposes.
  **/
  public static factory(data: VendorSavingInformationInfoDayInterface): VendorSavingInformationInfoDay{
    return new VendorSavingInformationInfoDay(data);
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
      name: 'VendorSavingInformationInfoDay',
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
        "vendor": {
          name: 'vendor',
          type: 'string'
        },
        "equipmentQuantity": {
          name: 'equipmentQuantity',
          type: 'number'
        },
        "saveValue": {
          name: 'saveValue',
          type: 'number'
        },
        "time": {
          name: 'time',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
