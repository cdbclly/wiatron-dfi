/* tslint:disable */

declare var Object: any;
export interface View_ModelScheduleInterface {
  "id"?: string;
  "plant"?: string;
  "model"?: string;
  "startDate"?: string;
  "cycleTimes"?: number;
  "doneTimes"?: number;
}

export class View_ModelSchedule implements View_ModelScheduleInterface {
  "id": string;
  "plant": string;
  "model": string;
  "startDate": string;
  "cycleTimes": number;
  "doneTimes": number;
  constructor(data?: View_ModelScheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_ModelSchedule`.
   */
  public static getModelName() {
    return "View_ModelSchedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_ModelSchedule for dynamic purposes.
  **/
  public static factory(data: View_ModelScheduleInterface): View_ModelSchedule{
    return new View_ModelSchedule(data);
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
      name: 'View_ModelSchedule',
      plural: 'View_ModelSchedules',
      path: 'View_ModelSchedules',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "startDate": {
          name: 'startDate',
          type: 'string'
        },
        "cycleTimes": {
          name: 'cycleTimes',
          type: 'number'
        },
        "doneTimes": {
          name: 'doneTimes',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
