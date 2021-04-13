/* tslint:disable */

declare var Object: any;
export interface DPMOEEDETAILInterface {
  "id"?: number;
  "syncdate"?: Date;
  "plant"?: string;
  "shiftdate"?: string;
  "shift"?: string;
  "shifttype"?: string;
  "bu"?: string;
  "line"?: string;
  "totalpresenttime"?: number;
  "earnedhrs"?: number;
  "ieearnedhrs"?: number;
  "losshrs"?: number;
  "chargehrs"?: number;
  "efficiency"?: number;
  "productivity"?: number;
  "charge"?: number;
  "ieproductivity"?: number;
}

export class DPMOEEDETAIL implements DPMOEEDETAILInterface {
  "id": number;
  "syncdate": Date;
  "plant": string;
  "shiftdate": string;
  "shift": string;
  "shifttype": string;
  "bu": string;
  "line": string;
  "totalpresenttime": number;
  "earnedhrs": number;
  "ieearnedhrs": number;
  "losshrs": number;
  "chargehrs": number;
  "efficiency": number;
  "productivity": number;
  "charge": number;
  "ieproductivity": number;
  constructor(data?: DPMOEEDETAILInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMOEEDETAIL`.
   */
  public static getModelName() {
    return "DPMOEEDETAIL";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMOEEDETAIL for dynamic purposes.
  **/
  public static factory(data: DPMOEEDETAILInterface): DPMOEEDETAIL{
    return new DPMOEEDETAIL(data);
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
      name: 'DPMOEEDETAIL',
      plural: 'dpmoeedetail',
      path: 'dpmoeedetail',
      idName: 'plant',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "syncdate": {
          name: 'syncdate',
          type: 'Date'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "shiftdate": {
          name: 'shiftdate',
          type: 'string'
        },
        "shift": {
          name: 'shift',
          type: 'string'
        },
        "shifttype": {
          name: 'shifttype',
          type: 'string'
        },
        "bu": {
          name: 'bu',
          type: 'string'
        },
        "line": {
          name: 'line',
          type: 'string'
        },
        "totalpresenttime": {
          name: 'totalpresenttime',
          type: 'number'
        },
        "earnedhrs": {
          name: 'earnedhrs',
          type: 'number'
        },
        "ieearnedhrs": {
          name: 'ieearnedhrs',
          type: 'number'
        },
        "losshrs": {
          name: 'losshrs',
          type: 'number'
        },
        "chargehrs": {
          name: 'chargehrs',
          type: 'number'
        },
        "efficiency": {
          name: 'efficiency',
          type: 'number'
        },
        "productivity": {
          name: 'productivity',
          type: 'number'
        },
        "charge": {
          name: 'charge',
          type: 'number'
        },
        "ieproductivity": {
          name: 'ieproductivity',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
