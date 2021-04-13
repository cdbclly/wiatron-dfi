/* tslint:disable */
import {
  DesignItem
} from '../index';

declare var Object: any;
export interface RiskInterface {
  "name"?: string;
  "level"?: number;
  "maximum"?: number;
  "minimum"?: number;
  "id"?: number;
  "designItemId"?: string;
  designItem?: DesignItem;
}

export class Risk implements RiskInterface {
  "name": string;
  "level": number;
  "maximum": number;
  "minimum": number;
  "id": number;
  "designItemId": string;
  designItem: DesignItem;
  constructor(data?: RiskInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Risk`.
   */
  public static getModelName() {
    return "Risk";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Risk for dynamic purposes.
  **/
  public static factory(data: RiskInterface): Risk{
    return new Risk(data);
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
      name: 'Risk',
      plural: 'Risks',
      path: 'Risks',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "level": {
          name: 'level',
          type: 'number'
        },
        "maximum": {
          name: 'maximum',
          type: 'number'
        },
        "minimum": {
          name: 'minimum',
          type: 'number'
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
