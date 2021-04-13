/* tslint:disable */

declare var Object: any;
export interface ModelTypeMappingInterface {
  "ModelType": string;
}

export class ModelTypeMapping implements ModelTypeMappingInterface {
  "ModelType": string;
  constructor(data?: ModelTypeMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelTypeMapping`.
   */
  public static getModelName() {
    return "ModelTypeMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelTypeMapping for dynamic purposes.
  **/
  public static factory(data: ModelTypeMappingInterface): ModelTypeMapping{
    return new ModelTypeMapping(data);
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
      name: 'ModelTypeMapping',
      plural: 'ModelTypeMappings',
      path: 'ModelTypeMappings',
      idName: 'ModelType',
      properties: {
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
