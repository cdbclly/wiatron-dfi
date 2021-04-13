/* tslint:disable */

declare var Object: any;
export interface View_SFCDEFECTRATEDATAInterface {
  "PRODUCT"?: string;
  "SITE"?: string;
  "PLANT"?: string;
  "MODEL"?: string;
  "MODELFAMILY"?: string;
  "REASONCODE"?: string;
  "REASONDESC"?: string;
  "SUMLOT"?: number;
  "ERRLOT"?: number;
  "REPAIRDATE"?: Date;
  "DEFECTRATE"?: string;
  "MATERIALID"?: number;
}

export class View_SFCDEFECTRATEDATA implements View_SFCDEFECTRATEDATAInterface {
  "PRODUCT": string;
  "SITE": string;
  "PLANT": string;
  "MODEL": string;
  "MODELFAMILY": string;
  "REASONCODE": string;
  "REASONDESC": string;
  "SUMLOT": number;
  "ERRLOT": number;
  "REPAIRDATE": Date;
  "DEFECTRATE": string;
  "MATERIALID": number;
  constructor(data?: View_SFCDEFECTRATEDATAInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_SFCDEFECTRATEDATA`.
   */
  public static getModelName() {
    return "View_SFCDEFECTRATEDATA";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_SFCDEFECTRATEDATA for dynamic purposes.
  **/
  public static factory(data: View_SFCDEFECTRATEDATAInterface): View_SFCDEFECTRATEDATA{
    return new View_SFCDEFECTRATEDATA(data);
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
      name: 'View_SFCDEFECTRATEDATA',
      plural: 'View_SFCDEFECTRATEDATa',
      path: 'View_SFCDEFECTRATEDATa',
      idName: 'SITE',
      properties: {
        "PRODUCT": {
          name: 'PRODUCT',
          type: 'string'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "MODEL": {
          name: 'MODEL',
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
