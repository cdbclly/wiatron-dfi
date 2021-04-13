/* tslint:disable */
import {
  GroupMappingRole
} from '../index';

declare var Object: any;
export interface FunctionRoleInterface {
  "id"?: number;
  "name": string;
  GroupMappingRole?: GroupMappingRole[];
}

export class FunctionRole implements FunctionRoleInterface {
  "id": number;
  "name": string;
  GroupMappingRole: GroupMappingRole[];
  constructor(data?: FunctionRoleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FunctionRole`.
   */
  public static getModelName() {
    return "FunctionRole";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FunctionRole for dynamic purposes.
  **/
  public static factory(data: FunctionRoleInterface): FunctionRole{
    return new FunctionRole(data);
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
      name: 'FunctionRole',
      plural: 'FunctionRoles',
      path: 'FunctionRoles',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
      },
      relations: {
        GroupMappingRole: {
          name: 'GroupMappingRole',
          type: 'GroupMappingRole[]',
          model: 'GroupMappingRole',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'roleId'
        },
      }
    }
  }
}
