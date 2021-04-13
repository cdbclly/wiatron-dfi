/* tslint:disable */

declare var Object: any;
export interface ProjectPartInterface {
  "projectId"?: string;
  "partId"?: string;
  "usageAmt"?: number;
  "id"?: number;
}

export class ProjectPart implements ProjectPartInterface {
  "projectId": string;
  "partId": string;
  "usageAmt": number;
  "id": number;
  constructor(data?: ProjectPartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProjectPart`.
   */
  public static getModelName() {
    return "ProjectPart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProjectPart for dynamic purposes.
  **/
  public static factory(data: ProjectPartInterface): ProjectPart{
    return new ProjectPart(data);
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
      name: 'ProjectPart',
      plural: 'ProjectParts',
      path: 'ProjectParts',
      idName: 'id',
      properties: {
        "projectId": {
          name: 'projectId',
          type: 'string'
        },
        "partId": {
          name: 'partId',
          type: 'string'
        },
        "usageAmt": {
          name: 'usageAmt',
          type: 'number'
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
