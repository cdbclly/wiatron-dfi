/* tslint:disable */
import {
  CTQ_log
} from '../index';

declare var Object: any;
export interface CTQInterface {
  "plant"?: string;
  "project"?: string;
  "screenParameter"?: number;
  "modelname"?: string;
  "stationtype"?: string;
  "tdname"?: string;
  "mdname"?: string;
  "goal"?: number;
  "updatedUser"?: string;
  "createdTime"?: number;
  "updatedTime"?: number;
  "id"?: number;
  CTQLogs?: CTQ_log[];
}

export class CTQ implements CTQInterface {
  "plant": string;
  "project": string;
  "screenParameter": number;
  "modelname": string;
  "stationtype": string;
  "tdname": string;
  "mdname": string;
  "goal": number;
  "updatedUser": string;
  "createdTime": number;
  "updatedTime": number;
  "id": number;
  CTQLogs: CTQ_log[];
  constructor(data?: CTQInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CTQ`.
   */
  public static getModelName() {
    return "CTQ";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CTQ for dynamic purposes.
  **/
  public static factory(data: CTQInterface): CTQ{
    return new CTQ(data);
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
      name: 'CTQ',
      plural: 'CTQs',
      path: 'CTQs',
      idName: 'id',
      properties: {
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
        "createdTime": {
          name: 'createdTime',
          type: 'number'
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
        CTQLogs: {
          name: 'CTQLogs',
          type: 'CTQ_log[]',
          model: 'CTQ_log',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'ctqId'
        },
      }
    }
  }
}
