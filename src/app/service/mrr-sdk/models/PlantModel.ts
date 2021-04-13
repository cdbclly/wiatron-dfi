/* tslint:disable */
import {
  Plant,
  Model
} from '../index';

declare var Object: any;
export interface PlantModelInterface {
  "id"?: number;
  "plantId"?: string;
  "modelId"?: string;
  plant?: Plant;
  model?: Model;
}

export class PlantModel implements PlantModelInterface {
  "id": number;
  "plantId": string;
  "modelId": string;
  plant: Plant;
  model: Model;
  constructor(data?: PlantModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlantModel`.
   */
  public static getModelName() {
    return "PlantModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlantModel for dynamic purposes.
  **/
  public static factory(data: PlantModelInterface): PlantModel{
    return new PlantModel(data);
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
      name: 'PlantModel',
      plural: 'PlantModels',
      path: 'PlantModels',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'Plant',
          model: 'Plant',
          relationType: 'belongsTo',
                  keyFrom: 'plantId',
          keyTo: 'id'
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
