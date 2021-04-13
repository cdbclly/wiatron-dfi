/* tslint:disable */
import {
  Stage,
  MOHGap,
  OperationTimeGap
} from '../index';

declare var Object: any;
export interface DataVerificationInterface {
  "StageID": number;
  "Month": number;
  "FactoryActualMOH": number;
  "FactoryActualOperationTime": number;
  stage?: Stage;
  MOHGaps?: MOHGap[];
  OperationTimeGaps?: OperationTimeGap[];
}

export class DataVerification implements DataVerificationInterface {
  "StageID": number;
  "Month": number;
  "FactoryActualMOH": number;
  "FactoryActualOperationTime": number;
  stage: Stage;
  MOHGaps: MOHGap[];
  OperationTimeGaps: OperationTimeGap[];
  constructor(data?: DataVerificationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DataVerification`.
   */
  public static getModelName() {
    return "DataVerification";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DataVerification for dynamic purposes.
  **/
  public static factory(data: DataVerificationInterface): DataVerification{
    return new DataVerification(data);
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
      name: 'DataVerification',
      plural: 'DataVerifications',
      path: 'DataVerifications',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "Month": {
          name: 'Month',
          type: 'number'
        },
        "FactoryActualMOH": {
          name: 'FactoryActualMOH',
          type: 'number'
        },
        "FactoryActualOperationTime": {
          name: 'FactoryActualOperationTime',
          type: 'number'
        },
      },
      relations: {
        stage: {
          name: 'stage',
          type: 'Stage',
          model: 'Stage',
          relationType: 'belongsTo',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
        MOHGaps: {
          name: 'MOHGaps',
          type: 'MOHGap[]',
          model: 'MOHGap',
          relationType: 'hasMany',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
        OperationTimeGaps: {
          name: 'OperationTimeGaps',
          type: 'OperationTimeGap[]',
          model: 'OperationTimeGap',
          relationType: 'hasMany',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
      }
    }
  }
}
