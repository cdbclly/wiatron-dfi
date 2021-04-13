/* tslint:disable */
import {
  IssueStatus
} from '../index';

declare var Object: any;
export interface IssueSummaryInterface {
  "plant"?: string;
  "kpiid"?: string;
  "mfgtype"?: string;
  "status": number;
  "count": number;
  "total": number;
  "rate": number;
  "createdate": Date;
  "updatedate": Date;
  "id"?: number;
  issuestatus?: IssueStatus;
}

export class IssueSummary implements IssueSummaryInterface {
  "plant": string;
  "kpiid": string;
  "mfgtype": string;
  "status": number;
  "count": number;
  "total": number;
  "rate": number;
  "createdate": Date;
  "updatedate": Date;
  "id": number;
  issuestatus: IssueStatus;
  constructor(data?: IssueSummaryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `IssueSummary`.
   */
  public static getModelName() {
    return "IssueSummary";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of IssueSummary for dynamic purposes.
  **/
  public static factory(data: IssueSummaryInterface): IssueSummary{
    return new IssueSummary(data);
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
      name: 'IssueSummary',
      plural: 'IssueSummary',
      path: 'IssueSummary',
      idName: 'id',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "count": {
          name: 'count',
          type: 'number'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "rate": {
          name: 'rate',
          type: 'number'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        issuestatus: {
          name: 'issuestatus',
          type: 'IssueStatus',
          model: 'IssueStatus',
          relationType: 'belongsTo',
                  keyFrom: 'status',
          keyTo: 'id'
        },
      }
    }
  }
}
