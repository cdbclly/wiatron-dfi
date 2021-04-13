/* tslint:disable */
import {
  DPMPDTISSUES,
  IssueSummary
} from '../index';

declare var Object: any;
export interface IssueStatusInterface {
  "name": string;
  "id"?: number;
  dpmpdissues?: DPMPDTISSUES[];
  issuesummary?: IssueSummary[];
}

export class IssueStatus implements IssueStatusInterface {
  "name": string;
  "id": number;
  dpmpdissues: DPMPDTISSUES[];
  issuesummary: IssueSummary[];
  constructor(data?: IssueStatusInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `IssueStatus`.
   */
  public static getModelName() {
    return "IssueStatus";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of IssueStatus for dynamic purposes.
  **/
  public static factory(data: IssueStatusInterface): IssueStatus{
    return new IssueStatus(data);
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
      name: 'IssueStatus',
      plural: 'IssueStatuses',
      path: 'IssueStatuses',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        dpmpdissues: {
          name: 'dpmpdissues',
          type: 'DPMPDTISSUES[]',
          model: 'DPMPDTISSUES',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'status'
        },
        issuesummary: {
          name: 'issuesummary',
          type: 'IssueSummary[]',
          model: 'IssueSummary',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'status'
        },
      }
    }
  }
}
