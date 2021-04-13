/* tslint:disable */

declare var Object: any;
export interface MailScheduleInterface {
  "id"?: number;
  "cron"?: string;
  "api"?: string;
  "sql"?: string;
  "template"?: string;
  "enable"?: boolean;
  "retryLimit"?: number;
  "lastActive"?: number;
  "subject"?: string;
}

export class MailSchedule implements MailScheduleInterface {
  "id": number;
  "cron": string;
  "api": string;
  "sql": string;
  "template": string;
  "enable": boolean;
  "retryLimit": number;
  "lastActive": number;
  "subject": string;
  constructor(data?: MailScheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MailSchedule`.
   */
  public static getModelName() {
    return "MailSchedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MailSchedule for dynamic purposes.
  **/
  public static factory(data: MailScheduleInterface): MailSchedule{
    return new MailSchedule(data);
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
      name: 'MailSchedule',
      plural: 'MailSchedules',
      path: 'MailSchedules',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "cron": {
          name: 'cron',
          type: 'string'
        },
        "api": {
          name: 'api',
          type: 'string'
        },
        "sql": {
          name: 'sql',
          type: 'string'
        },
        "template": {
          name: 'template',
          type: 'string'
        },
        "enable": {
          name: 'enable',
          type: 'boolean'
        },
        "retryLimit": {
          name: 'retryLimit',
          type: 'number'
        },
        "lastActive": {
          name: 'lastActive',
          type: 'number'
        },
        "subject": {
          name: 'subject',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
