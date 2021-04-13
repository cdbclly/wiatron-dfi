/* tslint:disable */

declare var Object: any;
export interface NPICHECKLIST_EMTInterface {
  "SEQ": number;
  "SITE": string;
  "PLANT": string;
  "STAGE": string;
  "PROCESS": string;
  "VERSION"?: string;
  "ITEMDESC"?: string;
  "CHECKPOINT"?: string;
  "CHECKFUNTIONROLE"?: string;
  "MUSTDO"?: number;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
}

export class NPICHECKLIST_EMT implements NPICHECKLIST_EMTInterface {
  "SEQ": number;
  "SITE": string;
  "PLANT": string;
  "STAGE": string;
  "PROCESS": string;
  "VERSION": string;
  "ITEMDESC": string;
  "CHECKPOINT": string;
  "CHECKFUNTIONROLE": string;
  "MUSTDO": number;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  constructor(data?: NPICHECKLIST_EMTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPICHECKLIST_EMT`.
   */
  public static getModelName() {
    return "NPICHECKLIST_EMT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPICHECKLIST_EMT for dynamic purposes.
  **/
  public static factory(data: NPICHECKLIST_EMTInterface): NPICHECKLIST_EMT{
    return new NPICHECKLIST_EMT(data);
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
      name: 'NPICHECKLIST_EMT',
      plural: 'NPICHECKLIST_EMTs',
      path: 'NPICHECKLIST_EMTs',
      idName: 'SEQ',
      properties: {
        "SEQ": {
          name: 'SEQ',
          type: 'number'
        },
        "SITE": {
          name: 'SITE',
          type: 'string'
        },
        "PLANT": {
          name: 'PLANT',
          type: 'string'
        },
        "STAGE": {
          name: 'STAGE',
          type: 'string'
        },
        "PROCESS": {
          name: 'PROCESS',
          type: 'string'
        },
        "VERSION": {
          name: 'VERSION',
          type: 'string'
        },
        "ITEMDESC": {
          name: 'ITEMDESC',
          type: 'string'
        },
        "CHECKPOINT": {
          name: 'CHECKPOINT',
          type: 'string'
        },
        "CHECKFUNTIONROLE": {
          name: 'CHECKFUNTIONROLE',
          type: 'string'
        },
        "MUSTDO": {
          name: 'MUSTDO',
          type: 'number'
        },
        "CREATEDBY": {
          name: 'CREATEDBY',
          type: 'string'
        },
        "CREATEDATE": {
          name: 'CREATEDATE',
          type: 'Date'
        },
        "UPDATEDBY": {
          name: 'UPDATEDBY',
          type: 'string'
        },
        "UPDATEDATE": {
          name: 'UPDATEDATE',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
