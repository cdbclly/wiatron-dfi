/* tslint:disable */
import {
  FactorDetail,
  Action
} from '../index';

declare var Object: any;
export interface StandardOperationTimeInterface {
  "OperationCode": string;
  "ModelType"?: string;
  "Module"?: string;
  "FactorDetailID"?: number;
  "ActionCode"?: string;
  "CostTime"?: number;
  "Version"?: string;
  factorDetail?: FactorDetail;
  action?: Action;
}

export class StandardOperationTime implements StandardOperationTimeInterface {
  "OperationCode": string;
  "ModelType": string;
  "Module": string;
  "FactorDetailID": number;
  "ActionCode": string;
  "CostTime": number;
  "Version": string;
  factorDetail: FactorDetail;
  action: Action;
  constructor(data?: StandardOperationTimeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StandardOperationTime`.
   */
  public static getModelName() {
    return "StandardOperationTime";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StandardOperationTime for dynamic purposes.
  **/
  public static factory(data: StandardOperationTimeInterface): StandardOperationTime{
    return new StandardOperationTime(data);
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
      name: 'StandardOperationTime',
      plural: 'StandardOperationTimes',
      path: 'StandardOperationTimes',
      idName: 'OperationCode',
      properties: {
        "OperationCode": {
          name: 'OperationCode',
          type: 'string'
        },
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
        "Module": {
          name: 'Module',
          type: 'string'
        },
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
        "ActionCode": {
          name: 'ActionCode',
          type: 'string'
        },
        "CostTime": {
          name: 'CostTime',
          type: 'number'
        },
        "Version": {
          name: 'Version',
          type: 'string'
        },
      },
      relations: {
        factorDetail: {
          name: 'factorDetail',
          type: 'FactorDetail',
          model: 'FactorDetail',
          relationType: 'belongsTo',
                  keyFrom: 'FactorDetailID',
          keyTo: 'FactorDetailID'
        },
        action: {
          name: 'action',
          type: 'Action',
          model: 'Action',
          relationType: 'belongsTo',
                  keyFrom: 'ActionCode',
          keyTo: 'ActionCode'
        },
      }
    }
  }
}
