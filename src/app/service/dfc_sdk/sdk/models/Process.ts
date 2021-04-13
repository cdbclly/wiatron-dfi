/* tslint:disable */
import {
  Material
} from '../index';

declare var Object: any;
export interface ProcessInterface {
  "ProcessCode"?: string;
  "Name"?: string;
  materials?: Material[];
}

export class Process implements ProcessInterface {
  "ProcessCode": string;
  "Name": string;
  materials: Material[];
  constructor(data?: ProcessInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Process`.
   */
  public static getModelName() {
    return "Process";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Process for dynamic purposes.
  **/
  public static factory(data: ProcessInterface): Process{
    return new Process(data);
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
      name: 'Process',
      plural: 'Processes',
      path: 'Processes',
      idName: 'ProcessCode',
      properties: {
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
        materials: {
          name: 'materials',
          type: 'Material[]',
          model: 'Material',
          relationType: 'hasMany',
                  keyFrom: 'ProcessCode',
          keyTo: 'ProcessCode'
        },
      }
    }
  }
}
