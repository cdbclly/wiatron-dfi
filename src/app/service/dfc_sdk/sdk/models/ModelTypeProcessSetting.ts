/* tslint:disable */

declare var Object: any;
export interface ModelTypeProcessSettingInterface {
  "plant": string;
  "modelType": string;
  "processCode": string;
  "id"?: number;
}

export class ModelTypeProcessSetting implements ModelTypeProcessSettingInterface {
  "plant": string;
  "modelType": string;
  "processCode": string;
  "id": number;
  constructor(data?: ModelTypeProcessSettingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelTypeProcessSetting`.
   */
  public static getModelName() {
    return "ModelTypeProcessSetting";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelTypeProcessSetting for dynamic purposes.
  **/
  public static factory(data: ModelTypeProcessSettingInterface): ModelTypeProcessSetting{
    return new ModelTypeProcessSetting(data);
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
      name: 'ModelTypeProcessSetting',
      plural: 'ModelTypeProcessSettings',
      path: 'ModelTypeProcessSettings',
      idName: 'id',
      properties: {
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "modelType": {
          name: 'modelType',
          type: 'string'
        },
        "processCode": {
          name: 'processCode',
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
