/* tslint:disable */

declare var Object: any;
export interface PartNumberVendorFileInterface {
  "id"?: number;
  "partNumberVendorId"?: number;
  "documentName"?: string;
  "stageId"?: string;
  "path"?: string;
  "fileName"?: string;
  "pass"?: boolean;
  "status"?: string;
  "createDate"?: Date;
  "updateDate"?: Date;
  "createBy"?: string;
  "updateBy"?: string;
  "isDelete"?: boolean;
  "uploadDate"?: Date;
  "uuidFileName"?: string;
  "defaultPass"?: boolean;
  "passReason"?: string;
  "rejectReason"?: string;
}

export class PartNumberVendorFile implements PartNumberVendorFileInterface {
  "id": number;
  "partNumberVendorId": number;
  "documentName": string;
  "stageId": string;
  "path": string;
  "fileName": string;
  "pass": boolean;
  "status": string;
  "createDate": Date;
  "updateDate": Date;
  "createBy": string;
  "updateBy": string;
  "isDelete": boolean;
  "uploadDate": Date;
  "uuidFileName": string;
  "defaultPass": boolean;
  "passReason": string;
  "rejectReason": string;
  constructor(data?: PartNumberVendorFileInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumberVendorFile`.
   */
  public static getModelName() {
    return "PartNumberVendorFile";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumberVendorFile for dynamic purposes.
  **/
  public static factory(data: PartNumberVendorFileInterface): PartNumberVendorFile{
    return new PartNumberVendorFile(data);
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
      name: 'PartNumberVendorFile',
      plural: 'PartNumberVendorFiles',
      path: 'PartNumberVendorFiles',
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
        "documentName": {
          name: 'documentName',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "path": {
          name: 'path',
          type: 'string'
        },
        "fileName": {
          name: 'fileName',
          type: 'string'
        },
        "pass": {
          name: 'pass',
          type: 'boolean'
        },
        "status": {
          name: 'status',
          type: 'string',
          default: 'UNCHECKED'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "isDelete": {
          name: 'isDelete',
          type: 'boolean',
          default: false
        },
        "uploadDate": {
          name: 'uploadDate',
          type: 'Date'
        },
        "uuidFileName": {
          name: 'uuidFileName',
          type: 'string'
        },
        "defaultPass": {
          name: 'defaultPass',
          type: 'boolean'
        },
        "passReason": {
          name: 'passReason',
          type: 'string'
        },
        "rejectReason": {
          name: 'rejectReason',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
