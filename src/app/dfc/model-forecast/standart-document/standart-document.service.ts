import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelTypeMappingApi, ProcessApi, V_StanderOperationApi, MemberApi, WorkflowFormMappingApi, WorkflowFormApi, WorkflowSignatoryApi, ModuleMappingApi, ModelTypeProcessSettingApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StandartDocumentService {

  constructor(
    private modelTypeMappingApi: ModelTypeMappingApi,
    private processApi: ProcessApi,
    private vStanderOperationApi: V_StanderOperationApi,
    private memberApi: MemberApi,
    private workflowSignatoryApi: WorkflowSignatoryApi,
    private workflowFormApi: WorkflowFormApi,
    private workflowFormMappingApi: WorkflowFormMappingApi,
    private moduleMappingApi: ModuleMappingApi,
    private modelTypeProcessMapping: ModelTypeProcessSettingApi
  ) { }

  // 獲取產品
  getModelTypeSelect(): Observable<any> {
    return this.modelTypeMappingApi.find({});
  }

  // 獲取產品
  getProcessSelect(): Observable<any> {
    return this.processApi.find({});
  }

  getModelTypeProcessSetting(modelType): Observable<any> {
    return this.modelTypeProcessMapping.find({ where: { modelType: modelType } });
  }

  // 表格數據查詢
  async queryData(queryValue: ClsDfcStandartDocSelect, skip?: number): Promise<any> {
    const standardDatas = await this.vStanderOperationApi.find({
      'where': {
        'and': [
          { 'OperationCode': { 'like': queryValue.operationCode + '%' } },
          { 'ModelType': queryValue.modelType },
          { 'ProcessCode': queryValue.process },
          { 'MaterialName': { 'like': '%' + queryValue.material + '%' } },
          { 'FactorName': { 'like': '%' + queryValue.factor + '%' } },
          { 'ActionName': { 'like': '%' + queryValue.action + '%' } }
        ]
      },
      'order': ['MaterialName ASC', 'OperationCode ASC', 'Version DESC'],
    }).toPromise();
    const dataSet = [];
    let currentFactorDetailID;
    let currentVersion;
    standardDatas.forEach((standardData, index) => {
      if (standardData['FactorDetailID'] !== currentFactorDetailID) {
        currentFactorDetailID = standardData['FactorDetailID'];
        currentVersion = standardData['Version'];
      } else if (standardData['FactorDetailID'] === currentFactorDetailID && currentVersion !== standardData['Version']) {
        return;
      }
      dataSet.push({
        Checked: false,
        No: index + '',
        ModelType: standardData['ModelType'],
        OperationCode: standardData['OperationCode'],
        CostTime: standardData['CostTime'],
        ProcessName: standardData['ProcessName'],
        MaterialName: standardData['MaterialName'],
        FactorName: standardData['FactorName'],
        FactorID: standardData['FactorID'],
        FactorDetail: standardData['FactorDetailName'],
        FactorDetailID: standardData['FactorDetailID'],
        ActionName: standardData['ActionName']
      });
    });
    return dataSet;
  }

  addFile(): Observable<any> {
    return this.vStanderOperationApi.find({});
  }

  // 新增模組時的下拉框
  async addModuleSelect(modelType, process): Promise<any> {
    const moduleDatas = await this.moduleMappingApi.GetModule(modelType, process).toPromise();
    const list = moduleDatas.reduce((p, t) => {
      if (!p['temp'].includes(t['module'])) {
        p['select'].push({ Value: t['module'], Label: t['module'] });
        p['temp'].push(t['module']);
      }
      return p;
    }, { 'select': [], 'temp': [] });
    return list['select'];
  }

  // 新增模組時的下拉框
  async findfactoryId(modelType, module): Promise<any> {
    const moduleDatas = await this.moduleMappingApi.find({
      'where': {
        'and': [
          { 'ModelType': modelType },
          { 'Module': module }
        ]
      }
    }).toPromise();
    const list = moduleDatas.map(data => {
      return data['FactorDetailID'];
    });
    return list;
  }

  // 查詢 送簽 相關人員信息
  async sendMember(modelType, process): Promise<any> {
    const signConfig = JSON.parse(localStorage.getItem('DFC_SignConfig'));
    const workflowForm = await this.workflowFormApi.find({
      'where': {
        'name': signConfig['Standard']
      },
      'limit': 1
    }).toPromise().then(datas => {
      return datas[0];
    });
    if (JSON.stringify(workflowForm) !== '{}') {
      const workflowFormKey = 'Standard_' + modelType;
      const workflowFormMap = await this.workflowFormMappingApi.find({
        'where': {
          'workflowFormId': workflowForm['id'],
          'key': { 'like': workflowFormKey + '%' }
        },
        'limit': 1
      }).toPromise().then(datas => {
        return datas[0];
      });
      if (!!workflowFormMap && JSON.stringify(workflowFormMap) !== '{}') {
        const signatoryDatas = await this.workflowSignatoryApi.find({
          'where': {
            'workflowFormMappingId': workflowFormMap['id']
          },
          'order': 'stage asc'
        }).toPromise().then(data => {
          return data;
        });
        if (signatoryDatas.length > 0) {
          return {
            flag: true,
            data: signatoryDatas
          };
        } else {
          return {
            flag: false,
            data: workflowFormMap
          };
        }
      } else {
        return false;
      }
    }
  }

  // 獲取簽核人員下拉框
  getSignMemberSelect(member) {
    return this.memberApi.findById(member).pipe(map(data => {
      return [{
        value: data['EmpID'],
        label: data['EmpID'] + '\t' + data['Name'] + '\t' + data['EName']
      }];
    }));
  }
}

/**
 * 工時標準文件維護 查詢框類
 */
export class ClsDfcStandartDocSelect {
  operationCode: string;
  modelType: string;
  process: string;
  material: string;
  factor: string;
  action: string;
}

/**
 * 頁面表格資料 類
 */
export class DFCStandartOperationTimeTableData {
  Checked: boolean; // 該列是否選中
  ModelType: string; // 產品
  OperationCode: string; // 識別碼
  CostTime: string; // 花費的時間, 工時
  ProcessName: string; // 製程
  MaterialName: string; // 物料名稱
  FactorName: string; // 因素名稱
  FactorDetail: string; // 因素細項
  ActionName: string; // 動作
}
