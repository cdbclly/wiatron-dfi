/* tslint:disable */
import {
  Fact,
  SiteModel
} from '../index';

declare var Object: any;
export interface ModelResultInterface {
  "status"?: string;
  "id"?: number;
  "siteModelId"?: number;
  facts?: Fact[];
  siteModel?: SiteModel;
}

export class ModelResult implements ModelResultInterface {
  "status": string;
  "id": number;
  "siteModelId": number;
  facts: Fact[];
  siteModel: SiteModel;
  constructor(data?: ModelResultInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelResult`.
   */
  public static getModelName() {
    return "ModelResult";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelResult for dynamic purposes.
  **/
  public static factory(data: ModelResultInterface): ModelResult{
    return new ModelResult(data);
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
      name: 'ModelResult',
      plural: 'ModelResults',
      path: 'ModelResults',
      idName: 'id',
      properties: {
        "status": {
          name: 'status',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "siteModelId": {
          name: 'siteModelId',
          type: 'number'
        },
      },
      relations: {
        facts: {
          name: 'facts',
          type: 'Fact[]',
          model: 'Fact',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'modelResultId'
        },
        siteModel: {
          name: 'siteModel',
          type: 'SiteModel',
          model: 'SiteModel',
          relationType: 'belongsTo',
                  keyFrom: 'siteModelId',
          keyTo: 'id'
        },
      }
    }
  }
}
