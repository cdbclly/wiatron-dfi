/* tslint:disable */
import {
  USER,
  ROLEMAPPING
} from '../index';

declare var Object: any;
export interface ROLEInterface {
  "id"?: number;
  "name": string;
  "description"?: string;
  "created"?: Date;
  "modified"?: Date;
  principals?: USER[];
  rolemappings?: ROLEMAPPING[];
}

export class ROLE implements ROLEInterface {
  "id": number;
  "name": string;
  "description": string;
  "created": Date;
  "modified": Date;
  principals: USER[];
  rolemappings: ROLEMAPPING[];
  constructor(data?: ROLEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ROLE`.
   */
  public static getModelName() {
    return "ROLE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ROLE for dynamic purposes.
  **/
  public static factory(data: ROLEInterface): ROLE{
    return new ROLE(data);
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
      name: 'ROLE',
      plural: 'Roles',
      path: 'Roles',
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
        "description": {
          name: 'description',
          type: 'string'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
      },
      relations: {
        principals: {
          name: 'principals',
          type: 'USER[]',
          model: 'USER',
          relationType: 'hasMany',
          modelThrough: 'ROLEMAPPING',
          keyThrough: 'uSERId',
          keyFrom: 'id',
          keyTo: 'roleId'
        },
        rolemappings: {
          name: 'rolemappings',
          type: 'ROLEMAPPING[]',
          model: 'ROLEMAPPING',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'roleId'
        },
      }
    }
  }
}
