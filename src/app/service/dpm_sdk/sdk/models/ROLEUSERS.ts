/* tslint:disable */

declare var Object: any;
export interface ROLEUSERSInterface {
  "PLANTID": string;
  "ROLEID": string;
  "USERID": string;
}

export class ROLEUSERS implements ROLEUSERSInterface {
  "PLANTID": string;
  "ROLEID": string;
  "USERID": string;
  constructor(data?: ROLEUSERSInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ROLEUSERS`.
   */
  public static getModelName() {
    return "ROLEUSERS";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ROLEUSERS for dynamic purposes.
  **/
  public static factory(data: ROLEUSERSInterface): ROLEUSERS{
    return new ROLEUSERS(data);
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
      name: 'ROLEUSERS',
      plural: 'ROLEUSERS',
      path: 'ROLEUSERS',
      idName: 'PLANTID',
      properties: {
        "PLANTID": {
          name: 'PLANTID',
          type: 'string'
        },
        "ROLEID": {
          name: 'ROLEID',
          type: 'string'
        },
        "USERID": {
          name: 'USERID',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
