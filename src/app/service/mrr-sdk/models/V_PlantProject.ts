/* tslint:disable */
import {
  NewModelDocument
} from '../index';

declare var Object: any;
export interface V_PlantProjectInterface {
  "plant"?: string;
  "projectName"?: string;
  "projectCode"?: string;
  "profitCenter"?: string;
  "bu"?: string;
  "productType"?: string;
  "customer"?: string;
  "currentStage"?: string;
  "RFQ"?: Date;
  "C0"?: Date;
  "C1"?: Date;
  "C2"?: Date;
  "C3"?: Date;
  "C4"?: Date;
  "C5"?: Date;
  "C6"?: Date;
  "createDate"?: Date;
  "PLMStatus"?: string;
  "moduleName"?: string;
  "moduleEnabled"?: boolean;
  "site"?: string;
  "businessGroup"?: string;
  "isRfq"?: boolean;
  "rfqProjectId"?: string;
  "createdBy"?: string;
  newModelDocument?: NewModelDocument[];
}

export class V_PlantProject implements V_PlantProjectInterface {
  "plant": string;
  "projectName": string;
  "projectCode": string;
  "profitCenter": string;
  "bu": string;
  "productType": string;
  "customer": string;
  "currentStage": string;
  "RFQ": Date;
  "C0": Date;
  "C1": Date;
  "C2": Date;
  "C3": Date;
  "C4": Date;
  "C5": Date;
  "C6": Date;
  "createDate": Date;
  "PLMStatus": string;
  "moduleName": string;
  "moduleEnabled": boolean;
  "site": string;
  "businessGroup": string;
  "isRfq": boolean;
  "rfqProjectId": string;
  "createdBy": string;
  newModelDocument: NewModelDocument[];
  constructor(data?: V_PlantProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `V_PlantProject`.
   */
  public static getModelName() {
    return "V_PlantProject";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of V_PlantProject for dynamic purposes.
  **/
  public static factory(data: V_PlantProjectInterface): V_PlantProject{
    return new V_PlantProject(data);
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
      name: 'V_PlantProject',
      plural: 'V_PlantProjects',
      path: 'V_PlantProjects',
      idName: 'projectName',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "profitCenter": {
          name: 'profitCenter',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "productType": {
          name: 'productType',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "currentStage": {
          name: 'currentStage',
          type: 'string'
        },
        "RFQ": {
          name: 'RFQ',
          type: 'Date'
        },
        "C0": {
          name: 'C0',
          type: 'Date'
        },
        "C1": {
          name: 'C1',
          type: 'Date'
        },
        "C2": {
          name: 'C2',
          type: 'Date'
        },
        "C3": {
          name: 'C3',
          type: 'Date'
        },
        "C4": {
          name: 'C4',
          type: 'Date'
        },
        "C5": {
          name: 'C5',
          type: 'Date'
        },
        "C6": {
          name: 'C6',
          type: 'Date'
        },
        "createDate": {
          name: 'createDate',
          type: 'Date'
        },
        "PLMStatus": {
          name: 'PLMStatus',
          type: 'string'
        },
        "moduleName": {
          name: 'moduleName',
          type: 'string'
        },
        "moduleEnabled": {
          name: 'moduleEnabled',
          type: 'boolean'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "businessGroup": {
          name: 'businessGroup',
          type: 'string'
        },
        "isRfq": {
          name: 'isRfq',
          type: 'boolean'
        },
        "rfqProjectId": {
          name: 'rfqProjectId',
          type: 'string'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
      },
      relations: {
        newModelDocument: {
          name: 'newModelDocument',
          type: 'NewModelDocument[]',
          model: 'NewModelDocument',
          relationType: 'hasMany',
                  keyFrom: 'projectName',
          keyTo: 'modelId'
        },
      }
    }
  }
}
