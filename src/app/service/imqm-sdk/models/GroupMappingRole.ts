/* tslint:disable */
import {
  FunctionRole
} from '../index';

declare var Object: any;
export interface GroupMappingRoleInterface {
  "groupId": number;
  "roleId": number;
  "read": boolean;
  "create": boolean;
  "delete": boolean;
  "edit": boolean;
  functionRole?: FunctionRole;
}

export class GroupMappingRole implements GroupMappingRoleInterface {
  "groupId": number;
  "roleId": number;
  "read": boolean;
  "create": boolean;
  "delete": boolean;
  "edit": boolean;
  functionRole: FunctionRole;
  constructor(data?: GroupMappingRoleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `GroupMappingRole`.
   */
  public static getModelName() {
    return "GroupMappingRole";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of GroupMappingRole for dynamic purposes.
  **/
  public static factory(data: GroupMappingRoleInterface): GroupMappingRole{
    return new GroupMappingRole(data);
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
      name: 'GroupMappingRole',
      plural: 'GroupMappingRoles',
      path: 'GroupMappingRoles',
      idName: 'groupId',
      properties: {
        "groupId": {
          name: 'groupId',
          type: 'number'
        },
        "roleId": {
          name: 'roleId',
          type: 'number'
        },
        "read": {
          name: 'read',
          type: 'boolean',
          default: false
        },
        "create": {
          name: 'create',
          type: 'boolean',
          default: false
        },
        "delete": {
          name: 'delete',
          type: 'boolean',
          default: false
        },
        "edit": {
          name: 'edit',
          type: 'boolean',
          default: false
        },
      },
      relations: {
        functionRole: {
          name: 'functionRole',
          type: 'FunctionRole',
          model: 'FunctionRole',
          relationType: 'belongsTo',
                  keyFrom: 'roleId',
          keyTo: 'id'
        },
      }
    }
  }
}
