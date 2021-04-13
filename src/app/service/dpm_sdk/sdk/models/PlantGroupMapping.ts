/* tslint:disable */
import {
  PLANT,
  PLANTGROUP
} from '../index';

declare var Object: any;
export interface PlantGroupMappingInterface {
  "id"?: number;
  "plantId"?: string;
  "plantGroupId"?: string;
  plant?: PLANT;
  plantGroup?: PLANTGROUP;
}

export class PlantGroupMapping implements PlantGroupMappingInterface {
  "id": number;
  "plantId": string;
  "plantGroupId": string;
  plant: PLANT;
  plantGroup: PLANTGROUP;
  constructor(data?: PlantGroupMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlantGroupMapping`.
   */
  public static getModelName() {
    return "PlantGroupMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlantGroupMapping for dynamic purposes.
  **/
  public static factory(data: PlantGroupMappingInterface): PlantGroupMapping{
    return new PlantGroupMapping(data);
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
      name: 'PlantGroupMapping',
      plural: 'PlantGroupMappings',
      path: 'PlantGroupMappings',
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
        "plantGroupId": {
          name: 'plantGroupId',
          type: 'string'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'PLANT',
          model: 'PLANT',
          relationType: 'belongsTo',
                  keyFrom: 'plantId',
          keyTo: 'id'
        },
        plantGroup: {
          name: 'plantGroup',
          type: 'PLANTGROUP',
          model: 'PLANTGROUP',
          relationType: 'belongsTo',
                  keyFrom: 'plantGroupId',
          keyTo: 'id'
        },
      }
    }
  }
}
