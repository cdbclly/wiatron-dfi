/* tslint:disable */
import {
  ModelOperations,
  MOHCondition,
  MOHAddition,
  ProjectNameProfile,
  TargetOperationSign,
  BasicModel
} from '../index';

declare var Object: any;
export interface StageInterface {
  "StageID"?: number;
  "ModelID"?: number;
  "Stage"?: string;
  ModelOperations?: ModelOperations[];
  MOHCondition?: MOHCondition;
  MOHAddition?: MOHAddition;
  ProjectName?: ProjectNameProfile;
  targetOperationSigns?: TargetOperationSign[];
  basicModel?: BasicModel;
}

export class Stage implements StageInterface {
  "StageID": number;
  "ModelID": number;
  "Stage": string;
  ModelOperations: ModelOperations[];
  MOHCondition: MOHCondition;
  MOHAddition: MOHAddition;
  ProjectName: ProjectNameProfile;
  targetOperationSigns: TargetOperationSign[];
  basicModel: BasicModel;
  constructor(data?: StageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Stage`.
   */
  public static getModelName() {
    return "Stage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Stage for dynamic purposes.
  **/
  public static factory(data: StageInterface): Stage{
    return new Stage(data);
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
      name: 'Stage',
      plural: 'Stages',
      path: 'Stages',
      idName: 'StageID',
      properties: {
        "StageID": {
          name: 'StageID',
          type: 'number'
        },
        "ModelID": {
          name: 'ModelID',
          type: 'number'
        },
        "Stage": {
          name: 'Stage',
          type: 'string'
        },
      },
      relations: {
        ModelOperations: {
          name: 'ModelOperations',
          type: 'ModelOperations[]',
          model: 'ModelOperations',
          relationType: 'hasMany',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
        MOHCondition: {
          name: 'MOHCondition',
          type: 'MOHCondition',
          model: 'MOHCondition',
          relationType: 'hasOne',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
        MOHAddition: {
          name: 'MOHAddition',
          type: 'MOHAddition',
          model: 'MOHAddition',
          relationType: 'hasOne',
                  keyFrom: 'StageID',
          keyTo: 'StageID'
        },
        ProjectName: {
          name: 'ProjectName',
          type: 'ProjectNameProfile',
          model: 'ProjectNameProfile',
          relationType: 'belongsTo',
                  keyFrom: 'ModelID',
          keyTo: 'ProjectNameID'
        },
        targetOperationSigns: {
          name: 'targetOperationSigns',
          type: 'TargetOperationSign[]',
          model: 'TargetOperationSign',
          relationType: 'hasMany',
                  keyFrom: 'StageID',
          keyTo: 'stageID'
        },
        basicModel: {
          name: 'basicModel',
          type: 'BasicModel',
          model: 'BasicModel',
          relationType: 'belongsTo',
                  keyFrom: 'ModelID',
          keyTo: 'modelId'
        },
      }
    }
  }
}
