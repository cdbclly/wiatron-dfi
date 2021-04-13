/* tslint:disable */

declare var Object: any;
export interface UploadForOFFLINEInterface {
  "id"?: number;
}

export class UploadForOFFLINE implements UploadForOFFLINEInterface {
  "id": number;
  constructor(data?: UploadForOFFLINEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UploadForOFFLINE`.
   */
  public static getModelName() {
    return "UploadForOFFLINE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UploadForOFFLINE for dynamic purposes.
  **/
  public static factory(data: UploadForOFFLINEInterface): UploadForOFFLINE{
    return new UploadForOFFLINE(data);
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
      name: 'UploadForOFFLINE',
      plural: 'UploadForOFFLINEs',
      path: 'UploadForOFFLINEs',
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
