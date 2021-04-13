/* tslint:disable */

declare var Object: any;
export interface DfiProjectInterface {
  "id": string;
  "productId": number;
}

export class DfiProject implements DfiProjectInterface {
  "id": string;
  "productId": number;
  constructor(data?: DfiProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DfiProject`.
   */
  public static getModelName() {
    return "DfiProject";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DfiProject for dynamic purposes.
  **/
  public static factory(data: DfiProjectInterface): DfiProject{
    return new DfiProject(data);
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
      name: 'DfiProject',
      plural: 'DfiProjects',
      path: 'DfiProjects',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
