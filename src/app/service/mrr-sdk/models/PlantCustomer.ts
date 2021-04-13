/* tslint:disable */

declare var Object: any;
export interface PlantCustomerInterface {
  "id"?: number;
  "plant"?: string;
  "customer"?: string;
  "plantName"?: string;
}

export class PlantCustomer implements PlantCustomerInterface {
  "id": number;
  "plant": string;
  "customer": string;
  "plantName": string;
  constructor(data?: PlantCustomerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlantCustomer`.
   */
  public static getModelName() {
    return "PlantCustomer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlantCustomer for dynamic purposes.
  **/
  public static factory(data: PlantCustomerInterface): PlantCustomer{
    return new PlantCustomer(data);
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
      name: 'PlantCustomer',
      plural: 'PlantCustomers',
      path: 'PlantCustomers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "customer": {
          name: 'customer',
          type: 'string'
        },
        "plantName": {
          name: 'plantName',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
