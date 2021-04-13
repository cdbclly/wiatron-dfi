/* tslint:disable */
import {
  Site
} from '../index';

declare var Object: any;
export interface PlantInterface {
  "id": string;
  "name"?: string;
  "siteId"?: string;
  site?: Site;
}

export class Plant implements PlantInterface {
  "id": string;
  "name": string;
  "siteId": string;
  site: Site;
  constructor(data?: PlantInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Plant`.
   */
  public static getModelName() {
    return "Plant";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Plant for dynamic purposes.
  **/
  public static factory(data: PlantInterface): Plant{
    return new Plant(data);
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
      name: 'Plant',
      plural: 'Plants',
      path: 'Plants',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "siteId": {
          name: 'siteId',
          type: 'string'
        },
      },
      relations: {
        site: {
          name: 'site',
          type: 'Site',
          model: 'Site',
          relationType: 'belongsTo',
                  keyFrom: 'siteId',
          keyTo: 'id'
        },
      }
    }
  }
}
