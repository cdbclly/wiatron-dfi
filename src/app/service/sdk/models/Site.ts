/* tslint:disable */
import {
  Plant
} from '../index';

declare var Object: any;
export interface SiteInterface {
  "id"?: string;
  plants?: Plant[];
}

export class Site implements SiteInterface {
  "id": string;
  plants: Plant[];
  constructor(data?: SiteInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Site`.
   */
  public static getModelName() {
    return "Site";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Site for dynamic purposes.
  **/
  public static factory(data: SiteInterface): Site{
    return new Site(data);
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
      name: 'Site',
      plural: 'Sites',
      path: 'Sites',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        plants: {
          name: 'plants',
          type: 'Plant[]',
          model: 'Plant',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'siteId'
        },
      }
    }
  }
}
