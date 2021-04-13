/* tslint:disable */

declare var Object: any;
export interface PlantPartNumberConfigInterface {
  "plant"?: string;
  "rule"?: string;
  "id"?: number;
}

export class PlantPartNumberConfig implements PlantPartNumberConfigInterface {
  "plant": string;
  "rule": string;
  "id": number;
  constructor(data?: PlantPartNumberConfigInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlantPartNumberConfig`.
   */
  public static getModelName() {
    return "PlantPartNumberConfig";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlantPartNumberConfig for dynamic purposes.
  **/
  public static factory(data: PlantPartNumberConfigInterface): PlantPartNumberConfig{
    return new PlantPartNumberConfig(data);
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
      name: 'PlantPartNumberConfig',
      plural: 'PlantPartNumberConfigs',
      path: 'PlantPartNumberConfigs',
      idName: 'id',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "rule": {
          name: 'rule',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
