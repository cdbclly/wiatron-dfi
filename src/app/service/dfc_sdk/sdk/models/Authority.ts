/* tslint:disable */
import {
  Group
} from '../index';

declare var Object: any;
export interface AuthorityInterface {
  "EmpID"?: string;
  "GroupID"?: number;
  group?: Group;
}

export class Authority implements AuthorityInterface {
  "EmpID": string;
  "GroupID": number;
  group: Group;
  constructor(data?: AuthorityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Authority`.
   */
  public static getModelName() {
    return "Authority";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Authority for dynamic purposes.
  **/
  public static factory(data: AuthorityInterface): Authority{
    return new Authority(data);
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
      name: 'Authority',
      plural: 'Authorities',
      path: 'Authorities',
      idName: 'EmpID',
      properties: {
        "EmpID": {
          name: 'EmpID',
          type: 'string'
        },
        "GroupID": {
          name: 'GroupID',
          type: 'number'
        },
      },
      relations: {
        group: {
          name: 'group',
          type: 'Group',
          model: 'Group',
          relationType: 'belongsTo',
                  keyFrom: 'GroupID',
          keyTo: 'GroupID'
        },
      }
    }
  }
}
