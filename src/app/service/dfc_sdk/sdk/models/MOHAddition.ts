/* tslint:disable */

declare var Object: any;
export interface MOHAdditionInterface {
  "StageID"?: number;
  "Output"?: number;
  "MOH"?: number;
  "FixDepre"?: number;
  "FixAmort"?: number;
  "FixRent"?: number;
  "SFixIdl"?: number;
  "SFixSiteAlloc"?: number;
  "SFixHQSup"?: number;
  "SFixPaCOut"?: number;
  "SFixHpwr"?: number;
  "SFixRepair"?: number;
  "VarDL"?: number;
  "VarMpa"?: number;
  "VarMaterial"?: number;
  "VarOther"?: number;
  "VarTax"?: number;
  "VarTravel"?: number;
  "VarDrive"?: number;
}

export class MOHAddition implements MOHAdditionInterface {
  "StageID": number;
  "Output": number;
  "MOH": number;
  "FixDepre": number;
  "FixAmort": number;
  "FixRent": number;
  "SFixIdl": number;
  "SFixSiteAlloc": number;
  "SFixHQSup": number;
  "SFixPaCOut": number;
  "SFixHpwr": number;
  "SFixRepair": number;
  "VarDL": number;
  "VarMpa": number;
  "VarMaterial": number;
  "VarOther": number;
  "VarTax": number;
  "VarTravel": number;
  "VarDrive": number;
  constructor(data?: MOHAdditionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHAddition`.
   */
  public static getModelName() {
    return "MOHAddition";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHAddition for dynamic purposes.
  **/
  public static factory(data: MOHAdditionInterface): MOHAddition{
    return new MOHAddition(data);
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
      name: 'MOHAddition',
      plural: 'MOHAdditions',
      path: 'MOHAdditions',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "Output": {
          name: 'Output',
          type: 'number',
          default: 0
        },
        "MOH": {
          name: 'MOH',
          type: 'number',
          default: 0
        },
        "FixDepre": {
          name: 'FixDepre',
          type: 'number',
          default: 0
        },
        "FixAmort": {
          name: 'FixAmort',
          type: 'number',
          default: 0
        },
        "FixRent": {
          name: 'FixRent',
          type: 'number',
          default: 0
        },
        "SFixIdl": {
          name: 'SFixIdl',
          type: 'number',
          default: 0
        },
        "SFixSiteAlloc": {
          name: 'SFixSiteAlloc',
          type: 'number',
          default: 0
        },
        "SFixHQSup": {
          name: 'SFixHQSup',
          type: 'number',
          default: 0
        },
        "SFixPaCOut": {
          name: 'SFixPaCOut',
          type: 'number',
          default: 0
        },
        "SFixHpwr": {
          name: 'SFixHpwr',
          type: 'number',
          default: 0
        },
        "SFixRepair": {
          name: 'SFixRepair',
          type: 'number',
          default: 0
        },
        "VarDL": {
          name: 'VarDL',
          type: 'number',
          default: 0
        },
        "VarMpa": {
          name: 'VarMpa',
          type: 'number',
          default: 0
        },
        "VarMaterial": {
          name: 'VarMaterial',
          type: 'number',
          default: 0
        },
        "VarOther": {
          name: 'VarOther',
          type: 'number',
          default: 0
        },
        "VarTax": {
          name: 'VarTax',
          type: 'number',
          default: 0
        },
        "VarTravel": {
          name: 'VarTravel',
          type: 'number',
          default: 0
        },
        "VarDrive": {
          name: 'VarDrive',
          type: 'number',
          default: 0
        },
      },
      relations: {
      }
    }
  }
}
