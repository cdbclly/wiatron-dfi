/* tslint:disable */
import {
  ModelSeries
} from '../index';

declare var Object: any;
export interface FpyrByModelSeriesInterface {
  "plant"?: string;
  "period"?: string;
  "periodtype"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "fpyr"?: number;
  "modelSeriesId"?: string;
  modelSeries?: ModelSeries;
}

export class FpyrByModelSeries implements FpyrByModelSeriesInterface {
  "plant": string;
  "period": string;
  "periodtype": string;
  "customer": string;
  "mfgtype": string;
  "fpyr": number;
  "modelSeriesId": string;
  modelSeries: ModelSeries;
  constructor(data?: FpyrByModelSeriesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FpyrByModelSeries`.
   */
  public static getModelName() {
    return "FpyrByModelSeries";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FpyrByModelSeries for dynamic purposes.
  **/
  public static factory(data: FpyrByModelSeriesInterface): FpyrByModelSeries{
    return new FpyrByModelSeries(data);
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
      name: 'FpyrByModelSeries',
      plural: 'FpyrByModelSeries',
      path: 'FpyrByModelSeries',
      idName: 'plant',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "periodtype": {
          name: 'periodtype',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "fpyr": {
          name: 'fpyr',
          type: 'number'
        },
        "modelSeriesId": {
          name: 'modelSeriesId',
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
      }
    }
  }
}
