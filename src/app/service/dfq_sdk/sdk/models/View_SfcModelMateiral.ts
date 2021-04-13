/* tslint:disable */

declare var Object: any;
export interface View_SfcModelMateiralInterface {
  "id"?: number;
  "plant"?: string;
  "model"?: string;
  "materialId"?: number;
  "yieldRate"?: string;
  "materialName"?: string;
}

export class View_SfcModelMateiral implements View_SfcModelMateiralInterface {
  "id": number;
  "plant": string;
  "model": string;
  "materialId": number;
  "yieldRate": string;
  "materialName": string;
  constructor(data?: View_SfcModelMateiralInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `View_SfcModelMateiral`.
   */
  public static getModelName() {
    return "View_SfcModelMateiral";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of View_SfcModelMateiral for dynamic purposes.
  **/
  public static factory(data: View_SfcModelMateiralInterface): View_SfcModelMateiral{
    return new View_SfcModelMateiral(data);
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
      name: 'View_SfcModelMateiral',
      plural: 'View_SfcModelMateirals',
      path: 'View_SfcModelMateirals',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "model": {
          name: 'model',
          type: 'string'
        },
        "materialId": {
          name: 'materialId',
          type: 'number'
        },
        "yieldRate": {
          name: 'yieldRate',
          type: 'string'
        },
        "materialName": {
          name: 'materialName',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
