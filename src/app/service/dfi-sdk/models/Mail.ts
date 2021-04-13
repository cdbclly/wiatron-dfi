/* tslint:disable */

declare var Object: any;
export interface MailInterface {
  "subject": string;
  "sender": string;
  "content": string;
  "receiver": string;
  "createOn"?: Date;
  "createBy"?: string;
  "attachments"?: string;
  "isSend"?: boolean;
  "planSendDate"?: Date;
  "completeDate"?: Date;
  "cc"?: string;
  "bcc"?: string;
  "retry"?: number;
  "retryLimit"?: number;
  "id"?: number;
}

export class Mail implements MailInterface {
  "subject": string;
  "sender": string;
  "content": string;
  "receiver": string;
  "createOn": Date;
  "createBy": string;
  "attachments": string;
  "isSend": boolean;
  "planSendDate": Date;
  "completeDate": Date;
  "cc": string;
  "bcc": string;
  "retry": number;
  "retryLimit": number;
  "id": number;
  constructor(data?: MailInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Mail`.
   */
  public static getModelName() {
    return "Mail";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Mail for dynamic purposes.
  **/
  public static factory(data: MailInterface): Mail{
    return new Mail(data);
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
      name: 'Mail',
      plural: 'Mails',
      path: 'Mails',
      idName: 'id',
      properties: {
        "subject": {
          name: 'subject',
          type: 'string'
        },
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "content": {
          name: 'content',
          type: 'string'
        },
        "receiver": {
          name: 'receiver',
          type: 'string'
        },
        "createOn": {
          name: 'createOn',
          type: 'Date'
        },
        "createBy": {
          name: 'createBy',
          type: 'string'
        },
        "attachments": {
          name: 'attachments',
          type: 'string'
        },
        "isSend": {
          name: 'isSend',
          type: 'boolean'
        },
        "planSendDate": {
          name: 'planSendDate',
          type: 'Date'
        },
        "completeDate": {
          name: 'completeDate',
          type: 'Date'
        },
        "cc": {
          name: 'cc',
          type: 'string'
        },
        "bcc": {
          name: 'bcc',
          type: 'string'
        },
        "retry": {
          name: 'retry',
          type: 'number'
        },
        "retryLimit": {
          name: 'retryLimit',
          type: 'number'
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
