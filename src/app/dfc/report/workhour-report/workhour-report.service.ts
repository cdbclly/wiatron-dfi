import {
  Injectable
} from '@angular/core';
import {
  FactorDetailApi,
  ProjectCodeProfileApi,
  ProjectNameProfileApi,
  StageApi,
  ProcessApi,
  TargetOperationsApi,
  MemberApi,
  ProjectMemberApi,
  ModelTypeMappingApi,
  BasicModelApi
} from '@service/dfc_sdk/sdk';
import {
  Observable
} from 'rxjs';
import {
  ClsDfcKpiSelect
} from './workhour-report';
@Injectable({
  providedIn: 'root'
})
export class WorkhourReportService {
  datawh = [];
  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private modelTypeMappingApi: ModelTypeMappingApi,
    private processApi: ProcessApi,
    private targetOperationsApi: TargetOperationsApi,
    private stageApi: StageApi,
    private projectMemberApi: ProjectMemberApi,
    private basicModelApi: BasicModelApi,
    private memberApi: MemberApi,
    private factorDetailServer: FactorDetailApi
  ) { }
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  totleTime;
  totleTarget;
  Time;
  stageid = [];
  targetData;
  SecondEchartParam;
  gapList = [];
  gapValue = [];
  gapOthers = 0;
  secondQueryDatas = [];
  secondQueryDatas2 = [];
  stageID: number;
  proCodeID: number;
  process: string;
  proCode: string;
  Process;
  proName: string;
  memberList;
  datadetail;
  stageids;

  // 獲取廠別下拉框
  getProCodePlant(): Observable<any> {
    return this.projectCodeProfileApi.GetPlant();
  }

  // 獲取客戶下拉框
  getProCodeCustom(custom: string, plant: string): Observable<any> {
    const query = {
      'fields': {
        'Customer': true
      },
      'where': {
        'and': [{
          'Plant': plant
        },
        {
          'Customer': {
            'like': '%' + custom + '%'
          }
        }
        ]
      }
    };
    return this.projectCodeProfileApi.find(query);
  }

  // 獲取產品下拉框的值
  getModelType(): Observable<any> {
    return this.modelTypeMappingApi.find({});
  }

  getProcess(): Observable<any> {
    return this.processApi.find({});
  }

  // 獲取ProjectCode下拉框
  getProCodeSelect(proCode: string, plant: string, custom?: string, modelType?: string): Observable<any> {
    const query = {
      'fields': ['ProjectCode', 'ProjectCodeID'],
      'where': {
        'and': [{
          'Plant': plant
        },
        {
          'ProjectCode': {
            'like': proCode + '%'
          }
        },
        {
          'Customer': {
            'like': (!custom ? '' : custom) + '%'
          }
        },
        {
          'ModelType': {
            'like': (!modelType ? '' : modelType) + '%'
          }
        }
        ]
      },
      'limit': 20
    };
    return this.projectCodeProfileApi.find(query);
  }

  async getdetail() {
    let aaa;
    await this.factorDetailServer.find({}).toPromise().then(res => aaa = res);
    this.datadetail = aaa.reduce(
      (p, t) => {
        if (p[t['FactorID']] === undefined) {
          p[t['FactorID']] = [];
        }
        p[t['FactorID']].push({
          Value: t['FactorDetailID'],
          Label: t['Name']
        });
        return p;
      }, {});
    return this.datadetail;
  }

  // 獲取ProjectName下拉框
  async getProNameSelect(proName, selectValue: ClsDfcKpiSelect): Promise<any> {
    let proCode = selectValue.proCode;
    if (!proCode || proCode.length === 0) {
      const proCodeQuery = {
        'where': {
          'and': [{
            'Plant': selectValue.plant
          },
          {
            'Customer': {
              'like': (!selectValue.custom ? '' : selectValue.custom) + '%'
            }
          },
          {
            'ModelType': {
              'like': (!selectValue.modelType ? '' : selectValue.modelType) + '%'
            }
          }
          ]
        },
        'fields': ['ProjectCodeID'],
        'limit': 50
      };
      const proCodeData = await this.projectCodeProfileApi.find(proCodeQuery).toPromise();
      proCode = [];
      proCodeData.forEach(data => {
        proCode.push(data['ProjectCodeID']);
      });
    }
    const query = {
      'where': {
        'and': [{
          'ProjectCodeID': {
            'inq': proCode
          }
        },
        {
          'ProjectName': {
            'like': proName + '%'
          }
        }
        ]
      },
      'fields': ['ProjectName', 'ProjectNameID'],
      'limit': 20
    };
    return this.projectNameProfileApi.find(query).toPromise();
  }

  async getAllProcess() {
    const list = [];
    const logs = await this.getProcess().toPromise();
    logs.forEach(data => {
      list.push({
        Value: data['ProcessCode'],
        Label: data['Name']
      });
    });
    return list;
  }

  async getTime(models: string[], cflows: string[]) {
    const list = await this.getAllProcess();
    const List = [];
    list.forEach(element => {
      List.push(element.Value);
    });
    this.stageid = [];
    this.stageids = [];
    this.datawh = [];
    this.totleTime = [];
    this.totleTarget = [];
    this.Process = [];
    const aaa = [];
    const rfq = [];
    for (let index = 0; index < models.length; index++) {
      const model = models[index];
      const stage = await this.basicModelApi.getStages(model).toPromise();
      this.stageids.push(stage);
    }
    this.stageids.forEach(stageid => {
      stageid.forEach(data => {
        cflows.forEach(cflow => {
          if (data.Stage === cflow) {
            aaa.push(data);
          }
        });
      });
    });
    const bbb = [];
    for (const key in aaa) {
      if (aaa.hasOwnProperty(key)) {
        const data = aaa[key];
        const fdata = [];
        const totledata = await this.targetOperationsApi.TargetOperationReport(data.StageID.toString(), true).toPromise();
        totledata['data'].forEach(datas => {
          if (JSON.stringify(datas['operationTime']) !== '{}') {
            for (const key2 in datas['operationTime']) {
              if (datas['operationTime'].hasOwnProperty(key2)) {
                const data2 = datas['operationTime'][key2];
                if (!key2.endsWith('M')) {
                  this.Process.push(key2);
                  this.totleTime.push(data2['costTime']);
                  this.totleTarget.push(data2['targetCostTime']);
                  this.targetData = {
                    stageID: datas.stageID,
                    Stage: datas.stage,
                    time: this.totleTime,
                    target: this.totleTarget,
                    projectName: datas.projectName,
                    allName: null,
                    Process: this.Process
                  };
                }
              }
            }
          } else if (JSON.stringify(datas['operationTime']) === '{}') {
            this.targetData = {
              stageID: datas.stageID,
              Stage: datas.stage,
              time: [0],
              target: 0,
              projectName: datas.projectName,
              allName: null,
              Process: ['A']
            };
          }
          List.forEach(element => {
            let flag = false;
            for (const m in this.targetData.Process) {
              if (this.targetData.Process.hasOwnProperty(m)) {
                const tdata = this.targetData.Process[m];
                if (element === tdata) {
                  flag = true;
                  const as = this.targetData.time[m];
                  fdata.push(as);
                }
              }
            }
            if (flag === false) {
              const as = 0;
              fdata.push(as);
            }
          });
          this.targetData.time = fdata;
          this.targetData.Process = List;
          this.datawh.push(this.targetData);
          this.totleTarget = [];
          this.totleTime = [];
          this.Process = [];
        });
      }
    }
    return this.datawh;
  }

  async getseconddata2(stageID, proname, process) {
    this.SecondEchartParam = {
      xAxisData: [],
      seriesData1: [],
      seriesData2: []
    };
    this.gapList = [];
    this.gapValue = [];
    this.gapOthers = 0;
    this.secondQueryDatas = [];
    this.secondQueryDatas2 = [];
    const stage = await this.stageApi.findById(stageID).toPromise();
    const query = {
      'include': {
        'relation': 'projectCodeProfile'
      },
      'where': {
        'and': [{
          'ProjectName': proname
        }]
      }
    };
    const mmm = await this.projectNameProfileApi.find(query).toPromise();
    const moid = mmm[0]['ProjectNameID'];
    const query1 = {
      'where': {
        'and': [{
          'ModelID': moid
        },
        {
          'Stage': 'RFQ'
        }
        ]
      }
    };
    const stagerfq = await this.stageApi.find(query1).toPromise();
    const stagerfqid = stagerfq[0]['StageID'];
    const proName = await this.projectNameProfileApi.findById(stage['ModelID']).toPromise();
    this.proCodeID = proName['ProjectCodeID'];
    this.proCode = proName['ProjectCode'];
    this.proName = proName['ProjectName'];
    // 加載當前需要的PIC名單
    const proMembers = await this.projectMemberApi.find({
      'fields': {
        'MemberID': true
      },
      'where': {
        'ProjectCodeID': this.proCodeID
      }
    }).toPromise();
    const proMemberList = proMembers.reduce((p, t) => {
      if (!p['member']) {
        p['member'] = [];
      }
      if (!p['member'].includes(t['MemberID'])) {
        p['member'].push(t['MemberID']);
      }
      return p;
    }, {});
    const members = await this.memberApi.find({
      'where': {
        'or': [{
          'EmpID': {
            'inq': proMemberList['member']
          }
        },
        {
          'and': [{
            'DFIUser': true
          },
          {
            'Plant': localStorage.getItem('DFC_Plant')
          }
          ]
        }
        ]
      }
    }).toPromise();
    this.memberList = members;
    // 查詢出現在第二頁中需要的數據
    const rs = await this.targetOperationsApi.TargetOperation(stageID, process, false).toPromise();
    const rs2 = await this.targetOperationsApi.TargetOperation(stagerfqid, process, false).toPromise();
    rs['data'].forEach(rsData => {
      const CostTimeActural = (!rsData['CostTimeActural']) ? 0 : rsData['CostTimeActural'];
      const CostTimeTarget = (!rsData['CostTimeTarget']) ? 0 : rsData['CostTimeTarget'];
      const member = this.memberList.find(d => d['EmpID'] === rsData['PICID']);
      let PICName = '';
      if (rsData['PICID']) {
        if (!member) {
          PICName = rsData['PICID'];
        } else {
          PICName = (!member['EName']) ? member['EmpID'] : member['EName'];
        }
      }
      // 將資料放進去
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rsData['Plant']);
      this.secondQueryDatas = [...this.secondQueryDatas, {
        cxPlant: (!plantMap) ? rsData['Plant'] : plantMap['PlantName'],
        cxModelOperationID: rsData['ModelOperationID'],
        cxMaterial: rsData['Material'],
        cxFactorID: rsData['FactorID'],
        cxFactor: rsData['Factor'],
        cxFactorDetailActural: rsData['FactorDetailActural'],
        cxFactorDetailIDActual: rsData['FactorDetailIDActual'],
        cxCount: rsData['Count'],
        cxCostTimeActural: CostTimeActural,
        cxComment: rsData['Comment'],
        cxgapCost: rsData['gapCost'],
        cxTargetFactorDetailCode: rsData['TargetFactorDetailCode'],
        cxTargetFactorDetail: rsData['TargetFactorDetail'],
        cxTargetCount: rsData['TargetCount'],
        cxCostTimeTarget: CostTimeTarget,
        cxPICID: rsData['PICID'],
        cxPICName: PICName,
        cxStatus: rsData['Status'],
        cxDueDay: rsData['DueDay'],
        cxBOMCost: rsData['BOMCost']
      }];
    });
    rs2['data'].forEach(rsData => {
      const CostTimeActural = (!rsData['CostTimeActural']) ? 0 : rsData['CostTimeActural'];
      const CostTimeTarget = (!rsData['CostTimeTarget']) ? 0 : rsData['CostTimeTarget'];
      const member = this.memberList.find(d => d['EmpID'] === rsData['PICID']);
      let PICName = '';
      if (rsData['PICID']) {
        if (!member) {
          PICName = rsData['PICID'];
        } else {
          PICName = (!member['EName']) ? member['EmpID'] : member['EName'];
        }
      }
      // 將資料放進去
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rsData['Plant']);
      this.secondQueryDatas2 = [...this.secondQueryDatas2, {
        rfqPlant: (!plantMap) ? rsData['Plant'] : plantMap['PlantName'],
        rfqModelOperationID: rsData['ModelOperationID'],
        rfqMaterial: rsData['Material'],
        rfqFactorID: rsData['FactorID'],
        rfqFactor: rsData['Factor'],
        rfqFactorDetailActural: rsData['FactorDetailActural'],
        rfqFactorDetailIDActual: rsData['FactorDetailIDActual'],
        rfqCount: rsData['Count'],
        rfqCostTimeActural: CostTimeActural,
        rfqComment: rsData['Comment'],
        rfqgapCost: rsData['gapCost'],
        rfqTargetFactorDetailCode: rsData['TargetFactorDetailCode'],
        rfqTargetFactorDetail: rsData['TargetFactorDetail'],
        rfqTargetCount: rsData['TargetCount'],
        rfqCostTimeTarget: CostTimeTarget,
        rfqPICID: rsData['PICID'],
        rfqPICName: PICName,
        rfqStatus: rsData['Status'],
        rfqDueDay: rsData['DueDay'],
        rfqBOMCost: rsData['BOMCost']
      }];
    });
    // 1.對資料by物料 by因素分類
    const test = {
      Rfq: 0,
      Cx: 0,
      RfqTarget: 0
    };
    const RFQDataSet = this.secondQueryDatas2.reduce((p, t) => {
      if (!p[t['rfqMaterial']]) {
        p[t['rfqMaterial']] = {};
      }
      if (!p[t['rfqMaterial']][t['rfqFactorID']]) {
        p[t['rfqMaterial']][t['rfqFactorID']] = {};
      }
      if (!p[t['rfqMaterial']][t['rfqFactorID']][t['rfqFactorDetailIDActual']]) {
        p[t['rfqMaterial']][t['rfqFactorID']][t['rfqFactorDetailIDActual']] = t;
      }
      test.Rfq += t['rfqCostTimeActural'] * t['rfqCount'];
      test.RfqTarget += t['rfqCostTimeTarget'] * t['rfqTargetCount'];
      return p;
    }, {});
    const CxDataSet = this.secondQueryDatas.reduce((p, t) => {
      if (!p[t['cxMaterial']]) {
        p[t['cxMaterial']] = {};
      }
      if (!p[t['cxMaterial']][t['cxFactorID']]) {
        p[t['cxMaterial']][t['cxFactorID']] = {};
      }
      if (!p[t['cxMaterial']][t['cxFactorID']][t['cxFactorDetailIDActual']]) {
        p[t['cxMaterial']][t['cxFactorID']][t['cxFactorDetailIDActual']] = t;
      }
      test.Cx += t['cxCostTimeActural'] * t['cxCount'];
      return p;
    }, {});
    // 2.對比2張表中數據是否一樣
    const tempData = {}; // 用於存放整合的table數據
    for (const keyMaterial in RFQDataSet) {
      if (RFQDataSet.hasOwnProperty(keyMaterial)) {
        const rfqMaterial = RFQDataSet[keyMaterial];
        for (const keyFactor in rfqMaterial) {
          if (rfqMaterial.hasOwnProperty(keyFactor)) {
            const rfqFactor = rfqMaterial[keyFactor];
            for (const keyFactorDetail in rfqFactor) {
              if (rfqFactor.hasOwnProperty(keyFactorDetail)) {
                const rfqFactorDetail = rfqFactor[keyFactorDetail];
                if (!tempData[keyMaterial]) {
                  tempData[keyMaterial] = {};
                }
                if (!tempData[keyMaterial][keyFactor]) {
                  tempData[keyMaterial][keyFactor] = {};
                }
                if (!CxDataSet[keyMaterial] || !CxDataSet[keyMaterial][keyFactor] || !CxDataSet[keyMaterial][keyFactor][keyFactorDetail]) {
                  rfqFactorDetail['cxModelOperationID'] = '';
                  rfqFactorDetail['cxMaterial'] = '';
                  rfqFactorDetail['cxFactorID'] = '';
                  rfqFactorDetail['cxFactor'] = '';
                  rfqFactorDetail['cxFactorDetailActural'] = '';
                  rfqFactorDetail['cxFactorDetailIDActual'] = '';
                  rfqFactorDetail['cxCount'] = 0;
                  rfqFactorDetail['cxCostTimeActural'] = 0;
                  rfqFactorDetail['cxComment'] = '';
                  rfqFactorDetail['cxgapCost'] = '';
                  rfqFactorDetail['cxTargetFactorDetailCode'] = '';
                  rfqFactorDetail['cxTargetFactorDetail'] = '';
                  rfqFactorDetail['cxTargetCount'] = 0;
                  rfqFactorDetail['cxCostTimeTarget'] = 0;
                  rfqFactorDetail['cxPICID'] = '';
                  rfqFactorDetail['cxPICName'] = '';
                  rfqFactorDetail['cxStatus'] = '';
                  rfqFactorDetail['cxDueDay'] = '';
                  rfqFactorDetail['cxBOMCost'] = '';
                  tempData[keyMaterial][keyFactor][keyFactorDetail] = rfqFactorDetail;
                } else {
                  for (const cxKey in CxDataSet[keyMaterial][keyFactor][keyFactorDetail]) {
                    if (CxDataSet[keyMaterial][keyFactor][keyFactorDetail].hasOwnProperty(cxKey)) {
                      const cxData = CxDataSet[keyMaterial][keyFactor][keyFactorDetail][cxKey];
                      rfqFactorDetail[cxKey] = cxData;
                    }
                  }
                  tempData[keyMaterial][keyFactor][keyFactorDetail] = rfqFactorDetail;
                }

              }
            }
          }
        }
      }
    }
    for (const keyMaterial in CxDataSet) {
      if (CxDataSet.hasOwnProperty(keyMaterial)) {
        const cxMaterial = CxDataSet[keyMaterial];
        for (const keyFactor in cxMaterial) {
          if (cxMaterial.hasOwnProperty(keyFactor)) {
            const cxFactor = cxMaterial[keyFactor];
            for (const keyFactorDetail in cxFactor) {
              if (cxFactor.hasOwnProperty(keyFactorDetail)) {
                const cxFactorDetail = cxFactor[keyFactorDetail];
                if (!tempData[keyMaterial]) {
                  tempData[keyMaterial] = {};
                }
                if (!tempData[keyMaterial][keyFactor]) {
                  tempData[keyMaterial][keyFactor] = {};
                }
                if (!tempData[keyMaterial] || !tempData[keyMaterial][keyFactor] || !tempData[keyMaterial][keyFactor][keyFactorDetail]) {
                  cxFactorDetail['rfqModelOperationID'] = '';
                  cxFactorDetail['rfqMaterial'] = '';
                  cxFactorDetail['rfqFactorID'] = '';
                  cxFactorDetail['rfqFactor'] = '';
                  cxFactorDetail['rfqFactorDetailActural'] = '';
                  cxFactorDetail['rfqFactorDetailIDActual'] = '';
                  cxFactorDetail['rfqCount'] = 0;
                  cxFactorDetail['rfqCostTimeActural'] = 0;
                  cxFactorDetail['rfqComment'] = '';
                  cxFactorDetail['rfqgapCost'] = '';
                  cxFactorDetail['rfqTargetFactorDetailCode'] = '';
                  cxFactorDetail['rfqTargetFactorDetail'] = '';
                  cxFactorDetail['rfqTargetCount'] = 0;
                  cxFactorDetail['rfqCostTimeTarget'] = 0;
                  cxFactorDetail['rfqPICID'] = '';
                  cxFactorDetail['rfqPICName'] = '';
                  cxFactorDetail['rfqStatus'] = '';
                  cxFactorDetail['rfqDueDay'] = '';
                  cxFactorDetail['rfqBOMCost'] = '';
                  tempData[keyMaterial][keyFactor][keyFactorDetail] = cxFactorDetail;
                }
              }
            }
          }
        }
      }
    }
    const dataSet = [];
    for (const keyMaterial in tempData) {
      if (tempData.hasOwnProperty(keyMaterial)) {
        const material = tempData[keyMaterial];
        for (const keyFactor in material) {
          if (material.hasOwnProperty(keyFactor)) {
            const factor = material[keyFactor];
            for (const keyFactorDetail in factor) {
              if (factor.hasOwnProperty(keyFactorDetail)) {
                const factorDetail = factor[keyFactorDetail];
                dataSet.push(factorDetail);
              }
            }
          }
        }
      }
    }
    // 3.計算出 gap與improve
    let aaa;
    aaa = await this.getGapImprove(dataSet); // target
    const bbb = {
      data: aaa,
      dataset: dataSet,
      member: this.memberList,
    };
    return bbb;
  }

  async getGapImprove(dataSet) { // target
    let cxActual = 0;
    let rfqActual = 0;
    let rfqTarget = 0;
    let improves: {
      Material: string,
      Value: number
    }[] = [];
    let gaps: {
      Material: string,
      Value: number
    }[] = [];
    dataSet.forEach(data => {
      rfqActual += (data.rfqCostTimeActural * data.rfqCount);
      cxActual += data.cxCostTimeActural * data.cxCount;
      rfqTarget += (!data.rfqCostTimeTarget) ? (data.rfqCostTimeActural * data.rfqCount) : (data.rfqCostTimeTarget * data.rfqTargetCount);
      let improveFlag = false;
      let improveIndex = -1;
      for (let k = 0; k < improves.length; k++) {
        const improve = improves[k];
        if ((!data.rfqMaterial ? data.cxMaterial : data.rfqMaterial) === improve.Material) {
          improveFlag = true;
          improveIndex = k;
          break;
        }
      }
      const improveValue = data.rfqCostTimeActural * data.rfqCount - data.cxCostTimeActural * data.cxCount;
      if (improveFlag) {
        improves[improveIndex].Value += improveValue;
      } else {
        improves.push({
          Material: (!data.rfqMaterial ? data.cxMaterial : data.rfqMaterial),
          Value: improveValue
        });
      }
      let gapFlag = false;
      let gapIndex = -1;
      for (let k = 0; k < gaps.length; k++) {
        const gap = gaps[k];
        if ((!!data.cxMaterial ? data.cxMaterial : data.rfqMaterial) === gap.Material) {
          gapFlag = true;
          gapIndex = k;
          break;
        }
      }
      const cxActualCostTime = data.cxCostTimeActural * data.cxCount;
      const rfqTargetCostTime = (!!data.rfqCostTimeTarget) ? (data.rfqCostTimeTarget * data.rfqTargetCount) : (data.rfqCostTimeActural * data.rfqCount);
      const gapValue = cxActualCostTime - rfqTargetCostTime;
      if (gapFlag) {
        gaps[gapIndex].Value += gapValue;
      } else {
        gaps.push({
          Material: (!!data.cxMaterial ? data.cxMaterial : data.rfqMaterial),
          Value: gapValue
        });
      }
    });
    // 改善项只取前五
    improves = await this.getImproveGapSort(improves);
    const improvesTop5 = await this.getImproveGapList(JSON.parse(JSON.stringify(improves)), 5);
    // 与最优相比 gap项取 前5
    gaps = await this.getImproveGapSort(gaps);
    const gapsTop5 = await this.getImproveGapList(JSON.parse(JSON.stringify(gaps)), 5);
    // 整合需要排序的物料
    const materialList = this.integrationMaterial(improves, gaps);
    const datam = {
      improvesTop5: improvesTop5,
      gapsTop5: gapsTop5,
      actural: cxActual,
      aims: rfqActual,
      target: rfqTarget
    };
    return datam;
  }

  getImproveGapSort(list: {
    Material: string,
    Value: number
  }[]): {
    Material: string,
    Value: number
  }[] {
    list = list.sort((a, b) => {
      return a.Value < b.Value ? 1 : -1;
    });
    list = list.filter(data => {
      return data.Value !== 0;
    });
    return list;
  }

  // 用於 improve取值
  getImproveGapList(list: {
    Material: string,
    Value: number
  }[], num: number): {
    Material: string,
    Value: number
  }[] {
    if (list.length > num) {
      let values = 0;
      for (let index = num; index < list.length; index++) {
        const data = list[index];
        values += data.Value;
      }
      list.splice(num, (list.length - num));
      list.push({
        Material: 'Other',
        Value: values
      });
    }
    return list;
  }

  integrationMaterial(improves: {
    Material: string,
    Value: number
  }[], gaps: {
    Material: string,
    Value: number
  }[]): string[] {
    const materialList: string[] = [];
    improves.forEach(improve => {
      materialList.push(improve.Material);
    });
    gaps.forEach(gap => {
      if (!materialList.includes(gap.Material)) {
        materialList.push(gap.Material);
      }
    });
    return materialList;
  }

  // 路由過來的 stageID查找
  queryStage(stage, basicModelID) {
    return this.basicModelApi.getStages(basicModelID, {
      'where': {
        'Stage': stage
      }
    });
  }
}
export class DFCTargetHourTableData {
  Plant: string;
  ModelOperationID: number;
  Material: string;
  FactorID: number;
  Factor: string;
  BestFactorDetailID: number;
  BestFactorDetail: string;
  FactorDetailActural: string;
  FactorDetailIDActual: number;
  Count: number;
  BestCostTime: number;
  CostTimeActural: number;
  Comment: string;
  improve: number;
  gap: number;
  gapCost: number;
  TargetFactorDetailCode: number;
  TargetFactorDetail: string;
  TargetCount: number;
  CostTimeTarget: number;
  PICID: string;
  PICName: string;
  Status: number;
  DueDay: string;
  BOMCost: number;
}
