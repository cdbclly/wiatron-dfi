/* tslint:disable */

declare var Object: any;
export interface MOHPlantInterface {
  "plant"?: string;
  "period"?: string;
  "ExRateNTD"?: number;
  "ExRateRMB"?: number;
  "dl2"?: number;
  "output"?: number;
  "moh"?: number;
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
}

export class MOHPlant implements MOHPlantInterface {
  "plant": string;
  "period": string;
  "ExRateNTD": number;
  "ExRateRMB": number;
  "dl2": number;
  "output": number;
  "moh": number;
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
  constructor(data?: MOHPlantInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHPlant`.
   */
  public static getModelName() {
    return "MOHPlant";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHPlant for dynamic purposes.
  **/
  public static factory(data: MOHPlantInterface): MOHPlant{
    return new MOHPlant(data);
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
      name: 'MOHPlant',
      plural: 'MOHPlants',
      path: 'MOHPlants',
      idName: 'plant',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "ExRateNTD": {
          name: 'ExRateNTD',
          type: 'number'
        },
        "ExRateRMB": {
          name: 'ExRateRMB',
          type: 'number'
        },
        "dl2": {
          name: 'dl2',
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
      },
      relations: {
      }
    }
  }
}
