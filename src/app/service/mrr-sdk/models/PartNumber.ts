/* tslint:disable */
import {
  Part,
  PartNumberVendor,
  Project,
  ProjectPartNumber
} from '../index';

declare var Object: any;
export interface PartNumberInterface {
  "id": string;
  "partId"?: number;
  part?: Part;
  partNumberVendors?: PartNumberVendor[];
  projects?: Project[];
  projectPartNumbers?: ProjectPartNumber[];
}

export class PartNumber implements PartNumberInterface {
  "id": string;
  "partId": number;
  part: Part;
  partNumberVendors: PartNumberVendor[];
  projects: Project[];
  projectPartNumbers: ProjectPartNumber[];
  constructor(data?: PartNumberInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartNumber`.
   */
  public static getModelName() {
    return "PartNumber";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartNumber for dynamic purposes.
  **/
  public static factory(data: PartNumberInterface): PartNumber{
    return new PartNumber(data);
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
      name: 'PartNumber',
      plural: 'PartNumbers',
      path: 'PartNumbers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "partId": {
          name: 'partId',
          type: 'number'
        },
      },
      relations: {
        part: {
          name: 'part',
          type: 'Part',
          model: 'Part',
          relationType: 'belongsTo',
                  keyFrom: 'partId',
          keyTo: 'id'
        },
        partNumberVendors: {
          name: 'partNumberVendors',
          type: 'PartNumberVendor[]',
          model: 'PartNumberVendor',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberId'
        },
        projects: {
          name: 'projects',
          type: 'Project[]',
          model: 'Project',
          relationType: 'hasMany',
          modelThrough: 'ProjectPartNumber',
          keyThrough: 'projectId',
          keyFrom: 'id',
          keyTo: 'partNumberId'
        },
        projectPartNumbers: {
          name: 'projectPartNumbers',
          type: 'ProjectPartNumber[]',
          model: 'ProjectPartNumber',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'partNumberId'
        },
      }
    }
  }
}
