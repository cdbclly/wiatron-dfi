/* tslint:disable */

declare var Object: any;
export interface StageFpyrByModelSeriesInterface {
  "plant"?: string;
  "period"?: string;
  "periodtype"?: string;
  "customer"?: string;
  "mfgtype"?: string;
  "modelSeriesId"?: string;
  "station"?: string;
  "ngqty"?: number;
  "inputqty"?: number;
  "passqty"?: number;
}

export class StageFpyrByModelSeries implements StageFpyrByModelSeriesInterface {
  "plant": string;
  "period": string;
  "periodtype": string;
  "customer": string;
  "mfgtype": string;
  "modelSeriesId": string;
  "station": string;
  "ngqty": number;
  "inputqty": number;
  "passqty": number;
  constructor(data?: StageFpyrByModelSeriesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StageFpyrByModelSeries`.
   */
  public static getModelName() {
    return "StageFpyrByModelSeries";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StageFpyrByModelSeries for dynamic purposes.
  **/
  public static factory(data: StageFpyrByModelSeriesInterface): StageFpyrByModelSeries{
    return new StageFpyrByModelSeries(data);
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
      name: 'StageFpyrByModelSeries',
      plural: 'StageFpyrByModelSeries',
      path: 'StageFpyrByModelSeries',
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
        "modelSeriesId": {
          name: 'modelSeriesId',
          type: 'string'
        },
        "station": {
          name: 'station',
          type: 'string'
        },
        "ngqty": {
          name: 'ngqty',
          type: 'number'
        },
        "inputqty": {
          name: 'inputqty',
          type: 'number'
        },
        "passqty": {
          name: 'passqty',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
