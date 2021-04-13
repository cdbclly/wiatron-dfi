/* tslint:disable */
import {
  GroupModel,
  BasicModel
} from '../index';

declare var Object: any;
export interface GroupModelMappingInterface {
  "groupModelMappingid"?: number;
  "groupModelId"?: number;
  "modelId"?: number;
  "count"?: number;
  groupModel?: GroupModel;
  basicModel?: BasicModel;
}

export class GroupModelMapping implements GroupModelMappingInterface {
  "groupModelMappingid": number;
  "groupModelId": number;
  "modelId": number;
  "count": number;
  groupModel: GroupModel;
  basicModel: BasicModel;
  constructor(data?: GroupModelMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `GroupModelMapping`.
   */
  public static getModelName() {
    return "GroupModelMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of GroupModelMapping for dynamic purposes.
  **/
  public static factory(data: GroupModelMappingInterface): GroupModelMapping{
    return new GroupModelMapping(data);
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
      name: 'GroupModelMapping',
      plural: 'GroupModelMappings',
      path: 'GroupModelMappings',
      idName: 'groupModelMappingid',
      properties: {
        "groupModelMappingid": {
          name: 'groupModelMappingid',
          type: 'number'
        },
        "groupModelId": {
          name: 'groupModelId',
          type: 'number'
        },
        "modelId": {
          name: 'modelId',
          type: 'number'
        },
        "count": {
          name: 'count',
          type: 'number'
        },
      },
      relations: {
        groupModel: {
          name: 'groupModel',
          type: 'GroupModel',
          model: 'GroupModel',
          relationType: 'belongsTo',
                  keyFrom: 'groupModelId',
          keyTo: 'groupModelId'
        },
        basicModel: {
          name: 'basicModel',
          type: 'BasicModel',
          model: 'BasicModel',
          relationType: 'belongsTo',
                  keyFrom: 'modelId',
          keyTo: 'modelId'
        },
      }
    }
  }
}
