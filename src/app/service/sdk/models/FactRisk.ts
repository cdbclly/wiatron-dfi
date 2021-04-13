/* tslint:disable */

import { Fact } from "@service/mrr-sdk";

declare var Object: any;
export interface FactRiskInterface {
  "name"?: string;
  "level"?: number;
  "id"?: number;
  "factId"?: number;
  fact?: Fact;
}

export class FactRisk implements FactRiskInterface {
  "name": string;
  "level": number;
  "id": number;
  "factId": number;
  fact: Fact;
  constructor(data?: FactRiskInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `FactRisk`.
   */
  public static getModelName() {
    return "FactRisk";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of FactRisk for dynamic purposes.
  **/
  public static factory(data: FactRiskInterface): FactRisk{
    return new FactRisk(data);
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
      name: 'FactRisk',
      plural: 'FactRisks',
      path: 'FactRisks',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "level": {
          name: 'level',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "factId": {
          name: 'factId',
          type: 'number'
        },
      },
      relations: {
        fact: {
          name: 'fact',
          type: 'Fact',
          model: 'Fact',
          relationType: 'belongsTo',
                  keyFrom: 'factId',
          keyTo: 'id'
        },
      }
    }
  }
}
