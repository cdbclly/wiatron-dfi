/* tslint:disable */
import {
  BusinessGroup
} from '../index';

declare var Object: any;
export interface CompanyInterface {
  "id": string;
  businessGroups?: BusinessGroup[];
}

export class Company implements CompanyInterface {
  "id": string;
  businessGroups: BusinessGroup[];
  constructor(data?: CompanyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public static getModelName() {
    return "Company";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Company for dynamic purposes.
  **/
  public static factory(data: CompanyInterface): Company{
    return new Company(data);
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
      name: 'Company',
      plural: 'Companies',
      path: 'Companies',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        businessGroups: {
          name: 'businessGroups',
          type: 'BusinessGroup[]',
          model: 'BusinessGroup',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
      }
    }
  }
}
