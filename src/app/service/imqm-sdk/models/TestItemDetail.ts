/* tslint:disable */

declare var Object: any;
export interface TestItemDetailInterface {
  "id"?: number;
  "groupId"?: number;
  "itemName": string;
  "isAble"?: number;
  "isCpkAble"?: number;
  "isSpcAble"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
}

export class TestItemDetail implements TestItemDetailInterface {
  "id": number;
  "groupId": number;
  "itemName": string;
  "isAble": number;
  "isCpkAble": number;
  "isSpcAble": number;
  "updatedUser": string;
  "updatedTime": number;
  constructor(data?: TestItemDetailInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TestItemDetail`.
   */
  public static getModelName() {
    return "TestItemDetail";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TestItemDetail for dynamic purposes.
  **/
  public static factory(data: TestItemDetailInterface): TestItemDetail{
    return new TestItemDetail(data);
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
      name: 'TestItemDetail',
      plural: 'TestItemDetails',
      path: 'TestItemDetails',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "groupId": {
          name: 'groupId',
          type: 'number'
        },
        "itemName": {
          name: 'itemName',
          type: 'string'
        },
        "isAble": {
          name: 'isAble',
          type: 'number'
        },
        "isCpkAble": {
          name: 'isCpkAble',
          type: 'number'
        },
        "isSpcAble": {
          name: 'isSpcAble',
          type: 'number'
        },
        "updatedUser": {
          name: 'updatedUser',
          type: 'string'
        },
        "updatedTime": {
          name: 'updatedTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
