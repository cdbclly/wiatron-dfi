/* tslint:disable */

declare var Object: any;
export interface SFCDEFECTRATEDATAInterface {
  "PLANT"?: string;
  "MODELFAMILY"?: string;
  "REASONCODE"?: string;
  "REASONDESC"?: string;
  "SUMLOT"?: number;
  "ERRLOT"?: number;
  "REPAIRDATE"?: Date;
  "DEFECTRATE"?: string;
  "MATERIALID"?: number;
}

export class SFCDEFECTRATEDATA implements SFCDEFECTRATEDATAInterface {
  "PLANT": string;
  "MODELFAMILY": string;
  "REASONCODE": string;
  "REASONDESC": string;
  "SUMLOT": number;
  "ERRLOT": number;
  "REPAIRDATE": Date;
  "DEFECTRATE": string;
  "MATERIALID": number;
  constructor(data?: SFCDEFECTRATEDATAInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SFCDEFECTRATEDATA`.
   */
  public static getModelName() {
    return "SFCDEFECTRATEDATA";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SFCDEFECTRATEDATA for dynamic purposes.
  **/
  public static factory(data: SFCDEFECTRATEDATAInterface): SFCDEFECTRATEDATA{
    return new SFCDEFECTRATEDATA(data);
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
      name: 'SFCDEFECTRATEDATA',
      plural: 'SFCDEFECTRATEDATa',
      path: 'SFCDEFECTRATEDATa',
      idName: 'PLANT',
      properties: {
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "MODELFAMILY": {
          name: 'MODELFAMILY',
          type: 'string'
        },
        "REASONCODE": {
          name: 'REASONCODE',
          type: 'string'
        },
        "REASONDESC": {
          name: 'REASONDESC',
          type: 'string'
        },
        "SUMLOT": {
          name: 'SUMLOT',
          type: 'number'
        },
        "ERRLOT": {
          name: 'ERRLOT',
          type: 'number'
        },
        "REPAIRDATE": {
          name: 'REPAIRDATE',
          type: 'Date'
        },
        "DEFECTRATE": {
          name: 'DEFECTRATE',
          type: 'string'
        },
        "MATERIALID": {
          name: 'MATERIALID',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
