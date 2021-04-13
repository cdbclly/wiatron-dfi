import { Side } from '@service/mrr-sdk';

/* tslint:disable */
declare var Object: any;
export interface PointInterface {
  "name"?: string;
  "enabled"?: boolean;
  "id"?: number;
  "sideId"?: number;
  side?: Side;
}

export class Point implements PointInterface {
  "name": string;
  "enabled": boolean;
  "id": number;
  "sideId": number;
  side: Side;
  constructor(data?: PointInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Point`.
   */
  public static getModelName() {
    return "Point";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Point for dynamic purposes.
  **/
  public static factory(data: PointInterface): Point{
    return new Point(data);
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
      name: 'Point',
      plural: 'Points',
      path: 'Points',
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
        "sideId": {
          name: 'sideId',
          type: 'number'
        },
      },
      relations: {
        side: {
          name: 'side',
          type: 'Side',
          model: 'Side',
          relationType: 'belongsTo',
                  keyFrom: 'sideId',
          keyTo: 'id'
        },
      }
    }
  }
}
