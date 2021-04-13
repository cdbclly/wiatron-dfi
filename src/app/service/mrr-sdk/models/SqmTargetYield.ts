/* tslint:disable */
import {
  PartNumberVendorOperation,
  YieldRateRecord
} from '../index';

declare var Object: any;
export interface SqmTargetYieldInterface {
  "id"?: number;
  "partNumberVendorOperationId": number;
  "yield": number;
  "createDate"?: Date;
  "createBy"?: string;
  partNumberVendorOperation?: PartNumberVendorOperation;
  yieldRateRecords?: YieldRateRecord[];
}

export class SqmTargetYield implements SqmTargetYieldInterface {
  "id": number;
  "partNumberVendorOperationId": number;
  "yield": number;
  "createDate": Date;
  "createBy": string;
  partNumberVendorOperation: PartNumberVendorOperation;
  yieldRateRecords: YieldRateRecord[];
  constructor(data?: SqmTargetYieldInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SqmTargetYield`.
   */
  public static getModelName() {
    return "SqmTargetYield";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SqmTargetYield for dynamic purposes.
  **/
  public static factory(data: SqmTargetYieldInterface): SqmTargetYield{
    return new SqmTargetYield(data);
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
      name: 'SqmTargetYield',
      plural: 'SqmTargetYields',
      path: 'SqmTargetYields',
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
        "createBy": {
          name: 'createBy',
          type: 'string'
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
          keyTo: 'sqmTargetYieldId'
        },
      }
    }
  }
}
