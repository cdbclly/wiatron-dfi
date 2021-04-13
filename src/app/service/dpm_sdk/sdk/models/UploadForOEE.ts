/* tslint:disable */

declare var Object: any;
export interface UploadForOEEInterface {
  "id"?: number;
}

export class UploadForOEE implements UploadForOEEInterface {
  "id": number;
  constructor(data?: UploadForOEEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UploadForOEE`.
   */
  public static getModelName() {
    return "UploadForOEE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UploadForOEE for dynamic purposes.
  **/
  public static factory(data: UploadForOEEInterface): UploadForOEE{
    return new UploadForOEE(data);
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
      name: 'UploadForOEE',
      plural: 'UploadForOEEs',
      path: 'UploadForOEEs',
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
