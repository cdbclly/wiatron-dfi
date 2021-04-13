/* tslint:disable */
import {
  FactoryRecord
} from '../index';

declare var Object: any;
export interface NuddItemInterface {
  "id"?: number;
  "factoryRecordId": number;
  "designItemId": string;
  "report"?: string;
  factoryRecord?: FactoryRecord;
}

export class NuddItem implements NuddItemInterface {
  "id": number;
  "factoryRecordId": number;
  "designItemId": string;
  "report": string;
  factoryRecord: FactoryRecord;
  constructor(data?: NuddItemInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NuddItem`.
   */
  public static getModelName() {
    return "NuddItem";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NuddItem for dynamic purposes.
  **/
  public static factory(data: NuddItemInterface): NuddItem{
    return new NuddItem(data);
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
      name: 'NuddItem',
      plural: 'NuddItems',
      path: 'NuddItems',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "factoryRecordId": {
          name: 'factoryRecordId',
          type: 'number'
        },
        "designItemId": {
          name: 'designItemId',
          type: 'string'
        },
        "report": {
          name: 'report',
          type: 'string'
        },
      },
      relations: {
        factoryRecord: {
          name: 'factoryRecord',
          type: 'FactoryRecord',
          model: 'FactoryRecord',
          relationType: 'belongsTo',
                  keyFrom: 'factoryRecordId',
          keyTo: 'id'
        },
      }
    }
  }
}
