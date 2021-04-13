/* tslint:disable */
import {
  TestItemDetail
} from '../index';

declare var Object: any;
export interface TestItemGroupInterface {
  "id"?: number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "groupName": string;
  "chineseName": string;
  "isGroupAble"?: number;
  "updatedUser"?: string;
  "updatedTime"?: number;
  TestItemDetail?: TestItemDetail[];
}

export class TestItemGroup implements TestItemGroupInterface {
  "id": number;
  "site": string;
  "plant": string;
  "product": string;
  "customer": string;
  "model": string;
  "vendor": string;
  "productName": string;
  "partNumber": string;
  "groupName": string;
  "chineseName": string;
  "isGroupAble": number;
  "updatedUser": string;
  "updatedTime": number;
  TestItemDetail: TestItemDetail[];
  constructor(data?: TestItemGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TestItemGroup`.
   */
  public static getModelName() {
    return "TestItemGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TestItemGroup for dynamic purposes.
  **/
  public static factory(data: TestItemGroupInterface): TestItemGroup{
    return new TestItemGroup(data);
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
      name: 'TestItemGroup',
      plural: 'TestItemGroups',
      path: 'TestItemGroups',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "product": {
          name: 'product',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "vendor": {
          name: 'vendor',
          type: 'string'
        },
        "productName": {
          name: 'productName',
          type: 'string'
        },
        "partNumber": {
          name: 'partNumber',
          type: 'string'
        },
        "groupName": {
          name: 'groupName',
          type: 'string'
        },
        "chineseName": {
          name: 'chineseName',
          type: 'string'
        },
        "isGroupAble": {
          name: 'isGroupAble',
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
        TestItemDetail: {
          name: 'TestItemDetail',
          type: 'TestItemDetail[]',
          model: 'TestItemDetail',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'groupId'
        },
      }
    }
  }
}
