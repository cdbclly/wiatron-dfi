/* tslint:disable */
import {
  DPMPDTISSUEGROUP
} from '../index';

declare var Object: any;
export interface DPMSTOPCODEGROUPInterface {
  "codegroup": number;
  "description"?: string;
  dpmpdtissuegroup?: DPMPDTISSUEGROUP[];
}

export class DPMSTOPCODEGROUP implements DPMSTOPCODEGROUPInterface {
  "codegroup": number;
  "description": string;
  dpmpdtissuegroup: DPMPDTISSUEGROUP[];
  constructor(data?: DPMSTOPCODEGROUPInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMSTOPCODEGROUP`.
   */
  public static getModelName() {
    return "DPMSTOPCODEGROUP";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMSTOPCODEGROUP for dynamic purposes.
  **/
  public static factory(data: DPMSTOPCODEGROUPInterface): DPMSTOPCODEGROUP{
    return new DPMSTOPCODEGROUP(data);
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
      name: 'DPMSTOPCODEGROUP',
      plural: 'DPMSTOPCODEGROUP',
      path: 'DPMSTOPCODEGROUP',
      idName: 'codegroup',
      properties: {
        "codegroup": {
          name: 'codegroup',
          type: 'number'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
      },
      relations: {
        dpmpdtissuegroup: {
          name: 'dpmpdtissuegroup',
          type: 'DPMPDTISSUEGROUP[]',
          model: 'DPMPDTISSUEGROUP',
          relationType: 'hasMany',
                  keyFrom: 'codegroup',
          keyTo: 'codegroup'
        },
      }
    }
  }
}
