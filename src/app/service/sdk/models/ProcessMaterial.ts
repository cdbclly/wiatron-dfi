/* tslint:disable */

import { Process, Material } from "@service/dfc_sdk/sdk";

declare var Object: any;
export interface ProcessMaterialInterface {
  "id"?: number;
  "processId"?: number;
  "materialId"?: number;
  process?: Process;
  material?: Material;
}

export class ProcessMaterial implements ProcessMaterialInterface {
  "id": number;
  "processId": number;
  "materialId": number;
  process: Process;
  material: Material;
  constructor(data?: ProcessMaterialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProcessMaterial`.
   */
  public static getModelName() {
    return "ProcessMaterial";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProcessMaterial for dynamic purposes.
  **/
  public static factory(data: ProcessMaterialInterface): ProcessMaterial{
    return new ProcessMaterial(data);
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
      name: 'ProcessMaterial',
      plural: 'ProcessMaterials',
      path: 'ProcessMaterials',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "processId": {
          name: 'processId',
          type: 'number'
        },
        "materialId": {
          name: 'materialId',
          type: 'number'
        },
      },
      relations: {
        process: {
          name: 'process',
          type: 'Process',
          model: 'Process',
          relationType: 'belongsTo',
                  keyFrom: 'processId',
          keyTo: 'id'
        },
        material: {
          name: 'material',
          type: 'Material',
          model: 'Material',
          relationType: 'belongsTo',
                  keyFrom: 'materialId',
          keyTo: 'id'
        },
      }
    }
  }
}
