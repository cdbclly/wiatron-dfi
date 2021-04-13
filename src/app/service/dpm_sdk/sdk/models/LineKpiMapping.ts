/* tslint:disable */
import {
  LINE,
  DPMKPI
} from '../index';

declare var Object: any;
export interface LineKpiMappingInterface {
  "id"?: number;
  "lineId"?: number;
  "kpiId"?: number;
  line?: LINE;
  kpi?: DPMKPI;
}

export class LineKpiMapping implements LineKpiMappingInterface {
  "id": number;
  "lineId": number;
  "kpiId": number;
  line: LINE;
  kpi: DPMKPI;
  constructor(data?: LineKpiMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `LineKpiMapping`.
   */
  public static getModelName() {
    return "LineKpiMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of LineKpiMapping for dynamic purposes.
  **/
  public static factory(data: LineKpiMappingInterface): LineKpiMapping{
    return new LineKpiMapping(data);
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
      name: 'LineKpiMapping',
      plural: 'LineKpiMappings',
      path: 'LineKpiMappings',
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
        "kpiId": {
          name: 'kpiId',
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
        kpi: {
          name: 'kpi',
          type: 'DPMKPI',
          model: 'DPMKPI',
          relationType: 'belongsTo',
                  keyFrom: 'kpiId',
          keyTo: 'id'
        },
      }
    }
  }
}
