/* tslint:disable */

declare var Object: any;
export interface UploadForDLInterface {
  "id"?: number;
}

export class UploadForDL implements UploadForDLInterface {
  "id": number;
  constructor(data?: UploadForDLInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UploadForDL`.
   */
  public static getModelName() {
    return "UploadForDL";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UploadForDL for dynamic purposes.
  **/
  public static factory(data: UploadForDLInterface): UploadForDL{
    return new UploadForDL(data);
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
      name: 'UploadForDL',
      plural: 'UploadForDLs',
      path: 'UploadForDLs',
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
