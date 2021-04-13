/* tslint:disable */

declare var Object: any;
export interface SendEmailInterface {
  "to": string;
  "from": string;
  "subject": string;
  "text"?: string;
  "html"?: string;
  "id"?: number;
}

export class SendEmail implements SendEmailInterface {
  "to": string;
  "from": string;
  "subject": string;
  "text": string;
  "html": string;
  "id": number;
  constructor(data?: SendEmailInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SendEmail`.
   */
  public static getModelName() {
    return "SendEmail";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SendEmail for dynamic purposes.
  **/
  public static factory(data: SendEmailInterface): SendEmail{
    return new SendEmail(data);
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
      name: 'SendEmail',
      plural: 'SendEmails',
      path: 'SendEmails',
      idName: 'id',
      properties: {
        "to": {
          name: 'to',
          type: 'string'
        },
        "from": {
          name: 'from',
          type: 'string'
        },
        "subject": {
          name: 'subject',
          type: 'string'
        },
        "text": {
          name: 'text',
          type: 'string'
        },
        "html": {
          name: 'html',
          type: 'string'
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
