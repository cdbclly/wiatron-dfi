/* tslint:disable */

declare var Object: any;
export interface CTQ_logInterface {
  "id"?: number;
  "ctqId": number;
  "plant"?: string;
  "project"?: string;
  "screenParameter"?: number;
  "modelname"?: string;
  "stationtype"?: string;
  "tdname"?: string;
  "mdname"?: string;
  "goal"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
  "actions"?: string;
}

export class CTQ_log implements CTQ_logInterface {
  "id": number;
  "ctqId": number;
  "plant": string;
  "project": string;
  "screenParameter": number;
  "modelname": string;
  "stationtype": string;
  "tdname": string;
  "mdname": string;
  "goal": number;
  "updatedUser": string;
  "updatedTime": number;
  "actions": string;
  constructor(data?: CTQ_logInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CTQ_log`.
   */
  public static getModelName() {
    return "CTQ_log";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CTQ_log for dynamic purposes.
  **/
  public static factory(data: CTQ_logInterface): CTQ_log{
    return new CTQ_log(data);
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
      name: 'CTQ_log',
      plural: 'CTQ_logs',
      path: 'CTQ_logs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "ctqId": {
          name: 'ctqId',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "project": {
          name: 'project',
          type: 'string'
        },
        "screenParameter": {
          name: 'screenParameter',
          type: 'number'
        },
        "modelname": {
          name: 'modelname',
          type: 'string'
        },
        "stationtype": {
          name: 'stationtype',
          type: 'string'
        },
        "tdname": {
          name: 'tdname',
          type: 'string'
        },
        "mdname": {
          name: 'mdname',
          type: 'string'
        },
        "goal": {
          name: 'goal',
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
        "actions": {
          name: 'actions',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
