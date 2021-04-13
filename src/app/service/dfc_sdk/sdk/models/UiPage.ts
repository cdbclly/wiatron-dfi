/* tslint:disable */

declare var Object: any;
export interface UiPageInterface {
  "id"?: number;
}

export class UiPage implements UiPageInterface {
  "id": number;
  constructor(data?: UiPageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UiPage`.
   */
  public static getModelName() {
    return "UiPage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UiPage for dynamic purposes.
  **/
  public static factory(data: UiPageInterface): UiPage{
    return new UiPage(data);
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
      name: 'UiPage',
      plural: 'UiPages',
      path: 'UiPages',
      idName: 'id',
      properties: {
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
