/* tslint:disable */

declare var Object: any;
export interface Opm_r3Interface {
  "usdfxr"?: number;
  "rmbfxr"?: number;
  "period": string;
  "plant"?: string;
  "id"?: number;
}

export class Opm_r3 implements Opm_r3Interface {
  "usdfxr": number;
  "rmbfxr": number;
  "period": string;
  "plant": string;
  "id": number;
  constructor(data?: Opm_r3Interface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Opm_r3`.
   */
  public static getModelName() {
    return "Opm_r3";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Opm_r3 for dynamic purposes.
  **/
  public static factory(data: Opm_r3Interface): Opm_r3{
    return new Opm_r3(data);
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
      name: 'Opm_r3',
      plural: 'Opm_r3s',
      path: 'Opm_r3s',
      idName: 'id',
      properties: {
        "usdfxr": {
          name: 'usdfxr',
          type: 'number'
        },
        "rmbfxr": {
          name: 'rmbfxr',
          type: 'number'
        },
        "period": {
          name: 'period',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
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
