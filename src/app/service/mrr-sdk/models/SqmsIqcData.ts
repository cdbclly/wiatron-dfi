/* tslint:disable */

declare var Object: any;
export interface SqmsIqcDataInterface {
  "inspectionNo"?: string;
  "plantId"?: string;
  "vendorId"?: string;
  "manufacturerId"?: string;
  "materialId"?: string;
  "dateCode"?: string;
  "result"?: string;
  "lotQty"?: number;
  "sampleQty"?: number;
  "defectQty"?: number;
  "updatedOn"?: Date;
  "id"?: number;
}

export class SqmsIqcData implements SqmsIqcDataInterface {
  "inspectionNo": string;
  "plantId": string;
  "vendorId": string;
  "manufacturerId": string;
  "materialId": string;
  "dateCode": string;
  "result": string;
  "lotQty": number;
  "sampleQty": number;
  "defectQty": number;
  "updatedOn": Date;
  "id": number;
  constructor(data?: SqmsIqcDataInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SqmsIqcData`.
   */
  public static getModelName() {
    return "SqmsIqcData";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SqmsIqcData for dynamic purposes.
  **/
  public static factory(data: SqmsIqcDataInterface): SqmsIqcData{
    return new SqmsIqcData(data);
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
      name: 'SqmsIqcData',
      plural: 'SqmsIqcData',
      path: 'SqmsIqcData',
      idName: 'id',
      properties: {
        "inspectionNo": {
          name: 'inspectionNo',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "dateCode": {
          name: 'dateCode',
          type: 'string'
        },
        "result": {
          name: 'result',
          type: 'string'
        },
        "lotQty": {
          name: 'lotQty',
          type: 'number'
        },
        "sampleQty": {
          name: 'sampleQty',
          type: 'number'
        },
        "defectQty": {
          name: 'defectQty',
          type: 'number'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
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
