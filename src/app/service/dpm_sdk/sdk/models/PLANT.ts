/* tslint:disable */
import {
  SITE,
  LINE,
  DPMKPIMFG,
  DPMKPI,
  PLANTGROUP,
  EVENT
} from '../index';

declare var Object: any;
export interface PLANTInterface {
  "id"?: string;
  "siteid"?: string;
  "name"?: string;
  site?: SITE;
  line?: LINE[];
  mfgtype?: DPMKPIMFG[];
  kpis?: DPMKPI[];
  plantGroups?: PLANTGROUP[];
  events?: EVENT[];
}

export class PLANT implements PLANTInterface {
  "id": string;
  "siteid": string;
  "name": string;
  site: SITE;
  line: LINE[];
  mfgtype: DPMKPIMFG[];
  kpis: DPMKPI[];
  plantGroups: PLANTGROUP[];
  events: EVENT[];
  constructor(data?: PLANTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PLANT`.
   */
  public static getModelName() {
    return "PLANT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PLANT for dynamic purposes.
  **/
  public static factory(data: PLANTInterface): PLANT{
    return new PLANT(data);
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
      name: 'PLANT',
      plural: 'PLANTS',
      path: 'PLANTS',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "siteid": {
          name: 'siteid',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
      },
      relations: {
        site: {
          name: 'site',
          type: 'SITE',
          model: 'SITE',
          relationType: 'belongsTo',
                  keyFrom: 'siteid',
          keyTo: 'id'
        },
        line: {
          name: 'line',
          type: 'LINE[]',
          model: 'LINE',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'plant'
        },
        mfgtype: {
          name: 'mfgtype',
          type: 'DPMKPIMFG[]',
          model: 'DPMKPIMFG',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'plantid'
        },
        kpis: {
          name: 'kpis',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'plantid'
        },
        plantGroups: {
          name: 'plantGroups',
          type: 'PLANTGROUP[]',
          model: 'PLANTGROUP',
          relationType: 'hasMany',
          modelThrough: 'PlantGroupMapping',
          keyThrough: 'plantGroupId',
          keyFrom: 'id',
          keyTo: 'plantId'
        },
        events: {
          name: 'events',
          type: 'EVENT[]',
          model: 'EVENT',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'plantid'
        },
      }
    }
  }
}
