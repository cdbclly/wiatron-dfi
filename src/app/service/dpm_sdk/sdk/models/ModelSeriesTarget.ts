/* tslint:disable */
import {
  DPMKPI,
  ModelSeries,
  PLANT
} from '../index';

declare var Object: any;
export interface ModelSeriesTargetInterface {
  "yearmonth"?: string;
  "target"?: number;
  "uom"?: string;
  "threshold"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
  "id"?: number;
  "kpiId"?: string;
  "modelSeriesId"?: string;
  "plantId"?: string;
  kpi?: DPMKPI;
  modelSeries?: ModelSeries;
  plant?: PLANT;
}

export class ModelSeriesTarget implements ModelSeriesTargetInterface {
  "yearmonth": string;
  "target": number;
  "uom": string;
  "threshold": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  "id": number;
  "kpiId": string;
  "modelSeriesId": string;
  "plantId": string;
  kpi: DPMKPI;
  modelSeries: ModelSeries;
  plant: PLANT;
  constructor(data?: ModelSeriesTargetInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelSeriesTarget`.
   */
  public static getModelName() {
    return "ModelSeriesTarget";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelSeriesTarget for dynamic purposes.
  **/
  public static factory(data: ModelSeriesTargetInterface): ModelSeriesTarget{
    return new ModelSeriesTarget(data);
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
      name: 'ModelSeriesTarget',
      plural: 'ModelSeriesTargets',
      path: 'ModelSeriesTargets',
      idName: 'id',
      properties: {
        "yearmonth": {
          name: 'yearmonth',
          type: 'string'
        },
        "target": {
          name: 'target',
          type: 'number'
        },
        "uom": {
          name: 'uom',
          type: 'string'
        },
        "threshold": {
          name: 'threshold',
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
        "kpiId": {
          name: 'kpiId',
          type: 'string'
        },
        "modelSeriesId": {
          name: 'modelSeriesId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
      },
      relations: {
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'kpiId',
          keyTo: 'id'
        },
        modelSeries: {
          name: 'modelSeries',
          type: 'ModelSeries',
          model: 'ModelSeries',
          relationType: 'belongsTo',
                  keyFrom: 'modelSeriesId',
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
