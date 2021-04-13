/* tslint:disable */
import {
  DPMKPI,
  LINE,
  PLANT
} from '../index';

declare var Object: any;
export interface DPMKPITARGETInterface {
  "id"?: number;
  "plantid"?: string;
  "kpiid"?: string;
  "lineid"?: number;
  "type"?: string;
  "yearmonth"?: string;
  "target"?: number;
  "uom"?: string;
  "threshold"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
  kpi?: DPMKPI;
  line?: LINE;
  plant?: PLANT;
}

export class DPMKPITARGET implements DPMKPITARGETInterface {
  "id": number;
  "plantid": string;
  "kpiid": string;
  "lineid": number;
  "type": string;
  "yearmonth": string;
  "target": number;
  "uom": string;
  "threshold": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  kpi: DPMKPI;
  line: LINE;
  plant: PLANT;
  constructor(data?: DPMKPITARGETInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMKPITARGET`.
   */
  public static getModelName() {
    return "DPMKPITARGET";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMKPITARGET for dynamic purposes.
  **/
  public static factory(data: DPMKPITARGETInterface): DPMKPITARGET{
    return new DPMKPITARGET(data);
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
      name: 'DPMKPITARGET',
      plural: 'DPMKPITARGET',
      path: 'DPMKPITARGET',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "plantid": {
          name: 'plantid',
          type: 'string'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
        "lineid": {
          name: 'lineid',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
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
          type: 'number',
          default: 0.95
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
      },
      relations: {
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'kpiid',
          keyTo: 'id'
        },
        line: {
          name: 'line',
          type: 'LINE',
          model: 'LINE',
          relationType: 'belongsTo',
                  keyFrom: 'lineid',
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
      }
    }
  }
}
