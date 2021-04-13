/* tslint:disable */

declare var Object: any;
export interface View_ProjectPartNumberListInterface {
  "id"?: number;
  "projectName"?: string;
  "projectId"?: string;
  "partNumberId"?: string;
  "source"?: string;
  "pass"?: boolean;
  "valid"?: boolean;
  "manufacturerId"?: string;
  "approveValidation"?: string;
  "failDesc"?: string;
  "used"?: string;
  "partNumberVendorId"?: number;
  "partNumberCreateBy"?: string;
  "partNumberUpdateBy"?: string;
  "vendorCreateBy"?: string;
  "vendorUpdateBy"?: string;
  "containerName"?: string;
  "gendesc"?: string;
  "createBy"?: string;
  "updateBy"?: string;
  "createDate"?: Date;
  "updateDate"?: Date;
}

export class View_ProjectPartNumberList implements View_ProjectPartNumberListInterface {
  "id": number;
  "projectName": string;
  "projectId": string;
  "partNumberId": string;
  "source": string;
  "pass": boolean;
  "valid": boolean;
  "manufacturerId": string;
  "approveValidation": string;
  "failDesc": string;
  "used": string;
  "partNumberVendorId": number;
  "partNumberCreateBy": string;
  "partNumberUpdateBy": string;
  "vendorCreateBy": string;
  "vendorUpdateBy": string;
  "containerName": string;
  "gendesc": string;
  "createBy": string;
  "updateBy": string;
  "createDate": Date;
  "updateDate": Date;
  constructor(data?: View_ProjectPartNumberListInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ProjectPartNumberList`.
   */
  public static getModelName() {
    return "View_ProjectPartNumberList";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ProjectPartNumberList for dynamic purposes.
  **/
  public static factory(data: View_ProjectPartNumberListInterface): View_ProjectPartNumberList{
    return new View_ProjectPartNumberList(data);
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
      name: 'View_ProjectPartNumberList',
      plural: 'View_ProjectPartNumberLists',
      path: 'View_ProjectPartNumberLists',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "partNumberId": {
          name: 'partNumberId',
          type: 'string'
        },
        "source": {
          name: 'source',
          type: 'string'
        },
        "pass": {
          name: 'pass',
          type: 'boolean'
        },
        "valid": {
          name: 'valid',
          type: 'boolean'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "approveValidation": {
          name: 'approveValidation',
          type: 'string'
        },
        "failDesc": {
          name: 'failDesc',
          type: 'string'
        },
        "used": {
          name: 'used',
          type: 'string'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "partNumberCreateBy": {
          name: 'partNumberCreateBy',
          type: 'string'
        },
        "partNumberUpdateBy": {
          name: 'partNumberUpdateBy',
          type: 'string'
        },
        "vendorCreateBy": {
          name: 'vendorCreateBy',
          type: 'string'
        },
        "vendorUpdateBy": {
          name: 'vendorUpdateBy',
          type: 'string'
        },
        "containerName": {
          name: 'containerName',
          type: 'string'
        },
        "gendesc": {
          name: 'gendesc',
          type: 'string'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
