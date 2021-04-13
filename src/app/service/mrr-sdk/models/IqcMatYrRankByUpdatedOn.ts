/* tslint:disable */

declare var Object: any;
export interface IqcMatYrRankByUpdatedOnInterface {
  "plantId"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "manufacturerId"?: string;
  "vendorId"?: string;
  "materialId"?: string;
  "manufactureDate"?: string;
  "result"?: string;
  "updatedOn"?: Date;
  "rank"?: number;
  "yieldRate"?: number;
  "status"?: boolean;
}

export class IqcMatYrRankByUpdatedOn implements IqcMatYrRankByUpdatedOnInterface {
  "plantId": string;
  "projectCode": string;
  "projectName": string;
  "manufacturerId": string;
  "vendorId": string;
  "materialId": string;
  "manufactureDate": string;
  "result": string;
  "updatedOn": Date;
  "rank": number;
  "yieldRate": number;
  "status": boolean;
  constructor(data?: IqcMatYrRankByUpdatedOnInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `IqcMatYrRankByUpdatedOn`.
   */
  public static getModelName() {
    return "IqcMatYrRankByUpdatedOn";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of IqcMatYrRankByUpdatedOn for dynamic purposes.
  **/
  public static factory(data: IqcMatYrRankByUpdatedOnInterface): IqcMatYrRankByUpdatedOn{
    return new IqcMatYrRankByUpdatedOn(data);
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
      name: 'IqcMatYrRankByUpdatedOn',
      plural: 'IqcMatYrRankByUpdatedOns',
      path: 'IqcMatYrRankByUpdatedOns',
      idName: 'plantId',
      properties: {
        "plantId": {
          name: 'plantId',
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
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'string'
        },
        "result": {
          name: 'result',
          type: 'string'
        },
        "updatedOn": {
          name: 'updatedOn',
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
