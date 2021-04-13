/* tslint:disable */
import {
  LINE,
  LINEGROUP
} from '../index';

declare var Object: any;
export interface LineGroupMappingInterface {
  "id"?: number;
  "lineId"?: number;
  "groupId"?: number;
  line?: LINE;
  group?: LINEGROUP;
}

export class LineGroupMapping implements LineGroupMappingInterface {
  "id": number;
  "lineId": number;
  "groupId": number;
  line: LINE;
  group: LINEGROUP;
  constructor(data?: LineGroupMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LineGroupMapping`.
   */
  public static getModelName() {
    return "LineGroupMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LineGroupMapping for dynamic purposes.
  **/
  public static factory(data: LineGroupMappingInterface): LineGroupMapping{
    return new LineGroupMapping(data);
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
      name: 'LineGroupMapping',
      plural: 'LineGroupMappings',
      path: 'LineGroupMappings',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "lineId": {
          name: 'lineId',
          type: 'number'
        },
        "groupId": {
          name: 'groupId',
          type: 'number'
        },
      },
      relations: {
        line: {
          name: 'line',
          type: 'LINE',
          model: 'LINE',
          relationType: 'belongsTo',
                  keyFrom: 'lineId',
          keyTo: 'id'
        },
        group: {
          name: 'group',
          type: 'LINEGROUP',
          model: 'LINEGROUP',
          relationType: 'belongsTo',
                  keyFrom: 'groupId',
          keyTo: 'id'
        },
      }
    }
  }
}
