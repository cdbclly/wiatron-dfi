/* tslint:disable */

declare var Object: any;
export interface OeeIssueInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "plant"?: string;
  "bu"?: string;
  "line"?: string;
  "modelfamily"?: string;
  "shiftdate"?: string;
  "shiftname"?: string;
  "upn"?: string;
  "code"?: string;
  "codedesc"?: string;
  "reasonremark"?: string;
  "stophours"?: number;
}

export class OeeIssue implements OeeIssueInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "plant": string;
  "bu": string;
  "line": string;
  "modelfamily": string;
  "shiftdate": string;
  "shiftname": string;
  "upn": string;
  "code": string;
  "codedesc": string;
  "reasonremark": string;
  "stophours": number;
  constructor(data?: OeeIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OeeIssue`.
   */
  public static getModelName() {
    return "OeeIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OeeIssue for dynamic purposes.
  **/
  public static factory(data: OeeIssueInterface): OeeIssue{
    return new OeeIssue(data);
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
      name: 'OeeIssue',
      plural: 'OeeIssues',
      path: 'OeeIssues',
      idName: 'syncid',
      properties: {
        "syncid": {
          name: 'syncid',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "syncaction": {
          name: 'syncaction',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "modelfamily": {
          name: 'modelfamily',
          type: 'string'
        },
        "shiftdate": {
          name: 'shiftdate',
          type: 'string'
        },
        "shiftname": {
          name: 'shiftname',
          type: 'string'
        },
        "upn": {
          name: 'upn',
          type: 'string'
        },
        "code": {
          name: 'code',
          type: 'string'
        },
        "codedesc": {
          name: 'codedesc',
          type: 'string'
        },
        "reasonremark": {
          name: 'reasonremark',
          type: 'string'
        },
        "stophours": {
          name: 'stophours',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
