/* tslint:disable */

declare var Object: any;
export interface ModelScheduleInterface {
  "modelId"?: string;
  "plant"?: string;
  "isGain"?: boolean;
  "cycleTimes"?: number;
  "frequency"?: number;
  "doneTimes"?: number;
  "id"?: number;
}

export class ModelSchedule implements ModelScheduleInterface {
  "modelId": string;
  "plant": string;
  "isGain": boolean;
  "cycleTimes": number;
  "frequency": number;
  "doneTimes": number;
  "id": number;
  constructor(data?: ModelScheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ModelSchedule`.
   */
  public static getModelName() {
    return "ModelSchedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ModelSchedule for dynamic purposes.
  **/
  public static factory(data: ModelScheduleInterface): ModelSchedule{
    return new ModelSchedule(data);
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
      name: 'ModelSchedule',
      plural: 'ModelSchedules',
      path: 'ModelSchedules',
      idName: 'id',
      properties: {
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "isGain": {
          name: 'isGain',
          type: 'boolean'
        },
        "cycleTimes": {
          name: 'cycleTimes',
          type: 'number'
        },
        "frequency": {
          name: 'frequency',
          type: 'number'
        },
        "doneTimes": {
          name: 'doneTimes',
          type: 'number'
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
