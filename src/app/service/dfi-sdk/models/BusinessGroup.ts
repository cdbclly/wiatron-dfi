/* tslint:disable */
import {
  BusinessUnit,
  Plant
} from '../index';

declare var Object: any;
export interface BusinessGroupInterface {
  "id": string;
  "companyId"?: string;
  businessUnits?: BusinessUnit[];
  plants?: Plant[];
}

export class BusinessGroup implements BusinessGroupInterface {
  "id": string;
  "companyId": string;
  businessUnits: BusinessUnit[];
  plants: Plant[];
  constructor(data?: BusinessGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `BusinessGroup`.
   */
  public static getModelName() {
    return "BusinessGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of BusinessGroup for dynamic purposes.
  **/
  public static factory(data: BusinessGroupInterface): BusinessGroup{
    return new BusinessGroup(data);
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
      name: 'BusinessGroup',
      plural: 'BusinessGroups',
      path: 'BusinessGroups',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
      },
      relations: {
        businessUnits: {
          name: 'businessUnits',
          type: 'BusinessUnit[]',
          model: 'BusinessUnit',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'businessGroupId'
        },
        plants: {
          name: 'plants',
          type: 'Plant[]',
          model: 'Plant',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'businessGroupId'
        },
      }
    }
  }
}
