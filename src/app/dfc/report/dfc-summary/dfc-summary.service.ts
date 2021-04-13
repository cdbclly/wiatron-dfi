import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi, ModelTypeMappingApi, ProjectNameProfileApi, StageApi, MOHApi, TargetOperationsApi, ProcessApi, V_ProjectSummaryApi, ModelTypeProcessSettingApi, BasicModelApi, GroupModelApi, GroupModelMappingApi, MilitaryOrderSignApi } from '@service/dfc_sdk/sdk';
import { Observable, of } from 'rxjs';

// import { ClsDfcKpiSelect, ClsDfcKpiReward, DfcKpiRewardsContent } from './dfc-kpi';

import { ClsDfcSummarySelect, ClsDfcSummaryReward } from './dfc-summary';

@Injectable({
  providedIn: 'root'
})
export class DfcSummaryService {
  [x: string]: any;
  private process: any[] = [];

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private modelTypeMappingApi: ModelTypeMappingApi,
    private mohApi: MOHApi,
    private targetOperationsApi: TargetOperationsApi,
    private stageApi: StageApi,
    private processApi: ProcessApi,
    private ProjectSummaryApi: V_ProjectSummaryApi,
    private modelTypeProcessSettingApi: ModelTypeProcessSettingApi,
    private basicModelApi: BasicModelApi,
    private groupModelApi: GroupModelApi,
    private groupModelMappingApi: GroupModelMappingApi,
    private militaryOrderSignApi: MilitaryOrderSignApi
  ) { }

  // 處理錯誤
  handlerError(message: string, err: any) {
    console.log(`${message} is error: ${err.message ? err.message : err.msg}`);
  }

  // 獲取ModelTypeProcessSetting
  queryModelTypeProcessSetting(selectValue: ClsDfcSummarySelect) {
    const query = {
      'where': {
        'and': [
          {'plant': selectValue.plant},
          {'modelType': {'like': '%' + selectValue.modelType + '%'}},
        ]
      }
    };

    return this.modelTypeProcessSettingApi.find(query);
  }

  // 獲取process
  async getProcess() {
    return await this.processApi.find().toPromise();
  }

  // 求字符串數組的并集
  getUnion(strArr: string[]): string[] {
    let sum: string[] = [];

    for (const str of strArr) {
      const temp: string[] = str.split(',');
      sum = [...sum, ...temp];
    }

    const sumSet = new Set(sum);  // 去重
    const result: string[] = Array.from(sumSet);
    return result;
  }
  // 對不同廠別的製程進行篩選和排序
  filterAndSortProcess(processHeaders: any[], processCodeArr: string[]): any[] {  // processHeaders必須是完整的製程
    // 獲取不同產品製程的並集
    const processCodeUnionArr: string[] = this.getUnion(processCodeArr);
    // 完整製程的順序
    const sequencrProcessCodeArr: string[] = ['D', 'DT', 'DP', 'LA', 'LT', 'LP', 'A', 'T', 'P'];
    const resultSequence: any[] = [];


    for (const processCode of sequencrProcessCodeArr) {  // 根據完成製程的順序，一個個判斷製程是否在不同產品製程的並集中
      const existProcessCode: string = processCodeUnionArr.find(code => code === processCode);
      if (!!existProcessCode) {
        const process: {} = processHeaders.find(item => item['ProcessCode'] === existProcessCode);
        resultSequence.push(process);
      }
    }

    return resultSequence;
  }

  getProcessCode(processArr: any[]): any[] {
    if (processArr.length !== 0) {
      return processArr.map( item => item['ProcessCode']);
    }

    return [];
  }

  getProcessName(processArr: any[]): any[] {
    if (processArr.length !== 0) {
      return processArr.map( item => item['Name']);
    }

    return [];
  }

  // 用斜杠替換原有數據
  dataToBias(arr: any[]): any[] {
    return arr.map(data => {
      return {
        cost: '/',
        gap: '/',
        target: '/',
        style: {},
        process: {
          click: true,
          expand: data.process.expand,
          arr: data.process.arr.map(item => {
            return { cost: '/', stageID: item.stageID, style: {}};
          }),
        }
      };
    });
  }

  // 重新組合數組，一部分保留，一部分用於去值
  operationArr(index: number, arr: any[]): any[] {
    const result: any[] = [];
    const tempArr: any[] = [];

    for (let i = 0; i <= index; i++) {
      result.push(arr[i]);
    }

    tempArr.push(...arr);
    tempArr.splice(0, index + 1);
    result.push(...this.dataToBias(tempArr));
    return result;
  }

  // 過濾當前階段之後的階段
  filterAfterCurrentStage(currStage: string, arr: any[]): any[] {
    let i: number;
    switch (currStage) {
      case 'RFQ':
        i = 0;
        return this.operationArr(i, arr);
      case 'C0':
        i = 1;
        return this.operationArr(i, arr);
      case 'C1':
        i = 2;
        return this.operationArr(i, arr);
      case 'C2':
        i = 3;
        return this.operationArr(i, arr);
      case 'C3':
        i = 4;
        return this.operationArr(i, arr);
      case 'C4':
        i = 5;
        return this.operationArr(i, arr);
      case 'C5':
        i = 6;
        return this.operationArr(i, arr);
      default:
        return arr;
    }
  }

  // 獲取廠別下拉框
  getProCodePlant(): Observable<any> {
    return this.projectCodeProfileApi.GetPlant();
  }

  // 獲取客戶下拉框
  getProCodeCustom(custom: string, plants: string[]): Observable<any> {
    const query = {
      'fields': { 'Customer': true },
      'where': {
        'and': [
          {'Plant': {'inq': plants}},
          {'Customer': {'like': '%' + custom + '%'}}
        ]
      }
    };
    return this.projectCodeProfileApi.find(query);
  }

  // 獲取產品下拉框的值
  getModelType(): Observable<any> {
    return this.modelTypeMappingApi.find({});
  }

  // 獲取ProjectCode下拉框
  getProNameSelect(selectValue: ClsDfcSummarySelect, proName): Promise<any> {
    // console.log(proCode);
    // console.log(plants);
    // console.log(custom);
    // console.log(modelType);
    //       // {'IsRfq': false}
    // console.log(cFlow);
    const query: any = {
      'where': {
        'and': [
          {'CurrentStage': { 'neq': 'EX' }},
          // {'Plant': {'inq': plants}},
          // {'ProjectCode': {'like': proCode + '%'}},
          // {'Customer': {'like': (!custom ? '' : custom) + '%'}},
          // {'ModelType': {'like': (!modelType ? '' : modelType) + '%'}},
          // {'CurrentStage':  {'inq': cFlow } },
          // {'IsRfq': false}
        ]
      },
      // 'limit': 20
      // debugger
    };
    if (!!selectValue.plant && selectValue.plant.length > 0) {
      query['where']['and'].push({'Plant': {'inq': selectValue.plant}});
    }
    if (!!selectValue.custom) {
      query['where']['and'].push({'Customer': selectValue.custom});
    }
    if (!!selectValue.modelType) {
      query['where']['and'].push({'ModelType': selectValue.modelType});
    }
    if (!!selectValue.cFlow && selectValue.cFlow.length > 0) {
      query['where']['and'].push({'CurrentStage': {'inq': selectValue.cFlow}});
    }
    if (!!proName) {
      query['where']['and'].push({'ProjectName': {'like': proName + '%'}});
    }

    return this.ProjectSummaryApi.find(query).toPromise();
  }


  // 請求stageApi，獲取stageIDs相關數據
  async queryStageIDs(proNames: number[], limit?: number): Promise<{}[]> {
    const query = {
      'where': {
        'ModelID': {'inq': proNames}
      }
    };
    if (!!limit) {
      query['limit'] = limit;
    }
    const stages: any = await this.stageApi.find(query).toPromise().catch(err => this.handlerError('stageApi', err));
    return stages;
  }

  // 查詢projectProName這張表中的fcst數據
  async queryProNameFcsts(proNameIDs: string[]): Promise<{}[]> {
    const query: {} = {
      'fields': ['FCST', 'ProjectName'],
      'where': {
        'ProjectNameID': {'inq': proNameIDs}
      }
    };
    const res: {}[] = await this.projectNameProfileApi.find(query).toPromise();
    return res;
  }

  // 獲取 projectNameIDs
  async queryProNameIDs(proCodes: string[], limit?: number): Promise<number[]> {
    const query: {} = {
      'fields': ['ProjectNameID'],
      'where': {
        'ProjectCodeID': {'inq': proCodes}
      }
    };
    if (!!limit) {
      query['limit'] = limit;
    }
    const proNameApiQuery: any = await this.projectNameProfileApi.find(query).toPromise().catch(err => this.handlerError('projectNameProfileApi', err));
    const proNameIDs = proNameApiQuery.map(item => item['ProjectNameID']);
    return proNameIDs;
  }

  // 獲取 projectCodeIDs
  async queryProCodeIDs(selectValue: ClsDfcSummarySelect, limit?: number): Promise<string[]> {
    const query: {} = {
      'fields': ['ProjectCodeID'],
      'where': {
        'and': [
          {'Plant': {'inq': selectValue.plant}},
          {'Customer': {'like': selectValue.custom + '%'}},
          {'ModelType': {'like': selectValue.modelType + '%'}},
          // {'IsRfq': false},
        ]
      }
    };
    if (!!limit) {
      query['limit'] = limit;
    }
    const proCodeApiQuery: any = await this.projectCodeProfileApi.find(query).toPromise().catch(err => this.handlerError('projectCodeProfileApi', err));
    const proCodeIDs = proCodeApiQuery.map(item => item['ProjectCodeID']);
    return proCodeIDs;
  }

  // 去掉currentStage不在CFlow中的項
  filterNotInCFlow(targetArr: any[], CFlow: string[]): any[] {
    if (CFlow.length > 0) {
      return targetArr.filter( item => {
        for (const cflow of CFlow) {
          if (item.CurrentStage === cflow) {
            return true;
          }
        }
        return false;
      });
    }

    return targetArr;
  }

  // 根據limit來截斷數據
  filterByLimit(twoArr: any[], limit: number): any[] {
    if (twoArr.length > limit) {
      const resultArr: any[] = [];
      for (let i = 0; i < limit; i++) {
        resultArr.push(twoArr[i]);
      }
      return resultArr;
    }
    return twoArr;
  }

  // 查詢V_ProjectSummary視圖
  async queryCurrenSummary(selectValue: ClsDfcSummarySelect, limit?: {limit: number, plant: string}): Promise<any[]> {
    const query: any = {
      'where': {
        'and': [
          {'CurrentStage': { 'neq': 'EX' }}
        ]
      }
    };

    if (!!limit && !!limit.plant) {
      query.where.and.push({'Plant': limit.plant});
    } else {
      query.where.and.push({'Plant': {'inq': selectValue.plant}});
      if (!!selectValue.custom) {
        query.where.and.push({'Customer': selectValue.custom});
      }
      if (!!selectValue.modelType) {
        query.where.and.push({'ModelType': selectValue.modelType});
      }
      if (!!selectValue.proCode) {
        query.where.and.push({'ProjectCodeID': selectValue.proCode});
      }
      if (!!selectValue.proName) {
        query.where.and.push({'ProjectNameID': selectValue.proName});
      }
    }

    if (selectValue.cFlow.length > 0) {
      query.where.and.push({'CurrentStage': {'inq': selectValue.cFlow}});
    }

    return await this.ProjectSummaryApi.find(query).toPromise();
  }

  getVirtualProcessArr(processHeader: any[]): any[] {
    const resultArr: any[] = [];
    for (let i = 0; i < processHeader.length; i++) {
      resultArr.push({cost: '/'});
    }
    return resultArr;
  }

  // 根據當前的製程計算每階段的製程綜合
  getSumOfProcess(obj: {}, stage: string, colData: {}, expandArr: any[], index: number, processArr: any[]): {} {
    const sum: {} = {};    // sum對象的結構如下: {cost: string, target: string, gap: string, process: {}}
    let cost: any = 0;
    let target: any = 0;
    let gap: any = 0;
    const process: {} = {};

    // tslint:disable-next-line:forin     process對象結構如下： {expand: string, click: boolean, arr: [ {cost: string, style: {}} ] }
    for (const key in obj) {
      if ( key.endsWith('M')) {
        continue;
      }
      cost += obj[key]['costTime'] ? obj[key]['costTime'] : 0;
      target += obj[key]['targetCostTime'] ? obj[key]['targetCostTime'] : 0;
    }

    const absGap = Math.abs((target === 0 ? 999 : ((cost - target) / target)));
    gap = cost - target;


    if (stage !== 'RFQ') {
      sum['isRFQ'] = false;
      process['expand'] = expandArr[index];
      process['click'] = true;
      const tempArr: {}[] = [];

      const processCodes = this.getProcessCode(processArr);  // processCode和數據庫返回的數據中保持一致

      for (const key of processCodes) {
        let cost2: any = obj[key] ? obj[key]['costTime'] : 0;
        const targetTime = obj[key] ? obj[key]['targetCostTime'] : 0;

        const range = (parseFloat(targetTime) === 0) ? 999 : (parseFloat(cost2) - parseFloat(targetTime)) / parseFloat(targetTime);
        const absRange = Math.abs(range);

        const style: {} = {color: ((absRange <= 0.05 || cost2 === 0) ? 'rgba(80, 80, 80, 1)' : 'red')};
        cost2 = cost2.toFixed(2);
        tempArr.push({ cost: cost2, style: style });
      }
      process['arr'] = tempArr;
    } else {
      sum['isRFQ'] = true;
    }


    sum['style'] = {color: (absGap <= 0.05 || cost === 0) ? 'rgba(80, 80, 80, 1)' : 'red' };
    cost = cost.toFixed(2);
    target = target.toFixed(2);
    sum['cost'] = cost;
    sum['target'] = target;
    sum['gap'] = gap.toFixed(2);
    sum['process'] = process;

    sum['stage'] = stage;
    sum['groupModelType'] = (colData['modelType'] === 'basic' ? 1 : 2);
    sum['modelID'] = colData['id'];

    if (stage === 'RFQ') {
      sum['style'] = {};
    }

    return sum;
  }

  // 把當前對象中的dueday組裝成一個數組
  getDueDayArr(obj: {}): string[] {
    const dueDayArr: string[] = [];
    const reg = /dueday$/i;

    for (const key in obj) {
      if (reg.test(key)) {
        dueDayArr.push(obj[key]);
      }
    }

    return dueDayArr;
  }

  // 根據dueday確定當前階段
  getCurrentStage(dueDayArr: any[]): {} {
    const dueDayMap: string[] = ['RFQ', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    const curDate = new Date().getTime();

    for (const dueDay of dueDayArr) {
      if (dueDay === null || dueDay === undefined) {
        continue;
      }
      const flowDate = Date.parse(dueDay);

      if (curDate < flowDate) {
        const index = dueDayArr.findIndex(item => item === dueDay);  // findIndex接收一個回調函數
         return {  stageName: dueDayMap[index], dueDay: dueDay, index: index - 1 };
      }
    }

    return {stageName: '所有階段都過期了', dueDay: null};
  }

  // 根據他們相同呢的ModelID把一維數組劃分為二維數組
  divideTwoArray(arr: any[]): any[] {
    const result: any[] = [];
    const collection: number[] = [];
    const key = 'ModelID';

    for (const data of arr) {
      if (collection.indexOf(data[key]) === -1) {   // 當ModelID不在collection中，則把ModelID相同的組成數組
        const temp: any[] = arr.filter(item => item[key] === data[key]);
        result.push(temp);
          collection.push(data[key]);
      }
    }

    for (const row of result) {  // 把RFQ放在成員的開頭
      const len: number = row.length;
      for (let i = 0; i < len; i++) {
        if (row[i].Stage === 'RFQ') {
          const rfq = row[i];
          row.splice(i, 1);
          row.unshift(rfq);
          break;
        }
      }
    }

    return result;
  }

  addRFQ(twoArr: any[]): boolean {
    for (const row of twoArr) {
      const len = row.length;
      for (let i = 0; i < len; i++) {
        if (row[i].Stage === 'RFQ') {
          return false;
        }
        if (i === len - 1) { // 機種沒有RFQ,則添加RFQ
          const rfq: {} = {
            StageWorkHourUploaded: false,
            StageID: null,
            Stage: 'RFQ'
          };
          row.unshift(rfq);
          return true;
        }
      }
    }

  }


  addAfterCurrentStage(twoArr: any[], len: number): void {
    for (const row of twoArr) {
      if (row.length < len) {
        for (let i = row.length; i < len; i++) {
          const stage: {} = {
            StageWorkHourUploaded: false,
            // StageID: null,
            Stage: `C${i - 1}`
          };
          row.push(stage);
        }
      }
    }
  }

  nameToPlant(name: string): string {
    const PlantMapping: any[] = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const plantMap = PlantMapping.find(plantMapData => plantMapData['PlantName'] === name);
    return !!plantMap ? plantMap.Plant : '';
  }

  plantToSite(plant: string): string {
    const PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const plantMap = PlantMapping.find(plantMapData => plantMapData['Plant'] === plant);
    return !!plantMap ? plantMap.Site : '';
  }
  plantToName(plant: string): string {
    const PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const plantMap = PlantMapping.find(plantMapData => plantMapData['Plant'] === plant);
    return !!plantMap ? plantMap.PlantName : '';
  }
  // 查詢targetOperationsApi的TargetOperationReport
  async queryTargetOperationReport(stageIDs: number[]): Promise<any> {
    return await this.targetOperationsApi.TargetOperationReport(stageIDs.toString(), true).toPromise().catch(err => this.handlerError('targetOperationsApi', err));
  }

  getTableEightColume(data: {}): {} {
    const dueDayArr: any[] = this.getDueDayArr(data['stageInfo']['ProjectName']['projectCodeProfile']);
    const currentStage: {} = this.getCurrentStage(dueDayArr);

    const table8: {} = {
      site: this.plantToSite(data['Plant']),
      customer: data['stageInfo']['ProjectName']['projectCodeProfile']['Customer'],
      modelType: data['ModelType'],
      projectCode: data['ProjectCode'],
      projectName: data['ProjectName'],
      currentStage: currentStage['stageName'],
      MPDate: new Date(data['stageInfo']['ProjectName']['projectCodeProfile']['C5DueDay']).toLocaleDateString(),
      FCST: data['stageInfo']['ProjectName']['FCST'].toFixed(2),
    };

    return table8;
  }

  async queryTable(selectValue: ClsDfcSummarySelect, limit: {limit: number, plant: string}, type: {type: string, expandArr?: any[], processHeaders?: any[]}) {
    let summaryDatas: any[] = [];
    const dataSet: any[] = [];

    summaryDatas = await this.queryCurrenSummary(selectValue, limit);

    if (summaryDatas.length === 0) {
      console.log('該條件下沒有可用數據');
      return [];
    }
    // 查詢出所帶的 Model, 如果沒有選擇Model, 則查詢ProjectName下的所有 BasicModel, GroupModel信息
    summaryDatas = await this.getModelList(selectValue.model, summaryDatas, type.expandArr, type.processHeaders, type.type, limit);

    // 讓請求同時發出來的
    const GetReportApi: Promise<any>[] = [];
    // 把stageTowArr變成二維數組，每個成員是一個機種的全部stage
    const summaryDatasTowArr: any[] = this.divideTwoArray(summaryDatas);

    const addedRfq = this.addRFQ(summaryDatasTowArr);  // summaryDatasTowArr中沒有RFQ階段的機種添上RFQ
    this.addAfterCurrentStage(summaryDatasTowArr, 8);   // 如果該機種沒有8個階段，則增加到8個
    for (const rowData of summaryDatasTowArr) {
      // 先合成前八項
      const index = !addedRfq ? 0 : 1;   // 某些機種沒有RFQ階段，本地添加的stageID為null，則index為第二個
      const tempRow: any[] = [
        rowData[index].Expand,
        rowData[index].GroupChild,
        rowData[index].GroupFlag,
        {
          proNameID: rowData[index].ProjectNameID,
          model: rowData[index].Model,
          expandArr: type.expandArr,
          processHeaders: type.processHeaders,
          modelID: rowData[index].ModelID,
          modelName: rowData[index].ModelName,
          groupType: (rowData[index].GroupFlag ? 2 : 1)
        },
        this.plantToSite(rowData[index].Plant),
        rowData[index].Customer,
        rowData[index].ModelType,
        rowData[index].ProjectCode,
        rowData[index].ProjectName,
        rowData[index].ModelName,
        rowData[index].CurrentStage,
        (!!rowData[index].MPDate ? new Date(rowData[index].MPDate).toLocaleDateString() : 'TBD'),
        rowData[index].FCST
      ];

      dataSet.push(tempRow);

      for (const col of rowData) {
        if (col.StageWorkHourUploaded) {
          let promise: Promise<any>;
          if (col.GroupFlag) {
            promise = (type.type !== 'workhour') ?
              this.groupModelApi.GetMOHReport(col.ModelID, col.Stage).toPromise().catch(err => err) :
              this.groupModelApi.GetOpTimeReport(col.ModelID, col.Stage).toPromise().catch(err => err);
          } else {
            promise = (type.type !== 'workhour') ?
              this.basicModelApi.GetMOHReport(col.ModelID, col.Stage).toPromise().catch(err => err) :
              this.basicModelApi.GetOpTimeReport(col.ModelID, col.Stage, true).toPromise().catch(err => err);
          }
          GetReportApi.push(promise);
        } else {
          GetReportApi.push(Promise.resolve('未到該階段'));
        }
      }
    }
    let resDataSet;
    if (type.type === 'workhour') {
      resDataSet = await this.workhourStage(GetReportApi, dataSet, type.expandArr, type.processHeaders);
    } else {
      resDataSet = await this.mohStage(GetReportApi, dataSet, summaryDatasTowArr);
    }
    return resDataSet;
  }

  /**
   * 獲取summaryModel 並將 Model信息加入進summaryDatas中
   *
   * @param {*} modelQuerySelect
   * @param {*} summaryDatas
   * @returns summaryDatas
   * @memberof DfcSummaryService
   */
  async getModelList(modelQuerySelect, summaryDatas, expandArr, processHeaders, type, limit?) {
    const proNameIdList = summaryDatas.reduce((p, t) => {
      if (!p['ids'].includes(t['ProjectNameID'])) {
        p['ids'].push(t['ProjectNameID']);
      }
      if (!p['list'][t['ModelID']]) {
        p['list'][t['ModelID']] = {
          'FCST': t['FCST'],
          'CurrentStage': t['CurrentStage'],
          'StageWorkHourUploaded': t['StageWorkHourUploaded']
        };
      }
      if (!p['proNameStage'][t['ProjectNameID']]) {
        p['proNameStage'][t['ProjectNameID']] = {
          'Plant': t['Plant'],
          'Customer': t['Customer'],
          'ModelType': t['ModelType'],
          'ProjectCodeID': t['ProjectCodeID'],
          'ProjectCode': t['ProjectCode'],
          'MPDate': t['MPDate'],
          'BU': t['BU'],
          'ProjectNameID': t['ProjectNameID'],
          'ProjectName': t['ProjectName'],
          'CurrentStage': t['CurrentStage']
        };
      }
      return p;
    }, {'ids': [], 'list': {}, 'proNameStage': {}});

    let modelList = [];

    if (!modelQuerySelect) { // 沒有選擇 Model的, 則查出他的所有 Model信息
      const basicModelIDs = await this.basicModelApi.find({
        'where': {
          'projectNameId': {'inq': proNameIdList['ids']}
        }
      }).toPromise().then(data => {
        return data;
      }).catch(error => {
        console.log(error);
        return [];
      });
      modelList = modelList.concat(basicModelIDs);
      const groupModelIDs = await this.groupModelApi.find({
        'where': {
          'projectNameId': {'inq': proNameIdList['ids']}
        }
      }).toPromise().then(data => data).catch(error => {
        console.log(error);
        return [];
      });
      modelList = modelList.concat(groupModelIDs);
    } else { // 有選擇Model, 則 查出 對應的 Model 信息
      const model = modelQuerySelect.split('-');
      let modelData;
      if (model[0] === 'G') {
        modelData = await this.groupModelApi.findById(model[1]).toPromise().then(data => data).catch(error => {
          console.log(error);
          return {};
        });
      } else {
        modelData = await this.basicModelApi.findById(model[1]).toPromise().then(data => data).catch(error => {
          console.log(error);
          return {};
        });
      }
      modelList.push(modelData);
    }
    const res = [];
    for (let index = 0; index < modelList.length; index++) {
      const model = modelList[index];
      const gourpFlag = (!!model['modelId'] ? false : (!!model['groupModelId'] ? true : false));
      const modelData: any = {
        'Expand': false,
        'GroupChild': [],
        'GroupFlag': gourpFlag,
        'ModelName': (!!model['modelName'] ? model['modelName'] : (!!model['groupModelName'] ? model['groupModelName'] : '')),
        'ModelID': (!!model['modelId'] ? model['modelId'] : (!!model['groupModelId'] ? model['groupModelId'] : '')),
        'Model': model,
        'FCST': (!gourpFlag) ? model['FCST'] : '-'
      };

      const stageData = this.modelStageData(proNameIdList['proNameStage'][model['projectNameId']], modelData);
      res.push(...stageData);
    }
    console.log(res);
    return res;
  }

  modelStageData(proNameIdList, modelData) {
    const res = [];
    // 存放每個 Stage內容
    const stagesList = ['RFQ', 'C2', 'C3', 'C4', 'C5', 'C6'];
    const indexOf = stagesList.indexOf(proNameIdList['CurrentStage']);
    for (let stageIndex = 0; stageIndex <= indexOf; stageIndex++) {
      const stageL = stagesList[stageIndex];
      const modelStageData: any = {...proNameIdList, ...modelData};
      modelStageData['Stage'] = stageL;
      modelStageData['StageWorkHourUploaded'] = true;
      res.push(modelStageData);
    }
    return res;
  }

  async getGroupChildData(model, type: {type: string, expandArr?: any[], processHeaders?: any[]}) {
    const res = [];
    const proName = await this.ProjectSummaryApi.find({
      'where': {
        'ProjectNameID': model['proNameID']
      },
      'fields': ['Plant', 'Customer', 'ModelType', 'ProjectCodeID', 'ProjectCode', 'MPDate', 'BU', 'ProjectNameID', 'ProjectName', 'CurrentStage'],
      'limit': 1
    }).toPromise().then(d => d[0]);
    const group = await this.groupModelApi.getGroupModelMappings(model['model']['groupModelId']).toPromise().then((gData: any[]) => {
      return gData.map(g => {
        return {
          'basicModel': g.modelId,
          'count': g.count
        };
      });
    }).catch(error => {
      console.log(error);
      return [];
    });
    const groupChild = [];
    for (let gIndex = 0; gIndex < group.length; gIndex++) {
      const gData = group[gIndex];
      const basicModelData = await this.basicModelApi.findById(gData['basicModel']).toPromise().then(data => data).catch(error => console.log(error));
      const groupChildData = this.modelStageData(proName, {gData, ModelID: gData['basicModel']});
      groupChild.push(...groupChildData);
    }
    console.log(groupChild);

    // 讓請求同時發出來的
    const reportApi: Promise<any>[] = [];
    // 把stageTowArr變成二維數組，每個成員是一個機種的全部stage
    const summaryDatasTowArr: any[] = this.divideTwoArray(groupChild);
    // if (!!limit) {
    //   summaryDatasTowArr = this.filterByLimit(summaryDatasTowArr, limit);
    // }
    const addedRfq = this.addRFQ(summaryDatasTowArr);  // summaryDatasTowArr中沒有RFQ階段的機種添上RFQ
    this.addAfterCurrentStage(summaryDatasTowArr, 8);   // 如果該機種沒有8個階段，則增加到8個

    for (const rowData of summaryDatasTowArr) {
      // 先合成前八項
      const rIndex = !addedRfq ? 0 : 1;   // 某些機種沒有RFQ階段，本地添加的stageID為null，則index為第二個
      rowData[rIndex].gData['projectNameID'] = rowData[rIndex]['ProjectNameID'];
      const tempRow: any[] = [rowData[rIndex].gData];
      res.push(tempRow);

      for (const col of rowData) {
        let promise: Promise<any>;
        if (col.StageWorkHourUploaded) {
          if (type.type === 'workhour') {
            promise = this.basicModelApi.GetOpTimeReport(col.gData['basicModel'], col.Stage, true).toPromise().catch(err => console.log(err));
          } else {
            promise = this.basicModelApi.GetMOHReport(col.gData['basicModel'], col.Stage).toPromise().catch(err => console.log(err));
          }
        } else {
          let description = '';
          if (type.type === 'workhour') {
            description = '未到該階段';
          } else {
            description = '無機種工時';
          }
          promise = Promise.resolve(description);
        }
        reportApi.push(promise);
      }
    }
    let childDataSet = [];
    if (type.type === 'workhour') {
      childDataSet = await this.workhourStage(reportApi, res, model.expandArr, model.processHeaders);
    } else {
      childDataSet = await this.mohStage(reportApi, res, summaryDatasTowArr, true);
    }
    return childDataSet;
  }

  workhourStage(targetOperationsApi, dataSet, expandArr, processHeaders): Promise<any[]> {
    return Promise.all(targetOperationsApi)
    .then((resDatas: any[]) => {  // resDatas中每個成員為一個機種，但是機種保存的stage不完整，如何讓沒有請求的stage按照順序插入進dataset中
      // debugger
      console.log(resDatas);
      let i = 0;    // 8個為一組
      let rowData: any[] = [];
      const twoArr: any[] = [];
      for (const item of resDatas) {
        rowData.push(item);
        if ((i !== 0 && i % 8 === 7)) {
          twoArr.push(rowData);  // 把一個機種裝進去
          rowData = [];   // 回到起點，重新裝值
        }
        i++;
      }

      for (let row = 0; row < dataSet.length; row++) {
        const childRow: any[] = [];
        const stageList = ['RFQ', 'C2', 'C3', 'C4', 'C5', 'C6'];
        for (let col = 0; col < stageList.length; col++) {   // 一個機種有8個Stage
          const temp = twoArr[row][col];
          if (typeof temp === 'string') {   // 處理不是真正請求的數據
            const obj: {} = {
              cost: temp,
              target: temp,
              gap: temp,
              style: {},
            };
            const rfq = /RFQ/i;
            if (rfq.test(temp)) {    // 匹配則是RFQ階段
              obj['isRFQ'] = true;
              obj['process'] = {};
            } else {
              obj['isRFQ'] = false;
              obj['process'] = {
                arr: this.getVirtualProcessArr(processHeaders),
                click: false,
                expand: expandArr[col - 1],   //  expandArr只有7個，得減1
              };
            }
            childRow.push(obj);
          } else if (!!temp['statusCode'] && temp['statusCode'] !== 200) {
            const obj: {} = {
              cost: 0,
              target: 0,
              gap: 0,
              style: {},
            };
            const rfq = /RFQ/i;
            if (rfq.test(temp)) {    // 匹配則是RFQ階段
              obj['isRFQ'] = true;
              obj['process'] = {};
            } else {
              obj['isRFQ'] = false;
              obj['process'] = {
                arr: this.getVirtualProcessArr(processHeaders),
                click: false,
                expand: expandArr[col - 1],   //  expandArr只有7個，得減1
              };
            }
            childRow.push(obj);
          } else {     // 處理真正請求的數據
            let index: number;    // index為對應的展開下表，從co-c6
            const colData: {} = twoArr[row][col]['result'];
            // const stageID: number = colData['stageId'];
            let process: {} = {};
            if (col === 0) {
              index = -1;
              process = this.getSumOfProcess(colData['operationTime'], stageList[col], colData, expandArr, index, processHeaders);
            } else {
              index = col - 1;
              process = this.getSumOfProcess(colData['operationTime'], stageList[col], colData, expandArr, index, processHeaders);
            }
            childRow.push(process);
          }
        }

        dataSet[row].push(childRow);
      }

      console.log(dataSet);
      // debugger
      // this.dataSet = dataSet;
      return dataSet;
    })
    .catch(err => console.log(err));
  }


  mohStage(reportApi, dataSet, summaryDatasTowArr, childFlag?): Promise<any[]> {
    return Promise.all(reportApi)
    .then(async (resDatas: any[]) => {    // resDatas由每個機種在當前stage之前的stage組成的moh信息
      let m = 0;   // 對應resDatas的長度
      let n = 0;   // 對應dataSet的長度
      console.log('--------------------');
      console.log(resDatas);
      for (const row of summaryDatasTowArr) {
        // console.log(row.length);
        // const am = await this.militaryOrderSignApi.
        const am = await this.projectNameProfileApi.getMilitaryOrders((childFlag ? dataSet[n][0]['projectNameID'] : dataSet[n][3]['proNameID']), false).toPromise().then(d => d.quote + '').catch(error => {
          console.log(error);
          return '';
        });
        dataSet[n].push(am);
        for (let i = 0; i < row.length; i++) {   // row的長度決定了dataSet中每個成員push的次數
          const obj: {} = {};
          if (typeof resDatas[m] === 'string') { // 處理沒有發送的請求
            obj['click'] = false;
            obj['style'] = {};
            obj['cost'] = resDatas[m];
            obj['target'] = resDatas[m];
          } else {
            if (!!resDatas[m]['result'] && !!resDatas[m]['result'].msg) {  // 處理錯誤響應
              obj['click'] = false;
              obj['style'] = {};
              obj['cost'] = resDatas[m]['result'].msg;
              obj['target'] = resDatas[m]['result'].msg;
            } else if (!!resDatas[m]['statusCode'] &&  resDatas[m]['statusCode'] !== 200) {
              obj['click'] = false;
              obj['style'] = {};
              obj['cost'] = '無相關信息';
              obj['target'] = '無相關信息';
            } else {
              const mohTarget = resDatas[m]['result'].mohTarget;
              const mohActual = resDatas[m]['result'].mohActual;
              const range = (mohTarget === 0) ? 999 : ((mohActual - mohTarget) / mohTarget);
              const absRange = Math.abs(range);

              obj['click'] = true;
              obj['style'] = { color: (absRange <= 0.05 || mohActual === 0) ? 'rgba(80, 80, 80, 1)' : 'red', 'text-decoration': 'underline' };
              obj['cost'] = resDatas[m]['result'].mohActual.toFixed(2);
              obj['target'] = resDatas[m]['result'].mohTarget.toFixed(2);
              obj['plant'] = resDatas[m]['result'].Plant;
              obj['check'] = resDatas[m]['result'].mohActual > resDatas[m]['result'].mohTarget ? 'down' : 'top';
              // obj['stageID'] = resDatas[m]['result'].stageID;
              obj['stage'] = resDatas[m]['result']['stageInfo']['Stage'];
              obj['groupModelType'] = (resDatas[m]['result']['type'] === 'basic' ? 1 : 2);
              obj['modelID'] = resDatas[m]['result']['id'];
              obj['modelType'] = resDatas[m]['result']['stageInfo']['basicModel']['projectNameProfile']['projectCodeProfile']['ModelType'];
              obj['modelName'] = resDatas[m]['result']['stageInfo']['basicModel']['modelName'];
            }
          }
          dataSet[n].push(obj);
          m++;
        }
        n++;
      }

      return dataSet;
    })
    .catch(err => console.log(err));
  }

}
