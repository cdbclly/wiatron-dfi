/* tslint:disable */

declare var Object: any;
export interface VendorMatYrRankByMfgDateInterface {
  "plantId"?: string;
  "customerId"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "vendorId"?: string;
  "manufacturer"?: string;
  "partId"?: number;
  "part"?: string;
  "materialId"?: string;
  "stage"?: string;
  "manufactureDate"?: Date;
  "rank"?: number;
  "yieldRate"?: number;
  "target"?: number;
  "status"?: boolean;
}

export class VendorMatYrRankByMfgDate implements VendorMatYrRankByMfgDateInterface {
  "plantId": string;
  "customerId": string;
  "projectCode": string;
  "projectName": string;
  "vendorId": string;
  "manufacturer": string;
  "partId": number;
  "part": string;
  "materialId": string;
  "stage": string;
  "manufactureDate": Date;
  "rank": number;
  "yieldRate": number;
  "target": number;
  "status": boolean;
  constructor(data?: VendorMatYrRankByMfgDateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `VendorMatYrRankByMfgDate`.
   */
  public static getModelName() {
    return "VendorMatYrRankByMfgDate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of VendorMatYrRankByMfgDate for dynamic purposes.
  **/
  public static factory(data: VendorMatYrRankByMfgDateInterface): VendorMatYrRankByMfgDate{
    return new VendorMatYrRankByMfgDate(data);
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
      name: 'VendorMatYrRankByMfgDate',
      plural: 'VendorMatYrRankByMfgDates',
      path: 'VendorMatYrRankByMfgDates',
      idName: 'plantId',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "customerId": {
          name: 'customerId',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
        "manufacturer": {
          name: 'manufacturer',
          type: 'string'
        },
        "partId": {
          name: 'partId',
          type: 'number'
        },
        "part": {
          name: 'part',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "stage": {
          name: 'stage',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'Date'
        },
        "rank": {
          name: 'rank',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "target": {
          name: 'target',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
