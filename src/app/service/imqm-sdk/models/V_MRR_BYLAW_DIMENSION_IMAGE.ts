/* tslint:disable */

declare var Object: any;
export interface V_MRR_BYLAW_DIMENSION_IMAGEInterface {
  "id"?: number;
}

export class V_MRR_BYLAW_DIMENSION_IMAGE implements V_MRR_BYLAW_DIMENSION_IMAGEInterface {
  "id": number;
  constructor(data?: V_MRR_BYLAW_DIMENSION_IMAGEInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `V_MRR_BYLAW_DIMENSION_IMAGE`.
   */
  public static getModelName() {
    return "V_MRR_BYLAW_DIMENSION_IMAGE";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of V_MRR_BYLAW_DIMENSION_IMAGE for dynamic purposes.
  **/
  public static factory(data: V_MRR_BYLAW_DIMENSION_IMAGEInterface): V_MRR_BYLAW_DIMENSION_IMAGE{
    return new V_MRR_BYLAW_DIMENSION_IMAGE(data);
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
      name: 'V_MRR_BYLAW_DIMENSION_IMAGE',
      plural: 'V_MRR_BYLAW_DIMENSION_IMAGEs',
      path: 'V_MRR_BYLAW_DIMENSION_IMAGEs',
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
