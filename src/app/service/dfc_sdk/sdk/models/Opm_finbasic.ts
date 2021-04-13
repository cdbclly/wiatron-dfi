/* tslint:disable */

declare var Object: any;
export interface Opm_finbasicInterface {
  "period": string;
  "plant": string;
  "dl2": number;
  "dl3": number;
  "id"?: number;
}

export class Opm_finbasic implements Opm_finbasicInterface {
  "period": string;
  "plant": string;
  "dl2": number;
  "dl3": number;
  "id": number;
  constructor(data?: Opm_finbasicInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Opm_finbasic`.
   */
  public static getModelName() {
    return "Opm_finbasic";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Opm_finbasic for dynamic purposes.
  **/
  public static factory(data: Opm_finbasicInterface): Opm_finbasic{
    return new Opm_finbasic(data);
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
      name: 'Opm_finbasic',
      plural: 'Opm_finbasics',
      path: 'Opm_finbasics',
      idName: 'id',
      properties: {
        "period": {
          name: 'period',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "dl2": {
          name: 'dl2',
          type: 'number'
        },
        "dl3": {
          name: 'dl3',
          type: 'number'
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
