/* tslint:disable */

declare var Object: any;
export interface PlantMappingInterface {
  "PlantCode"?: string;
  "Site"?: string;
  "Plant"?: string;
  "PlantName"?: string;
  "Actived"?: boolean;
  "bg"?: string;
  "op"?: string;
}

export class PlantMapping implements PlantMappingInterface {
  "PlantCode": string;
  "Site": string;
  "Plant": string;
  "PlantName": string;
  "Actived": boolean;
  "bg": string;
  "op": string;
  constructor(data?: PlantMappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlantMapping`.
   */
  public static getModelName() {
    return "PlantMapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlantMapping for dynamic purposes.
  **/
  public static factory(data: PlantMappingInterface): PlantMapping{
    return new PlantMapping(data);
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
      name: 'PlantMapping',
      plural: 'PlantMappings',
      path: 'PlantMappings',
      idName: 'PlantCode',
      properties: {
        "PlantCode": {
          name: 'PlantCode',
          type: 'string'
        },
        "Site": {
          name: 'Site',
          type: 'string'
        },
        "Plant": {
          name: 'Plant',
          type: 'string'
        },
        "PlantName": {
          name: 'PlantName',
          type: 'string'
        },
        "Actived": {
          name: 'Actived',
          type: 'boolean'
        },
        "bg": {
          name: 'bg',
          type: 'string'
        },
        "op": {
          name: 'op',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
