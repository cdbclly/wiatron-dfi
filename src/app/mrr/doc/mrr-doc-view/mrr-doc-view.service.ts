import { Injectable } from '@angular/core';
import { ProjectStageApi, V_PlantProjectApi, V_PlantProject, NewModelDocumentApi, ProductDocumentApi, LoopBackFilter, ProductDocument, NewModelDocument } from '@service/mrr-sdk';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PLM_allpartApi } from '@service/mrr-sdk/services/custom/PLM_allpart';
import { MrrDocQuerySelect } from './mrr-doc-view';

@Injectable({
  providedIn: 'root'
})
export class MrrDocViewService {

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [];

  constructor(
    private vPlantProjectApi: V_PlantProjectApi,
    private projectStageApi: ProjectStageApi,
    private allPartApi: PLM_allpartApi,
    private newModelDocumentApi: NewModelDocumentApi,
    private productDocumentApi: ProductDocumentApi
  ) { }

  queryCurrentStage(mrrModuleName, plant, productType, custom, proName): Observable<any> {
    return this.vPlantProjectApi.find({
      'where': {
        'and': [
          { 'plant': plant },
          { 'projectName': proName },
          { 'productType': productType },
          { 'customer': custom }
        ]
      }
    }).pipe(map(data => {
      data = data.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      if (data.length > 0) {
        return this.projectStageApi.find({
          'where': {
            'projectId': data[0]['projectCode']
          },
          'order': 'dueDate asc'
        }).pipe(map(stageDatas => {
          const dateNow = new Date();
          const stage = stageDatas.reduce((p, t) => {
            if (!p['flag'] && dateNow.getTime() < (new Date(t['dueDate']).getTime())) {
              p['flag'] = true;
              p['stage'] = t['stageId'];
            }
            return p;
          }, { 'stage': 'EX', 'flag': false });
          return of(stage['stage']);
        }));
      } else {
        return of('No related models！');
      }
    }));
  }

  routeProNameInfo(mrrModuleName, plant, proName): Observable<any> {
    return this.vPlantProjectApi.find({
      'where': {
        'and': [
          { 'plant': plant },
          { 'projectName': proName }
        ]
      },
      'fields': ['productType', 'customer', 'moduleName', 'moduleEnabled']
    }).pipe(map(datas => {
      datas = datas.filter(a => a['moduleName'] === mrrModuleName && a['moduleEnabled']);
      const plantMapping = this.PlantMapping.find(data => data.Plant === plant);
      return {
        site: plantMapping.Site,
        productType: datas[0]['productType'],
        customer: datas[0]['customer']
      };
    }));
  }

  async queryPLMAllPart(mrrModuleName, projectName: string) {
    const datas = await this.vPlantProjectApi.find({
      where: {
        and: [
          { projectName: projectName },
          { moduleName: mrrModuleName },
          { moduleEnabled: true }
        ]
      }
    }).toPromise();
    return this.allPartApi.find({ where: { PROJECTNAME: datas[0]['projectCode'] } }).toPromise();
  }

