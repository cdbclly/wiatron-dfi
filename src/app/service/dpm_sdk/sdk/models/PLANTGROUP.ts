/* tslint:disable */
import {
  SITE,
  DPMKPI,
  PLANT
} from '../index';

declare var Object: any;
export interface PLANTGROUPInterface {
  "id"?: string;
  "siteid"?: string;
  "name"?: string;
  site?: SITE;
  kpis?: DPMKPI[];
  plants?: PLANT[];
}

export class PLANTGROUP implements PLANTGROUPInterface {
  "id": string;
  "siteid": string;
  "name": string;
  site: SITE;
  kpis: DPMKPI[];
  plants: PLANT[];
  constructor(data?: PLANTGROUPInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PLANTGROUP`.
   */
  public static getModelName() {
    return "PLANTGROUP";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PLANTGROUP for dynamic purposes.
  **/
  public static factory(data: PLANTGROUPInterface): PLANTGROUP{
    return new PLANTGROUP(data);
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
      name: 'PLANTGROUP',
      plural: 'PLANTGROUPS',
      path: 'PLANTGROUPS',
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
        kpis: {
          name: 'kpis',
          type: 'DPMKPI[]',
          model: 'DPMKPI',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'plantid'
        },
        plants: {
          name: 'plants',
          type: 'PLANT[]',
          model: 'PLANT',
          relationType: 'hasMany',
          modelThrough: 'PlantGroupMapping',
          keyThrough: 'plantId',
          keyFrom: 'id',
          keyTo: 'plantGroupId'
        },
      }
    }
  }
}
