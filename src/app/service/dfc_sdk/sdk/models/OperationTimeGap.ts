/* tslint:disable */
import {
  DataVerification
} from '../index';

declare var Object: any;
export interface OperationTimeGapInterface {
  "OperationTimeGapId"?: number;
  "StageID": number;
  "DifferenceValue": number;
  "Reason"?: string;
  "Countermeasure"?: string;
  dataVerification?: DataVerification;
}

export class OperationTimeGap implements OperationTimeGapInterface {
  "OperationTimeGapId": number;
  "StageID": number;
  "DifferenceValue": number;
  "Reason": string;
  "Countermeasure": string;
  dataVerification: DataVerification;
  constructor(data?: OperationTimeGapInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OperationTimeGap`.
   */
  public static getModelName() {
    return "OperationTimeGap";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OperationTimeGap for dynamic purposes.
  **/
  public static factory(data: OperationTimeGapInterface): OperationTimeGap{
    return new OperationTimeGap(data);
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
      name: 'OperationTimeGap',
      plural: 'OperationTimeGaps',
      path: 'OperationTimeGaps',
      idName: 'OperationTimeGapId',
      properties: {
        "OperationTimeGapId": {
          name: 'OperationTimeGapId',
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
