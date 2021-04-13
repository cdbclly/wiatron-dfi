/* tslint:disable */
import {
  DataVerification
} from '../index';

declare var Object: any;
export interface MOHGapInterface {
  "MOHGapId"?: number;
  "StageID": number;
  "DifferenceValue": number;
  "Reason"?: string;
  "Countermeasure"?: string;
  dataVerification?: DataVerification;
}

export class MOHGap implements MOHGapInterface {
  "MOHGapId": number;
  "StageID": number;
  "DifferenceValue": number;
  "Reason": string;
  "Countermeasure": string;
  dataVerification: DataVerification;
  constructor(data?: MOHGapInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MOHGap`.
   */
  public static getModelName() {
    return "MOHGap";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MOHGap for dynamic purposes.
  **/
  public static factory(data: MOHGapInterface): MOHGap{
    return new MOHGap(data);
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
      name: 'MOHGap',
      plural: 'MOHGaps',
      path: 'MOHGaps',
      idName: 'MOHGapId',
      properties: {
        "MOHGapId": {
          name: 'MOHGapId',
          type: 'number'
        },
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "DifferenceValue": {
          name: 'DifferenceValue',
          type: 'number'
        },
        "Reason": {
          name: 'Reason',
          type: 'string'
        },
        "Countermeasure": {
          name: 'Countermeasure',
          type: 'string'
        },
      },
      relations: {
        dataVerification: {
          name: 'dataVerification',
          type: 'DataVerification',
          model: 'DataVerification',
          relationType: 'belongsTo',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
      }
    }
  }
}
