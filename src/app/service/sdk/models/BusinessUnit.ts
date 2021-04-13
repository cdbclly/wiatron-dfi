/* tslint:disable */
import {
  ProfitCenter,
  BusinessGroup
} from '../index';

declare var Object: any;
export interface BusinessUnitInterface {
  "id": string;
  "businessGroupId"?: string;
  profitCenters?: ProfitCenter[];
  businessGroup?: BusinessGroup;
}

export class BusinessUnit implements BusinessUnitInterface {
  "id": string;
  "businessGroupId": string;
  profitCenters: ProfitCenter[];
  businessGroup: BusinessGroup;
  constructor(data?: BusinessUnitInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `BusinessUnit`.
   */
  public static getModelName() {
    return "BusinessUnit";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of BusinessUnit for dynamic purposes.
  **/
  public static factory(data: BusinessUnitInterface): BusinessUnit{
    return new BusinessUnit(data);
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
      name: 'BusinessUnit',
      plural: 'BusinessUnits',
      path: 'BusinessUnits',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "businessGroupId": {
          name: 'businessGroupId',
          type: 'string'
        },
      },
      relations: {
        profitCenters: {
          name: 'profitCenters',
          type: 'ProfitCenter[]',
          model: 'ProfitCenter',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'businessUnitId'
        },
        businessGroup: {
          name: 'businessGroup',
          type: 'BusinessGroup',
          model: 'BusinessGroup',
          relationType: 'belongsTo',
                  keyFrom: 'businessGroupId',
          keyTo: 'id'
        },
      }
    }
  }
}
