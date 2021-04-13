/* tslint:disable */

declare var Object: any;
export interface PLM_allpartInterface {
  "PROJECTNAME"?: string;
  "PARTNUMBER"?: string;
  "NOMENCLATURE"?: string;
  "id"?: number;
}

export class PLM_allpart implements PLM_allpartInterface {
  "PROJECTNAME": string;
  "PARTNUMBER": string;
  "NOMENCLATURE": string;
  "id": number;
  constructor(data?: PLM_allpartInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PLM_allpart`.
   */
  public static getModelName() {
    return "PLM_allpart";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PLM_allpart for dynamic purposes.
  **/
  public static factory(data: PLM_allpartInterface): PLM_allpart{
    return new PLM_allpart(data);
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
      name: 'PLM_allpart',
      plural: 'PLM_allparts',
      path: 'PLM_allparts',
      idName: 'id',
      properties: {
        "PROJECTNAME": {
          name: 'PROJECTNAME',
          type: 'string'
        },
        "PARTNUMBER": {
          name: 'PARTNUMBER',
          type: 'string'
        },
        "NOMENCLATURE": {
          name: 'NOMENCLATURE',
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
