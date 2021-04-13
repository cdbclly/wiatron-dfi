/* tslint:disable */
import {
  Customer,
  Model,
  ProfitCenter,
  Product,
  Stage
} from '../index';

declare var Object: any;
export interface ProjectInterface {
  "id"?: string;
  "profitCenterId"?: string;
  "productId"?: string;
  "customerId"?: string;
  "createdBy"?: string;
  "createdOn"?: Date;
  "rfqProjectId"?: string;
  "isRfq"?: boolean;
  "PLMStatus"?: string;
  "name"?: string;
  "updatedOn"?: Date;
  "updatedBy"?: string;
  "showOnDashboard"?: boolean;
  customer?: Customer;
  models?: Model[];
  profitCenter?: ProfitCenter;
  product?: Product;
  stages?: Stage[];
}

export class Project implements ProjectInterface {
  "id": string;
  "profitCenterId": string;
  "productId": string;
  "customerId": string;
  "createdBy": string;
  "createdOn": Date;
  "rfqProjectId": string;
  "isRfq": boolean;
  "PLMStatus": string;
  "name": string;
  "updatedOn": Date;
  "updatedBy": string;
  "showOnDashboard": boolean;
  customer: Customer;
  models: Model[];
  profitCenter: ProfitCenter;
  product: Product;
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
        "isRfq": {
          name: 'isRfq',
          type: 'boolean'
        },
        "PLMStatus": {
          name: 'PLMStatus',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "updatedOn": {
          name: 'updatedOn',
          type: 'Date'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "showOnDashboard": {
          name: 'showOnDashboard',
          type: 'boolean'
        },
      },
      relations: {
        customer: {
          name: 'customer',
          type: 'Customer',
          model: 'Customer',
          relationType: 'belongsTo',
                  keyFrom: 'customerId',
          keyTo: 'id'
        },
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
