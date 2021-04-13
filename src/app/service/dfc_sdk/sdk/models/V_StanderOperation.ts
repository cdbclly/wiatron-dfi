/* tslint:disable */

declare var Object: any;
export interface V_StanderOperationInterface {
  "OperationCode"?: string;
  "ProcessCode"?: string;
  "ModelType"?: string;
  "ProcessName"?: string;
  "MaterialCode"?: string;
  "MaterialName"?: string;
  "FactorCode"?: string;
  "FactorName"?: string;
  "FactorID"?: number;
  "FactorDetailCode"?: string;
  "FactorDetailID"?: number;
  "FactorDetailName"?: string;
  "ActionCode"?: string;
  "ActionName"?: string;
  "CostTime"?: number;
  "Version"?: number;
}

export class V_StanderOperation implements V_StanderOperationInterface {
  "OperationCode": string;
  "ProcessCode": string;
  "ModelType": string;
  "ProcessName": string;
  "MaterialCode": string;
  "MaterialName": string;
  "FactorCode": string;
  "FactorName": string;
  "FactorID": number;
  "FactorDetailCode": string;
  "FactorDetailID": number;
  "FactorDetailName": string;
  "ActionCode": string;
  "ActionName": string;
  "CostTime": number;
  "Version": number;
  constructor(data?: V_StanderOperationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `V_StanderOperation`.
   */
  public static getModelName() {
    return "V_StanderOperation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of V_StanderOperation for dynamic purposes.
  **/
  public static factory(data: V_StanderOperationInterface): V_StanderOperation{
    return new V_StanderOperation(data);
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
      name: 'V_StanderOperation',
      plural: 'V_StanderOperations',
      path: 'V_StanderOperations',
      idName: 'OperationCode',
      properties: {
        "OperationCode": {
          name: 'OperationCode',
          type: 'string'
        },
        "ProcessCode": {
          name: 'ProcessCode',
          type: 'string'
        },
        "ModelType": {
          name: 'ModelType',
          type: 'string'
        },
        "ProcessName": {
          name: 'ProcessName',
          type: 'string'
        },
        "MaterialCode": {
          name: 'MaterialCode',
          type: 'string'
        },
        "MaterialName": {
          name: 'MaterialName',
          type: 'string'
        },
        "FactorCode": {
          name: 'FactorCode',
          type: 'string'
        },
        "FactorName": {
          name: 'FactorName',
          type: 'string'
        },
        "FactorID": {
          name: 'FactorID',
          type: 'number'
        },
        "FactorDetailCode": {
          name: 'FactorDetailCode',
          type: 'string'
        },
        "FactorDetailID": {
          name: 'FactorDetailID',
          type: 'number'
        },
        "FactorDetailName": {
          name: 'FactorDetailName',
          type: 'string'
        },
        "ActionCode": {
          name: 'ActionCode',
          type: 'string'
        },
        "ActionName": {
          name: 'ActionName',
          type: 'string'
        },
        "CostTime": {
          name: 'CostTime',
          type: 'number'
        },
        "Version": {
          name: 'Version',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
