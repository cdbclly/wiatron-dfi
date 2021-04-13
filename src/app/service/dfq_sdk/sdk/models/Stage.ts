/* tslint:disable */
import {
  NPICHECKLIST_EM_HEAD
} from '../index';

declare var Object: any;
export interface StageInterface {
  "id": string;
  nPICHECKLISTEmHeads?: NPICHECKLIST_EM_HEAD[];
}

export class Stage implements StageInterface {
  "id": string;
  nPICHECKLISTEmHeads: NPICHECKLIST_EM_HEAD[];
  constructor(data?: StageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Stage`.
   */
  public static getModelName() {
    return "Stage";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Stage for dynamic purposes.
  **/
  public static factory(data: StageInterface): Stage{
    return new Stage(data);
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
      name: 'Stage',
      plural: 'Stages',
      path: 'Stages',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
      },
      relations: {
        nPICHECKLISTEmHeads: {
          name: 'nPICHECKLISTEmHeads',
          type: 'NPICHECKLIST_EM_HEAD[]',
          model: 'NPICHECKLIST_EM_HEAD',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'STAGE'
        },
      }
    }
  }
}
