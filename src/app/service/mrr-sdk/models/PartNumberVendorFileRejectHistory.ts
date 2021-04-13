/* tslint:disable */

declare var Object: any;
export interface PartNumberVendorFileRejectHistoryInterface {
  "id"?: number;
  "partNumberVendorId"?: number;
  "createDate"?: Date;
  "rejectReason"?: string;
  "rejectBy"?: string;
}

export class PartNumberVendorFileRejectHistory implements PartNumberVendorFileRejectHistoryInterface {
  "id": number;
  "partNumberVendorId": number;
  "createDate": Date;
  "rejectReason": string;
  "rejectBy": string;
  constructor(data?: PartNumberVendorFileRejectHistoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendorFileRejectHistory`.
   */
  public static getModelName() {
    return "PartNumberVendorFileRejectHistory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumberVendorFileRejectHistory for dynamic purposes.
  **/
  public static factory(data: PartNumberVendorFileRejectHistoryInterface): PartNumberVendorFileRejectHistory{
    return new PartNumberVendorFileRejectHistory(data);
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
      name: 'PartNumberVendorFileRejectHistory',
      plural: 'PartNumberVendorFileRejectHistorys',
      path: 'PartNumberVendorFileRejectHistorys',
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
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "rejectReason": {
          name: 'rejectReason',
          type: 'string'
        },
        "rejectBy": {
          name: 'rejectBy',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
