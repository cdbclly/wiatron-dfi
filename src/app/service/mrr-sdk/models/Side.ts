/* tslint:disable */
import {
  DesignItem,
  Point
} from '../index';

declare var Object: any;
export interface SideInterface {
  "name"?: string;
  "code"?: string;
  "enabled"?: boolean;
  "id"?: number;
  "designItemId"?: string;
  designItem?: DesignItem;
  points?: Point[];
}

export class Side implements SideInterface {
  "name": string;
  "code": string;
  "enabled": boolean;
  "id": number;
  "designItemId": string;
  designItem: DesignItem;
  points: Point[];
  constructor(data?: SideInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Side`.
   */
  public static getModelName() {
    return "Side";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Side for dynamic purposes.
  **/
  public static factory(data: SideInterface): Side{
    return new Side(data);
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
      name: 'Side',
      plural: 'Sides',
      path: 'Sides',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "code": {
          name: 'code',
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
        points: {
          name: 'points',
          type: 'Point[]',
          model: 'Point',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'sideId'
        },
      }
    }
  }
}
