/* tslint:disable */
import {
  ModelSeries,
  DPMKPI,
  PLANT
} from '../index';

declare var Object: any;
export interface ModelSeriesBaselineInterface {
  "year"?: string;
  "baseline"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
  "id"?: number;
  "modelSeriesId"?: string;
  "kpiId"?: string;
  "plantId"?: string;
  modelSeries?: ModelSeries;
  kpi?: DPMKPI;
  plant?: PLANT;
}

export class ModelSeriesBaseline implements ModelSeriesBaselineInterface {
  "year": string;
  "baseline": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  "id": number;
  "modelSeriesId": string;
  "kpiId": string;
  "plantId": string;
  modelSeries: ModelSeries;
  kpi: DPMKPI;
  plant: PLANT;
  constructor(data?: ModelSeriesBaselineInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelSeriesBaseline`.
   */
  public static getModelName() {
    return "ModelSeriesBaseline";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelSeriesBaseline for dynamic purposes.
  **/
  public static factory(data: ModelSeriesBaselineInterface): ModelSeriesBaseline{
    return new ModelSeriesBaseline(data);
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
      name: 'ModelSeriesBaseline',
      plural: 'ModelSeriesBaselines',
      path: 'ModelSeriesBaselines',
      idName: 'id',
      properties: {
        "year": {
          name: 'year',
          type: 'string'
        },
        "baseline": {
          name: 'baseline',
          type: 'number'
        },
        "createuser": {
          name: 'createuser',
          type: 'string'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "updateuser": {
          name: 'updateuser',
          type: 'string'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelSeriesId": {
          name: 'modelSeriesId',
          type: 'string'
        },
        "kpiId": {
          name: 'kpiId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
      },
      relations: {
        modelSeries: {
          name: 'modelSeries',
          type: 'ModelSeries',
          model: 'ModelSeries',
          relationType: 'belongsTo',
                  keyFrom: 'modelSeriesId',
          keyTo: 'id'
        },
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'kpiId',
          keyTo: 'id'
        },
        plant: {
          name: 'plant',
          type: 'PLANT',
          model: 'PLANT',
          relationType: 'belongsTo',
                  keyFrom: 'plantId',
          keyTo: 'id'
        },
      }
    }
  }
}
