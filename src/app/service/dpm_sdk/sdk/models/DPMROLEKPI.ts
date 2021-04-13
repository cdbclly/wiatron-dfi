/* tslint:disable */

declare var Object: any;
export interface DPMROLEKPIInterface {
  "ROLEID": string;
  "KPIID": string;
  "PERMISSION"?: number;
  "id"?: number;
}

export class DPMROLEKPI implements DPMROLEKPIInterface {
  "ROLEID": string;
  "KPIID": string;
  "PERMISSION": number;
  "id": number;
  constructor(data?: DPMROLEKPIInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMROLEKPI`.
   */
  public static getModelName() {
    return "DPMROLEKPI";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMROLEKPI for dynamic purposes.
  **/
  public static factory(data: DPMROLEKPIInterface): DPMROLEKPI{
    return new DPMROLEKPI(data);
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
      name: 'DPMROLEKPI',
      plural: 'DPMROLEKPI',
      path: 'DPMROLEKPI',
      idName: 'id',
      properties: {
        "ROLEID": {
          name: 'ROLEID',
          type: 'string'
        },
        "KPIID": {
          name: 'KPIID',
          type: 'string'
        },
        "PERMISSION": {
          name: 'PERMISSION',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
