import { Injectable } from '@angular/core';
import {
  ProjectCodeProfileApi, ModelTypeMappingApi, ProjectNameProfileApi, WorkflowSignApi,
  WorkflowApi as WorkflowDfcApi, ProcessApi, MemberApi, MilitaryOrderSignApi, TargetOperationSignApi, WorkflowFormApi, WorkflowFormMappingApi, WorkflowSignatoryApi, V_ProjectSummaryApi, BasicModelApi, GroupModelApi, V_ProjectSelectApi
} from '@service/dfc_sdk/sdk';
import { ClsDfcMilitaryOrderQuery } from './military-order-sign';
import { Observable, Subject, forkJoin } from 'rxjs';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { map } from 'rxjs/operators';
import { WorkflowApi as WorkflowDFiApi } from '@service/dfi-sdk';
import { View_ModelYieldRateApi } from '@service/dfq_sdk/sdk';
// DFC SDK
import { LoopBackConfig as DFCLoopBackConfig } from '@service/dfc_sdk/sdk';
@Injectable({
  providedIn: 'root'
})
export class MilitaryOrderSignService {

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  private querySubject = new Subject<any>();
  private signSubject = new Subject<any>();
  transParam = {};
  constructor(
    private vProjectSummaryApi: V_ProjectSummaryApi,
    private vProjectSelectApi: V_ProjectSelectApi,
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private modelTypeMappingApi: ModelTypeMappingApi,
    private militaryOrderSignApi: MilitaryOrderSignApi,
    private targetOperationSignApi: TargetOperationSignApi,
    private workflowSignApi: WorkflowSignApi,
    private workflowApi: WorkflowDfcApi,
    private workflowDFiApi: WorkflowDFiApi,
    private processApi: ProcessApi,
    private memberApi: MemberApi,
    private dfcCommonService: DfcCommonService,
    private workflowFormApi: WorkflowFormApi,
    private workflowFormMappingApi: WorkflowFormMappingApi,
    private workflowSignatoryApi: WorkflowSignatoryApi,
    private vModelYieldRateApi: View_ModelYieldRateApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi
  ) { }

