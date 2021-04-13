/* tslint:disable */

declare var Object: any;
export interface IMQMCSNInterface {
  "USN"?: string;
  "CPN"?: string;
  "CSN": string;
  "TRNDATE": Date;
  "MODEL": string;
  "MODELFAMILY"?: string;
  "UPN"?: string;
  "PLANT": string;
  "renew"?: boolean;
}

export class IMQMCSN implements IMQMCSNInterface {
  "USN": string;
  "CPN": string;
  "CSN": string;
  "TRNDATE": Date;
  "MODEL": string;
  "MODELFAMILY": string;
  "UPN": string;
  "PLANT": string;
  "renew": boolean;
  constructor(data?: IMQMCSNInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `IMQMCSN`.
   */
  public static getModelName() {
    return "IMQMCSN";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of IMQMCSN for dynamic purposes.
  **/
  public static factory(data: IMQMCSNInterface): IMQMCSN{
    return new IMQMCSN(data);
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
      name: 'IMQMCSN',
      plural: 'IMQMCSNs',
      path: 'IMQMCSNs',
      idName: 'id',
      properties: {
        "USN": {
          name: 'USN',
          type: 'string'
        },
        "CPN": {
          name: 'CPN',
          type: 'string'
        },
        "CSN": {
          name: 'CSN',
          type: 'string'
        },
        "TRNDATE": {
          name: 'TRNDATE',
          type: 'Date'
        },
        "MODEL": {
          name: 'MODEL',
          type: 'string'
        },
        "MODELFAMILY": {
          name: 'MODELFAMILY',
          type: 'string'
        },
        "UPN": {
          name: 'UPN',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "renew": {
          name: 'renew',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
