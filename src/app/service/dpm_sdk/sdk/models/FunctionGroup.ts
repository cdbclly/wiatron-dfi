/* tslint:disable */
import {
  DEPARTMENT
} from '../index';

declare var Object: any;
export interface FunctionGroupInterface {
  "id": number;
  "groupname"?: string;
  departments?: DEPARTMENT[];
}

export class FunctionGroup implements FunctionGroupInterface {
  "id": number;
  "groupname": string;
  departments: DEPARTMENT[];
  constructor(data?: FunctionGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FunctionGroup`.
   */
  public static getModelName() {
    return "FunctionGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FunctionGroup for dynamic purposes.
  **/
  public static factory(data: FunctionGroupInterface): FunctionGroup{
    return new FunctionGroup(data);
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
      name: 'FunctionGroup',
      plural: 'FunctionGroups',
      path: 'FunctionGroups',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "groupname": {
          name: 'groupname',
          type: 'string'
        },
      },
      relations: {
        departments: {
          name: 'departments',
          type: 'DEPARTMENT[]',
          model: 'DEPARTMENT',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'functiongroupid'
        },
      }
    }
  }
}
