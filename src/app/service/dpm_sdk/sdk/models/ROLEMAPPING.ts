/* tslint:disable */
import {
  USER,
  ROLE
} from '../index';

declare var Object: any;
export interface ROLEMAPPINGInterface {
  "id"?: number;
  "principalType"?: string;
  "principalId"?: string;
  "roleId"?: number;
  uSER?: USER;
  rOLE?: ROLE;
}

export class ROLEMAPPING implements ROLEMAPPINGInterface {
  "id": number;
  "principalType": string;
  "principalId": string;
  "roleId": number;
  uSER: USER;
  rOLE: ROLE;
  constructor(data?: ROLEMAPPINGInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ROLEMAPPING`.
   */
  public static getModelName() {
    return "ROLEMAPPING";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ROLEMAPPING for dynamic purposes.
  **/
  public static factory(data: ROLEMAPPINGInterface): ROLEMAPPING{
    return new ROLEMAPPING(data);
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
      name: 'ROLEMAPPING',
      plural: 'RoleMappings',
      path: 'RoleMappings',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "principalType": {
          name: 'principalType',
          type: 'string'
        },
        "principalId": {
          name: 'principalId',
          type: 'string'
        },
        "roleId": {
          name: 'roleId',
          type: 'number'
        },
      },
      relations: {
        uSER: {
          name: 'uSER',
          type: 'USER',
          model: 'USER',
          relationType: 'belongsTo',
                  keyFrom: 'principalId',
          keyTo: 'USERID'
        },
        rOLE: {
          name: 'rOLE',
          type: 'ROLE',
          model: 'ROLE',
          relationType: 'belongsTo',
                  keyFrom: 'roleId',
          keyTo: 'id'
        },
      }
    }
  }
}
