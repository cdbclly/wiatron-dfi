/* tslint:disable */
import {
  ModelFamily,
  ModelSeriesTarget,
  ModelSeriesBaseline
} from '../index';

declare var Object: any;
export interface ModelSeriesInterface {
  "id"?: string;
  "enabled"?: boolean;
  modelFamilies?: ModelFamily[];
  targets?: ModelSeriesTarget[];
  baselines?: ModelSeriesBaseline[];
}

export class ModelSeries implements ModelSeriesInterface {
  "id": string;
  "enabled": boolean;
  modelFamilies: ModelFamily[];
  targets: ModelSeriesTarget[];
  baselines: ModelSeriesBaseline[];
  constructor(data?: ModelSeriesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelSeries`.
   */
  public static getModelName() {
    return "ModelSeries";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelSeries for dynamic purposes.
  **/
  public static factory(data: ModelSeriesInterface): ModelSeries{
    return new ModelSeries(data);
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
      name: 'ModelSeries',
      plural: 'ModelSeries',
      path: 'ModelSeries',
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
      },
      relations: {
        modelFamilies: {
          name: 'modelFamilies',
          type: 'ModelFamily[]',
          model: 'ModelFamily',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelSeriesId'
        },
        targets: {
          name: 'targets',
          type: 'ModelSeriesTarget[]',
          model: 'ModelSeriesTarget',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelSeriesId'
        },
        baselines: {
          name: 'baselines',
          type: 'ModelSeriesBaseline[]',
          model: 'ModelSeriesBaseline',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelSeriesId'
        },
      }
    }
  }
}
