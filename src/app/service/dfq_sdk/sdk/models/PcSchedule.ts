/* tslint:disable */

declare var Object: any;
export interface PcScheduleInterface {
  "id": string;
  "process"?: string;
  "date"?: Date;
  "line"?: string;
  "plant"?: string;
  "model"?: string;
  "planQty"?: number;
  "uploadDate"?: Date;
  "uploadBy"?: string;
}

export class PcSchedule implements PcScheduleInterface {
  "id": string;
  "process": string;
  "date": Date;
  "line": string;
  "plant": string;
  "model": string;
  "planQty": number;
  "uploadDate": Date;
  "uploadBy": string;
  constructor(data?: PcScheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PcSchedule`.
   */
  public static getModelName() {
    return "PcSchedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PcSchedule for dynamic purposes.
  **/
  public static factory(data: PcScheduleInterface): PcSchedule{
    return new PcSchedule(data);
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
      name: 'PcSchedule',
      plural: 'PcSchedules',
      path: 'PcSchedules',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "process": {
          name: 'process',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "line": {
          name: 'line',
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
        "planQty": {
          name: 'planQty',
          type: 'number'
        },
        "uploadDate": {
          name: 'uploadDate',
          type: 'Date'
        },
        "uploadBy": {
          name: 'uploadBy',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
