/* tslint:disable */

declare var Object: any;
export interface RecipientInterface {
  "plantName"?: string;
  "plantId"?: string;
  "process"?: string;
  "model"?: string;
  "stageId"?: string;
  "recipientName"?: string;
  "beginTime"?: number;
  "endTime"?: number;
  "phase"?: string;
  "createdTime"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
  "id"?: number;
}

export class Recipient implements RecipientInterface {
  "plantName": string;
  "plantId": string;
  "process": string;
  "model": string;
  "stageId": string;
  "recipientName": string;
  "beginTime": number;
  "endTime": number;
  "phase": string;
  "createdTime": number;
  "updatedUser": string;
  "updatedTime": number;
  "id": number;
  constructor(data?: RecipientInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Recipient`.
   */
  public static getModelName() {
    return "Recipient";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Recipient for dynamic purposes.
  **/
  public static factory(data: RecipientInterface): Recipient{
    return new Recipient(data);
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
      name: 'Recipient',
      plural: 'Recipients',
      path: 'Recipients',
      idName: 'id',
      properties: {
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
        "createdTime": {
          name: 'createdTime',
          type: 'number'
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
