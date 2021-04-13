/* tslint:disable */

declare var Object: any;
export interface DEPARTMENTUSERInterface {
  "DEPARTMENT"?: string;
  "USERID": string;
  "SECTIONMANAGER"?: string;
  "id"?: number;
}

export class DEPARTMENTUSER implements DEPARTMENTUSERInterface {
  "DEPARTMENT": string;
  "USERID": string;
  "SECTIONMANAGER": string;
  "id": number;
  constructor(data?: DEPARTMENTUSERInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DEPARTMENTUSER`.
   */
  public static getModelName() {
    return "DEPARTMENTUSER";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DEPARTMENTUSER for dynamic purposes.
  **/
  public static factory(data: DEPARTMENTUSERInterface): DEPARTMENTUSER{
    return new DEPARTMENTUSER(data);
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
      name: 'DEPARTMENTUSER',
      plural: 'DEPARTMENTUSER',
      path: 'DEPARTMENTUSER',
      idName: 'id',
      properties: {
        "DEPARTMENT": {
          name: 'DEPARTMENT',
          type: 'string'
        },
        "USERID": {
          name: 'USERID',
          type: 'string'
        },
        "SECTIONMANAGER": {
          name: 'SECTIONMANAGER',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
