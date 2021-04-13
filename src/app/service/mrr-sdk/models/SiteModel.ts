/* tslint:disable */
import {
  Site,
  ModelResult,
  Model
} from '../index';

declare var Object: any;
export interface SiteModelInterface {
  "id"?: number;
  "siteId"?: string;
  "modelId"?: string;
  site?: Site;
  modelResults?: ModelResult[];
  model?: Model;
}

export class SiteModel implements SiteModelInterface {
  "id": number;
  "siteId": string;
  "modelId": string;
  site: Site;
  modelResults: ModelResult[];
  model: Model;
  constructor(data?: SiteModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SiteModel`.
   */
  public static getModelName() {
    return "SiteModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SiteModel for dynamic purposes.
  **/
  public static factory(data: SiteModelInterface): SiteModel{
    return new SiteModel(data);
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
      name: 'SiteModel',
      plural: 'SiteModels',
      path: 'SiteModels',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "siteId": {
          name: 'siteId',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
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
        modelResults: {
          name: 'modelResults',
          type: 'ModelResult[]',
          model: 'ModelResult',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'siteModelId'
        },
        model: {
          name: 'model',
          type: 'Model',
          model: 'Model',
          relationType: 'belongsTo',
                  keyFrom: 'modelId',
          keyTo: 'id'
        },
      }
    }
  }
}
