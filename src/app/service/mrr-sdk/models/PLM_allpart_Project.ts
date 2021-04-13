/* tslint:disable */

declare var Object: any;
export interface PLM_allpart_ProjectInterface {
  "PARTNUMBER": string;
  "PROJECTNAME": string;
}

export class PLM_allpart_Project implements PLM_allpart_ProjectInterface {
  "PARTNUMBER": string;
  "PROJECTNAME": string;
  constructor(data?: PLM_allpart_ProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PLM_allpart_Project`.
   */
  public static getModelName() {
    return "PLM_allpart_Project";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PLM_allpart_Project for dynamic purposes.
  **/
  public static factory(data: PLM_allpart_ProjectInterface): PLM_allpart_Project{
    return new PLM_allpart_Project(data);
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
      name: 'PLM_allpart_Project',
      plural: 'PLM_allpart_Projects',
      path: 'PLM_allpart_Projects',
      idName: 'PARTNUMBER',
      properties: {
        "PARTNUMBER": {
          name: 'PARTNUMBER',
          type: 'string'
        },
        "PROJECTNAME": {
          name: 'PROJECTNAME',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
