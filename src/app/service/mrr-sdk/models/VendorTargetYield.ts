/* tslint:disable */
import {
  PartNumberVendorOperation,
  YieldRateRecord
} from '../index';

declare var Object: any;
export interface VendorTargetYieldInterface {
  "id"?: number;
  "partNumberVendorOperationId": number;
  "yield"?: number;
  "createDate"?: Date;
  partNumberVendorOperation?: PartNumberVendorOperation;
  yieldRateRecords?: YieldRateRecord[];
}

export class VendorTargetYield implements VendorTargetYieldInterface {
  "id": number;
  "partNumberVendorOperationId": number;
  "yield": number;
  "createDate": Date;
  partNumberVendorOperation: PartNumberVendorOperation;
  yieldRateRecords: YieldRateRecord[];
  constructor(data?: VendorTargetYieldInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorTargetYield`.
   */
  public static getModelName() {
    return "VendorTargetYield";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorTargetYield for dynamic purposes.
  **/
  public static factory(data: VendorTargetYieldInterface): VendorTargetYield{
    return new VendorTargetYield(data);
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
      name: 'VendorTargetYield',
      plural: 'VendorTargetYields',
      path: 'VendorTargetYields',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "partNumberVendorOperationId": {
          name: 'partNumberVendorOperationId',
          type: 'number'
        },
        "yield": {
          name: 'yield',
          type: 'number'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
      },
      relations: {
        partNumberVendorOperation: {
          name: 'partNumberVendorOperation',
          type: 'PartNumberVendorOperation',
          model: 'PartNumberVendorOperation',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberVendorOperationId',
          keyTo: 'id'
        },
        yieldRateRecords: {
          name: 'yieldRateRecords',
          type: 'YieldRateRecord[]',
          model: 'YieldRateRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'vendorTargetYieldId'
        },
      }
    }
  }
}
