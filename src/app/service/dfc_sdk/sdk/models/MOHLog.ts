/* tslint:disable */

declare var Object: any;
export interface MOHLogInterface {
  "StageID"?: number;
  "Time"?: Date;
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
  "AddOutput"?: number;
  "AddMOH"?: number;
  "AddFixDepre"?: number;
  "AddFixAmort"?: number;
  "AddFixRent"?: number;
  "AddSFixIdl"?: number;
  "AddSFixSiteAlloc"?: number;
  "AddSFixHQSup"?: number;
  "AddSFixPaCOut"?: number;
  "AddSFixHpwr"?: number;
  "AddSFixRepair"?: number;
  "AddVarDL"?: number;
  "AddVarMpa"?: number;
  "AddVarMaterial"?: number;
  "AddVarOther"?: number;
  "AddVarTax"?: number;
  "AddVarTravel"?: number;
  "AddVarDrive"?: number;
  "PCBAProductionRate"?: number;
  "FAProductionRate"?: number;
  "Balance"?: number;
  "PCBAOfflineRatio"?: number;
  "FAOfflineRatio"?: number;
  "FAMonthDay"?: number;
  "ExchangeRate"?: number;
  "FCST"?: number;
  "SMTCT"?: number;
  "RunIn"?: number;
  "Yield"?: number;
  "id"?: number;
}

export class MOHLog implements MOHLogInterface {
  "StageID": number;
  "Time": Date;
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
  "AddOutput": number;
  "AddMOH": number;
  "AddFixDepre": number;
  "AddFixAmort": number;
  "AddFixRent": number;
  "AddSFixIdl": number;
  "AddSFixSiteAlloc": number;
  "AddSFixHQSup": number;
  "AddSFixPaCOut": number;
  "AddSFixHpwr": number;
  "AddSFixRepair": number;
  "AddVarDL": number;
  "AddVarMpa": number;
  "AddVarMaterial": number;
  "AddVarOther": number;
  "AddVarTax": number;
  "AddVarTravel": number;
  "AddVarDrive": number;
  "PCBAProductionRate": number;
  "FAProductionRate": number;
  "Balance": number;
  "PCBAOfflineRatio": number;
  "FAOfflineRatio": number;
  "FAMonthDay": number;
  "ExchangeRate": number;
  "FCST": number;
  "SMTCT": number;
  "RunIn": number;
  "Yield": number;
  "id": number;
  constructor(data?: MOHLogInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHLog`.
   */
  public static getModelName() {
    return "MOHLog";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHLog for dynamic purposes.
  **/
  public static factory(data: MOHLogInterface): MOHLog{
    return new MOHLog(data);
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
      name: 'MOHLog',
      plural: 'MOHLogs',
      path: 'MOHLogs',
      idName: 'id',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "Time": {
          name: 'Time',
          type: 'Date'
        },
        "Output": {
          name: 'Output',
          type: 'number'
        },
        "MOH": {
          name: 'MOH',
          type: 'number'
        },
        "FixDepre": {
          name: 'FixDepre',
          type: 'number'
        },
        "FixAmort": {
          name: 'FixAmort',
          type: 'number'
        },
        "FixRent": {
          name: 'FixRent',
          type: 'number'
        },
        "SFixIdl": {
          name: 'SFixIdl',
          type: 'number'
        },
        "SFixSiteAlloc": {
          name: 'SFixSiteAlloc',
          type: 'number'
        },
        "SFixHQSup": {
          name: 'SFixHQSup',
          type: 'number'
        },
        "SFixPaCOut": {
          name: 'SFixPaCOut',
          type: 'number'
        },
        "SFixHpwr": {
          name: 'SFixHpwr',
          type: 'number'
        },
        "SFixRepair": {
          name: 'SFixRepair',
          type: 'number'
        },
        "VarDL": {
          name: 'VarDL',
          type: 'number'
        },
        "VarMpa": {
          name: 'VarMpa',
          type: 'number'
        },
        "VarMaterial": {
          name: 'VarMaterial',
          type: 'number'
        },
        "VarOther": {
          name: 'VarOther',
          type: 'number'
        },
        "VarTax": {
          name: 'VarTax',
          type: 'number'
        },
        "VarTravel": {
          name: 'VarTravel',
          type: 'number'
        },
        "VarDrive": {
          name: 'VarDrive',
          type: 'number'
        },
        "AddOutput": {
          name: 'AddOutput',
          type: 'number'
        },
        "AddMOH": {
          name: 'AddMOH',
          type: 'number'
        },
        "AddFixDepre": {
          name: 'AddFixDepre',
          type: 'number'
        },
        "AddFixAmort": {
          name: 'AddFixAmort',
          type: 'number'
        },
        "AddFixRent": {
          name: 'AddFixRent',
          type: 'number'
        },
        "AddSFixIdl": {
          name: 'AddSFixIdl',
          type: 'number'
        },
        "AddSFixSiteAlloc": {
          name: 'AddSFixSiteAlloc',
          type: 'number'
        },
        "AddSFixHQSup": {
          name: 'AddSFixHQSup',
          type: 'number'
        },
        "AddSFixPaCOut": {
          name: 'AddSFixPaCOut',
          type: 'number'
        },
        "AddSFixHpwr": {
          name: 'AddSFixHpwr',
          type: 'number'
        },
        "AddSFixRepair": {
          name: 'AddSFixRepair',
          type: 'number'
        },
        "AddVarDL": {
          name: 'AddVarDL',
          type: 'number'
        },
        "AddVarMpa": {
          name: 'AddVarMpa',
          type: 'number'
        },
        "AddVarMaterial": {
          name: 'AddVarMaterial',
          type: 'number'
        },
        "AddVarOther": {
          name: 'AddVarOther',
          type: 'number'
        },
        "AddVarTax": {
          name: 'AddVarTax',
          type: 'number'
        },
        "AddVarTravel": {
          name: 'AddVarTravel',
          type: 'number'
        },
        "AddVarDrive": {
          name: 'AddVarDrive',
          type: 'number'
        },
        "PCBAProductionRate": {
          name: 'PCBAProductionRate',
          type: 'number'
        },
        "FAProductionRate": {
          name: 'FAProductionRate',
          type: 'number'
        },
        "Balance": {
          name: 'Balance',
          type: 'number'
        },
        "PCBAOfflineRatio": {
          name: 'PCBAOfflineRatio',
          type: 'number'
        },
        "FAOfflineRatio": {
          name: 'FAOfflineRatio',
          type: 'number'
        },
        "FAMonthDay": {
          name: 'FAMonthDay',
          type: 'number'
        },
        "ExchangeRate": {
          name: 'ExchangeRate',
          type: 'number'
        },
        "FCST": {
          name: 'FCST',
          type: 'number'
        },
        "SMTCT": {
          name: 'SMTCT',
          type: 'number'
        },
        "RunIn": {
          name: 'RunIn',
          type: 'number'
        },
        "Yield": {
          name: 'Yield',
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
