/* tslint:disable */

declare var Object: any;
export interface EmailMaintainInterface {
  "id": number;
  "type": string;
  "site": string;
  "plant": string;
  "vendor"?: string;
  "model"?: string;
  "partNumber"?: string;
  "eMail"?: string;
}

export class EmailMaintain implements EmailMaintainInterface {
  "id": number;
  "type": string;
  "site": string;
  "plant": string;
  "vendor": string;
  "model": string;
  "partNumber": string;
  "eMail": string;
  constructor(data?: EmailMaintainInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EmailMaintain`.
   */
  public static getModelName() {
    return "EmailMaintain";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EmailMaintain for dynamic purposes.
  **/
  public static factory(data: EmailMaintainInterface): EmailMaintain{
    return new EmailMaintain(data);
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
      name: 'EmailMaintain',
      plural: 'EmailMaintains',
      path: 'EmailMaintains',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "vendor": {
          name: 'vendor',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "eMail": {
          name: 'eMail',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
