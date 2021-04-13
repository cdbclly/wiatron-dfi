/* tslint:disable */
import {
  FactRisk,
  ModelResult,
  Workflow,
  View_ModelResult
} from '../index';

declare var Object: any;
export interface FactInterface {
  "value"?: string;
  "riskLevel"?: number;
  "pointName"?: string;
  "sideName"?: string;
  "dimensionName"?: string;
  "designItemPath"?: string;
  "partName"?: string;
  "owner"?: string;
  "category"?: string;
  "processType"?: string;
  "designItemName"?: string;
  "id"?: number;
  "modelResultId"?: number;
  "workflowId"?: number;
  factRisks?: FactRisk[];
  modelResult?: ModelResult;
  workflow?: Workflow;
  view_modelResult?: View_ModelResult;
}

export class Fact implements FactInterface {
  "value": string;
  "riskLevel": number;
  "pointName": string;
  "sideName": string;
  "dimensionName": string;
  "designItemPath": string;
  "partName": string;
  "owner": string;
  "category": string;
  "processType": string;
  "designItemName": string;
  "id": number;
  "modelResultId": number;
  "workflowId": number;
  factRisks: FactRisk[];
  modelResult: ModelResult;
  workflow: Workflow;
  view_modelResult: View_ModelResult;
  constructor(data?: FactInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Fact`.
   */
  public static getModelName() {
    return "Fact";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Fact for dynamic purposes.
  **/
  public static factory(data: FactInterface): Fact{
    return new Fact(data);
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
      name: 'Fact',
      plural: 'Facts',
      path: 'Facts',
      idName: 'id',
      properties: {
        "value": {
          name: 'value',
          type: 'string'
        },
        "riskLevel": {
          name: 'riskLevel',
          type: 'number'
        },
        "pointName": {
          name: 'pointName',
          type: 'string'
        },
        "sideName": {
          name: 'sideName',
          type: 'string'
        },
        "dimensionName": {
          name: 'dimensionName',
          type: 'string'
        },
        "designItemPath": {
          name: 'designItemPath',
          type: 'string'
        },
        "partName": {
          name: 'partName',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "category": {
          name: 'category',
          type: 'string'
        },
        "processType": {
          name: 'processType',
          type: 'string'
        },
        "designItemName": {
          name: 'designItemName',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "modelResultId": {
          name: 'modelResultId',
          type: 'number'
        },
        "workflowId": {
          name: 'workflowId',
          type: 'number'
        },
      },
      relations: {
        factRisks: {
          name: 'factRisks',
          type: 'FactRisk[]',
          model: 'FactRisk',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'factId'
        },
        modelResult: {
          name: 'modelResult',
          type: 'ModelResult',
          model: 'ModelResult',
          relationType: 'belongsTo',
                  keyFrom: 'modelResultId',
          keyTo: 'id'
        },
        workflow: {
          name: 'workflow',
          type: 'Workflow',
          model: 'Workflow',
          relationType: 'belongsTo',
                  keyFrom: 'workflowId',
          keyTo: 'id'
        },
        view_modelResult: {
          name: 'view_modelResult',
          type: 'View_ModelResult',
          model: 'View_ModelResult',
          relationType: 'belongsTo',
                  keyFrom: 'modelResultId',
          keyTo: 'id'
        },
      }
    }
  }
}
