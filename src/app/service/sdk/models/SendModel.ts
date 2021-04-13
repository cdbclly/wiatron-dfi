/* tslint:disable */

declare var Object: any;
export interface SendModelInterface {
  "id"?: number;
}

export class SendModel implements SendModelInterface {
  "id": number;
  constructor(data?: SendModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SendModel`.
   */
  public static getModelName() {
    return "SendModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SendModel for dynamic purposes.
  **/
  public static factory(data: SendModelInterface): SendModel{
    return new SendModel(data);
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
      name: 'SendModel',
      plural: 'SendModels',
      path: 'SendModels',
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
