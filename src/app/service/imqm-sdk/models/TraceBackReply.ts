/* tslint:disable */

declare var Object: any;
export interface TraceBackReplyInterface {
  "number": string;
  "times": number;
  "reason"?: string;
  "countermeasures"?: string;
  "updateTime"?: number;
}

export class TraceBackReply implements TraceBackReplyInterface {
  "number": string;
  "times": number;
  "reason": string;
  "countermeasures": string;
  "updateTime": number;
  constructor(data?: TraceBackReplyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `TraceBackReply`.
   */
  public static getModelName() {
    return "TraceBackReply";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of TraceBackReply for dynamic purposes.
  **/
  public static factory(data: TraceBackReplyInterface): TraceBackReply{
    return new TraceBackReply(data);
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
      name: 'TraceBackReply',
      plural: 'TraceBackReplies',
      path: 'TraceBackReplies',
      idName: 'number',
      properties: {
        "number": {
          name: 'number',
          type: 'string'
        },
        "times": {
          name: 'times',
          type: 'number'
        },
        "reason": {
          name: 'reason',
          type: 'string'
        },
        "countermeasures": {
          name: 'countermeasures',
          type: 'string'
        },
        "updateTime": {
          name: 'updateTime',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
