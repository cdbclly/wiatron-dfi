/* tslint:disable */
import {
  Section,
  Station
} from '../index';

declare var Object: any;
export interface LineInterface {
  "name"?: string;
  "id"?: number;
  "sectionId"?: number;
  section?: Section;
  stations?: Station[];
}

export class Line implements LineInterface {
  "name": string;
  "id": number;
  "sectionId": number;
  section: Section;
  stations: Station[];
  constructor(data?: LineInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Line`.
   */
  public static getModelName() {
    return "Line";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Line for dynamic purposes.
  **/
  public static factory(data: LineInterface): Line{
    return new Line(data);
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
      name: 'Line',
      plural: 'Lines',
      path: 'Lines',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "sectionId": {
          name: 'sectionId',
          type: 'number'
        },
      },
      relations: {
        section: {
          name: 'section',
          type: 'Section',
          model: 'Section',
          relationType: 'belongsTo',
                  keyFrom: 'sectionId',
          keyTo: 'id'
        },
        stations: {
          name: 'stations',
          type: 'Station[]',
          model: 'Station',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'lineId'
        },
      }
    }
  }
}
