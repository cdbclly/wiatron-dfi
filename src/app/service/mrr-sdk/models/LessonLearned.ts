/* tslint:disable */
import {
  DesignItem
} from '../index';

declare var Object: any;
export interface LessonLearnedInterface {
  "year"?: string;
  "fileName"?: string;
  "path"?: string;
  "id"?: number;
  "designItemId"?: string;
  designItem?: DesignItem;
}

export class LessonLearned implements LessonLearnedInterface {
  "year": string;
  "fileName": string;
  "path": string;
  "id": number;
  "designItemId": string;
  designItem: DesignItem;
  constructor(data?: LessonLearnedInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LessonLearned`.
   */
  public static getModelName() {
    return "LessonLearned";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LessonLearned for dynamic purposes.
  **/
  public static factory(data: LessonLearnedInterface): LessonLearned{
    return new LessonLearned(data);
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
      name: 'LessonLearned',
      plural: 'LessonLearneds',
      path: 'LessonLearneds',
      idName: 'id',
      properties: {
        "year": {
          name: 'year',
          type: 'string'
        },
        "fileName": {
          name: 'fileName',
          type: 'string'
        },
        "path": {
          name: 'path',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "designItemId": {
          name: 'designItemId',
          type: 'string'
        },
      },
      relations: {
        designItem: {
          name: 'designItem',
          type: 'DesignItem',
          model: 'DesignItem',
          relationType: 'belongsTo',
                  keyFrom: 'designItemId',
          keyTo: 'id'
        },
      }
    }
  }
}
