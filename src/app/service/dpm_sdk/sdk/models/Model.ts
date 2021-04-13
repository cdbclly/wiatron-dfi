/* tslint:disable */
import {
  ModelFamily,
  DPMYRISSUE
} from '../index';

declare var Object: any;
export interface ModelInterface {
  "id"?: string;
  "enabled"?: boolean;
  "modelFamilyId"?: string;
  modelFamily?: ModelFamily;
  fpyrIssues?: DPMYRISSUE[];
}

export class Model implements ModelInterface {
  "id": string;
  "enabled": boolean;
  "modelFamilyId": string;
  modelFamily: ModelFamily;
  fpyrIssues: DPMYRISSUE[];
  constructor(data?: ModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Model`.
   */
  public static getModelName() {
    return "Model";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Model for dynamic purposes.
  **/
  public static factory(data: ModelInterface): Model{
    return new Model(data);
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
      name: 'Model',
      plural: 'Models',
      path: 'Models',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean'
        },
        "modelFamilyId": {
          name: 'modelFamilyId',
          type: 'string'
        },
      },
      relations: {
        modelFamily: {
          name: 'modelFamily',
          type: 'ModelFamily',
          model: 'ModelFamily',
          relationType: 'belongsTo',
                  keyFrom: 'modelFamilyId',
          keyTo: 'id'
        },
        fpyrIssues: {
          name: 'fpyrIssues',
          type: 'DPMYRISSUE[]',
          model: 'DPMYRISSUE',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'model'
        },
      }
    }
  }
}
