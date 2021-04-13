/* tslint:disable */

declare var Object: any;
export interface FactoryMatYrRankByMfgDateInterface {
  "plantId"?: string;
  "projectCode"?: string;
  "projectName"?: string;
  "materialId"?: string;
  "manufactureDate"?: Date;
  "rank"?: number;
  "yieldRate"?: number;
  "target"?: number;
  "status"?: boolean;
}

export class FactoryMatYrRankByMfgDate implements FactoryMatYrRankByMfgDateInterface {
  "plantId": string;
  "projectCode": string;
  "projectName": string;
  "materialId": string;
  "manufactureDate": Date;
  "rank": number;
  "yieldRate": number;
  "target": number;
  "status": boolean;
  constructor(data?: FactoryMatYrRankByMfgDateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactoryMatYrRankByMfgDate`.
   */
  public static getModelName() {
    return "FactoryMatYrRankByMfgDate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactoryMatYrRankByMfgDate for dynamic purposes.
  **/
  public static factory(data: FactoryMatYrRankByMfgDateInterface): FactoryMatYrRankByMfgDate{
    return new FactoryMatYrRankByMfgDate(data);
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
      name: 'FactoryMatYrRankByMfgDate',
      plural: 'FactoryMatYrRankByMfgDates',
      path: 'FactoryMatYrRankByMfgDates',
      idName: 'plantId',
      properties: {
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "projectCode": {
          name: 'projectCode',
          type: 'string'
        },
        "projectName": {
          name: 'projectName',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'string'
        },
        "manufactureDate": {
          name: 'manufactureDate',
          type: 'Date'
        },
        "rank": {
          name: 'rank',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'number'
        },
        "target": {
          name: 'target',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'boolean'
        },
      },
      relations: {
      }
    }
  }
}
