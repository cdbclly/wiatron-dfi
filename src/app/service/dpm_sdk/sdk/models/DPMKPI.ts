/* tslint:disable */
import {
  DPMUSERKPI,
  LINE,
  USER,
  DPMKPIBASELINE,
  DPMKPITARGET,
  DPMKPIWARNING,
  DPMKPIMFG,
  PLANT,
  PLANTGROUP,
  ModelSeriesTarget,
  ModelSeriesBaseline
} from '../index';

declare var Object: any;
export interface DPMKPIInterface {
  "kpiid": string;
  "site"?: string;
  "plantid": string;
  "name"?: string;
  "description"?: string;
  "formula"?: string;
  "defaultperiodtype"?: string;
  "thresholddir"?: number;
  "maintaingroup"?: string;
  "maintainmode"?: number;
  "meetingtype"?: string;
  "owner"?: string;
  "mfgtype"?: string;
  "isRealTime"?: boolean;
  "id"?: number;
  "KPIID"?: number;
  "mfgtypeid"?: number;
  userkpi?: DPMUSERKPI[];
  lines?: LINE[];
  users?: USER[];
  baselines?: DPMKPIBASELINE[];
  targets?: DPMKPITARGET[];
  dpmkpiwarning?: DPMKPIWARNING[];
  _mfgtype?: DPMKPIMFG;
  plant?: PLANT;
  plantgroup?: PLANTGROUP;
  modelSeriesTarget?: ModelSeriesTarget[];
  modelSeriesBaseline?: ModelSeriesBaseline[];
}

export class DPMKPI implements DPMKPIInterface {
  "kpiid": string;
  "site": string;
  "plantid": string;
  "name": string;
  "description": string;
  "formula": string;
  "defaultperiodtype": string;
  "thresholddir": number;
  "maintaingroup": string;
  "maintainmode": number;
  "meetingtype": string;
  "owner": string;
  "mfgtype": string;
  "isRealTime": boolean;
  "id": number;
  "KPIID": number;
  "mfgtypeid": number;
  userkpi: DPMUSERKPI[];
  lines: LINE[];
  users: USER[];
  baselines: DPMKPIBASELINE[];
  targets: DPMKPITARGET[];
  dpmkpiwarning: DPMKPIWARNING[];
  _mfgtype: DPMKPIMFG;
  plant: PLANT;
  plantgroup: PLANTGROUP;
  modelSeriesTarget: ModelSeriesTarget[];
  modelSeriesBaseline: ModelSeriesBaseline[];
  constructor(data?: DPMKPIInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMKPI`.
   */
  public static getModelName() {
    return "DPMKPI";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMKPI for dynamic purposes.
  **/
  public static factory(data: DPMKPIInterface): DPMKPI{
    return new DPMKPI(data);
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
      name: 'DPMKPI',
      plural: 'DPMKPI',
      path: 'DPMKPI',
      idName: 'id',
      properties: {
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plantid": {
          name: 'plantid',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "formula": {
          name: 'formula',
          type: 'string'
        },
        "defaultperiodtype": {
          name: 'defaultperiodtype',
          type: 'string'
        },
        "thresholddir": {
          name: 'thresholddir',
          type: 'number'
        },
        "maintaingroup": {
          name: 'maintaingroup',
          type: 'string'
        },
        "maintainmode": {
          name: 'maintainmode',
          type: 'number'
        },
        "meetingtype": {
          name: 'meetingtype',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "isRealTime": {
          name: 'isRealTime',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "KPIID": {
          name: 'KPIID',
          type: 'number'
        },
        "mfgtypeid": {
          name: 'mfgtypeid',
          type: 'number'
        },
      },
      relations: {
        userkpi: {
          name: 'userkpi',
          type: 'DPMUSERKPI[]',
          model: 'DPMUSERKPI',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'KPIID'
        },
        lines: {
          name: 'lines',
          type: 'LINE[]',
          model: 'LINE',
          relationType: 'hasMany',
          modelThrough: 'LineKpiMapping',
          keyThrough: 'lineId',
          keyFrom: 'id',
          keyTo: 'kpiId'
        },
        users: {
          name: 'users',
          type: 'USER[]',
          model: 'USER',
          relationType: 'hasMany',
          modelThrough: 'DPMUSERKPI',
          keyThrough: 'uSERId',
          keyFrom: 'id',
          keyTo: 'userId'
        },
        baselines: {
          name: 'baselines',
          type: 'DPMKPIBASELINE[]',
          model: 'DPMKPIBASELINE',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'kpiid'
        },
        targets: {
          name: 'targets',
          type: 'DPMKPITARGET[]',
          model: 'DPMKPITARGET',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'kpiid'
        },
        dpmkpiwarning: {
          name: 'dpmkpiwarning',
          type: 'DPMKPIWARNING[]',
          model: 'DPMKPIWARNING',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'kpiid'
        },
        _mfgtype: {
          name: '_mfgtype',
          type: 'DPMKPIMFG',
          model: 'DPMKPIMFG',
          relationType: 'belongsTo',
                  keyFrom: 'mfgtypeid',
          keyTo: 'id'
        },
        plant: {
          name: 'plant',
          type: 'PLANT',
          model: 'PLANT',
          relationType: 'belongsTo',
                  keyFrom: 'plantid',
          keyTo: 'id'
        },
        plantgroup: {
          name: 'plantgroup',
          type: 'PLANTGROUP',
          model: 'PLANTGROUP',
          relationType: 'belongsTo',
                  keyFrom: 'plantid',
          keyTo: 'id'
        },
        modelSeriesTarget: {
          name: 'modelSeriesTarget',
          type: 'ModelSeriesTarget[]',
          model: 'ModelSeriesTarget',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'kpiId'
        },
        modelSeriesBaseline: {
          name: 'modelSeriesBaseline',
          type: 'ModelSeriesBaseline[]',
          model: 'ModelSeriesBaseline',
          relationType: 'hasMany',
                  keyFrom: 'kpiid',
          keyTo: 'kpiId'
        },
      }
    }
  }
}
