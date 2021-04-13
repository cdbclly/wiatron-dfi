import { Injectable } from '@angular/core';
import { PartDocumentApi, PartApi, ModelDocumentApi, ModelApi, ProductApi, Dimension } from '@service/mrr-sdk';
import { MailApi } from '@service/dfi-sdk';

@Injectable({
  providedIn: 'root'
})
export class NuddUploadService {

  constructor(private partDocumentService: PartDocumentApi,
    private partService: PartApi,
    private modelDocumentService: ModelDocumentApi,
    private model: ModelApi,
    private productService: ProductApi,
    private mailService: MailApi
  ) { }

  sendEmail(data){
    return this.mailService.create(data);
  }

  deleteModelDocument(id) {
    return this.modelDocumentService.deleteById(id);
  }

  getModelDocument() {
    return this.modelDocumentService.find();
  }

  postPartDocument(data) {
    return this.partDocumentService.create(data);
  }


  deletePartDocument(id) {
    return this.partDocumentService.deleteById(id);
  }


  getPartDocument() {
    return this.partDocumentService.find({
      include: 'part'
    },
    );
  }

  getDimension() {
    return this.productService.getDimensions('NB');
  }
  getPart(partId) {
    return this.partDocumentService.getPart(partId);
  }

  getFromPart() {
    return this.partService.find();
  }

  addModel(param) {
    return this.modelDocumentService.create(param);
  }

  getModel(modelId) {
    return this.model.find(
      {
        include: [
          {
            relation: 'modelDocuments',
            scope: {
              order: 'id DESC',
              limit: 1
            }
          },
          {
            relation: 'partDocuments',
            scope: {
              order: 'id DESC',
              include: [
                { relation: 'part', },
                { relation: 'dimension', }
              ]
            }
          }
        ],
        where: { 'id': modelId }
      }
    );
  }
}
