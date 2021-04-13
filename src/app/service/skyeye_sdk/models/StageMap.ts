/* tslint:disable */

declare var Object: any;
export interface StageMapInterface {
  "stageCode"?: string;
  "chineseContrast"?: string;
  "englishContrast"?: string;
  "plantCode"?: string;
  "siteCode"?: string;
  "id"?: number;
}

export class StageMap implements StageMapInterface {
  "stageCode": string;
  "chineseContrast": string;
  "englishContrast": string;
  "plantCode": string;
  "siteCode": string;
  "id": number;
  constructor(data?: StageMapInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `StageMap`.
   */
  public static getModelName() {
    return "StageMap";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of StageMap for dynamic purposes.
  **/
  public static factory(data: StageMapInterface): StageMap{
    return new StageMap(data);
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
      name: 'StageMap',
      plural: 'StageMaps',
      path: 'StageMaps',
      idName: 'id',
      properties: {
        "stageCode": {
          name: 'stageCode',
          type: 'string'
        },
        "chineseContrast": {
          name: 'chineseContrast',
          type: 'string'
        },
        "englishContrast": {
          name: 'englishContrast',
          type: 'string'
        },
        "plantCode": {
          name: 'plantCode',
          type: 'string'
        },
        "siteCode": {
          name: 'siteCode',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
