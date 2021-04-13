/* tslint:disable */
import {
  Model,
  ModelSeries
} from '../index';

declare var Object: any;
export interface ModelFamilyInterface {
  "id"?: string;
  "enabled"?: boolean;
  "modelSeriesId"?: string;
  models?: Model[];
  modelSeries?: ModelSeries;
}

export class ModelFamily implements ModelFamilyInterface {
  "id": string;
  "enabled": boolean;
  "modelSeriesId": string;
  models: Model[];
  modelSeries: ModelSeries;
  constructor(data?: ModelFamilyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelFamily`.
   */
  public static getModelName() {
    return "ModelFamily";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelFamily for dynamic purposes.
  **/
  public static factory(data: ModelFamilyInterface): ModelFamily{
    return new ModelFamily(data);
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
      name: 'ModelFamily',
      plural: 'ModelFamilies',
      path: 'ModelFamilies',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean'
        },
        "modelSeriesId": {
          name: 'modelSeriesId',
          type: 'string'
        },
      },
      relations: {
        models: {
          name: 'models',
          type: 'Model[]',
          model: 'Model',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelFamilyId'
        },
        modelSeries: {
          name: 'modelSeries',
          type: 'ModelSeries',
          model: 'ModelSeries',
          relationType: 'belongsTo',
                  keyFrom: 'modelSeriesId',
          keyTo: 'id'
        },
      }
    }
  }
}
