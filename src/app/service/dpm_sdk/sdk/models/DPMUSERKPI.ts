/* tslint:disable */
import {
  USER,
  DPMKPI
} from '../index';

declare var Object: any;
export interface DPMUSERKPIInterface {
  "ID"?: number;
  "PLANTID"?: string;
  "USERID"?: string;
  "KPIID"?: number;
  user?: USER;
  kpi?: DPMKPI;
  dPMKPI?: DPMKPI;
}

export class DPMUSERKPI implements DPMUSERKPIInterface {
  "ID": number;
  "PLANTID": string;
  "USERID": string;
  "KPIID": number;
  user: USER;
  kpi: DPMKPI;
  dPMKPI: DPMKPI;
  constructor(data?: DPMUSERKPIInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMUSERKPI`.
   */
  public static getModelName() {
    return "DPMUSERKPI";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMUSERKPI for dynamic purposes.
  **/
  public static factory(data: DPMUSERKPIInterface): DPMUSERKPI{
    return new DPMUSERKPI(data);
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
      name: 'DPMUSERKPI',
      plural: 'DPMUSERKPI',
      path: 'DPMUSERKPI',
      idName: 'ID',
      properties: {
        "ID": {
          name: 'ID',
          type: 'number'
        },
        "PLANTID": {
          name: 'PLANTID',
          type: 'string'
        },
        "USERID": {
          name: 'USERID',
          type: 'string'
        },
        "KPIID": {
          name: 'KPIID',
          type: 'number'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'USER',
          model: 'USER',
          relationType: 'belongsTo',
                  keyFrom: 'USERID',
          keyTo: 'USERID'
        },
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'KPIID',
          keyTo: 'kpiid'
        },
        dPMKPI: {
          name: 'dPMKPI',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'KPIID',
          keyTo: 'id'
        },
      }
    }
  }
}
