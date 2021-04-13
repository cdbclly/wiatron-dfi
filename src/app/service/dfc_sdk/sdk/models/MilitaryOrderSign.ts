/* tslint:disable */
import {
  ProjectNameProfile,
  Workflow
} from '../index';

declare var Object: any;
export interface MilitaryOrderSignInterface {
  "projectNameID"?: number;
  "plantCapacity"?: number;
  "date"?: Date;
  "size"?: string;
  "parts"?: number;
  "quote"?: number;
  "pic"?: string;
  "signID"?: number;
  "signID2"?: number;
  "isMohFAYield"?: boolean;
  "id"?: number;
  projectNameProfile?: ProjectNameProfile;
  workflow?: Workflow;
}

export class MilitaryOrderSign implements MilitaryOrderSignInterface {
  "projectNameID": number;
  "plantCapacity": number;
  "date": Date;
  "size": string;
  "parts": number;
  "quote": number;
  "pic": string;
  "signID": number;
  "signID2": number;
  "isMohFAYield": boolean;
  "id": number;
  projectNameProfile: ProjectNameProfile;
  workflow: Workflow;
  constructor(data?: MilitaryOrderSignInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MilitaryOrderSign`.
   */
  public static getModelName() {
    return "MilitaryOrderSign";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MilitaryOrderSign for dynamic purposes.
  **/
  public static factory(data: MilitaryOrderSignInterface): MilitaryOrderSign{
    return new MilitaryOrderSign(data);
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
      name: 'MilitaryOrderSign',
      plural: 'MilitaryOrderSigns',
      path: 'MilitaryOrderSigns',
      idName: 'id',
      properties: {
        "projectNameID": {
          name: 'projectNameID',
          type: 'number'
        },
        "plantCapacity": {
          name: 'plantCapacity',
          type: 'number'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "size": {
          name: 'size',
          type: 'string'
        },
        "parts": {
          name: 'parts',
          type: 'number'
        },
        "quote": {
          name: 'quote',
          type: 'number'
        },
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "signID": {
          name: 'signID',
          type: 'number'
        },
        "signID2": {
          name: 'signID2',
          type: 'number'
        },
        "isMohFAYield": {
          name: 'isMohFAYield',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        projectNameProfile: {
          name: 'projectNameProfile',
          type: 'ProjectNameProfile',
          model: 'ProjectNameProfile',
          relationType: 'belongsTo',
                  keyFrom: 'projectNameID',
          keyTo: 'ProjectNameID'
        },
        workflow: {
          name: 'workflow',
          type: 'Workflow',
          model: 'Workflow',
          relationType: 'belongsTo',
                  keyFrom: 'signID',
          keyTo: 'id'
        },
      }
    }
  }
}
