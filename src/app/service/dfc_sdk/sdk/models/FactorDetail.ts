/* tslint:disable */
import {
  Factor,
  StandardOperationTime
} from '../index';

declare var Object: any;
export interface FactorDetailInterface {
  "FactorDetailID"?: number;
  "FactorDetailCode"?: string;
  "FactorID"?: number;
  "Name"?: string;
  factor?: Factor;
  standardOperationTimes?: StandardOperationTime[];
}

export class FactorDetail implements FactorDetailInterface {
  "FactorDetailID": number;
  "FactorDetailCode": string;
  "FactorID": number;
  "Name": string;
  factor: Factor;
  standardOperationTimes: StandardOperationTime[];
  constructor(data?: FactorDetailInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactorDetail`.
   */
  public static getModelName() {
    return "FactorDetail";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactorDetail for dynamic purposes.
  **/
  public static factory(data: FactorDetailInterface): FactorDetail{
    return new FactorDetail(data);
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
      name: 'FactorDetail',
      plural: 'FactorDetails',
      path: 'FactorDetails',
      idName: 'FactorDetailID',
      properties: {
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
        "FactorDetailCode": {
          name: 'FactorDetailCode',
          type: 'string'
        },
        "FactorID": {
          name: 'FactorID',
          type: 'number'
        },
        "Name": {
          name: 'Name',
          type: 'string'
        },
      },
      relations: {
        factor: {
          name: 'factor',
          type: 'Factor',
          model: 'Factor',
          relationType: 'belongsTo',
                  keyFrom: 'FactorID',
          keyTo: 'FactorID'
        },
        standardOperationTimes: {
          name: 'standardOperationTimes',
          type: 'StandardOperationTime[]',
          model: 'StandardOperationTime',
          relationType: 'hasMany',
                  keyFrom: 'FactorDetailID',
          keyTo: 'FactorDetailID'
        },
      }
    }
  }
}
