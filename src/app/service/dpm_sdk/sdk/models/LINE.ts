/* tslint:disable */
import {
  DPMKPI,
  DPMKPIBASELINE,
  DPMKPITARGET,
  DPMKPIMFG,
  PLANT
} from '../index';

declare var Object: any;
export interface LINEInterface {
  "mfgtype"?: string;
  "site"?: string;
  "line"?: string;
  "id"?: number;
  "mfgtypeid"?: number;
  "plant"?: string;
  kpis?: DPMKPI[];
  baselines?: DPMKPIBASELINE[];
  targets?: DPMKPITARGET[];
  _mfgtype?: DPMKPIMFG;
  _plant?: PLANT;
}

export class LINE implements LINEInterface {
  "mfgtype": string;
  "site": string;
  "line": string;
  "id": number;
  "mfgtypeid": number;
  "plant": string;
  kpis: DPMKPI[];
  baselines: DPMKPIBASELINE[];
  targets: DPMKPITARGET[];
  _mfgtype: DPMKPIMFG;
  _plant: PLANT;
  constructor(data?: LINEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LINE`.
   */
  public static getModelName() {
    return "LINE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LINE for dynamic purposes.
  **/
  public static factory(data: LINEInterface): LINE{
    return new LINE(data);
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
      name: 'LINE',
      plural: 'LINE',
      path: 'LINE',
      idName: 'id',
      properties: {
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "mfgtypeid": {
          name: 'mfgtypeid',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
      },
      relations: {
        kpis: {
          name: 'kpis',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
          modelThrough: 'LineKpiMapping',
          keyThrough: 'kpiId',
          keyFrom: 'id',
          keyTo: 'lineId'
        },
        baselines: {
          name: 'baselines',
          type: 'DPMKPIBASELINE[]',
          model: 'DPMKPIBASELINE',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'lineid'
        },
        targets: {
          name: 'targets',
          type: 'DPMKPITARGET[]',
          model: 'DPMKPITARGET',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'lineid'
        },
        _mfgtype: {
          name: '_mfgtype',
          type: 'DPMKPIMFG',
          model: 'DPMKPIMFG',
          relationType: 'belongsTo',
                  keyFrom: 'mfgtypeid',
          keyTo: 'id'
        },
        _plant: {
          name: '_plant',
          type: 'PLANT',
          model: 'PLANT',
          relationType: 'belongsTo',
                  keyFrom: 'plant',
          keyTo: 'id'
        },
      }
    }
  }
}
