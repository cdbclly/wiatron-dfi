/* tslint:disable */

declare var Object: any;
export interface ProductivityIssueInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "plant"?: string;
  "line"?: string;
  "bu"?: string;
  "modelfamily"?: string;
  "mfgtype"?: string;
  "shiftdate"?: string;
  "shiftid"?: string;
  "code"?: string;
  "codedesc"?: string;
  "reasonremark"?: string;
  "stoptime"?: number;
  "stopdl"?: number;
  "hours"?: number;
}

export class ProductivityIssue implements ProductivityIssueInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "plant": string;
  "line": string;
  "bu": string;
  "modelfamily": string;
  "mfgtype": string;
  "shiftdate": string;
  "shiftid": string;
  "code": string;
  "codedesc": string;
  "reasonremark": string;
  "stoptime": number;
  "stopdl": number;
  "hours": number;
  constructor(data?: ProductivityIssueInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProductivityIssue`.
   */
  public static getModelName() {
    return "ProductivityIssue";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProductivityIssue for dynamic purposes.
  **/
  public static factory(data: ProductivityIssueInterface): ProductivityIssue{
    return new ProductivityIssue(data);
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
      name: 'ProductivityIssue',
      plural: 'ProductivityIssues',
      path: 'ProductivityIssues',
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
        "line": {
          name: 'line',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "modelfamily": {
          name: 'modelfamily',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "shiftdate": {
          name: 'shiftdate',
          type: 'string'
        },
        "shiftid": {
          name: 'shiftid',
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
        "stoptime": {
          name: 'stoptime',
          type: 'number'
        },
        "stopdl": {
          name: 'stopdl',
          type: 'number'
        },
        "hours": {
          name: 'hours',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