  // 獲取廠別下拉框
  getPlantSelect(): Promise<any> {
    return this.projectCodeProfileApi.GetPlant().toPromise().then(datas => {
      const plantList = [];
      datas.forEach(data => {
        if (!data['plant']) {
          plantList.push({ Value: data['plant'], Label: '无' });
        } else {
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === data['plant']);
          plantList.push({ Value: data['plant'], Label: plantMap['PlantName'] });
        }
      });
      return plantList;
    });
  }

  // 獲取BU下拉框
  getBUSelect(plant, bu): Promise<any> {
    return this.vProjectSummaryApi.find({
      'fields': ['BU'],
      'where': {
        'and': [
          { 'Plant': plant },
          { 'BU': { 'like': bu + '%' } },
          { 'CurrentStage': { 'neq': 'EX' } }
        ]
      }
    }).toPromise().then(proDatas => {
      const buList = proDatas.reduce((p, t) => {
        if (!!t['BU'] && !p['bu'].includes(t['BU'])) {
          p['bu'].push(t['BU']);
          p['select'].push({ Value: t['BU'], Label: t['BU'] });
        }
        return p;
      }, { bu: [], select: [] });
      return buList['select'];
    });
  }

  // 獲取客戶下拉框
  getCustomerSelect(custom: string, plant: string, bu: string): Promise<any> {
    return this.vProjectSummaryApi.find({
      'fields': ['Customer'],
      'where': {
        'and': [
          { 'Plant': plant },
          { 'Customer': { 'like': custom + '%' } },
          { 'BU': { 'like': bu + '%' } },
          { 'CurrentStage': { 'neq': 'EX' } }
        ]
      }
    }).toPromise().then(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['Customer']) && !!t['Customer']) {
          p['temp'].push(t['Customer']);
          p['customer'].push({ Value: t['Customer'], Label: t['Customer'] });
        }
        return p;
      }, { 'customer': [], 'temp': [] });
      return list['customer'];
    });
  }

  // 獲取產品下拉框的值
  getModelType(): Promise<any> {
    return this.modelTypeMappingApi.find({}).toPromise().then(datas => {
      const list = [];
      datas.forEach(data => {
        list.push({ Value: data['ModelType'], Label: data['ModelType'] });
      });
      return list;
    });
  }

  // 獲取ProjectName下拉框
  async getProNameSelect(proName, queryValue: ClsDfcMilitaryOrderQuery): Promise<any> {
    return this.vProjectSelectApi.find({
      'where': {
        'and': [
          { 'Plant': queryValue.plant },
          { 'ProjectName': { 'like': proName + '%' } },
          { 'Customer': { 'like': (!queryValue.custom ? '' : queryValue.custom) + '%' } },
          { 'ModelType': { 'like': (!queryValue.modelType ? '' : queryValue.modelType) + '%' } },
          { 'BU': { 'like': (!queryValue.bu ? '' : queryValue.bu) + '%' } },
          { 'CurrentStage': { 'neq': 'EX' } },
          { 'IsRfq': 0 },
          { 'Status': { 'nin': [2, 3] } },
        ]
      },
      'fields': ['ProjectName', 'ProjectNameID', 'ProjectCodeID'],
      'limit': 200
    }).toPromise().then(datas => {
      const list = datas.reduce((p, t) => {
        if (!p['temp'].includes(t['ProjectNameID']) && !!t['ProjectNameID']) {
          p['temp'].push(t['ProjectNameID']);
          p['select'].push(
            {
              Value: t['ProjectNameID'],
              Label: t['ProjectName'],
              ProjectCodeID: t['ProjectCodeID']
            }
          );
        }
        return p;
      }, { 'select': [], 'temp': [] });
      return list['select'];
    });
  }

  // 獲取ProjectCode下拉框
  async getProCodeSelect(proCode: string, queryValue: ClsDfcMilitaryOrderQuery): Promise<any> {
    const proCodeDatas = await this.vProjectSelectApi.find({
      'fields': ['ProjectCode', 'ProjectCodeID'],
      'where': {
        'and': [
          { 'Plant': queryValue.plant },
          { 'ProjectCode': { 'like': proCode + '%' } },
          { 'Customer': { 'like': (!queryValue.custom ? '' : queryValue.custom) + '%' } },
          { 'ModelType': { 'like': (!queryValue.modelType ? '' : queryValue.modelType) + '%' } },
          { 'BU': { 'like': (!queryValue.bu ? '' : queryValue.bu) + '%' } },
          { 'ProjectNameID': { 'like': (!queryValue.proName ? '' : queryValue.proName) + '%' } },
          { 'CurrentStage': { 'neq': 'EX' } },
          { 'IsRfq': 0 },
          { 'Status': { 'nin': [2, 3] } },
        ]
      },
      'limit': 200
    }).toPromise();
    const res = proCodeDatas.reduce((p, t) => {
      if (!p['temp'].includes(t['ProjectCodeID']) && !!t['ProjectCodeID']) {
        p['temp'].push(t['ProjectCodeID']);
        p['select'].push({ Value: t['ProjectCodeID'], Label: t['ProjectCode'] });
      }
      return p;
    }, { 'select': [], 'temp': [] });
    return res['select'];
  }

  // 簽核頁面 邀簽 Member下拉框
  async getAddSignMember(member): Promise<any> {
    const members = await this.memberApi.find({
      'fields': ['EmpID', 'Name', 'EName'],
      'where': {
        'or': [
          { 'EmpID': { 'like': '%' + member + '%' } },
          { 'Name': { 'like': '%' + member + '%' } },
          { 'EName': { 'like': '%' + member + '%' } }
        ]
      },
      'limit': 20
    }).toPromise();
    const list = members.reduce((p, t) => {
      p['select'].push({ Value: t['EmpID'], Label: t['EmpID'] + '\t' + t['EName'] + '\t' + t['Name'] });
      return p;
    }, { 'select': [] });
    return list['select'];
  }

  // 签核页面查询
  async querySign(queryValue: ClsDfcMilitaryOrderQuery): Promise<any> {
    // 1.查詢出所使用的基本信息
    const proNameData = await this.projectNameProfileApi.findById(queryValue.proName, {
      'include': [
        {
          'relation': 'projectCodeProfile',
          'scope': {
            'include': ['BU']
          }
        },
        {
          'relation': 'basicModels',
          'scope': {
            'include': [{
              'relation': 'stages',
              'scope': {
                'where': {
                  'Stage': 'RFQ'
                }
              }
            }]
          }
        },
        {
          'relation': 'groupModels',
          'scope': {
            'where': {
              'isMilitary': true
            },
            'include': [{
              'relation': 'groupModelMappings'
            }]
          }
        }
      ]
    }).toPromise();
    // 工时达标期限
    const workhourStandardDayTemp = new Date(proNameData['projectCodeProfile']['C5DueDay']);
    workhourStandardDayTemp.setDate(workhourStandardDayTemp.getDate() + 7);
    const workhourStandardDay = this.changeScheduleData(workhourStandardDayTemp);
    // 良率达标期限
    const faYRGoalStandardDayTemp = new Date(proNameData['projectCodeProfile']['C5DueDay']);
    faYRGoalStandardDayTemp.setDate(faYRGoalStandardDayTemp.getDate() + 28);
    const faYRGoalStandardDay = this.changeScheduleData(faYRGoalStandardDayTemp);
    // 1.2 查詢出機種 的 良率
    // 1.2.1 DFQ良率預測
    const vModelYieldRate = await this.vModelYieldRateApi.find({
      'fields': ['plant', 'model', 'improvedYieldRate'],
      'where': {
        'and': [
          { 'plant': proNameData['projectCodeProfile']['Plant'] },
          { 'project': proNameData['RfqProjectCode'] },
          { 'status': 1 }
        ]
      }
    }).toPromise().then(datas => datas[0]).catch(error => console.log(error));
    const faYRGoal = (!!vModelYieldRate && !!vModelYieldRate['improvedYieldRate']) ? vModelYieldRate['improvedYieldRate'] : 0;
    // 返回的數據格式
    const res = {
      flag: false, // 標誌為 是否顯示 簽核狀態, false -- 啟動按鈕/txt文本, true -- Approve
      editFlag: false, // 標誌為 是否可以編輯
      txt: '', // 若在OperationStatus中沒有, 則增加顯示說明
      militaryFlag: false, // 軍令狀是否啟動
      table: {
        imgSrc: '',
        pic: '',
        customer: proNameData['projectCodeProfile']['Customer'],
        modelType: proNameData['projectCodeProfile']['ModelType'],
        fcst: proNameData['FCST'],
        proCode: proNameData['ProjectCode'],
        proCodeID: proNameData['ProjectCodeID'],
        proName: proNameData['ProjectName'],
        proNameID: queryValue.proName,
        plantCapacity: '', // plant規模量
        size: '', // 機種尺寸
        c3: this.changeScheduleData(proNameData['projectCodeProfile']['C2DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C3DueDay']), // C3時間
        c4: this.changeScheduleData(proNameData['projectCodeProfile']['C3DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C4DueDay']), // C4時間
        c5: this.changeScheduleData(proNameData['projectCodeProfile']['C4DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C5DueDay']), // C5時間
        mp: this.changeScheduleData(proNameData['projectCodeProfile']['C5DueDay']), // MP時間
        modelList: []
      },
      militaryNo: '',
      militaryCode: '',
      signID: 0,
      signID2: 0,
      militaryStatus: null, // 0 --- 未啟動, 1 --- 簽核中, 2 --- 已簽核, 3 --- 駁回  默認填-1只是為了UI顯示
      bu: proNameData['projectCodeProfile']['BU']['BU'],
      bg: proNameData['projectCodeProfile']['BU']['BG'],
      plant: proNameData['projectCodeProfile']['Plant'],
      proCodeID: proNameData['ProjectCodeID'],
      isMohFAYield: false
    };
    // 2.初步合成modelList需要的資料內容
    const signModelList = { 'list': [], 'modelIds': [] }; // 若未签核 则会去 查找是否已经有 目标签核的 modelList
    let partsAndQuoteFlag = true;
    // 2.1 basicModel
    for (let basicIndex = 0; basicIndex < proNameData['basicModels'].length; basicIndex++) {
      const model = proNameData['basicModels'][basicIndex];
      if (model['isMilitary']) {
        const workhourMoh = await this.modelWorkhourAndMoh(model['modelId'], 1).toPromise().then(d => d).catch(error => console.log(error));
        const mohGap = workhourMoh['mohTarget'] - (!!model['quoat'] ? model['quoat'] : 0);
        partsAndQuoteFlag = partsAndQuoteFlag && ((!!model['parts'] || model['parts'] === 0) && (!!model['quoat'] || model['quoat'] === 0));
        res['table']['modelList'].push({
          ...model,
          type: 1,
          workhourStandardDay: this.changeScheduleData(workhourStandardDay), // 達標期限 MP + 1Week
          faYRGoal: workhourMoh['FAYield'], // FA YR Goal
          faYRGoalStandardDay: this.changeScheduleData(faYRGoalStandardDay), // 達標期限 MP + 4Week
          workhourActual: workhourMoh['workhourActual'].toFixed(2), // 初始 工時
          workhourTarget: workhourMoh['workhourTarget'].toFixed(2), // 目標工時
          mohTarget: workhourMoh['mohTarget'].toFixed(2), // MOH目標
          mohGap: !!mohGap ? mohGap.toFixed(2) : '-'
        });
        // 2.1.2 将 isMilitary 数据放进 signModelList 以便之后的检查
        signModelList['list'].push({ ...model, type: 1 });
        signModelList['modelIds'].push(model['modelId']);
      }
    }
    // 2.2 groupModel
    for (let groupIndex = 0; groupIndex < proNameData['groupModels'].length; groupIndex++) {
      const groupModel = proNameData['groupModels'][groupIndex];
      const workhourMoh = await this.modelWorkhourAndMoh(groupModel['groupModelId'], 2).toPromise().then(d => d).catch(error => console.log(error));
      const mohGap = workhourMoh['mohTarget'] - (!!groupModel['quoat'] ? groupModel['quoat'] : 0);
      partsAndQuoteFlag = partsAndQuoteFlag && ((!!groupModel['parts'] || groupModel['parts'] === 0) && (!!groupModel['quoat'] || groupModel['quoat'] === 0));
      res['table']['modelList'].push({
        ...groupModel,
        type: 2,
        modelId: groupModel.groupModelId,
        modelName: groupModel.groupModelName,
        workhourStandardDay: this.changeScheduleData(workhourStandardDay), // 達標期限 MP + 1Week
        faYRGoal: workhourMoh['FAYield'], // FA YR Goal
        faYRGoalStandardDay: this.changeScheduleData(faYRGoalStandardDay), // 達標期限 MP + 4Week
        workhourActual: workhourMoh['workhourActual'].toFixed(2), // 初始 工時
        workhourTarget: workhourMoh['workhourTarget'].toFixed(2), // 目標工時
        mohTarget: workhourMoh['mohTarget'].toFixed(2), // MOH目標
        mohGap: !!mohGap ? mohGap.toFixed(2) : '-'
      });
      // 2.2.2 将 groupModel中 提及的basicModel 放进 signModelList 以便之后的检查
      groupModel['groupModelMappings'].forEach(mappingData => {
        if (!signModelList['modelIds'].includes(mappingData['modelId'])) {
          const model = proNameData['basicModels'].find(d => d.modelId === mappingData['modelId']);
          signModelList['list'].push({
            ...model,
            type: 2,
            groupModelName: groupModel.groupModelName,
            groupModelId: groupModel.groupModelId
          });
          signModelList['modelIds'].push(model['modelId']);
        }
      });
    }
    // 3.各種判斷
    // 3.1 判斷 MilitaryOrderSign 表中 是否有數據, 有--有存值或者已經啟動簽核, 無--需要檢查 model各個 製程 是否已經 簽核完畢
    const militaryOrderData = await this.militaryOrderSignApi.find({ 'where': { 'projectNameID': queryValue.proName } }).toPromise();
    if (militaryOrderData.length > 0) { // 有資料
      // 3.1.1 基礎資料 補充完整
      res['table']['plantCapacity'] = militaryOrderData[0]['plantCapacity'];
      res['table']['size'] = militaryOrderData[0]['size'];
      const apiURL = DFCLoopBackConfig.getPath().toString();
      res['table']['imgSrc'] = !militaryOrderData[0]['pic'] ? '' : apiURL + '/api/uploads/picture/download/' + militaryOrderData[0]['pic'];
      res['table']['pic'] = !militaryOrderData[0]['pic'] ? '' : militaryOrderData[0]['pic'];
      // 3.1.2 判斷是否有填寫完整
      if (!militaryOrderData[0]['plantCapacity']
        || !militaryOrderData[0]['size']
        || !militaryOrderData[0]['pic']
        || !partsAndQuoteFlag) {
        res['txt'] = '有未填寫參數, 請完善后 啟動...';
        res['militaryFlag'] = false;
        res['editFlag'] = true;
      } else {
        res['militaryFlag'] = (!militaryOrderData[0]['signID'] ? false : true);
        res['flag'] = (!militaryOrderData[0]['signID'] ? false : true);
        res['editFlag'] = (!militaryOrderData[0]['signID'] ? true : false);
      }
      // 3.1.3 存放進其他數據
      res['signID'] = militaryOrderData[0]['signID'];
      res['signID2'] = militaryOrderData[0]['signID2'];
      res['militaryNo'] = militaryOrderData[0]['id'];
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === proNameData['projectCodeProfile']['Plant']);
      res['militaryCode'] = 'P' + plantMap['PlantName'].split('-')[0] + plantMap['PlantName'].split('-')[1] +
        this.changeScheduleData((new Date(militaryOrderData[0]['date'])).toLocaleDateString(), true) + militaryOrderData[0]['id'];
      res['isMohFAYield'] = (!militaryOrderData[0]['isMohFAYield'] ? false : true);
      if (!res['isMohFAYield']) {
        res['table']['modelList'].forEach(modelList => {
          modelList.faYRGoal = faYRGoal;
        });
      }
    } else { // 無資料
      // 3.2.1 查詢出所有要檢查的製程
      const processDatas = await this.processApi.find({}).toPromise();
      const processModelType = await this.dfcCommonService.getProcess(queryValue.plant, queryValue.modelType).toPromise();
      const nowProcessCode = (processModelType[0]['processCode']).split(',');
      const process = processDatas.reduce((p, t) => {
        if (nowProcessCode.includes(t['ProcessCode'])) {
          p['processCode'].push(t['ProcessCode']);
          p['processDatas'].push(t);
        }
        return p;
      }, { processCode: [], processDatas: [] });
      await this.getTargetSign(signModelList, process).then(d => {
        res['txt'] = d['txt'];
        res['editFlag'] = d['editFlag'];
      });
    }
    return res;
  }

  querySignObservable(): Observable<any> {
    return this.signSubject.asObservable();
  }

  querySignPush(data: any) {
    this.signSubject.next(data);
  }

  queryTableObservable(): Observable<any> {
    return this.querySubject.asObservable();
  }

  queryTablePush(data: any) {
    this.querySubject.next(data);
  }

  // 查询页面信息 --- 已知ProNameID
  async queryTabel(queryValue: ClsDfcMilitaryOrderQuery): Promise<any> {
    const dataSet = {};
    const pipData = { 0: 0, 1: 0, 2: 0 };
    let proQuery = {};
    proQuery = {
      'fields': ['ProjectNameID', 'Plant', 'Customer', 'ModelType', 'ProjectCode', 'ProjectCodeID', 'ProjectName'],
      'where': {
        'and': [
          { 'Plant': queryValue.plant },
          { 'CurrentStage': { 'neq': 'EX' } },
          { 'IsRfq': 0 },
          { 'Status': 0 },
        ]
      }
    };
    if (!!queryValue.bu) {
      proQuery['where']['and'].push({ 'BU': { 'like': (!queryValue.bu ? '' : queryValue.bu) + '%' } });
    }
    if (!!queryValue.custom) {
      proQuery['where']['and'].push({ 'Customer': { 'like': (!queryValue.custom ? '' : queryValue.custom) + '%' } });
    }
    if (!!queryValue.modelType) {
      proQuery['where']['and'].push({ 'ModelType': { 'like': (!queryValue.modelType ? '' : queryValue.modelType) + '%' } });
    }
    if (!!queryValue.proName) {
      proQuery['where']['and'].push({ 'ProjectNameID': { 'like': (!queryValue.proName ? '' : queryValue.proName) + '%' } });
    }
    if (!!queryValue.proCode) {
      proQuery['where']['and'].push({ 'ProjectCodeID': { 'like': (!queryValue.proCode ? '' : queryValue.proCode) + '%' } });
    }
    const proDatas = await this.vProjectSelectApi.find(proQuery).toPromise();
    let proNameID = [];
    proDatas.forEach(proData => {
      if (!proNameID.includes(proData['ProjectNameID'])) {
        proNameID.push(proData['ProjectNameID']);
        const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === proData['Plant']);
        dataSet[proData['ProjectNameID']] = {
          no: '',
          code: '',
          plant: proData['Plant'],
          plantName: plantMap['PlantName'],
          customer: proData['Customer'],
          modelType: proData['ModelType'],
          proCode: proData['ProjectCode'],
          proCodeID: proData['ProjectCodeID'],
          proName: proData['ProjectName'],
          proNameID: proData['ProjectNameID'],
          status: '未啟動',
          statusCode: '-1',
          desc: [],
          signID: -1,
          signID2: -1
        };
        pipData['0'] += 1;
      }
    });
    // 1.在簽核相關表中查詢出有關數據
    const militaryOrderDatas = await this.militaryOrderSignApi.find({
      'where': {
        'and': [
          { 'projectNameID': { 'inq': proNameID } }
        ]
      }
    }).toPromise();
    for (let index = 0; index < militaryOrderDatas.length; index++) {
      const militaryOrderData = militaryOrderDatas[index];
      dataSet[militaryOrderData['projectNameID']]['no'] = militaryOrderData['id'];
      dataSet[militaryOrderData['projectNameID']]['code'] = 'P' +
        dataSet[militaryOrderData['projectNameID']]['plantName'].split('-')[0] + dataSet[militaryOrderData['projectNameID']]['plantName'].split('-')[1] +
        this.changeScheduleData((new Date()).toLocaleDateString(), true) + militaryOrderData['id'];
      dataSet[militaryOrderData['projectNameID']]['signID'] = militaryOrderData['signID'];
      dataSet[militaryOrderData['projectNameID']]['signID2'] = militaryOrderData['signID2'];
      const desc = [];
      if (!!militaryOrderData['signID']) {
        const workFlow = await this.workflowApi.findById(militaryOrderData['signID']).toPromise().then(data => {
          return data;
        }).catch(error => {
          return { 'error': error };
        });
        let workFlow2;
        if (!!militaryOrderData['signID2']) {
          workFlow2 = await this.workflowApi.findById(militaryOrderData['signID2']).toPromise().then(data => {
            return data;
          }).catch(error => {
            return { 'error': error };
          });
        }
        if (workFlow['status'] === 1 && (!workFlow2 || (!!workFlow2 && workFlow2['status'] === 1))) {
          dataSet[militaryOrderData['projectNameID']]['status'] = '已簽核';
          dataSet[militaryOrderData['projectNameID']]['statusCode'] = '1';
          pipData['2'] += 1;
          pipData['0'] -= 1;
        } else {
          dataSet[militaryOrderData['projectNameID']]['status'] = '簽核中';
          dataSet[militaryOrderData['projectNameID']]['statusCode'] = '0';
          pipData['1'] += 1;
          pipData['0'] -= 1;
        }
        // 查詢出對應的人員名字
        if (!workFlow['error']) {
          if (!workFlow['current']) {
            desc.push('廠端已完成簽核');
          } else {
            const currentUser = await this.workflowApi.getCurrentUser(militaryOrderData['signID'], false).toPromise().then(data => {
              return data;
            }).catch(error => {
              return { 'error': error };
            });
            const member = await this.memberApi.findById(currentUser['userId'], {
              'fields': ['EmpID', 'EName']
            }).toPromise().then(data => {
              return data;
            }).catch(error => {
              return { 'error': error };
            });
            desc.push('等待' + member['EName'] + '簽核');
          }
        }
        if (!!workFlow2 && !workFlow2['error']) {
          if (!workFlow2['current']) {
            desc.push('BU已簽核完畢');
          } else {
            const currentUser = await this.workflowApi.getCurrentUser(militaryOrderData['signID2'], false).toPromise().then(data => {
              return data;
            }).catch(error => {
              return { 'error': error };
            });
            const member = await this.memberApi.findById(currentUser['userId'], {
              'fields': ['EmpID', 'EName']
            }).toPromise().then(data => {
              return data;
            }).catch(error => {
              return { 'error': error };
            });
            desc.push('等待' + member['EName'] + '簽核');
          }
        }
      }
      dataSet[militaryOrderData['projectNameID']]['desc'] = (desc.length < 1) ? ['軍令狀 未啟動'] : desc;
      proNameID = proNameID.filter(data => data !== (militaryOrderData['projectNameID'] + ''));
    }
    // 2.在 MilitaryOrderSign 表中 查詢不出資料的, desc 寫詳細
    const proNameDatas = await this.projectNameProfileApi.find({
      'where': {
        'ProjectNameID': { 'inq': proNameID }
      },
      'include': [
        {
          'relation': 'projectCodeProfile',
          'scope': {
            'include': ['BU']
          }
        },
        {
          'relation': 'basicModels',
          'scope': {
            'include': [{
              'relation': 'stages',
              'scope': {
                'where': {
                  'Stage': 'RFQ'
                }
              }
            }]
          }
        },
        {
          'relation': 'groupModels',
          'scope': {
            'where': {
              'isMilitary': true
            },
            'include': [{
              'relation': 'groupModelMappings'
            }]
          }
        }
      ]
    }).toPromise();
    const processDatas = await this.processApi.find({}).toPromise();
    const processList = processDatas.reduce((p, t) => {
      p['list'].push(t['ProcessCode']);
      p['processCode'] = p['list'].join();
      return p;
    }, { 'processCode': '', 'list': [] });
    const plantProcessDatas = {}; // 記錄查詢過得Process
    for (let proNameIndex = 0; proNameIndex < proNameDatas.length; proNameIndex++) {
      const proNameData = proNameDatas[proNameIndex];
      // 2.1 整合 modelList
      const signModelList = { 'list': [], 'modelIds': [] }; // 若未签核 则会去 查找是否已经有 目标签核的 modelList
      // 2.1.1 basicModel
      proNameData['basicModels'].forEach(model => {
        if (model['isMilitary']) {
          signModelList['list'].push({ ...model, type: 1 });
          signModelList['modelIds'].push(model['modelId']);
        }
      });
      // 2.1.2 groupModel
      proNameData['groupModels'].forEach(groupModel => {
        groupModel['groupModelMappings'].forEach(mappingData => {
          if (!signModelList['modelIds'].includes(mappingData['modelId'])) {
            const model = proNameData['basicModels'].find(d => d.modelId === mappingData['modelId']);
            signModelList['list'].push({
              ...model,
              type: 2,
              groupModelName: groupModel.groupModelName,
              groupModelId: groupModel.groupModelId
            });
            signModelList['modelIds'].push(model['modelId']);
          }
        });
      });
      // 2.2 查詢出所有要檢查的製程
      let processModelType;
      if (!plantProcessDatas[proNameData['projectCodeProfile']['Plant'] + '-' + proNameData['projectCodeProfile']['ModelType']]) {
        processModelType = await this.dfcCommonService.getProcess(proNameData['projectCodeProfile']['Plant'], proNameData['projectCodeProfile']['ModelType']).toPromise();
        if (processModelType.length < 1) {
          processModelType = [{ ...processList }];
        }
        plantProcessDatas[proNameData['projectCodeProfile']['Plant'] + '-' + proNameData['projectCodeProfile']['ModelType']] = [...processModelType];
      } else {
        processModelType = [...plantProcessDatas[proNameData['projectCodeProfile']['Plant'] + '-' + proNameData['projectCodeProfile']['ModelType']]];
      }
      const nowProcessCode = (processModelType[0]['processCode']).split(',');
      const process = processDatas.reduce((p, t) => {
        if (nowProcessCode.includes(t['ProcessCode'])) {
          p['processCode'].push(t['ProcessCode']);
          p['processDatas'].push(t);
        }
        return p;
      }, { processCode: [], processDatas: [] });
      // 2.3 得到最終 數據
      await this.getTargetSign(signModelList, process).then(d => {
        dataSet[proNameData['ProjectNameID']]['desc'] = [d['txt']];
      });
    }
    const res = { dataSet: [], pipData: pipData };
    for (const key in dataSet) {
      if (dataSet.hasOwnProperty(key)) {
        const data = dataSet[key];
        if (!queryValue.signStatus || (!!queryValue.signStatus && queryValue.signStatus === data['statusCode'])) {
          res['dataSet'].push(data);
        }
      }
    }
    return res;
  }

  // 各個製程狀態 簽核查詢
  private async getTargetSign(signModelList, process) {
    const res: any = { 'txt': '', 'editFlag': false };
    // 3.2.2 检查是否 目标工时 签核 是否已完成
    for (let signModelIndex = 0; signModelIndex < signModelList['list'].length; signModelIndex++) {
      const model = signModelList['list'][signModelIndex];
      if (model['stages'].length < 1) {
        res['txt'] = model['modelName'] + ' 無RFQ階段, 請檢查 機種工時有無上傳';
        break;
      }
      const targetSign = await this.targetOperationSignApi.find({
        'where': {
          'and': [
            { 'stageID': model['stages'][0]['StageID'] },
            { 'process': { 'inq': process['processCode'] } }
          ]
        },
        'include': ['workflow'],
        'order': 'id asc'
      }).toPromise().then(d => {
        const signList = d.reduce((p, t) => {
          p[t['process']] = { ...t };
          return p;
        }, {});
        return signList;
      }).catch(error => {
        console.log(error);
        return {};
      });
      // 3.2.2.2 檢查process
      if (JSON.stringify(targetSign) === '{}') {
        res['txt'] = model['modelName'] + ' 目標工時 無製程 送簽';
        break;
      } else {
        process['processDatas'].forEach(p => {
          if (targetSign.hasOwnProperty(p['ProcessCode'])) {
            switch (targetSign[p['ProcessCode']]['workflow']['status']) {
              case 0: {
                res['txt'] = model['modelName'] + ' ' + p['Name'] + ' 正在簽核中';
                res['editFlag'] = false;
                break;
              }
              case 1: {
                res['txt'] = '有未填寫參數, 請完善后 啟動...';
                res['editFlag'] = true;
                break;
              }
              case 2: {
                res['txt'] = model['modelName'] + ' ' + p['Name'] + ' 簽核被駁回, 請重新送簽';
                res['editFlag'] = false;
                break;
              }
              default: {
                res['txt'] = model['modelName'] + ' ' + p['Name'] + ' 正在簽核中';
                res['editFlag'] = false;
                break;
              }
            }
            if (!res['editFlag']) {
              return;
            }
          } else {
            res['txt'] = model['modelName'] + ' ' + p['Name'] + ' 未送簽';
            res['editFlag'] = false;
          }
        });
        if (!res['editFlag']) {
          break;
        }
      }
    }
    return res;
  }

  // 签核 -- 編輯保存
  async signSave(editData: any, queryValue: any, id, notice: string): Promise<any> {
    const promise: Promise<any>[] = [];
    let militaryOrderSign: Promise<any>;
    const militaryQuery = await this.militaryOrderSignApi.find({ where: { projectNameID: editData['proNameID'] } }).toPromise();
    if (militaryQuery.length > 0) {
      militaryOrderSign = this.militaryOrderSignApi.patchAttributes(militaryQuery[0]['id'], {
        'plantCapacity': editData['plantCapacity'],
        'size': editData['size'],
        'pic': editData['pic'],
      }).toPromise().then(res => {
        return {
          'res': 'success',
          'data': res
        };
      }).catch(error => {
        return {
          'res': 'fail',
          'data': error
        };
      });
    } else {
      militaryOrderSign = this.militaryOrderSignApi.create({
        'projectNameID': editData['proNameID'],
        'plantCapacity': editData['plantCapacity'],
        'size': editData['size'],
        'pic': editData['pic']
      }).toPromise().then(res => {
        return {
          'res': 'success',
          'data': res
        };
      }).catch(error => {
        return {
          'res': 'fail',
          'data': error
        };
      });
    }
    promise.push(militaryOrderSign);
    editData['modelList'].forEach(model => {
      let modelPromise: Promise<any>;
      if (model.type === 1) {
        modelPromise = this.basicModelApi.patchAttributes(model.modelId, {
          'parts': model['parts'],
          'quoat': model['quoat']
        }).toPromise().then(res => {
          return {
            'res': 'success',
            'data': res,
            'type': 1,
            'modelId': res['modelId']
          };
        }).catch(error => {
          return {
            'res': 'fail',
            'data': error
          };
        });
      } else {
        modelPromise = this.groupModelApi.patchAttributes(model.modelId, {
          'parts': model['parts'],
          'quoat': model['quoat']
        }).toPromise().then(res => {
          return {
            'res': 'success',
            'data': res,
            'type': 2,
            'modelId': res['groupModelId']
          };
        }).catch(error => {
          return {
            'res': 'fail',
            'data': error
          };
        });
      }
      promise.push(modelPromise);
    });
    return Promise.all(promise).then(res => {
      const data: any = { txt: '', militaryFlag: true, flag: false, res: res };
      res.forEach((r, i) => {
        if (r.res === 'success') {
          data.flag = true;
          if (i === 0) {
            data['plantCapacity'] = r.data['plantCapacity'];
            data['size'] = r.data['size'];
            data['pic'] = r.data['pic'];
            data['militaryID'] = r.data['id'];
            data['militaryFlag'] = data['militaryFlag'] &&
              ((!!r.data['plantCapacity'] || r.data['plantCapacity'] === 0) &&
                (!!r.data['size'] || r.data['size'] === 0) &&
                (!!r.data['pic'] || r.data['pic'] === 0));
          } else {
            data[(r.type + '-' + r.modelId)] = {
              parts: r.data.parts,
              quoat: r.data.quoat
            };
            data['militaryFlag'] = data['militaryFlag'] &&
              ((!!r.data['parts'] || r.data['parts'] === 0) &&
                (!!r.data['quoat'] || r.data['quoat'] === 0));
          }
        }
      });
      if (!data['militaryFlag']) {
        data.txt = notice;
      }
      data['militaryFlag'] = (!res[0]['data']['signID'] ? false : true);
      return data;
    });
  }

  FAYied(militaryID, isMohFAYield): Promise<any> {
    return this.militaryOrderSignApi.patchAttributes(militaryID, { isMohFAYield: isMohFAYield }).toPromise().then(rs => {
      return {
        res: 'success',
        data: rs
      };
    }).catch(error => {
      return {
        res: 'fail',
        data: error
      };
    });
  }

  // 啟動簽核
  async startUp(militaryNo, describe, plantMemberList, buMemberList, plantMapID, buMapID, proName): Promise<any> {
    const PlantWorkFlowData = await this.workflowApi.CreateNewSigningFlow(describe, plantMemberList, plantMapID).toPromise();
    let buWorkFlowData;
    if (buMemberList.length > 0) {
      buWorkFlowData = await this.workflowApi.CreateNewSigningFlow(describe, buMemberList, buMapID).toPromise();
      this.workflowDFiApi.patchAttributes(buWorkFlowData['data']['id'], {
        'status': 0,
        'workflowFormMappingId': buMapID,
        'routingParameter': '?proName=' + proName
      }).subscribe(data => console.log(data), error => console.log(error));
    }
    // 修改狀態
    this.workflowDFiApi.patchAttributes(PlantWorkFlowData['data']['id'], {
      'status': 0,
      'workflowFormMappingId': plantMapID,
      'routingParameter': '?proName=' + proName
    }).subscribe(data => console.log(data), error => console.log(error));
    const militaryData = {
      'id': militaryNo,
      'signID': PlantWorkFlowData['data']['id'],
      'date': new Date()
    };
    if (buMemberList.length > 0) {
      militaryData['signID2'] = buWorkFlowData['data']['id'];
    }
    return this.militaryOrderSignApi.patchOrCreate(militaryData).toPromise().then(rs => {
      return {
        res: 'success',
        data: rs
      };
    }).catch(error => {
      return {
        res: 'fail',
        data: error
      };
    });
  }

  sendPlantSelect(plant): Observable<any> {
    const signConfig = JSON.parse(localStorage.getItem('DFC_SignConfig'));
    return this.workflowFormMappingApi.find({
      'where': {
        'key': { 'like': 'Military_Order_' + plant + '%' }
      },
      'include': {
        'relation': 'workflowForm',
        'scope': {
          'where': {
            'name': signConfig['Military']
          }
        }
      }
    }).pipe(map((datas: any[]) => {
      const res = datas.reduce((p, t) => {
        const keys = t['key'].split('_');
        if (!p['temp'].includes(keys[2]) && keys[2].startsWith('F')) {
          p['temp'].push(keys[2]);
          p['select'].push({ Value: keys[2], Label: keys[2] });
        }
        return p;
      }, { 'temp': [], 'select': [] });
      return res['select'];
    }));
  }

  // 簽核人員 下拉框查詢
  async sendMemberSelect(name, role, proCodeID): Promise<any> {
    const memberData = await this.projectCodeProfileApi.getMembers(proCodeID, {
      'fields': ['EmpID', 'Name', 'EName'],
      'where': {
        'and': [
          { 'Role': role },
          {
            'or': [
              { 'EmpID': { 'like': '%' + name + '%' } },
              { 'Name': { 'like': '%' + name + '%' } },
              { 'EName': { 'like': '%' + name + '%' } }
            ]
          }
        ]
      }
    }).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    const list = memberData.reduce((p, t) => {
      if (!p['temp'].includes(t['EmpID'])) {
        p['select'].push({ Value: t['EmpID'], Label: t['EmpID'] + '\t' + t['Name'] + '\t' + t['EName'] });
        p['temp'].push(t['EmpID']);
      }
      return p;
    }, { 'select': [], 'temp': [] });
    return list['select'];
  }

  // 根据ID 查询出对应的 Member资讯
  getMember(empID) {
    return this.memberApi.findById(empID, {
      'fields': ['EmpID', 'Name', 'EName']
    }).toPromise().then(data => {
      return { Value: data['EmpID'], Label: data['EmpID'] + '\t' + data['Name'] + '\t' + data['EName'] };
    }).catch(error => console.log(error));
  }

  // 查詢 送簽 相關人員信息
  async sendMember(buPlant): Promise<any> {
    const signConfig = JSON.parse(localStorage.getItem('DFC_SignConfig'));
    const workflowForm = await this.workflowFormApi.find({
      'where': {
        'name': signConfig['Military']
      },
      'limit': 1
    }).toPromise().then(datas => {
      return datas[0];
    });
    if (!!workflowForm) {
      const workflowFormKey = 'Military_Order_' + buPlant;
      const workflowFormMap = await this.workflowFormMappingApi.find({
        'where': {
          'and': [{
            'workflowFormId': workflowForm['id'],
            'key': workflowFormKey
          }]
        },
        'limit': 1
      }).toPromise().then(datas => {
        return datas[0];
      });
      if (!!workflowFormMap) {
        const signatoryDatas = await this.workflowSignatoryApi.find({
          'where': {
            'workflowFormMappingId': workflowFormMap['id']
          },
          'order': 'stage asc'
        }).toPromise().then(data => {
          return data;
        });
        if (signatoryDatas.length > 0) {
          const list = signatoryDatas.reduce((p, t) => {
            p[t['stageDesc']] = t['picId'];
            return p;
          }, {});
          return { 'datas': list, 'workflowMappingID': workflowFormMap['id'] };
        }
      }
    }
  }

  async queryPrint(proNameID, militaryOrderNo, signIDs): Promise<any> {
    // 1.查詢出所使用的基本信息
    const proNameData = await this.projectNameProfileApi.findById(proNameID, {
      'include': [
        {
          'relation': 'projectCodeProfile',
          'scope': {
            'include': ['BU']
          }
        },
        {
          'relation': 'basicModels',
          'scope': {
            'include': [{
              'relation': 'stages',
              'scope': {
                'where': {
                  'Stage': 'RFQ'
                }
              }
            }]
          }
        },
        {
          'relation': 'groupModels',
          'scope': {
            'where': {
              'isMilitary': true
            },
            'include': [{
              'relation': 'groupModelMappings'
            }]
          }
        }
      ]
    }).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    if (!proNameData) {
      return;
    }
    const workhourStandardDay = new Date(proNameData['projectCodeProfile']['C5DueDay']);
    workhourStandardDay.setDate(workhourStandardDay.getDate() + 7);
    const faYRGoalStandardDay = new Date(proNameData['projectCodeProfile']['C5DueDay']);
    faYRGoalStandardDay.setDate(faYRGoalStandardDay.getDate() + 28);
    const vModelYieldRate = await this.vModelYieldRateApi.find({
      'fields': ['plant', 'model', 'improvedYieldRate'],
      'where': {
        'and': [
          { 'plant': proNameData['projectCodeProfile']['Plant'] },
          { 'project': proNameData['RfqProjectCode'] },
          { 'status': 1 }
        ]
      }
    }).toPromise().then(datas => datas[0]).catch(error => console.log(error));
    const faYRGoal = (!!vModelYieldRate && !!vModelYieldRate['improvedYieldRate']) ? vModelYieldRate['improvedYieldRate'] : 0;
    const res = {
      isMohFAYield: false,
      formCode: '',
      pic: '',
      imgSrc: '',
      customer: proNameData['projectCodeProfile']['Customer'],
      modelType: proNameData['projectCodeProfile']['ModelType'],
      fcst: proNameData['FCST'],
      proName: proNameData['ProjectName'],
      proNameID: proNameID,
      proCode: proNameData['ProjectCode'],
      proCodeID: proNameData['ProjectCodeID'],
      plantCapacity: 0, // plant規模量
      size: '', // 機種尺寸
      modelList: [],
      c3: this.changeScheduleData(proNameData['projectCodeProfile']['C2DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C3DueDay']), // C3時間
      c4: this.changeScheduleData(proNameData['projectCodeProfile']['C3DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C4DueDay']), // C4時間
      c5: this.changeScheduleData(proNameData['projectCodeProfile']['C4DueDay']) + '~' + this.changeScheduleData(proNameData['projectCodeProfile']['C5DueDay']), // C5時間
      mp: this.changeScheduleData(proNameData['projectCodeProfile']['C5DueDay']), // MP時間
      IE: '',
      PME: '',
      PE: '',
      PSE: '',
      DFI_LEADER: '',
      GSQM: '',
      PQM: '',
      PLANT_MANAGER: '',
      EE: '',
      ME: '',
      SW: '',
      PM: '',
      PM_HEAD: '',
      BU_HEAD: ''
    };
    // 2.初步合成modelList需要的資料內容
    for (let basicIndex = 0; basicIndex < proNameData['basicModels'].length; basicIndex++) {
      const model = proNameData['basicModels'][basicIndex];
      if (model['isMilitary']) {
        const workhourMoh = await this.modelWorkhourAndMoh(model['modelId'], 1).toPromise().then(d => d).catch(error => console.log(error));
        const mohGap = workhourMoh['mohTarget'] - (!!model['quoat'] ? model['quoat'] : 0);
        res['modelList'].push({
          ...model,
          type: 1,
          workhourStandardDay: this.changeScheduleData(workhourStandardDay), // 達標期限 MP + 1Week
          faYRGoal: workhourMoh['FAYield'], // FA YR Goal
          faYRGoalStandardDay: this.changeScheduleData(faYRGoalStandardDay), // 達標期限 MP + 4Week
          workhourActual: workhourMoh['workhourActual'].toFixed(2), // 初始 工時
          workhourTarget: workhourMoh['workhourTarget'].toFixed(2), // 目標工時
          mohTarget: workhourMoh['mohTarget'], // MOH目標
          mohGap: !!mohGap ? mohGap.toFixed(2) : '-'
        });
      }
    }
    // 2.2 groupModel
    for (let groupIndex = 0; groupIndex < proNameData['groupModels'].length; groupIndex++) {
      const groupModel = proNameData['groupModels'][groupIndex];
      const workhourMoh = await this.modelWorkhourAndMoh(groupModel['groupModelId'], 2).toPromise().then(d => d).catch(error => console.log(error));
      const mohGap = workhourMoh['mohTarget'] - (!!groupModel['quoat'] ? groupModel['quoat'] : 0);
      res['modelList'].push({
        ...groupModel,
        type: 2,
        modelId: groupModel.groupModelId,
        modelName: groupModel.groupModelName,
        workhourStandardDay: this.changeScheduleData(workhourStandardDay), // 達標期限 MP + 1Week
        faYRGoal: workhourMoh['FAYield'], // FA YR Goal
        faYRGoalStandardDay: this.changeScheduleData(faYRGoalStandardDay), // 達標期限 MP + 4Week
        workhourActual: workhourMoh['workhourActual'].toFixed(2), // 初始 工時
        workhourTarget: workhourMoh['workhourTarget'].toFixed(2), // 目標工時
        mohTarget: workhourMoh['mohTarget'].toFixed(2), // MOH目標
        mohGap: !!mohGap ? mohGap.toFixed(2) : '-'
      });
    }
    // 2.查詢MilitaryOrder表
    const militaryOrderData = await this.militaryOrderSignApi.findById(militaryOrderNo).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    if (!!militaryOrderData) {
      res['plantCapacity'] = militaryOrderData['plantCapacity'];
      res['size'] = militaryOrderData['size'];
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === proNameData['projectCodeProfile']['Plant']);
      res['formCode'] = 'P' + plantMap['PlantName'].split('-')[0] + plantMap['PlantName'].split('-')[1] +
        this.changeScheduleData((new Date(militaryOrderData['date'])).toLocaleDateString(), true) + militaryOrderData['id'];
      const apiURL = DFCLoopBackConfig.getPath().toString();
      res['imgSrc'] = !militaryOrderData['pic'] ? '' : apiURL + '/api/uploads/picture/download/' + militaryOrderData['pic'];
      res['pic'] = !militaryOrderData['pic'] ? '' : militaryOrderData['pic'];
      // 判斷良率來自何處
      res['isMohFAYield'] = (!militaryOrderData['isMohFAYield'] ? false : true);
      console.log(JSON.stringify(res));
      if (!res['isMohFAYield']) {
        res['modelList'].forEach(modelList => {
          modelList.faYRGoal = faYRGoal;
        });
      }
    }
    // 3.查詢出 簽核人員, 並在 WorkFlowSign表中查詢出對應的簽核狀態
    const workFlowID = [];
    if (!!militaryOrderData['signID']) {
      workFlowID.push(militaryOrderData['signID']);
    }
    if (!!militaryOrderData['signID2']) {
      workFlowID.push(militaryOrderData['signID2']);
    }
    const signMemberList = await this.workflowSignApi.find({
      'where': {
        'and': [
          { 'workflowId': { 'inq': workFlowID } },
          { 'isAgree': true }
        ]
      }
    }).toPromise().then(data => data).catch(error => {
      console.log(error);
      return [];
    });
    for (let index = 0; index < signMemberList.length; index++) {
      const signMember = signMemberList[index];
      await this.memberApi.findById(signMember['userId'], {
        'fields': ['EName']
      }).toPromise().then(data => {
        res[signMember['role']] = data['EName'];
        return data;
      }).catch(error => console.log(error));
    }
    return res;
  }

  private modelWorkhourAndMoh(modelId, type) {
    if (type === 1) {
      return forkJoin(
        this.basicModelApi.GetMOHReport(modelId, 'RFQ'),
        this.basicModelApi.GetOpTimeReport(modelId, 'RFQ', true)
      ).pipe(map(res => {
        return this.modelWorkhourAndMohRes(res);
      }));
    } else {
      return forkJoin(
        this.groupModelApi.GetMOHReport(modelId, 'RFQ'),
        this.groupModelApi.GetOpTimeReport(modelId, 'RFQ'),
      ).pipe(map(res => {
        return this.modelWorkhourAndMohRes(res);
      }));
    }
  }

  private modelWorkhourAndMohRes(res) {
    let workhourActual = 0;
    let workhourTarget = 0;
    if (!!res[1]['result'] && res[1]['result']['operationTime']) {
      for (const key in res[1]['result']['operationTime']) {
        if (res[1]['result']['operationTime'].hasOwnProperty(key) && !key.endsWith('M')) {
          const operationTime = res[1]['result']['operationTime'][key];
          workhourActual += operationTime['costTime'];
          workhourTarget += operationTime['targetCostTime'];
        }
      }
    }
    return {
      workhourActual: workhourActual,
      workhourTarget: workhourTarget,
      mohTarget: (!!res[0]['result'] && !!res[0]['result']['mohTarget']) ? res[0]['result']['mohTarget'] : 0,
      FAYield: !!res[0]['result'] && !!res[0]['result']['FAYield'] ? res[0]['result']['FAYield'] : 0
    };
  }

  // 日期变换
  private changeScheduleData(date, type?): string {
    if (!date) {
      return '';
    }
    const changeDate = new Date(date);
    if (changeDate < new Date('1971/01/01')) {
      return '';
    } else {
      if (!!type) {
        return changeDate.getFullYear() + this.changeTime(changeDate.getMonth() + 1) + this.changeTime(changeDate.getDate());
      } else {
        return changeDate.toLocaleDateString();
      }
    }
  }

  // 時間格式改變
  private changeTime(data: number): string {
    let d: string;
    if (data < 10) {
      d = '0' + data;
    } else {
      d = data + '';
    }
    return d;
  }
}
