/* tslint:disable */

declare var Object: any;
export interface MOHInterface {
  "StageID"?: number;
  "output"?: number;
  "moh"?: number;
  "targetMoh"?: number;
  "fixdepre"?: number;
  "fixamort"?: number;
  "fixrent"?: number;
  "sfixidl"?: number;
  "sfixsitealloc"?: number;
  "sfixhqsup"?: number;
  "sfixpacout"?: number;
  "sfixhpwr"?: number;
  "sfixrepair"?: number;
  "vardl"?: number;
  "varmpa"?: number;
  "varmaterial"?: number;
  "varother"?: number;
  "vartax"?: number;
  "vartravel"?: number;
  "vardrive"?: number;
  "ExRateNTD"?: number;
}

export class MOH implements MOHInterface {
  "StageID": number;
  "output": number;
  "moh": number;
  "targetMoh": number;
  "fixdepre": number;
  "fixamort": number;
  "fixrent": number;
  "sfixidl": number;
  "sfixsitealloc": number;
  "sfixhqsup": number;
  "sfixpacout": number;
  "sfixhpwr": number;
  "sfixrepair": number;
  "vardl": number;
  "varmpa": number;
  "varmaterial": number;
  "varother": number;
  "vartax": number;
  "vartravel": number;
  "vardrive": number;
  "ExRateNTD": number;
  constructor(data?: MOHInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOH`.
   */
  public static getModelName() {
    return "MOH";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOH for dynamic purposes.
  **/
  public static factory(data: MOHInterface): MOH{
    return new MOH(data);
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
      name: 'MOH',
      plural: 'MOHs',
      path: 'MOHs',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
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
        "targetMoh": {
          name: 'targetMoh',
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
        "vartax": {
          name: 'vartax',
          type: 'number'
        },
        "vartravel": {
          name: 'vartravel',
          type: 'number'
        },
        "vardrive": {
          name: 'vardrive',
          type: 'number'
        },
        "ExRateNTD": {
          name: 'ExRateNTD',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
