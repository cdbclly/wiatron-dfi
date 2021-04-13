/* tslint:disable */
import {
  Member
} from '../index';

declare var Object: any;
export interface TargetOperationsInterface {
  "ModelOperationID"?: number;
  "TargetFactorDetailCode"?: number;
  "PICID"?: string;
  "Comment"?: string;
  "Status"?: number;
  "TargetCount"?: number;
  "DueDay"?: Date;
  "BOMCost"?: number;
  "Version"?: number;
  "ModifiedMOH"?: number;
  pic?: Member;
}

export class TargetOperations implements TargetOperationsInterface {
  "ModelOperationID": number;
  "TargetFactorDetailCode": number;
  "PICID": string;
  "Comment": string;
  "Status": number;
  "TargetCount": number;
  "DueDay": Date;
  "BOMCost": number;
  "Version": number;
  "ModifiedMOH": number;
  pic: Member;
  constructor(data?: TargetOperationsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TargetOperations`.
   */
  public static getModelName() {
    return "TargetOperations";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TargetOperations for dynamic purposes.
  **/
  public static factory(data: TargetOperationsInterface): TargetOperations{
    return new TargetOperations(data);
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
      name: 'TargetOperations',
      plural: 'TargetOperations',
      path: 'TargetOperations',
      idName: 'ModelOperationID',
      properties: {
        "ModelOperationID": {
          name: 'ModelOperationID',
          type: 'number'
        },
        "TargetFactorDetailCode": {
          name: 'TargetFactorDetailCode',
          type: 'number'
        },
        "PICID": {
          name: 'PICID',
          type: 'string'
        },
        "Comment": {
          name: 'Comment',
          type: 'string'
        },
        "Status": {
          name: 'Status',
          type: 'number'
        },
        "TargetCount": {
          name: 'TargetCount',
          type: 'number'
        },
        "DueDay": {
          name: 'DueDay',
          type: 'Date'
        },
        "BOMCost": {
          name: 'BOMCost',
          type: 'number'
        },
        "Version": {
          name: 'Version',
          type: 'number'
        },
        "ModifiedMOH": {
          name: 'ModifiedMOH',
          type: 'number'
        },
      },
      relations: {
        pic: {
          name: 'pic',
          type: 'Member',
          model: 'Member',
          relationType: 'belongsTo',
                  keyFrom: 'PICID',
          keyTo: 'EmpID'
        },
      }
    }
  }
}
