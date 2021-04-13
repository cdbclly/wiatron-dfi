/* tslint:disable */
import {
  ModelMaterial
} from '../index';

declare var Object: any;
export interface DiscussionInterface {
  "pic"?: string;
  "desc"?: string;
  "duedate"?: string;
  "status"?: number;
  "updatedOn"?: Date;
  "id"?: number;
  "modelMaterialId"?: number;
  modelMaterial?: ModelMaterial;
}

export class Discussion implements DiscussionInterface {
  "pic": string;
  "desc": string;
  "duedate": string;
  "status": number;
  "updatedOn": Date;
  "id": number;
  "modelMaterialId": number;
  modelMaterial: ModelMaterial;
  constructor(data?: DiscussionInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Discussion`.
   */
  public static getModelName() {
    return "Discussion";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Discussion for dynamic purposes.
  **/
  public static factory(data: DiscussionInterface): Discussion{
    return new Discussion(data);
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
      name: 'Discussion',
      plural: 'Discussions',
      path: 'Discussions',
      idName: 'id',
      properties: {
        "pic": {
          name: 'pic',
          type: 'string'
        },
        "desc": {
          name: 'desc',
          type: 'string'
        },
        "duedate": {
          name: 'duedate',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelMaterialId": {
          name: 'modelMaterialId',
          type: 'number'
        },
      },
      relations: {
        modelMaterial: {
          name: 'modelMaterial',
          type: 'ModelMaterial',
          model: 'ModelMaterial',
          relationType: 'belongsTo',
                  keyFrom: 'modelMaterialId',
          keyTo: 'id'
        },
      }
    }
  }
}
