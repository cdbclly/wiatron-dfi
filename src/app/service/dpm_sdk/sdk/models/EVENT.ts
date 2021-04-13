/* tslint:disable */
import {
  PLANT
} from '../index';

declare var Object: any;
export interface EVENTInterface {
  "plantid"?: string;
  "date"?: string;
  "description"?: string;
  "type"?: number;
  "isregular"?: boolean;
  "id"?: number;
  plant?: PLANT;
}

export class EVENT implements EVENTInterface {
  "plantid": string;
  "date": string;
  "description": string;
  "type": number;
  "isregular": boolean;
  "id": number;
  plant: PLANT;
  constructor(data?: EVENTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EVENT`.
   */
  public static getModelName() {
    return "EVENT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EVENT for dynamic purposes.
  **/
  public static factory(data: EVENTInterface): EVENT{
    return new EVENT(data);
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
      name: 'EVENT',
      plural: 'EVENTS',
      path: 'EVENTS',
      idName: 'id',
      properties: {
        "plantid": {
          name: 'plantid',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'number'
        },
        "isregular": {
          name: 'isregular',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        plant: {
          name: 'plant',
          type: 'PLANT',
          model: 'PLANT',
          relationType: 'belongsTo',
                  keyFrom: 'plantid',
          keyTo: 'id'
        },
      }
    }
  }
}
