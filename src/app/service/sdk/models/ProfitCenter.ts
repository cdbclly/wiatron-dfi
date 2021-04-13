/* tslint:disable */
import {
  Project,
  BusinessUnit
} from '../index';

declare var Object: any;
export interface ProfitCenterInterface {
  "id": string;
  "businessUnitId"?: string;
  projects?: Project[];
  businessUnit?: BusinessUnit;
}

export class ProfitCenter implements ProfitCenterInterface {
  "id": string;
  "businessUnitId": string;
  projects: Project[];
  businessUnit: BusinessUnit;
  constructor(data?: ProfitCenterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProfitCenter`.
   */
  public static getModelName() {
    return "ProfitCenter";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProfitCenter for dynamic purposes.
  **/
  public static factory(data: ProfitCenterInterface): ProfitCenter{
    return new ProfitCenter(data);
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
      name: 'ProfitCenter',
      plural: 'ProfitCenters',
      path: 'ProfitCenters',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "businessUnitId": {
          name: 'businessUnitId',
          type: 'string'
        },
      },
      relations: {
        projects: {
          name: 'projects',
          type: 'Project[]',
          model: 'Project',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'profitCenterId'
        },
        businessUnit: {
          name: 'businessUnit',
          type: 'BusinessUnit',
          model: 'BusinessUnit',
          relationType: 'belongsTo',
                  keyFrom: 'businessUnitId',
          keyTo: 'id'
        },
      }
    }
  }
}
