/* tslint:disable */
import {
  DesignItem,
  Dimension
} from '../index';

declare var Object: any;
export interface ProcessTypeInterface {
  "name"?: string;
  "enabled"?: boolean;
  "id"?: number;
  "dimensionId"?: number;
  designItems?: DesignItem[];
  dimension?: Dimension;
}

export class ProcessType implements ProcessTypeInterface {
  "name": string;
  "enabled": boolean;
  "id": number;
  "dimensionId": number;
  designItems: DesignItem[];
  dimension: Dimension;
  constructor(data?: ProcessTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProcessType`.
   */
  public static getModelName() {
    return "ProcessType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProcessType for dynamic purposes.
  **/
  public static factory(data: ProcessTypeInterface): ProcessType{
    return new ProcessType(data);
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
      name: 'ProcessType',
      plural: 'ProcessTypes',
      path: 'ProcessTypes',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "enabled": {
          name: 'enabled',
          type: 'boolean',
          default: true
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "dimensionId": {
          name: 'dimensionId',
          type: 'number'
        },
      },
      relations: {
        designItems: {
          name: 'designItems',
          type: 'DesignItem[]',
          model: 'DesignItem',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'processTypeId'
        },
        dimension: {
          name: 'dimension',
          type: 'Dimension',
          model: 'Dimension',
          relationType: 'belongsTo',
                  keyFrom: 'dimensionId',
          keyTo: 'id'
        },
      }
    }
  }
}
