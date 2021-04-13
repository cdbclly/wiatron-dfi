/* tslint:disable */
import {
  Line
} from '../index';

declare var Object: any;
export interface StationInterface {
  "id"?: string;
  "type"?: string;
  "name"?: string;
  "stationSort"?: string;
  "lineId"?: number;
  line?: Line;
}

export class Station implements StationInterface {
  "id": string;
  "type": string;
  "name": string;
  "stationSort": string;
  "lineId": number;
  line: Line;
  constructor(data?: StationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Station`.
   */
  public static getModelName() {
    return "Station";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Station for dynamic purposes.
  **/
  public static factory(data: StationInterface): Station{
    return new Station(data);
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
      name: 'Station',
      plural: 'Stations',
      path: 'Stations',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "stationSort": {
          name: 'stationSort',
          type: 'string'
        },
        "lineId": {
          name: 'lineId',
          type: 'number'
        },
      },
      relations: {
        line: {
          name: 'line',
          type: 'Line',
          model: 'Line',
          relationType: 'belongsTo',
                  keyFrom: 'lineId',
          keyTo: 'id'
        },
      }
    }
  }
}
