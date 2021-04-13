/* tslint:disable */

declare var Object: any;
export interface RawDataInterface {
  "id"?: number;
}

export class RawData implements RawDataInterface {
  "id": number;
  constructor(data?: RawDataInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RawData`.
   */
  public static getModelName() {
    return "RawData";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RawData for dynamic purposes.
  **/
  public static factory(data: RawDataInterface): RawData{
    return new RawData(data);
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
      name: 'RawData',
      plural: 'RawData',
      path: 'RawData',
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
