/* tslint:disable */

declare var Object: any;
export interface DPMSTOPCODEInterface {
  "code": string;
  "description"?: string;
  "oeetype"?: string;
  "oeelosstype"?: string;
  "oeelosssubtype"?: string;
}

export class DPMSTOPCODE implements DPMSTOPCODEInterface {
  "code": string;
  "description": string;
  "oeetype": string;
  "oeelosstype": string;
  "oeelosssubtype": string;
  constructor(data?: DPMSTOPCODEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMSTOPCODE`.
   */
  public static getModelName() {
    return "DPMSTOPCODE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMSTOPCODE for dynamic purposes.
  **/
  public static factory(data: DPMSTOPCODEInterface): DPMSTOPCODE{
    return new DPMSTOPCODE(data);
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
      name: 'DPMSTOPCODE',
      plural: 'DPMSTOPCODE',
      path: 'DPMSTOPCODE',
      idName: 'code',
      properties: {
        "code": {
          name: 'code',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "oeetype": {
          name: 'oeetype',
          type: 'string'
        },
        "oeelosstype": {
          name: 'oeelosstype',
          type: 'string'
        },
        "oeelosssubtype": {
          name: 'oeelosssubtype',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
