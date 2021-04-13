/* tslint:disable */

declare var Object: any;
export interface DPMALERTInterface {
  "SYNCID"?: number;
  "SYNCACTION": string;
  "SYNCDATE": Date;
  "ALERTID": string;
  "SUBJECT"?: string;
  "CONTENT"?: string;
  "ATTACHMENT"?: string;
  "SENDFROM"?: string;
  "SENDTYPE"?: number;
  "SENDTO"?: string;
}

export class DPMALERT implements DPMALERTInterface {
  "SYNCID": number;
  "SYNCACTION": string;
  "SYNCDATE": Date;
  "ALERTID": string;
  "SUBJECT": string;
  "CONTENT": string;
  "ATTACHMENT": string;
  "SENDFROM": string;
  "SENDTYPE": number;
  "SENDTO": string;
  constructor(data?: DPMALERTInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DPMALERT`.
   */
  public static getModelName() {
    return "DPMALERT";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DPMALERT for dynamic purposes.
  **/
  public static factory(data: DPMALERTInterface): DPMALERT{
    return new DPMALERT(data);
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
      name: 'DPMALERT',
      plural: 'DPMALERTs',
      path: 'DPMALERTs',
      idName: 'SYNCID',
      properties: {
        "SYNCID": {
          name: 'SYNCID',
          type: 'number'
        },
        "SYNCACTION": {
          name: 'SYNCACTION',
          type: 'string',
          default: 'C'
        },
        "SYNCDATE": {
          name: 'SYNCDATE',
          type: 'Date'
        },
        "ALERTID": {
          name: 'ALERTID',
          type: 'string'
        },
        "SUBJECT": {
          name: 'SUBJECT',
          type: 'string'
        },
        "CONTENT": {
          name: 'CONTENT',
          type: 'string'
        },
        "ATTACHMENT": {
          name: 'ATTACHMENT',
          type: 'string'
        },
        "SENDFROM": {
          name: 'SENDFROM',
          type: 'string'
        },
        "SENDTYPE": {
          name: 'SENDTYPE',
          type: 'number'
        },
        "SENDTO": {
          name: 'SENDTO',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
