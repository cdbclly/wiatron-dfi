import { Dimension, Part, Model } from '@service/mrr-sdk';

/* tslint:disable */
declare var Object: any;
export interface PartDocumentInterface {
  "path"?: string;
  "id"?: number;
  "dimensionId"?: number;
  "partId"?: number;
  "modelId"?: string;
  dimension?: Dimension;
  part?: Part;
  model?: Model;
}

export class PartDocument implements PartDocumentInterface {
  "path": string;
  "id": number;
  "dimensionId": number;
  "partId": number;
  "modelId": string;
  dimension: Dimension;
  part: Part;
  model: Model;
  constructor(data?: PartDocumentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PartDocument`.
   */
  public static getModelName() {
    return "PartDocument";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PartDocument for dynamic purposes.
  **/
  public static factory(data: PartDocumentInterface): PartDocument{
    return new PartDocument(data);
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
      name: 'PartDocument',
      plural: 'PartDocuments',
      path: 'PartDocuments',
      idName: 'id',
      properties: {
        "path": {
          name: 'path',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "dimensionId": {
          name: 'dimensionId',
          type: 'number'
        },
        "partId": {
          name: 'partId',
          type: 'number'
        },
        "modelId": {
          name: 'modelId',
          type: 'string'
        },
      },
      relations: {
        dimension: {
          name: 'dimension',
          type: 'Dimension',
          model: 'Dimension',
          relationType: 'belongsTo',
                  keyFrom: 'dimensionId',
          keyTo: 'id'
        },
        part: {
          name: 'part',
          type: 'Part',
          model: 'Part',
          relationType: 'belongsTo',
                  keyFrom: 'partId',
          keyTo: 'id'
        },
        model: {
          name: 'model',
          type: 'Model',
          model: 'Model',
          relationType: 'belongsTo',
                  keyFrom: 'modelId',
          keyTo: 'id'
        },
      }
    }
  }
}
