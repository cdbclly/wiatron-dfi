/* tslint:disable */

declare var Object: any;
export interface EmailModelInterface {
  "to": string;
  "from": string;
  "subject": string;
  "text"?: string;
  "html"?: string;
  "id"?: number;
}

export class EmailModel implements EmailModelInterface {
  "to": string;
  "from": string;
  "subject": string;
  "text": string;
  "html": string;
  "id": number;
  constructor(data?: EmailModelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EmailModel`.
   */
  public static getModelName() {
    return "EmailModel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EmailModel for dynamic purposes.
  **/
  public static factory(data: EmailModelInterface): EmailModel{
    return new EmailModel(data);
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
      name: 'EmailModel',
      plural: 'EmailModels',
      path: 'EmailModels',
      idName: 'id',
      properties: {
        "to": {
          name: 'to',
          type: 'string'
        },
        "from": {
          name: 'from',
          type: 'string'
        },
        "subject": {
          name: 'subject',
          type: 'string'
        },
        "text": {
          name: 'text',
          type: 'string'
        },
        "html": {
          name: 'html',
          type: 'string'
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
