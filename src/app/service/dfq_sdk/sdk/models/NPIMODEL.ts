/* tslint:disable */
import {
  Plant,
  NPITEAMMEMBERHEAD,
  NPICHECKLIST_EM_HEAD
} from '../index';

declare var Object: any;
export interface NPIMODELInterface {
  "SITE": string;
  "PLANT": string;
  "MODEL": string;
  "PROJECTCODE"?: string;
  "PROJECTNAME"?: string;
  "CUSTOMER"?: string;
  "BU"?: string;
  "BG"?: string;
  "SITENPI"?: string;
  "STARTSTAGE"?: string;
  "MFGLEVEL"?: number;
  "ROHSII"?: number;
  "HF"?: number;
  "HFREDUCE"?: number;
  "EAEATGOLD"?: number;
  "EPEATSILVER"?: number;
  "STATUS"?: number;
  "TRANSFERFLAG"?: number;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  "CURRENTSTAGE"?: string;
  plant?: Plant;
  nPITEAMMEMBERHEADs?: NPITEAMMEMBERHEAD;
  nPICHECKLISTEmHeads?: NPICHECKLIST_EM_HEAD[];
}

export class NPIMODEL implements NPIMODELInterface {
  "SITE": string;
  "PLANT": string;
  "MODEL": string;
  "PROJECTCODE": string;
  "PROJECTNAME": string;
  "CUSTOMER": string;
  "BU": string;
  "BG": string;
  "SITENPI": string;
  "STARTSTAGE": string;
  "MFGLEVEL": number;
  "ROHSII": number;
  "HF": number;
  "HFREDUCE": number;
  "EAEATGOLD": number;
  "EPEATSILVER": number;
  "STATUS": number;
  "TRANSFERFLAG": number;
  "CREATEDBY": string;
  "CREATEDATE": Date;
  "UPDATEDBY": string;
  "UPDATEDATE": Date;
  "CURRENTSTAGE": string;
  plant: Plant;
  nPITEAMMEMBERHEADs: NPITEAMMEMBERHEAD;
  nPICHECKLISTEmHeads: NPICHECKLIST_EM_HEAD[];
  constructor(data?: NPIMODELInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NPIMODEL`.
   */
  public static getModelName() {
    return "NPIMODEL";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NPIMODEL for dynamic purposes.
  **/
  public static factory(data: NPIMODELInterface): NPIMODEL{
    return new NPIMODEL(data);
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
      name: 'NPIMODEL',
      plural: 'NPIMODELs',
      path: 'NPIMODELs',
      idName: 'SITE',
      properties: {
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
        "PROJECTCODE": {
          name: 'PROJECTCODE',
          type: 'string'
        },
        "PROJECTNAME": {
          name: 'PROJECTNAME',
          type: 'string'
        },
        "CUSTOMER": {
          name: 'CUSTOMER',
          type: 'string'
        },
        "BU": {
          name: 'BU',
          type: 'string'
        },
        "BG": {
          name: 'BG',
          type: 'string'
        },
        "SITENPI": {
          name: 'SITENPI',
          type: 'string'
        },
        "STARTSTAGE": {
          name: 'STARTSTAGE',
          type: 'string'
        },
        "MFGLEVEL": {
          name: 'MFGLEVEL',
          type: 'number'
        },
        "ROHSII": {
          name: 'ROHSII',
          type: 'number'
        },
        "HF": {
          name: 'HF',
          type: 'number'
        },
        "HFREDUCE": {
          name: 'HFREDUCE',
          type: 'number'
        },
        "EAEATGOLD": {
          name: 'EAEATGOLD',
          type: 'number'
        },
        "EPEATSILVER": {
          name: 'EPEATSILVER',
          type: 'number'
        },
        "STATUS": {
          name: 'STATUS',
          type: 'number'
        },
        "TRANSFERFLAG": {
          name: 'TRANSFERFLAG',
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
        "CURRENTSTAGE": {
          name: 'CURRENTSTAGE',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'Plant',
          model: 'Plant',
          relationType: 'belongsTo',
                  keyFrom: 'PLANT',
          keyTo: 'id'
        },
        nPITEAMMEMBERHEADs: {
          name: 'nPITEAMMEMBERHEADs',
          type: 'NPITEAMMEMBERHEAD',
          model: 'NPITEAMMEMBERHEAD',
          relationType: 'hasOne',
                  keyFrom: 'SITE',
          keyTo: 'MODEL'
        },
        nPICHECKLISTEmHeads: {
          name: 'nPICHECKLISTEmHeads',
          type: 'NPICHECKLIST_EM_HEAD[]',
          model: 'NPICHECKLIST_EM_HEAD',
          relationType: 'hasMany',
                  keyFrom: 'SITE',
          keyTo: 'MODEL'
        },
      }
    }
  }
}
