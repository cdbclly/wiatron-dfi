/* tslint:disable */

declare var Object: any;
export interface View_PartNumberOverviewInterface {
  "projectId"?: string;
  "partNumberId"?: string;
  "manufacturerId"?: string;
  "partNumberVendorId"?: number;
  "plant"?: string;
  "c3DueDay"?: Date;
  "c4DueDay"?: Date;
  "c5DueDay"?: Date;
  "c3Totoal"?: number;
  "c4Totoal"?: number;
  "c5Totoal"?: number;
  "c3TotoalUploaded"?: number;
  "c4TotoalUploaded"?: number;
  "c5TotoalUploaded"?: number;
  "c3TotoalPass"?: number;
  "c4TotoalPass"?: number;
  "c5TotoalPass"?: number;
  "containerName"?: string;
  "lastMailSentDate"?: Date;
  "projectName"?: string;
}

export class View_PartNumberOverview implements View_PartNumberOverviewInterface {
  "projectId": string;
  "partNumberId": string;
  "manufacturerId": string;
  "partNumberVendorId": number;
  "plant": string;
  "c3DueDay": Date;
  "c4DueDay": Date;
  "c5DueDay": Date;
  "c3Totoal": number;
  "c4Totoal": number;
  "c5Totoal": number;
  "c3TotoalUploaded": number;
  "c4TotoalUploaded": number;
  "c5TotoalUploaded": number;
  "c3TotoalPass": number;
  "c4TotoalPass": number;
  "c5TotoalPass": number;
  "containerName": string;
  "lastMailSentDate": Date;
  "projectName": string;
  constructor(data?: View_PartNumberOverviewInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_PartNumberOverview`.
   */
  public static getModelName() {
    return "View_PartNumberOverview";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_PartNumberOverview for dynamic purposes.
  **/
  public static factory(data: View_PartNumberOverviewInterface): View_PartNumberOverview{
    return new View_PartNumberOverview(data);
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
      name: 'View_PartNumberOverview',
      plural: 'View_PartNumberOverviews',
      path: 'View_PartNumberOverviews',
      idName: 'projectId',
      properties: {
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "partNumberId": {
          name: 'partNumberId',
          type: 'string'
        },
        "manufacturerId": {
          name: 'manufacturerId',
          type: 'string'
        },
        "partNumberVendorId": {
          name: 'partNumberVendorId',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "c3DueDay": {
          name: 'c3DueDay',
          type: 'Date'
        },
        "c4DueDay": {
          name: 'c4DueDay',
          type: 'Date'
        },
        "c5DueDay": {
          name: 'c5DueDay',
          type: 'Date'
        },
        "c3Totoal": {
          name: 'c3Totoal',
          type: 'number'
        },
        "c4Totoal": {
          name: 'c4Totoal',
          type: 'number'
        },
        "c5Totoal": {
          name: 'c5Totoal',
          type: 'number'
        },
        "c3TotoalUploaded": {
          name: 'c3TotoalUploaded',
          type: 'number'
        },
        "c4TotoalUploaded": {
          name: 'c4TotoalUploaded',
          type: 'number'
        },
        "c5TotoalUploaded": {
          name: 'c5TotoalUploaded',
          type: 'number'
        },
        "c3TotoalPass": {
          name: 'c3TotoalPass',
          type: 'number'
        },
        "c4TotoalPass": {
          name: 'c4TotoalPass',
          type: 'number'
        },
        "c5TotoalPass": {
          name: 'c5TotoalPass',
          type: 'number'
        },
        "containerName": {
          name: 'containerName',
          type: 'string'
        },
        "lastMailSentDate": {
          name: 'lastMailSentDate',
          type: 'Date'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
