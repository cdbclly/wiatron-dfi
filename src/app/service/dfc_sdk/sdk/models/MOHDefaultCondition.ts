/* tslint:disable */

declare var Object: any;
export interface MOHDefaultConditionInterface {
  "Plant"?: string;
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
  "RunIn"?: number;
  "FAOfflineRatio"?: number;
  "FABalance"?: number;
  "FAProductionRate"?: number;
  "FAYield"?: number;
  "FAMonthDay"?: number;
  "FADayHour"?: number;
}

export class MOHDefaultCondition implements MOHDefaultConditionInterface {
  "Plant": string;
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
  "RunIn": number;
  "FAOfflineRatio": number;
  "FABalance": number;
  "FAProductionRate": number;
  "FAYield": number;
  "FAMonthDay": number;
  "FADayHour": number;
  constructor(data?: MOHDefaultConditionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHDefaultCondition`.
   */
  public static getModelName() {
    return "MOHDefaultCondition";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHDefaultCondition for dynamic purposes.
  **/
  public static factory(data: MOHDefaultConditionInterface): MOHDefaultCondition{
    return new MOHDefaultCondition(data);
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
      name: 'MOHDefaultCondition',
      plural: 'MOHDefaultConditions',
      path: 'MOHDefaultConditions',
      idName: 'Plant',
      properties: {
        "Plant": {
          name: 'Plant',
          type: 'string'
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
        "RunIn": {
          name: 'RunIn',
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
      },
      relations: {
      }
    }
  }
}
