/* tslint:disable */
import {
  DPMSTOPCODEGROUP
} from '../index';

declare var Object: any;
export interface DPMPDTISSUEGROUPInterface {
  "syncid"?: number;
  "syncdate"?: Date;
  "syncaction"?: string;
  "period"?: string;
  "periodtype"?: string;
  "site"?: string;
  "plant"?: string;
  "mfgtype"?: string;
  "line"?: string;
  "customer"?: string;
  "codegroup"?: number;
  "value"?: number;
  "losshour"?: number;
  "percentage"?: number;
  stopcodegroup?: DPMSTOPCODEGROUP;
}

export class DPMPDTISSUEGROUP implements DPMPDTISSUEGROUPInterface {
  "syncid": number;
  "syncdate": Date;
  "syncaction": string;
  "period": string;
  "periodtype": string;
  "site": string;
  "plant": string;
  "mfgtype": string;
  "line": string;
  "customer": string;
  "codegroup": number;
  "value": number;
  "losshour": number;
  "percentage": number;
  stopcodegroup: DPMSTOPCODEGROUP;
  constructor(data?: DPMPDTISSUEGROUPInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMPDTISSUEGROUP`.
   */
  public static getModelName() {
    return "DPMPDTISSUEGROUP";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMPDTISSUEGROUP for dynamic purposes.
  **/
  public static factory(data: DPMPDTISSUEGROUPInterface): DPMPDTISSUEGROUP{
    return new DPMPDTISSUEGROUP(data);
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
      name: 'DPMPDTISSUEGROUP',
      plural: 'dpmpdtissuegroup',
      path: 'dpmpdtissuegroup',
      idName: 'syncid',
      properties: {
        "syncid": {
          name: 'syncid',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "syncaction": {
          name: 'syncaction',
          type: 'string'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "periodtype": {
          name: 'periodtype',
          type: 'string'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "mfgtype": {
          name: 'mfgtype',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "codegroup": {
          name: 'codegroup',
          type: 'number'
        },
        "value": {
          name: 'value',
          type: 'number'
        },
        "losshour": {
          name: 'losshour',
          type: 'number'
        },
        "percentage": {
          name: 'percentage',
          type: 'number'
        },
      },
      relations: {
        stopcodegroup: {
          name: 'stopcodegroup',
          type: 'DPMSTOPCODEGROUP',
          model: 'DPMSTOPCODEGROUP',
          relationType: 'belongsTo',
                  keyFrom: 'codegroup',
          keyTo: 'codegroup'
        },
      }
    }
  }
}
