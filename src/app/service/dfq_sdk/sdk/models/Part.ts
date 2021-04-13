/* tslint:disable */

declare var Object: any;
export interface PartInterface {
  "partId"?: string;
  "workflowId"?: number;
  "productId"?: string;
  "plantId"?: string;
  "defectNum"?: number;
  "total"?: number;
  "modifiedBy"?: string;
  "modified"?: Date;
  "id"?: number;
}

export class Part implements PartInterface {
  "partId": string;
  "workflowId": number;
  "productId": string;
  "plantId": string;
  "defectNum": number;
  "total": number;
  "modifiedBy": string;
  "modified": Date;
  "id": number;
  constructor(data?: PartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Part`.
   */
  public static getModelName() {
    return "Part";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Part for dynamic purposes.
  **/
  public static factory(data: PartInterface): Part{
    return new Part(data);
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
      name: 'Part',
      plural: 'Parts',
      path: 'Parts',
      idName: 'id',
      properties: {
        "partId": {
          name: 'partId',
          type: 'string'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "plantId": {
          name: 'plantId',
          type: 'string'
        },
        "defectNum": {
          name: 'defectNum',
          type: 'number'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "modifiedBy": {
          name: 'modifiedBy',
          type: 'string'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
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
