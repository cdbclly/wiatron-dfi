import { Injectable } from '@angular/core';
import {
  ProjectCodeProfileApi,
  ProjectNameProfileApi,
  StageApi,
  TargetOperationsApi,
  TargetOperationSignApi,
  ProcessApi,
  WorkflowApi,
  MemberApi,
  BasicModelApi
} from '@service/dfc_sdk/sdk';

import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetHourSignService {

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private projectNameProfileApi: ProjectNameProfileApi,
    private targetOperationsApi: TargetOperationsApi,
    private targetOperationSignApi: TargetOperationSignApi,
    private basicModelApi: BasicModelApi,
    private stageApi: StageApi,
    private processApi: ProcessApi,
    private workflowApi: WorkflowApi,
    private memberApi: MemberApi,
    private dfcCommonService: DfcCommonService
  ) { }

  // query
  async query(queryValue: { plant: string, bu: string, custom: string, modelType: string, proCode: string, proName: string, signStage: string, searchUser: string, model: string }): Promise<any> {
    const stageIDs = await this.getStageIDs(queryValue);
    const processMapping = await this.processApi.find({}).toPromise().then(datas => {
      return datas.reduce((p, t) => {
        p[t['ProcessCode']] = t['Name'];
        return p;
      }, {});
    });
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const res = [];
    const stagesInfo = await this.stageApi.find(
      {
        where: { StageID: { inq: stageIDs } },
        include: [
          { 'basicModel': { 'projectNameProfile': { 'projectCodeProfile': 'BU' } } },
          { 'targetOperationSigns': ['senderInfo', { 'workflow': [{ 'currentUser': 'member' }, { 'workflowSigns': 'member' }] }] }]
      }
    ).toPromise();
    for (let index = 0; index < stageIDs.length; index++) {
      const stageID = stagesInfo[index]['StageID'];
      const stageInfo = stagesInfo[index];
      const proCode = stageInfo['basicModel'].projectNameProfile.projectCodeProfile;
      const proName = stageInfo['basicModel'].projectNameProfile;
      const model = stageInfo['basicModel'];
      const targetSignDatas = stageInfo['targetOperationSigns'];
      for (let k = 0; k < targetSignDatas.length; k++) {
        const targetSignData = targetSignDatas[k];
        const senderData = targetSignData.senderInfo;
        const plant = plantMapping.find(plantMap => plantMap['Plant'] === proCode['Plant']);
        const workflowData = targetSignData.workflow;
        if (workflowData && !workflowData['name'] && (!queryValue.signStage || queryValue.signStage === (workflowData.status + ''))) {
          let status;
          let comment = '';
          let searchUserFlag = true;
          let revokeFlag = false;
          switch (workflowData.status) {
            case 0: {
              status = '簽核中';
              // 撤銷 flag
              if (localStorage.getItem('$DFI$userID') === targetSignData.sender && !workflowData.currentUser.previousWorkflowSignId) {
                revokeFlag = true;
              }
              comment = '等待' + (workflowData.currentUser.member ? workflowData.currentUser.member.EName : workflowData.currentUser.userId) + '簽核';
              break;
            }
            case 1: {
              status = '已簽核';
              comment = '簽核完成';
              break;
            }
            case 2: {
              const workflowSignData = targetSignData.workflow.workflowSigns.filter(x => x.isAgree === false);
              if (workflowSignData.length > 0) {
                status = '被駁回';
                comment = '被' + workflowSignData[0].member.EName + '駁回';
              } else {
                status = '被撤回';
              }
              break;
            }
            default: {
              status = '未送簽';
              comment = '未送簽';
              break;
            }
          }
          if ((!!queryValue.searchUser && ((!!workflowData.currentUser && workflowData.currentUser.userId === queryValue.searchUser) || targetSignData.sender === queryValue.searchUser))
            || (!queryValue.searchUser)) {
            searchUserFlag = true;
          } else {
            searchUserFlag = false;
          }
          if (searchUserFlag) {
            res.push({
              plant: plant['PlantName'],
              plantCode: plant['Plant'],
              bu: proCode['BU'] ? proCode['BU']['BU'] : '',
              customer: proCode['Customer'],
              modelType: proCode['ModelType'],
              proName: proName['ProjectName'],
              proNameID: proName['ProjectNameID'],
              proCode: proCode['ProjectCode'],
              proCodeID: proCode['ProjectCodeID'],
              modelID: model['modelId'],
              modelName: model['modelName'],
              cFlow: 'RFQ',
              processCode: targetSignData['process'],
              process: processMapping[targetSignData['process']],
              sender: senderData ? senderData['EName'] : targetSignData.sender,
              senderID: senderData ? senderData['EmpID'] : targetSignData.sender,
              revokeFlag: revokeFlag,
              status: status,
              comment: comment,
              signID: targetSignData['signID'],
              formNo: targetSignData['id'],
              stageID: stageID
            });
          }
        }
      }
    }
    return res;
  }

  // 根据查询条件获取 StageID
  async getStageIDs(queryValue: { plant: string, bu: string, custom: string, modelType: string, proCode: string, proName: string, signStage: string, model: string }): Promise<number[]> {
    let stageIDs = [];
    if (!!queryValue.model) {
      stageIDs = await this.queryStageID([queryValue.model]);
    } else if (!!queryValue.proName) {
      const models = await this.queryModelID([queryValue.proName]);
      stageIDs = await this.queryStageID(models);
    } else if (!!queryValue.proCode) {
      const proNames = await this.queryProNameID([queryValue.proCode]);
      const models = await this.queryModelID(proNames);
      stageIDs = await this.queryStageID(models);
    } else {
      const proCodes = await this.queryProCodeID(queryValue);
      const proNames = await this.queryProNameID(proCodes);
      const models = await this.queryModelID(proNames);
      stageIDs = await this.queryStageID(models);
    }
    return stageIDs;
  }

  // 獲取StageID 值
  private async queryStageID(models: string[]): Promise<number[]> {
    const query = {
      'fields': ['StageID'],
      'where': {
        'and': [
          { 'ModelID': { 'inq': models } },
          { 'Stage': 'RFQ' }
        ]
      }
    };
    const stageApiQuery = await this.stageApi.find(query).toPromise();
    const stageIDs = stageApiQuery.reduce((p, t) => {
      if (!p['StageID']) {
        p['StageID'] = [];
      }
      p['StageID'].push(t['StageID']);
      return p;
    }, {});
    return stageIDs['StageID'];
  }

  // 獲取 modelID
  private async queryModelID(proNames: string[]): Promise<string[]> {
    const modelApi = await this.basicModelApi.find({
      'fields': ['modelId'],
      'where': {
        'projectNameId': { 'inq': proNames }
      }
    }).toPromise();
    const modelIds = modelApi.reduce((p, t) => {
      if (!p['modelId']) {
        p['modelId'] = [];
      }
      p['modelId'].push(t['modelId']);
      return p;
    }, {});
    return modelIds['modelId'];
  }

  // 獲取 projectNameID
  private async queryProNameID(proCodes: string[]): Promise<string[]> {
    const proNameApiQuery = await this.projectNameProfileApi.find({
      'fields': ['ProjectNameID'],
      'where': {
        'ProjectCodeID': { 'inq': proCodes }
      }
    }).toPromise();
    const proNameIDs = proNameApiQuery.reduce((p, t) => {
      if (!p['proNameID']) {
        p['proNameID'] = [];
      }
      p['proNameID'].push(t['ProjectNameID']);
      return p;
    }, {});
    return proNameIDs['proNameID'];
  }

  // 獲取 projectCodeID
  private async queryProCodeID(queryValue: { plant: string, bu: string, custom: string, modelType: string, proCode: string, proName: string, signStage: string }): Promise<string[]> {
    let query;
    query = {
      'include': { 'relation': 'BU' },
      'fields': ['ProjectCodeID', 'ProfitCenter'],
      'where': {
        'and': [
          { 'Plant': queryValue.plant },
          { 'Customer': { 'like': queryValue.custom + '%' } }
        ]
      }
    };
    if (!!queryValue.modelType) {
      query.where.and.push({ 'ModelType': queryValue.modelType });
    }
    const proCodeApiQuery = await this.projectCodeProfileApi.find(query).toPromise();
    const proCodeIDs = proCodeApiQuery.reduce((p, t) => {
      if (!p['proCodeID']) {
        p['proCodeID'] = [];
      }
      if ((!queryValue.bu) || (!!queryValue.bu && (!!t['BU'] && queryValue.bu.includes(t['BU']['BU'])))) {
        p['proCodeID'].push(t['ProjectCodeID']);
      }
      return p;
    }, {});
    return proCodeIDs['proCodeID'];
  }

  async queryDetail(proNameID, stageID, process, signID, formNo): Promise<any> {
    const targetSender = await this.targetOperationSignApi.findById(formNo).toPromise().then(datas => {
      return datas;
    }).catch(error => {
      return error;
    });
    const memberData = await this.memberApi.findById(targetSender['sender']).toPromise().then(data => {
      return data;
    }).catch(error => {
      return { 'error': error };
    });
    const stageInfo = await this.stageApi.find({
      where: { StageID: stageID },
      include: [
        { 'basicModel': { 'projectNameProfile': 'projectCodeProfile' } }]
    }).toPromise().then(d => {
      if (d.length > 0) {
        return d[0];
      } else {
        return null;
      }
    });
    const proCodeData = stageInfo['basicModel']['projectNameProfile']['projectCodeProfile'];
    const proNameData = stageInfo['basicModel']['projectNameProfile'];
    const echartData = await this.getEchartData(stageID, process, proCodeData['Plant'], proCodeData['ModelType']);
    let s = '';
    if (targetSender['date']) {
      const date = new Date(targetSender['date']);
      s = date.toLocaleDateString();
      s = s + '    ' + this.changeTime(date.getHours());
      s = s + ':' + this.changeTime(date.getMinutes());
      s = s + ':' + this.changeTime(date.getSeconds());
    }
    const workflowData = await this.workflowApi.findById(signID).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    let revokeFlag = false;
    if (!!workflowData && workflowData['status'] === 0) {
      revokeFlag = await this.workflowApi.getCurrentUser(signID, false).toPromise().then(data => {
        if (localStorage.getItem('$DFI$userID') === targetSender['sender'] && !data['previousWorkflowSignId']) {
          return true;
        } else {
          return false;
        }
      }).catch(error => {
        return false;
      });
    }
    const plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    const memberPlant = plantMapping.find(x => x.Plant === memberData['Plant']);
    const proPlant = plantMapping.find(x => x.Plant === proCodeData['Plant']);
    return {
      data: {
        deptCode: memberData['Dept'],
        deptName: memberData['Role'],
        applicant: memberData['EName'],
        applyDate: s,
        site: memberData['Site'],
        plant: memberPlant['PlantName'],
        customer: proCodeData['Customer'],
        modelType: proCodeData['ModelType'],
        proName: proNameData['ProjectName'],
        proCode: proCodeData['ProjectCode'],
        modelName: stageInfo['basicModel']['modelName'],
        proPlant: proPlant['PlantName']
      },
      revokeFlag: revokeFlag,
      echartData: echartData
    };
  }

  private changeTime(data: number): string {
    let d: string;
    if (data < 10) {
      d = '0' + data;
    } else {
      d = data + '';
    }
    return d;
  }

  private async getEchartData(stageID, process, plant, modelType): Promise<any> {
    const colorList = ['rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgba(0, 102, 255, 1)'];
    const otherColorList = ['rgba(135, 174, 216, 0.6)', 'rgba(147, 196, 197, 0.6)', 'rgba(107, 155, 216, 0.6)'];
    // 1.获取processMapping关系
    const processTemp = await this.processApi.find({}).toPromise();
    const processMapping = processTemp.reduce((p, t) => {
      p[t['ProcessCode']] = t['Name'];
      return p;
    }, {});
    // 2.获取需要显示的process与其顺序
    const processModelType = await this.dfcCommonService.getProcess(plant, modelType).toPromise();
    const processDatas = (processModelType[0]['processCode']).split(',');
    const echartParam = {
      legendData: ['RFQ工时', 'Target', 'Best'],
      series: [],
      xAxisData: [],
    };
    echartParam.legendData.forEach((data, index) => {
      echartParam.series.push({
        name: data,
        id: data + '-' + index,
        stageID: stageID,
        type: 'bar',
        itemStyle: {
          normal: {
            color: function (params) {
              if (params.name === processMapping[process]) {
                return colorList[index];
              } else {
                return otherColorList[index];
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: function (p) {
                return p.value;
              }
            }
          }
        },
        data: []
      });
    });
    // 3.向echartParam中传相应的值
    for (let index = 0; index < processDatas.length; index++) {
      const processData = processDatas[index];
      echartParam.xAxisData.push({ value: processMapping[processData], code: processData });
      const targetOperation = await this.targetOperationsApi.TargetOperation(stageID, processData, true).toPromise().then(datas => {
        const res = {
          best: 0,
          target: 0,
          actual: 0
        };
        datas['data'].forEach(data => {
          const BestCostTime = (!data['BestCostTime']) ? 0 : data['BestCostTime'];
          const CostTimeActural = (!data['CostTimeActural']) ? 0 : data['CostTimeActural'];
          const CostTimeTarget = (!data['CostTimeTarget']) ? 0 : data['CostTimeTarget'];
          res.actual += (CostTimeActural * data['Count']);
          res.best += (!CostTimeTarget) ? (BestCostTime * data['Count']) : (BestCostTime * data['TargetCount']);
          res.target += (!CostTimeTarget) ? (CostTimeActural * data['Count']) : (CostTimeTarget * data['TargetCount']);
        });
        return res;
      }).catch(error => {
        console.log(error);
      });
      echartParam.series[0]['data'].push((!targetOperation ? 0 : targetOperation['actual'].toFixed(2)));
      echartParam.series[1]['data'].push((!targetOperation ? 0 : targetOperation['target'].toFixed(2)));
      echartParam.series[2]['data'].push((!targetOperation ? 0 : targetOperation['best'].toFixed(2)));
    }
    return echartParam;
  }

  // 撤回
  revoke(signID): Observable<any> {
    return this.workflowApi.patchAttributes(signID, { status: 2 });
  }
}
