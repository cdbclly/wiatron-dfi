/* tslint:disable */
import {
  PLANT,
  PLANTGROUP
} from '../index';

declare var Object: any;
export interface SITEInterface {
  "id": string;
  plant?: PLANT[];
  plantGroup?: PLANTGROUP[];
}

export class SITE implements SITEInterface {
  "id": string;
  plant: PLANT[];
  plantGroup: PLANTGROUP[];
  constructor(data?: SITEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SITE`.
   */
  public static getModelName() {
    return "SITE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SITE for dynamic purposes.
  **/
  public static factory(data: SITEInterface): SITE{
    return new SITE(data);
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
      name: 'SITE',
      plural: 'SITES',
      path: 'SITES',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'PLANT[]',
          model: 'PLANT',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'siteid'
        },
        plantGroup: {
          name: 'plantGroup',
          type: 'PLANTGROUP[]',
          model: 'PLANTGROUP',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'siteid'
        },
      }
    }
  }
}
