/* tslint:disable */

declare var Object: any;
export interface TestItemMapInterface {
  "no"?: number;
  "testItemName"?: string;
  "subTestItemName"?: string;
  "chineseContrast"?: string;
  "plantCode"?: string;
  "siteCode"?: string;
  "id"?: number;
}

export class TestItemMap implements TestItemMapInterface {
  "no": number;
  "testItemName": string;
  "subTestItemName": string;
  "chineseContrast": string;
  "plantCode": string;
  "siteCode": string;
  "id": number;
  constructor(data?: TestItemMapInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TestItemMap`.
   */
  public static getModelName() {
    return "TestItemMap";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TestItemMap for dynamic purposes.
  **/
  public static factory(data: TestItemMapInterface): TestItemMap{
    return new TestItemMap(data);
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
      name: 'TestItemMap',
      plural: 'TestItemMaps',
      path: 'TestItemMaps',
      idName: 'id',
      properties: {
        "no": {
          name: 'no',
          type: 'number'
        },
        "testItemName": {
          name: 'testItemName',
          type: 'string'
        },
        "subTestItemName": {
          name: 'subTestItemName',
          type: 'string'
        },
        "chineseContrast": {
          name: 'chineseContrast',
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
