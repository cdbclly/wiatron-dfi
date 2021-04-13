/* tslint:disable */
import {
  Authority
} from '../index';

declare var Object: any;
export interface GroupInterface {
  "GroupID"?: number;
  "Describtion"?: string;
  "ModelProfiles"?: number;
  "MOHCondition"?: number;
  "MOHAddition"?: number;
  "StandardOperation"?: number;
  "ModelOperation"?: number;
  "TargetOperation"?: number;
  "TimeReport"?: number;
  "MOHReport"?: number;
  "UserMangement"?: number;
  "DfiMember"?: number;
  "StandardOperationSign"?: number;
  "TargetOperationSign"?: number;
  "WorkhourGap"?: number;
  "WorkhourQuery"?: number;
  "WorkhourReview"?: number;
  "KpiReport"?: number;
  "TargetOperationReport"?: number;
  "SummaryReport"?: number;
  "ImproveReport"?: number;
  "MilitaryOrderQuery"?: number;
  "MilitaryOrderSign"?: number;
  "RewardQuery"?: number;
  "RewardSign"?: number;
  "SkyeyeTestItemMaintain"?: number;
  authority?: Authority[];
}

export class Group implements GroupInterface {
  "GroupID": number;
  "Describtion": string;
  "ModelProfiles": number;
  "MOHCondition": number;
  "MOHAddition": number;
  "StandardOperation": number;
  "ModelOperation": number;
  "TargetOperation": number;
  "TimeReport": number;
  "MOHReport": number;
  "UserMangement": number;
  "DfiMember": number;
  "StandardOperationSign": number;
  "TargetOperationSign": number;
  "WorkhourGap": number;
  "WorkhourQuery": number;
  "WorkhourReview": number;
  "KpiReport": number;
  "TargetOperationReport": number;
  "SummaryReport": number;
  "ImproveReport": number;
  "MilitaryOrderQuery": number;
  "MilitaryOrderSign": number;
  "RewardQuery": number;
  "RewardSign": number;
  "SkyeyeTestItemMaintain": number;
  authority: Authority[];
  constructor(data?: GroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Group`.
   */
  public static getModelName() {
    return "Group";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Group for dynamic purposes.
  **/
  public static factory(data: GroupInterface): Group{
    return new Group(data);
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
      name: 'Group',
      plural: 'Groups',
      path: 'Groups',
      idName: 'GroupID',
      properties: {
        "GroupID": {
          name: 'GroupID',
          type: 'number'
        },
        "Describtion": {
          name: 'Describtion',
          type: 'string'
        },
        "ModelProfiles": {
          name: 'ModelProfiles',
          type: 'number'
        },
        "MOHCondition": {
          name: 'MOHCondition',
          type: 'number'
        },
        "MOHAddition": {
          name: 'MOHAddition',
          type: 'number'
        },
        "StandardOperation": {
          name: 'StandardOperation',
          type: 'number'
        },
        "ModelOperation": {
          name: 'ModelOperation',
          type: 'number'
        },
        "TargetOperation": {
          name: 'TargetOperation',
          type: 'number'
        },
        "TimeReport": {
          name: 'TimeReport',
          type: 'number'
        },
        "MOHReport": {
          name: 'MOHReport',
          type: 'number'
        },
        "UserMangement": {
          name: 'UserMangement',
          type: 'number'
        },
        "DfiMember": {
          name: 'DfiMember',
          type: 'number'
        },
        "StandardOperationSign": {
          name: 'StandardOperationSign',
          type: 'number'
        },
        "TargetOperationSign": {
          name: 'TargetOperationSign',
          type: 'number'
        },
        "WorkhourGap": {
          name: 'WorkhourGap',
          type: 'number'
        },
        "WorkhourQuery": {
          name: 'WorkhourQuery',
          type: 'number'
        },
        "WorkhourReview": {
          name: 'WorkhourReview',
          type: 'number'
        },
        "KpiReport": {
          name: 'KpiReport',
          type: 'number'
        },
        "TargetOperationReport": {
          name: 'TargetOperationReport',
          type: 'number'
        },
        "SummaryReport": {
          name: 'SummaryReport',
          type: 'number'
        },
        "ImproveReport": {
          name: 'ImproveReport',
          type: 'number'
        },
        "MilitaryOrderQuery": {
          name: 'MilitaryOrderQuery',
          type: 'number'
        },
        "MilitaryOrderSign": {
          name: 'MilitaryOrderSign',
          type: 'number'
        },
        "RewardQuery": {
          name: 'RewardQuery',
          type: 'number'
        },
        "RewardSign": {
          name: 'RewardSign',
          type: 'number'
        },
        "SkyeyeTestItemMaintain": {
          name: 'SkyeyeTestItemMaintain',
          type: 'number'
        },
      },
      relations: {
        authority: {
          name: 'authority',
          type: 'Authority[]',
          model: 'Authority',
          relationType: 'hasMany',
                  keyFrom: 'GroupID',
          keyTo: 'GroupID'
        },
      }
    }
  }
}
