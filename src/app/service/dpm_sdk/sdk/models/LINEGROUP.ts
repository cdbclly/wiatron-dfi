/* tslint:disable */
import {
  LINE,
  DPMKPI
} from '../index';

declare var Object: any;
export interface LINEGROUPInterface {
  "id"?: number;
  "site"?: string;
  "plant": string;
  "groupname"?: string;
  "description"?: string;
  "kpiid"?: string;
  lines?: LINE[];
  kpis?: DPMKPI[];
}

export class LINEGROUP implements LINEGROUPInterface {
  "id": number;
  "site": string;
  "plant": string;
  "groupname": string;
  "description": string;
  "kpiid": string;
  lines: LINE[];
  kpis: DPMKPI[];
  constructor(data?: LINEGROUPInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LINEGROUP`.
   */
  public static getModelName() {
    return "LINEGROUP";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LINEGROUP for dynamic purposes.
  **/
  public static factory(data: LINEGROUPInterface): LINEGROUP{
    return new LINEGROUP(data);
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
      name: 'LINEGROUP',
      plural: 'LINEGROUP',
      path: 'LINEGROUP',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "groupname": {
          name: 'groupname',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
      },
      relations: {
        lines: {
          name: 'lines',
          type: 'LINE[]',
          model: 'LINE',
          relationType: 'hasMany',
          modelThrough: 'LineGroupMapping',
          keyThrough: 'lineId',
          keyFrom: 'id',
          keyTo: 'groupId'
        },
        kpis: {
          name: 'kpis',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'KPIID'
        },
      }
    }
  }
}
