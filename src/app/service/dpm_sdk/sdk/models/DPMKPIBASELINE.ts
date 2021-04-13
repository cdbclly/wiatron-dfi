/* tslint:disable */
import {
  LINE,
  DPMKPI,
  PLANT
} from '../index';

declare var Object: any;
export interface DPMKPIBASELINEInterface {
  "id"?: number;
  "plantid"?: string;
  "lineid"?: number;
  "kpiid"?: string;
  "year"?: string;
  "baseline"?: number;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
  line?: LINE;
  kpi?: DPMKPI;
  plant?: PLANT;
}

export class DPMKPIBASELINE implements DPMKPIBASELINEInterface {
  "id": number;
  "plantid": string;
  "lineid": number;
  "kpiid": string;
  "year": string;
  "baseline": number;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  line: LINE;
  kpi: DPMKPI;
  plant: PLANT;
  constructor(data?: DPMKPIBASELINEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMKPIBASELINE`.
   */
  public static getModelName() {
    return "DPMKPIBASELINE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMKPIBASELINE for dynamic purposes.
  **/
  public static factory(data: DPMKPIBASELINEInterface): DPMKPIBASELINE{
    return new DPMKPIBASELINE(data);
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
      name: 'DPMKPIBASELINE',
      plural: 'DPMKPIBASELINE',
      path: 'DPMKPIBASELINE',
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
        "lineid": {
          name: 'lineid',
          type: 'number'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
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
      },
      relations: {
        line: {
          name: 'line',
          type: 'LINE',
          model: 'LINE',
          relationType: 'belongsTo',
                  keyFrom: 'lineid',
          keyTo: 'id'
        },
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'kpiid',
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