  /**
   * 查询表格中的数据
   *
   * @param {MrrDocQuerySelect} querySelect
   * @param {string} docType 判斷是 是否為全查, 還是查某一個 docType的資料, *為全查
   * @memberof MrrDocViewService
   */
  queryDataSet(mrrModuleName, plant, querySelect: MrrDocQuerySelect, docType) {
    // console.log(mrrModuleName, plant, querySelect, docType);

    const jobs: Promise<any>[] = [of('').toPromise(), of('').toPromise(), of('').toPromise()];
    // 查看 定義的 上傳文件, 此處只管 通用文件 類
    if (['*', '通用標準文件'].includes(docType)) {
      const queryProductDoc: LoopBackFilter = {
        where: {
          productId: querySelect.productType.value,
          plant: querySelect.plant.value
        },
        include: [{
          'document': {
            relation: 'documentType',
            scope: {
              where: {
                typeName: '通用標準文件'
              }
            }
          }
        },
        {
          relation: 'modelDocument',
          scope: {
            where: {
              modelId: querySelect.custom.value
            },
            order: 'uploadDate asc'
          }
        }
        ],
        order: 'productDocumentId'
      };
      jobs[0] = this.productDocumentApi.find<ProductDocument>(queryProductDoc).toPromise();
    }

    // 查看上傳文件
    if (querySelect.proName && querySelect.proName.value) {
      const queryModelDoc: LoopBackFilter = {
        where: {
          modelId: querySelect.proName.value
        },
        include: [{ 'productDocument': { 'document': 'documentType' } }],
        order: 'uploadDate asc'
      };
      jobs[1] = this.newModelDocumentApi.find<NewModelDocument>(queryModelDoc).toPromise();
      jobs[2] = this.vPlantProjectApi.find<V_PlantProject>({
        where: {
          and: [
            { projectName: querySelect.proName.value },
            { plant: plant },
            { moduleName: mrrModuleName },
            { moduleEnabled: 1 }
          ]
        }
      }).toPromise();
    }
    return forkJoin(jobs).pipe(map(queryDatas => {
      const temp = [];
      // 查看 定義的 上傳文件, 此處只管 通用文件 類
      if (['*', '通用標準文件'].includes(docType)) {
        const docs = queryDatas[0];
        docs.forEach(doc => {
          if (
            doc.document &&
            doc.document.documentType &&
            doc.document.documentType.typeName === '通用標準文件'
          ) {
            temp.push({
              productDocumentId: doc.productDocumentId,
              documentName: doc.document.documentName,
              typeName: doc.document.documentType.typeName,
              stageCheckBox: [
                { label: 'C3', value: 'C3', checked: (!!doc['C3'] ? true : false) },
                { label: 'C4', value: 'C4', checked: (!!doc['C4'] ? true : false) },
                { label: 'C5', value: 'C5', checked: (!!doc['C5'] ? true : false) }
              ],
              modelDocument: doc.modelDocument.map(d => {
                d.ex = false;
                d.currentStage = '';
                return d;
              })
            });
          }
        });
      }
      // 查看上傳文件
      if (querySelect.proName && querySelect.proName.value) {
        const modelInfo = queryDatas[2][0];
        // console.log(queryDatas[1]);

        const docs = queryDatas[1].reduce((p, c) => {
          if (
            c.productDocument &&
            c.productDocument.plant === querySelect.plant.value &&
            c.productDocument.document &&
            c.productDocument.document.documentType &&
            c.productDocument.document.documentType.typeName !== '通用標準文件'
          ) {
          const modelDoc = {
              Id: c['Id'],
              byPass: c['byPass'],
              filepath: c['filepath'],
              modelId: c['modelId'],
              productDocumentId: c['productDocumentId'],
              uploadDate: c['uploadDate'],
              uploadUser: c['uploadUser']
            };
            let doc;
            if (p['temp'].includes(c['productDocumentId'])) {
              doc = p['docs'].find(d => d.productDocumentId === c['productDocumentId']);
            } else {
              doc = {
                productDocumentId: c['productDocumentId'],
                stageCheckBox: [
                  { label: 'C3', value: 'C3', checked: (!!c.productDocument['C3'] ? true : false) },
                  { label: 'C4', value: 'C4', checked: (!!c.productDocument['C4'] ? true : false) },
                  { label: 'C5', value: 'C5', checked: (!!c.productDocument['C5'] ? true : false) }
                ],
                documentName: c.productDocument.document.documentName,
                typeName: c.productDocument.document.documentType.typeName,
                modelDocument: []
              };
            }
            // 判斷是否有無過期
            const stages = ['C2', 'C3', 'C4', 'C5', 'C6'];
            const currentStage = stages.indexOf(modelInfo.currentStage);
            for (let i = currentStage; i > 0; i--) {
              if (c.productDocument[stages[i]] === false) {
                continue;
              }
              const lastStageDueDate = modelInfo[stages[i - 1]];
              if (c.uploadDate > lastStageDueDate) {
                modelDoc['ex'] = false;
              } else {
                modelDoc['ex'] = true;
              }
            }
            const uploadDate = c.uploadDate;
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
              if (!uploadDate) {
                modelDoc['currentStage'] = '';
              } else {
                modelDoc['currentStage'] = 'EX';
              }
            }
            doc.modelDocument.push(modelDoc);
            if (!p['temp'].includes(c['productDocumentId'])) {
              p['temp'].push(c['productDocumentId']);
              p['docs'].push(doc);
            }
          }
          return p;
        }, { 'temp': [], 'docs': [] })['docs'];
        temp.push(...docs);
      }
      const dataSet = this.sort(temp, (x: any) => x.typeName, ['通用標準文件', '外觀標準文件', '機構標準文件']);
      return dataSet;
    }));
  }

  sort<T>(arr: Array<any>, fnc: (x: T) => any, mappingTable?: Array<any>) {
    return arr.sort(
      (a, b) => {
        const _a = mappingTable ? mappingTable.indexOf(fnc(a)) : fnc(a);
        const _b = mappingTable ? mappingTable.indexOf(fnc(b)) : fnc(b);
        if (_a > _b) {
          return 1;
        } else if (_a < _b) {
          return -1;
        } else {
          return 0;
        }
      }
    );
  }

  byPassSave(dataSet) {
    const reduceData = dataSet.reduce((p, c) => {
      c['modelDocument'].forEach(doc => {
        if (!p['byPass'][doc.modelId + doc.productDocumentId]) {
          p['byPass'][doc.modelId + doc.productDocumentId] = { id: [], bypass: doc.byPass };
        }
        p['byPass'][doc.modelId + doc.productDocumentId]['id'].push(doc.Id);
        p['update'].push({ Id: doc.Id, byPass: p['byPass'][doc.modelId + doc.productDocumentId]['bypass'] });
      });
      return p;
    }, { 'byPass': {}, 'update': [] });
    return forkJoin(reduceData['update'].map(d => {
      return this.newModelDocumentApi.patchAttributes(d.Id, { byPass: d.byPass });
    }));
  }
}


