/* tslint:disable */

declare var Object: any;
export interface APINIInterface {
  "site"?: string;
  "plant"?: string;
  "apid"?: string;
  "section"?: string;
  "item"?: string;
  "value"?: string;
  "remark"?: string;
  "id"?: number;
}

export class APINI implements APINIInterface {
  "site": string;
  "plant": string;
  "apid": string;
  "section": string;
  "item": string;
  "value": string;
  "remark": string;
  "id": number;
  constructor(data?: APINIInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `APINI`.
   */
  public static getModelName() {
    return "APINI";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of APINI for dynamic purposes.
  **/
  public static factory(data: APINIInterface): APINI{
    return new APINI(data);
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
      name: 'APINI',
      plural: 'APINI',
      path: 'APINI',
      idName: 'id',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "apid": {
          name: 'apid',
          type: 'string'
        },
        "section": {
          name: 'section',
          type: 'string'
        },
        "item": {
          name: 'item',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'string'
        },
        "remark": {
          name: 'remark',
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
