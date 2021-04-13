/* tslint:disable */
import {
  DPMKPI,
  LINE,
  PLANT
} from '../index';

declare var Object: any;
export interface DPMKPIMFGInterface {
  "mfgtype"?: string;
  "plantid"?: string;
  "id"?: number;
  kpis?: DPMKPI[];
  lines?: LINE[];
  plant?: PLANT;
}

export class DPMKPIMFG implements DPMKPIMFGInterface {
  "mfgtype": string;
  "plantid": string;
  "id": number;
  kpis: DPMKPI[];
  lines: LINE[];
  plant: PLANT;
  constructor(data?: DPMKPIMFGInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMKPIMFG`.
   */
  public static getModelName() {
    return "DPMKPIMFG";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMKPIMFG for dynamic purposes.
  **/
  public static factory(data: DPMKPIMFGInterface): DPMKPIMFG{
    return new DPMKPIMFG(data);
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
      name: 'DPMKPIMFG',
      plural: 'DPMKPIMFG',
      path: 'DPMKPIMFG',
      idName: 'id',
      properties: {
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "plantid": {
          name: 'plantid',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        kpis: {
          name: 'kpis',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'mfgtypeid'
        },
        lines: {
          name: 'lines',
          type: 'LINE[]',
          model: 'LINE',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'mfgtypeid'
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
