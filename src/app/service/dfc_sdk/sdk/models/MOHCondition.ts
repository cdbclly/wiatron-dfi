/* tslint:disable */

declare var Object: any;
export interface MOHConditionInterface {
  "StageID"?: number;
  "SMTCT"?: number;
  "SMTMan"?: number;
  "PCBAOfflineRatio"?: number;
  "SMTProductionRate"?: number;
  "SMTYield"?: number;
  "SMTMonthDay"?: number;
  "SMTDayHour"?: number;
  "PCBAType"?: boolean;
  "DIPCT"?: number;
  "DIPMan"?: number;
  "DipBalance"?: number;
  "DIPProductionRate"?: number;
  "DIPYield"?: number;
  "DIPDayHour"?: number;
  "DIPMonthDay"?: number;
  "LCMType"?: boolean;
  "LCMCT"?: number;
  "LCMMan"?: number;
  "LCMOfflineRatio"?: number;
  "LCMBalance"?: number;
  "LCMProductionRate"?: number;
  "LCMYield"?: number;
  "LCMMonthDay"?: number;
  "LCMDayHour"?: number;
  "FAType"?: boolean;
  "FACT"?: number;
  "FAMan"?: number;
  "FAOfflineRatio"?: number;
  "FABalance"?: number;
  "FAProductionRate"?: number;
  "FAYield"?: number;
  "FAMonthDay"?: number;
  "FADayHour"?: number;
  "RunIn"?: number;
}

export class MOHCondition implements MOHConditionInterface {
  "StageID": number;
  "SMTCT": number;
  "SMTMan": number;
  "PCBAOfflineRatio": number;
  "SMTProductionRate": number;
  "SMTYield": number;
  "SMTMonthDay": number;
  "SMTDayHour": number;
  "PCBAType": boolean;
  "DIPCT": number;
  "DIPMan": number;
  "DipBalance": number;
  "DIPProductionRate": number;
  "DIPYield": number;
  "DIPDayHour": number;
  "DIPMonthDay": number;
  "LCMType": boolean;
  "LCMCT": number;
  "LCMMan": number;
  "LCMOfflineRatio": number;
  "LCMBalance": number;
  "LCMProductionRate": number;
  "LCMYield": number;
  "LCMMonthDay": number;
  "LCMDayHour": number;
  "FAType": boolean;
  "FACT": number;
  "FAMan": number;
  "FAOfflineRatio": number;
  "FABalance": number;
  "FAProductionRate": number;
  "FAYield": number;
  "FAMonthDay": number;
  "FADayHour": number;
  "RunIn": number;
  constructor(data?: MOHConditionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHCondition`.
   */
  public static getModelName() {
    return "MOHCondition";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHCondition for dynamic purposes.
  **/
  public static factory(data: MOHConditionInterface): MOHCondition{
    return new MOHCondition(data);
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
      name: 'MOHCondition',
      plural: 'MOHConditions',
      path: 'MOHConditions',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "SMTCT": {
          name: 'SMTCT',
          type: 'number'
        },
        "SMTMan": {
          name: 'SMTMan',
          type: 'number'
        },
        "PCBAOfflineRatio": {
          name: 'PCBAOfflineRatio',
          type: 'number'
        },
        "SMTProductionRate": {
          name: 'SMTProductionRate',
          type: 'number'
        },
        "SMTYield": {
          name: 'SMTYield',
          type: 'number'
        },
        "SMTMonthDay": {
          name: 'SMTMonthDay',
          type: 'number'
        },
        "SMTDayHour": {
          name: 'SMTDayHour',
          type: 'number'
        },
        "PCBAType": {
          name: 'PCBAType',
          type: 'boolean'
        },
        "DIPCT": {
          name: 'DIPCT',
          type: 'number'
        },
        "DIPMan": {
          name: 'DIPMan',
          type: 'number'
        },
        "DipBalance": {
          name: 'DipBalance',
          type: 'number'
        },
        "DIPProductionRate": {
          name: 'DIPProductionRate',
          type: 'number'
        },
        "DIPYield": {
          name: 'DIPYield',
          type: 'number'
        },
        "DIPDayHour": {
          name: 'DIPDayHour',
          type: 'number'
        },
        "DIPMonthDay": {
          name: 'DIPMonthDay',
          type: 'number'
        },
        "LCMType": {
          name: 'LCMType',
          type: 'boolean'
        },
        "LCMCT": {
          name: 'LCMCT',
          type: 'number'
        },
        "LCMMan": {
          name: 'LCMMan',
          type: 'number'
        },
        "LCMOfflineRatio": {
          name: 'LCMOfflineRatio',
          type: 'number'
        },
        "LCMBalance": {
          name: 'LCMBalance',
          type: 'number'
        },
        "LCMProductionRate": {
          name: 'LCMProductionRate',
          type: 'number'
        },
        "LCMYield": {
          name: 'LCMYield',
          type: 'number'
        },
        "LCMMonthDay": {
          name: 'LCMMonthDay',
          type: 'number'
        },
        "LCMDayHour": {
          name: 'LCMDayHour',
          type: 'number'
        },
        "FAType": {
          name: 'FAType',
          type: 'boolean'
        },
        "FACT": {
          name: 'FACT',
          type: 'number'
        },
        "FAMan": {
          name: 'FAMan',
          type: 'number'
        },
        "FAOfflineRatio": {
          name: 'FAOfflineRatio',
          type: 'number'
        },
        "FABalance": {
          name: 'FABalance',
          type: 'number'
        },
        "FAProductionRate": {
          name: 'FAProductionRate',
          type: 'number'
        },
        "FAYield": {
          name: 'FAYield',
          type: 'number'
        },
        "FAMonthDay": {
          name: 'FAMonthDay',
          type: 'number'
        },
        "FADayHour": {
          name: 'FADayHour',
          type: 'number'
        },
        "RunIn": {
          name: 'RunIn',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
