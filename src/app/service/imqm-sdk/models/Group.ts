/* tslint:disable */
import {
  GroupMappingRole
} from '../index';

declare var Object: any;
export interface GroupInterface {
  "id": number;
  "name": string;
  groupMappingRoles?: GroupMappingRole[];
}

export class Group implements GroupInterface {
  "id": number;
  "name": string;
  groupMappingRoles: GroupMappingRole[];
  constructor(data?: GroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Group`.
   */
  public static getModelName() {
    return "Group";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Group for dynamic purposes.
  **/
  public static factory(data: GroupInterface): Group{
    return new Group(data);
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
      name: 'Group',
      plural: 'Groups',
      path: 'Groups',
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
        groupMappingRoles: {
          name: 'groupMappingRoles',
          type: 'GroupMappingRole[]',
          model: 'GroupMappingRole',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'groupId'
        },
      }
    }
  }
}
