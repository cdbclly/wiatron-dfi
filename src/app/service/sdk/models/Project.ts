/* tslint:disable */
import {
  Model,
  ProfitCenter,
  Product,
  Customer,
  Stage
} from '../index';

declare var Object: any;
export interface ProjectInterface {
  "id"?: string;
  "createdBy"?: string;
  "createdOn"?: Date;
  "rfqProjectId"?: string;
  "profitCenterId"?: string;
  "productId"?: string;
  "customerId"?: string;
  models?: Model[];
  profitCenter?: ProfitCenter;
  product?: Product;
  customer?: Customer;
  stages?: Stage[];
}

export class Project implements ProjectInterface {
  "id": string;
  "createdBy": string;
  "createdOn": Date;
  "rfqProjectId": string;
  "profitCenterId": string;
  "productId": string;
  "customerId": string;
  models: Model[];
  profitCenter: ProfitCenter;
  product: Product;
  customer: Customer;
  stages: Stage[];
  constructor(data?: ProjectInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Project`.
   */
  public static getModelName() {
    return "Project";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Project for dynamic purposes.
  **/
  public static factory(data: ProjectInterface): Project{
    return new Project(data);
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
      name: 'Project',
      plural: 'Projects',
      path: 'Projects',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "rfqProjectId": {
          name: 'rfqProjectId',
          type: 'string'
        },
        "profitCenterId": {
          name: 'profitCenterId',
          type: 'string'
        },
        "productId": {
          name: 'productId',
          type: 'string'
        },
        "customerId": {
          name: 'customerId',
          type: 'string'
        },
      },
      relations: {
        models: {
          name: 'models',
          type: 'Model[]',
          model: 'Model',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'projectId'
        },
        profitCenter: {
          name: 'profitCenter',
          type: 'ProfitCenter',
          model: 'ProfitCenter',
          relationType: 'belongsTo',
                  keyFrom: 'profitCenterId',
          keyTo: 'id'
        },
        product: {
          name: 'product',
          type: 'Product',
          model: 'Product',
          relationType: 'belongsTo',
                  keyFrom: 'productId',
          keyTo: 'id'
        },
        customer: {
          name: 'customer',
          type: 'Customer',
          model: 'Customer',
          relationType: 'belongsTo',
                  keyFrom: 'customerId',
          keyTo: 'id'
        },
        stages: {
          name: 'stages',
          type: 'Stage[]',
          model: 'Stage',
          relationType: 'hasMany',
          modelThrough: 'ProjectStage',
          keyThrough: 'stageId',
          keyFrom: 'id',
          keyTo: 'projectId'
        },
      }
    }
  }
}
