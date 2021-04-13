/* tslint:disable */

declare var Object: any;
export interface DashboardIgnoredProjectInterface {
  "ProjectNameID": number;
  "ignore"?: boolean;
  "remark"?: string;
  "updateBy": string;
  "updateDate"?: Date;
}

export class DashboardIgnoredProject implements DashboardIgnoredProjectInterface {
  "ProjectNameID": number;
  "ignore": boolean;
  "remark": string;
  "updateBy": string;
  "updateDate": Date;
  constructor(data?: DashboardIgnoredProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DashboardIgnoredProject`.
   */
  public static getModelName() {
    return "DashboardIgnoredProject";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DashboardIgnoredProject for dynamic purposes.
  **/
  public static factory(data: DashboardIgnoredProjectInterface): DashboardIgnoredProject{
    return new DashboardIgnoredProject(data);
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
      name: 'DashboardIgnoredProject',
      plural: 'DashboardIgnoredProjects',
      path: 'DashboardIgnoredProjects',
      idName: 'ProjectNameID',
      properties: {
        "ProjectNameID": {
          name: 'ProjectNameID',
          type: 'number'
        },
        "ignore": {
          name: 'ignore',
          type: 'boolean',
          default: true
        },
        "remark": {
          name: 'remark',
          type: 'string'
        },
        "updateBy": {
          name: 'updateBy',
          type: 'string'
        },
        "updateDate": {
          name: 'updateDate',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
