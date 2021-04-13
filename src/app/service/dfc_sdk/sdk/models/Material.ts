/* tslint:disable */
import {
  Process,
  Factor
} from '../index';

declare var Object: any;
export interface MaterialInterface {
  "MaterialID"?: number;
  "MaterialCode"?: string;
  "ProcessCode"?: string;
  "Name"?: string;
  process?: Process;
  factors?: Factor[];
}

export class Material implements MaterialInterface {
  "MaterialID": number;
  "MaterialCode": string;
  "ProcessCode": string;
  "Name": string;
  process: Process;
  factors: Factor[];
  constructor(data?: MaterialInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Material`.
   */
  public static getModelName() {
    return "Material";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Material for dynamic purposes.
  **/
  public static factory(data: MaterialInterface): Material{
    return new Material(data);
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
      name: 'Material',
      plural: 'Materials',
      path: 'Materials',
      idName: 'MaterialID',
      properties: {
        "MaterialID": {
          name: 'MaterialID',
          type: 'number'
        },
        "MaterialCode": {
          name: 'MaterialCode',
          type: 'string'
        },
        "ProcessCode": {
          name: 'ProcessCode',
          type: 'string'
        },
        "Name": {
          name: 'Name',
          type: 'string'
        },
      },
      relations: {
        process: {
          name: 'process',
          type: 'Process',
          model: 'Process',
          relationType: 'belongsTo',
                  keyFrom: 'ProcessCode',
          keyTo: 'ProcessCode'
        },
        factors: {
          name: 'factors',
          type: 'Factor[]',
          model: 'Factor',
          relationType: 'hasMany',
                  keyFrom: 'MaterialID',
          keyTo: 'MaterialID'
        },
      }
    }
  }
}
