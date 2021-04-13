import { Injectable } from '@angular/core';
import { NewModelDocument, NewModelDocumentApi, V_PlantProjectApi, ProductDocumentApi, ProductDocument, V_PlantProject } from '@service/mrr-sdk';

@Injectable({
  providedIn: 'root'
})
export class MrrDocUploadService {

  constructor(
    private newModelDocumentApi: NewModelDocumentApi,
    private productDocumentApi: ProductDocumentApi,
    private vPlantProjectApi: V_PlantProjectApi
  ) { }

  async SetModelDocument(modelId, productDocumentId, filename) {
    const modelDocument = await this.newModelDocumentApi.find<NewModelDocument[]>({
      where: {
        modelId: modelId,
        productDocumentId: productDocumentId
      },
      include: ['vPlantProjects', 'productDocument'],
      order: 'uploadDate desc'
    }).toPromise().then(r => {
      return r[0];
    }).catch(e => null);
    let createFlag = true;
    if (!!modelDocument && !!modelDocument['vPlantProjects']) {
      const currentStage = modelDocument['vPlantProjects']['currentStage'];
      const lastSendStage = this.getProDocStage(modelDocument['uploadDate'], modelDocument['vPlantProjects']);
      if (!lastSendStage || currentStage === lastSendStage) {
        createFlag = false;
      }
    }
    if (createFlag) {
      await this.newModelDocumentApi.create(
        {
          filepath: filename,
          modelId: modelId,
          uploadDate: new Date(),
          uploadUser: localStorage.getItem('$DFI$userID'),
          productDocumentId: productDocumentId
        }
      ).toPromise();
    } else {
      await this.newModelDocumentApi.patchAttributes(modelDocument.Id, {
        filepath: filename,
        uploadUser: localStorage.getItem('$DFI$userID'),
        uploadDate: new Date()
      }).toPromise();
    }
  }

  private getProDocStage(lastDate: Date, vPlantProject: V_PlantProject) {
    if (!lastDate) {
      return '';
    }
    if (lastDate < vPlantProject.RFQ) {
      return 'RFQ';
    } else if (lastDate < vPlantProject.C0) {
      return 'C0';
    } else if (lastDate < vPlantProject.C1) {
      return 'C1';
    } else if (lastDate < vPlantProject.C2) {
      return 'C2';
    } else if (lastDate < vPlantProject.C3) {
      return 'C3';
    } else if (lastDate < vPlantProject.C4) {
      return 'C4';
    } else if (lastDate < vPlantProject.C5) {
      return 'C5';
    } else if (lastDate < vPlantProject.C6) {
      return 'C6';
    } else {
      return 'EX';
    }
  }

  async queryViewDataSet(mrrModuleName, queryValue: { productType: string, proName?: string, custom: string }, docType, plant) {
    const temp = await this.productDocumentApi.find<ProductDocument>({
      where: {
        productId: queryValue.productType,
        plant: plant
      },
      include: [{
        'document': 'documentType'
      },
      {
        relation: 'modelDocument',
        scope: {
          where: {
            or: [{
              modelId: queryValue.proName
            }, {
              modelId: queryValue.custom
            }]
          },
          order: 'uploadDate asc'
        }
      }
      ],
      order: 'productDocumentId'
    }).toPromise();
    const stages = ['C2', 'C3', 'C4', 'C5', 'C6'];
    if (!!queryValue.proName) {
      const modelInfo = await this.vPlantProjectApi.findById<V_PlantProject>(queryValue.proName).toPromise();
      // const modelInfo = await this.vPlantProjectApi.find({ where: {
      //   and: [
      //     { projectName: queryValue.proName },
      //     { moduleName: mrrModuleName },
      //     { moduleEnabled: true }
      //   ]
      // }}).toPromise();
      // console.log(modelInfo);
      //  const currentStage = stages.indexOf(modelInfo[0]['currentStage']);
      //  console.log(currentStage);

      const currentStage = stages.indexOf(modelInfo.currentStage);

      temp.forEach(x => {
        for (let i = currentStage; i > 0; i--) {
          if (x[stages[i]] === false || x.modelDocument.length < 1) {
            continue;
          }
          const lastStageDueDate = modelInfo[stages[i - 1]];
          for (let j = 0; j < x.modelDocument.length; j++) {
            const modelDoc = x.modelDocument[j];
            // x.document.documentTypeId === 3
            if (modelDoc.uploadDate > lastStageDueDate || j !== (x.modelDocument.length - 1) || x.document.documentTypeId === 3) {
              x.modelDocument[j]['ex'] = false;
            } else {
              x.modelDocument[j]['ex'] = true;
            }
          }
          // const fileUploadDate = x.modelDocument[0].uploadDate;
          // if (fileUploadDate > lastStageDueDate) {
          //   x['ex'] = false;
          //   return;
          // } else {
          //   x['ex'] = true;
          //   return;
          // }
        }
      });
      /**確定文件上傳的stage */
      temp.forEach(document => {
        // if (document.modelDocument.length === 0) {   // 沒有上傳的stage為空
        //   document.modelDocument.push({});
        //   return ;
        // } else {
        document.modelDocument.forEach(modelDoc => {
          const uploadDate = modelDoc.uploadDate;
          if (uploadDate < modelInfo.C0) {
            modelDoc['currentStage'] = 'C0';
          } else if (uploadDate >= modelInfo.C0 && uploadDate < modelInfo.C1) {
            modelDoc['currentStage'] = 'C1';
          } else if (uploadDate >= modelInfo.C1 && uploadDate < modelInfo.C2) {
            modelDoc['currentStage'] = 'C2';
          } else if (uploadDate >= modelInfo.C2 && uploadDate < modelInfo.C3) {
            modelDoc['currentStage'] = 'C3';
          } else if (uploadDate >= modelInfo.C3 && uploadDate < modelInfo.C4) {
            modelDoc['currentStage'] = 'C4';
          } else if (uploadDate >= modelInfo.C4 && uploadDate < modelInfo.C5) {
            modelDoc['currentStage'] = 'C5';
          } else if (uploadDate >= modelInfo.C5 && uploadDate < modelInfo.C6) {
            modelDoc['currentStage'] = 'C6';
          } else {
            modelDoc['currentStage'] = 'EX';
          }
        });
        //
        // }
        document['stageCheckBox'] = [
          { label: 'C3', value: 'C3', checked: (!!document['C3'] ? true : false) },
          { label: 'C4', value: 'C4', checked: (!!document['C4'] ? true : false) },
          { label: 'C5', value: 'C5', checked: (!!document['C5'] ? true : false) }
        ];
      });
    }
    const dataSet = temp.filter(d => d.document.documentType.typeName === docType);

    return dataSet;
  }

  async deleteModelDocument(id) {
    return await this.newModelDocumentApi.deleteById(id).toPromise();

  }
}
