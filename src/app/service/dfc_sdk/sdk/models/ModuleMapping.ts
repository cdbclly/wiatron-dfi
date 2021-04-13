/* tslint:disable */

declare var Object: any;
export interface ModuleMappingInterface {
  "ID"?: number;
  "ModelType"?: string;
  "Module"?: string;
  "FactorDetailID"?: number;
}

export class ModuleMapping implements ModuleMappingInterface {
  "ID": number;
  "ModelType": string;
  "Module": string;
  "FactorDetailID": number;
  constructor(data?: ModuleMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModuleMapping`.
   */
  public static getModelName() {
    return "ModuleMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModuleMapping for dynamic purposes.
  **/
  public static factory(data: ModuleMappingInterface): ModuleMapping{
    return new ModuleMapping(data);
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
      name: 'ModuleMapping',
      plural: 'ModuleMappings',
      path: 'ModuleMappings',
      idName: 'ID',
      properties: {
        "ID": {
          name: 'ID',
          type: 'number'
        },
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
        "Module": {
          name: 'Module',
          type: 'string'
        },
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
