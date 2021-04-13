/* tslint:disable */

declare var Object: any;
export interface Skyeye_ctq_spc_cl_listInterface {
  "site"?: string;
  "plant"?: string;
  "modelname"?: string;
  "stationline"?: string;
  "stationtype"?: string;
  "tdname"?: string;
  "mdname"?: string;
  "count"?: number;
  "firsttime"?: number;
  "lasttime"?: number;
  "id"?: number;
}

export class Skyeye_ctq_spc_cl_list implements Skyeye_ctq_spc_cl_listInterface {
  "site": string;
  "plant": string;
  "modelname": string;
  "stationline": string;
  "stationtype": string;
  "tdname": string;
  "mdname": string;
  "count": number;
  "firsttime": number;
  "lasttime": number;
  "id": number;
  constructor(data?: Skyeye_ctq_spc_cl_listInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Skyeye_ctq_spc_cl_list`.
   */
  public static getModelName() {
    return "Skyeye_ctq_spc_cl_list";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Skyeye_ctq_spc_cl_list for dynamic purposes.
  **/
  public static factory(data: Skyeye_ctq_spc_cl_listInterface): Skyeye_ctq_spc_cl_list{
    return new Skyeye_ctq_spc_cl_list(data);
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
      name: 'Skyeye_ctq_spc_cl_list',
      plural: 'Skyeye_ctq_spc_cl_lists',
      path: 'Skyeye_ctq_spc_cl_lists',
      idName: 'id',
      properties: {
        "site": {
          name: 'site',
          type: 'string'
        },
        "plant": {
          name: 'plant',
          type: 'string'
        },
        "modelname": {
          name: 'modelname',
          type: 'string'
        },
        "stationline": {
          name: 'stationline',
          type: 'string'
        },
        "stationtype": {
          name: 'stationtype',
          type: 'string'
        },
        "tdname": {
          name: 'tdname',
          type: 'string'
        },
        "mdname": {
          name: 'mdname',
          type: 'string'
        },
        "count": {
          name: 'count',
          type: 'number'
        },
        "firsttime": {
          name: 'firsttime',
          type: 'number'
        },
        "lasttime": {
          name: 'lasttime',
          type: 'number'
        },
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
