/* tslint:disable */

declare var Object: any;
export interface UploadForIDLInterface {
  "id"?: number;
}

export class UploadForIDL implements UploadForIDLInterface {
  "id": number;
  constructor(data?: UploadForIDLInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UploadForIDL`.
   */
  public static getModelName() {
    return "UploadForIDL";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UploadForIDL for dynamic purposes.
  **/
  public static factory(data: UploadForIDLInterface): UploadForIDL{
    return new UploadForIDL(data);
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
      name: 'UploadForIDL',
      plural: 'UploadForIDLs',
      path: 'UploadForIDLs',
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
