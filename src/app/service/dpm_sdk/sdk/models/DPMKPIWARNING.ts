/* tslint:disable */
import {
  DPMKPI
} from '../index';

declare var Object: any;
export interface DPMKPIWARNINGInterface {
  "plantid": string;
  "kpiid": string;
  "frequency": string;
  "deptmanager": string;
  "plantmanager": string;
  "ophead": string;
  "createuser"?: string;
  "createdate"?: Date;
  "updateuser"?: string;
  "updatedate"?: Date;
  "id"?: number;
  kpi?: DPMKPI;
}

export class DPMKPIWARNING implements DPMKPIWARNINGInterface {
  "plantid": string;
  "kpiid": string;
  "frequency": string;
  "deptmanager": string;
  "plantmanager": string;
  "ophead": string;
  "createuser": string;
  "createdate": Date;
  "updateuser": string;
  "updatedate": Date;
  "id": number;
  kpi: DPMKPI;
  constructor(data?: DPMKPIWARNINGInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMKPIWARNING`.
   */
  public static getModelName() {
    return "DPMKPIWARNING";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMKPIWARNING for dynamic purposes.
  **/
  public static factory(data: DPMKPIWARNINGInterface): DPMKPIWARNING{
    return new DPMKPIWARNING(data);
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
      name: 'DPMKPIWARNING',
      plural: 'DPMKPIWARNING',
      path: 'DPMKPIWARNING',
      idName: 'id',
      properties: {
        "plantid": {
          name: 'plantid',
          type: 'string'
        },
        "kpiid": {
          name: 'kpiid',
          type: 'string'
        },
        "frequency": {
          name: 'frequency',
          type: 'string'
        },
        "deptmanager": {
          name: 'deptmanager',
          type: 'string'
        },
        "plantmanager": {
          name: 'plantmanager',
          type: 'string'
        },
        "ophead": {
          name: 'ophead',
          type: 'string'
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
      }
    }
  }
}
