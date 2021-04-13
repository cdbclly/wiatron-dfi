/* tslint:disable */

declare var Object: any;
export interface Recipient_LogInterface {
  "recipientId"?: number;
  "plantName"?: string;
  "plantId"?: string;
  "process"?: string;
  "model"?: string;
  "stageId"?: string;
  "recipientName"?: string;
  "beginTime"?: number;
  "endTime"?: number;
  "phase"?: string;
  "action"?: string;
  "updatedUser"?: string;
  "updatedTime"?: number;
  "id"?: number;
}

export class Recipient_Log implements Recipient_LogInterface {
  "recipientId": number;
  "plantName": string;
  "plantId": string;
  "process": string;
  "model": string;
  "stageId": string;
  "recipientName": string;
  "beginTime": number;
  "endTime": number;
  "phase": string;
  "action": string;
  "updatedUser": string;
  "updatedTime": number;
  "id": number;
  constructor(data?: Recipient_LogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Recipient_Log`.
   */
  public static getModelName() {
    return "Recipient_Log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Recipient_Log for dynamic purposes.
  **/
  public static factory(data: Recipient_LogInterface): Recipient_Log{
    return new Recipient_Log(data);
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
      name: 'Recipient_Log',
      plural: 'Recipient_Logs',
      path: 'Recipient_Logs',
      idName: 'id',
      properties: {
        "recipientId": {
          name: 'recipientId',
          type: 'number'
        },
        "plantName": {
          name: 'plantName',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "process": {
          name: 'process',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "stageId": {
          name: 'stageId',
          type: 'string'
        },
        "recipientName": {
          name: 'recipientName',
          type: 'string'
        },
        "beginTime": {
          name: 'beginTime',
          type: 'number'
        },
        "endTime": {
          name: 'endTime',
          type: 'number'
        },
        "phase": {
          name: 'phase',
          type: 'string'
        },
        "action": {
          name: 'action',
          type: 'string'
        },
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
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
