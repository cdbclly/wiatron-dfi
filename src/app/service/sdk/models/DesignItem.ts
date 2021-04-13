/* tslint:disable */
import { Side, Risk, ProcessType, LessonLearned } from '@service/mrr-sdk';

declare var Object: any;
export interface DesignItemInterface {
  "id": string;
  "name"?: string;
  "picturePath"?: string;
  "enabled"?: boolean;
  "isFactNumeric"?: boolean;
  "processTypeId"?: number;
  sides?: Side[];
  risks?: Risk[];
  processType?: ProcessType;
  lessonLearneds?: LessonLearned[];
}

export class DesignItem implements DesignItemInterface {
  "id": string;
  "name": string;
  "picturePath": string;
  "enabled": boolean;
  "isFactNumeric": boolean;
  "processTypeId": number;
  sides: Side[];
  risks: Risk[];
  processType: ProcessType;
  lessonLearneds: LessonLearned[];
  constructor(data?: DesignItemInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DesignItem`.
   */
  public static getModelName() {
    return "DesignItem";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DesignItem for dynamic purposes.
  **/
  public static factory(data: DesignItemInterface): DesignItem{
    return new DesignItem(data);
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
      name: 'DesignItem',
      plural: 'DesignItems',
      path: 'DesignItems',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "picturePath": {
          name: 'picturePath',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean',
          default: true
        },
        "isFactNumeric": {
          name: 'isFactNumeric',
          type: 'boolean'
        },
        "processTypeId": {
          name: 'processTypeId',
          type: 'number'
        },
      },
      relations: {
        sides: {
          name: 'sides',
          type: 'Side[]',
          model: 'Side',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'designItemId'
        },
        risks: {
          name: 'risks',
          type: 'Risk[]',
          model: 'Risk',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'designItemId'
        },
        processType: {
          name: 'processType',
          type: 'ProcessType',
          model: 'ProcessType',
          relationType: 'belongsTo',
                  keyFrom: 'processTypeId',
          keyTo: 'id'
        },
        lessonLearneds: {
          name: 'lessonLearneds',
          type: 'LessonLearned[]',
          model: 'LessonLearned',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'designItemId'
        },
      }
    }
  }
}
