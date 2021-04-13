/* tslint:disable */

declare var Object: any;
export interface VendorSavingInformationInfoInterface {
  "savingInformationId": number;
  "site": string;
  "plant": string;
  "vendor": string;
  "equipmentQuantity": number;
  "saveValue": number;
  "grandTotal": number;
  "time": number;
}

export class VendorSavingInformationInfo implements VendorSavingInformationInfoInterface {
  "savingInformationId": number;
  "site": string;
  "plant": string;
  "vendor": string;
  "equipmentQuantity": number;
  "saveValue": number;
  "grandTotal": number;
  "time": number;
  constructor(data?: VendorSavingInformationInfoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorSavingInformationInfo`.
   */
  public static getModelName() {
    return "VendorSavingInformationInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorSavingInformationInfo for dynamic purposes.
  **/
  public static factory(data: VendorSavingInformationInfoInterface): VendorSavingInformationInfo{
    return new VendorSavingInformationInfo(data);
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
      name: 'VendorSavingInformationInfo',
      plural: 'VendorSavingInformationInfos',
      path: 'VendorSavingInformationInfos',
      idName: 'savingInformationId',
      properties: {
        "savingInformationId": {
          name: 'savingInformationId',
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
        "grandTotal": {
          name: 'grandTotal',
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
