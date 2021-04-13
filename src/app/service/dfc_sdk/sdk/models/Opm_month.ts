/* tslint:disable */

declare var Object: any;
export interface Opm_monthInterface {
  "period"?: string;
  "bg"?: string;
  "op"?: string;
  "site"?: string;
  "plant"?: string;
  "maintaintime"?: Date;
  "expense"?: number;
  "output"?: number;
  "moh"?: number;
  "fixdepre"?: number;
  "fixamort"?: number;
  "fixrent"?: number;
  "fixexpense"?: number;
  "sfixidl"?: number;
  "sfixsitealloc"?: number;
  "sfixhqsup"?: number;
  "sfixpacout"?: number;
  "sfixhpwr"?: number;
  "sfixrepair"?: number;
  "sfixexpense"?: number;
  "vardl"?: number;
  "varmpa"?: number;
  "varmaterial"?: number;
  "varother"?: number;
  "vardrive"?: number;
  "vartravel"?: number;
  "vartax"?: number;
  "varexpense"?: number;
  "mohpercent"?: number;
  "fixmoh"?: number;
  "sfixmoh"?: number;
  "varmoh"?: number;
  "id"?: number;
}

export class Opm_month implements Opm_monthInterface {
  "period": string;
  "bg": string;
  "op": string;
  "site": string;
  "plant": string;
  "maintaintime": Date;
  "expense": number;
  "output": number;
  "moh": number;
  "fixdepre": number;
  "fixamort": number;
  "fixrent": number;
  "fixexpense": number;
  "sfixidl": number;
  "sfixsitealloc": number;
  "sfixhqsup": number;
  "sfixpacout": number;
  "sfixhpwr": number;
  "sfixrepair": number;
  "sfixexpense": number;
  "vardl": number;
  "varmpa": number;
  "varmaterial": number;
  "varother": number;
  "vardrive": number;
  "vartravel": number;
  "vartax": number;
  "varexpense": number;
  "mohpercent": number;
  "fixmoh": number;
  "sfixmoh": number;
  "varmoh": number;
  "id": number;
  constructor(data?: Opm_monthInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Opm_month`.
   */
  public static getModelName() {
    return "Opm_month";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Opm_month for dynamic purposes.
  **/
  public static factory(data: Opm_monthInterface): Opm_month{
    return new Opm_month(data);
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
      name: 'Opm_month',
      plural: 'Opm_months',
      path: 'Opm_months',
      idName: 'id',
      properties: {
        "period": {
          name: 'period',
          type: 'string'
        },
        "bg": {
          name: 'bg',
          type: 'string'
        },
        "op": {
          name: 'op',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "maintaintime": {
          name: 'maintaintime',
          type: 'Date'
        },
        "expense": {
          name: 'expense',
          type: 'number'
        },
        "output": {
          name: 'output',
          type: 'number'
        },
        "moh": {
          name: 'moh',
          type: 'number'
        },
        "fixdepre": {
          name: 'fixdepre',
          type: 'number'
        },
        "fixamort": {
          name: 'fixamort',
          type: 'number'
        },
        "fixrent": {
          name: 'fixrent',
          type: 'number'
        },
        "fixexpense": {
          name: 'fixexpense',
          type: 'number'
        },
        "sfixidl": {
          name: 'sfixidl',
          type: 'number'
        },
        "sfixsitealloc": {
          name: 'sfixsitealloc',
          type: 'number'
        },
        "sfixhqsup": {
          name: 'sfixhqsup',
          type: 'number'
        },
        "sfixpacout": {
          name: 'sfixpacout',
          type: 'number'
        },
        "sfixhpwr": {
          name: 'sfixhpwr',
          type: 'number'
        },
        "sfixrepair": {
          name: 'sfixrepair',
          type: 'number'
        },
        "sfixexpense": {
          name: 'sfixexpense',
          type: 'number'
        },
        "vardl": {
          name: 'vardl',
          type: 'number'
        },
        "varmpa": {
          name: 'varmpa',
          type: 'number'
        },
        "varmaterial": {
          name: 'varmaterial',
          type: 'number'
        },
        "varother": {
          name: 'varother',
          type: 'number'
        },
        "vardrive": {
          name: 'vardrive',
          type: 'number'
        },
        "vartravel": {
          name: 'vartravel',
          type: 'number'
        },
        "vartax": {
          name: 'vartax',
          type: 'number'
        },
        "varexpense": {
          name: 'varexpense',
          type: 'number'
        },
        "mohpercent": {
          name: 'mohpercent',
          type: 'number'
        },
        "fixmoh": {
          name: 'fixmoh',
          type: 'number'
        },
        "sfixmoh": {
          name: 'sfixmoh',
          type: 'number'
        },
        "varmoh": {
          name: 'varmoh',
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
