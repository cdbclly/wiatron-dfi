/* tslint:disable */
import {
  Line
} from '../index';

declare var Object: any;
export interface SectionInterface {
  "name"?: string;
  "plantId"?: string;
  "id"?: number;
  lines?: Line[];
}

export class Section implements SectionInterface {
  "name": string;
  "plantId": string;
  "id": number;
  lines: Line[];
  constructor(data?: SectionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Section`.
   */
  public static getModelName() {
    return "Section";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Section for dynamic purposes.
  **/
  public static factory(data: SectionInterface): Section{
    return new Section(data);
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
      name: 'Section',
      plural: 'Sections',
      path: 'Sections',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        lines: {
          name: 'lines',
          type: 'Line[]',
          model: 'Line',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'sectionId'
        },
      }
    }
  }
}
