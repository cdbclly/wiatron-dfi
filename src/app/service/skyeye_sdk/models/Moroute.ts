/* tslint:disable */

declare var Object: any;
export interface MorouteInterface {
  "PLANT"?: string;
  "MFG"?: string;
  "UPN"?: string;
  "QTY"?: number;
  "LINE"?: string;
  "ROUTE"?: string;
  "WIPORNO"?: string;
  "id"?: number;
}

export class Moroute implements MorouteInterface {
  "PLANT": string;
  "MFG": string;
  "UPN": string;
  "QTY": number;
  "LINE": string;
  "ROUTE": string;
  "WIPORNO": string;
  "id": number;
  constructor(data?: MorouteInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Moroute`.
   */
  public static getModelName() {
    return "Moroute";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Moroute for dynamic purposes.
  **/
  public static factory(data: MorouteInterface): Moroute{
    return new Moroute(data);
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
      name: 'Moroute',
      plural: 'Moroutes',
      path: 'Moroutes',
      idName: 'id',
      properties: {
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "MFG": {
          name: 'MFG',
          type: 'string'
        },
        "UPN": {
          name: 'UPN',
          type: 'string'
        },
        "QTY": {
          name: 'QTY',
          type: 'number'
        },
        "LINE": {
          name: 'LINE',
          type: 'string'
        },
        "ROUTE": {
          name: 'ROUTE',
          type: 'string'
        },
        "WIPORNO": {
          name: 'WIPORNO',
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
