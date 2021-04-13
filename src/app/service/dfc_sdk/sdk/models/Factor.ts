/* tslint:disable */
import {
  Material,
  FactorDetail
} from '../index';

declare var Object: any;
export interface FactorInterface {
  "FactorID"?: number;
  "FactorCode"?: string;
  "MaterialID"?: number;
  "Name"?: string;
  material?: Material;
  factorDetails?: FactorDetail[];
}

export class Factor implements FactorInterface {
  "FactorID": number;
  "FactorCode": string;
  "MaterialID": number;
  "Name": string;
  material: Material;
  factorDetails: FactorDetail[];
  constructor(data?: FactorInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Factor`.
   */
  public static getModelName() {
    return "Factor";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Factor for dynamic purposes.
  **/
  public static factory(data: FactorInterface): Factor{
    return new Factor(data);
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
      name: 'Factor',
      plural: 'Factors',
      path: 'Factors',
      idName: 'FactorID',
      properties: {
        "FactorID": {
          name: 'FactorID',
          type: 'number'
        },
        "FactorCode": {
          name: 'FactorCode',
          type: 'string'
        },
        "MaterialID": {
          name: 'MaterialID',
          type: 'number'
        },
        "Name": {
          name: 'Name',
          type: 'string'
        },
      },
      relations: {
        material: {
          name: 'material',
          type: 'Material',
          model: 'Material',
          relationType: 'belongsTo',
                  keyFrom: 'MaterialID',
          keyTo: 'MaterialID'
        },
        factorDetails: {
          name: 'factorDetails',
          type: 'FactorDetail[]',
          model: 'FactorDetail',
          relationType: 'hasMany',
                  keyFrom: 'FactorID',
          keyTo: 'FactorID'
        },
      }
    }
  }
}
