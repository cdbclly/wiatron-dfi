/* tslint:disable */
import {
  PartNumberVendor,
  Operation,
  SqmTargetYield,
  VendorTargetYield,
  YieldRateRecord
} from '../index';

declare var Object: any;
export interface PartNumberVendorOperationInterface {
  "id"?: number;
  "partNumberVendorId": number;
  "plantId": string;
  "stageId": string;
  "version": number;
  "order": number;
  "operationId": number;
  "createDate"?: Date;
  partNumberVendor?: PartNumberVendor;
  operation?: Operation;
  sqmTargetYields?: SqmTargetYield[];
  vendorTargetYields?: VendorTargetYield[];
  yieldRateRecords?: YieldRateRecord[];
}

export class PartNumberVendorOperation implements PartNumberVendorOperationInterface {
  "id": number;
  "partNumberVendorId": number;
  "plantId": string;
  "stageId": string;
  "version": number;
  "order": number;
  "operationId": number;
  "createDate": Date;
  partNumberVendor: PartNumberVendor;
  operation: Operation;
  sqmTargetYields: SqmTargetYield[];
  vendorTargetYields: VendorTargetYield[];
  yieldRateRecords: YieldRateRecord[];
  constructor(data?: PartNumberVendorOperationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendorOperation`.
   */
  public static getModelName() {
    return "PartNumberVendorOperation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumberVendorOperation for dynamic purposes.
  **/
  public static factory(data: PartNumberVendorOperationInterface): PartNumberVendorOperation{
    return new PartNumberVendorOperation(data);
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
      name: 'PartNumberVendorOperation',
      plural: 'PartNumberVendorOperations',
      path: 'PartNumberVendorOperations',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "version": {
          name: 'version',
          type: 'number'
        },
        "order": {
          name: 'order',
          type: 'number'
        },
        "operationId": {
          name: 'operationId',
          type: 'number'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
      },
      relations: {
        partNumberVendor: {
          name: 'partNumberVendor',
          type: 'PartNumberVendor',
          model: 'PartNumberVendor',
          relationType: 'belongsTo',
                  keyFrom: 'partNumberVendorId',
          keyTo: 'id'
        },
        operation: {
          name: 'operation',
          type: 'Operation',
          model: 'Operation',
          relationType: 'belongsTo',
                  keyFrom: 'operationId',
          keyTo: 'id'
        },
        sqmTargetYields: {
          name: 'sqmTargetYields',
          type: 'SqmTargetYield[]',
          model: 'SqmTargetYield',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorOperationId'
        },
        vendorTargetYields: {
          name: 'vendorTargetYields',
          type: 'VendorTargetYield[]',
          model: 'VendorTargetYield',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorOperationId'
        },
        yieldRateRecords: {
          name: 'yieldRateRecords',
          type: 'YieldRateRecord[]',
          model: 'YieldRateRecord',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberVendorOperationId'
        },
      }
    }
  }
}
