import {
  Injectable
} from '@angular/core';
import {
  ProjectCodeProfileApi,
  ModelTypeMappingApi,
  V_ProjectSummaryApi,
  RewardSignApi,
  MilitaryOrderSignApi,
  UiPageApi,
  KpiReportCacheApi,
  LoopBackFilter,
  KpiReportCache,
} from '@service/dfc_sdk/sdk';
import {
  Observable,
  forkJoin
} from 'rxjs';
import {
  ClsDfcKpiSelect,
  DfcKpiRewardsContent
} from './dfc-kpi';
import {
  BasicModelApi
} from '@service/dfc_sdk/sdk/services/custom/BasicModel';
import {
  GroupModelApi
} from '@service/dfc_sdk/sdk/services/custom/GroupModel';
@Injectable({
  providedIn: 'root'
})
export class DfcKpiService {

  RewardRule = DfcKpiRewardsContent; // 獎懲規則
  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private modelTypeMappingApi: ModelTypeMappingApi,
    private vProjectSummaryApi: V_ProjectSummaryApi,
    private rewardSignApi: RewardSignApi,
    private basicModelService: BasicModelApi,
    private groupModelService: GroupModelApi,
    private militaryOrderSignApi: MilitaryOrderSignApi,
    private uiPageApi: UiPageApi,
    private kpiReportCacheApi: KpiReportCacheApi
  ) { }

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

  // proCode改變, 則查出當前所在的 Stage
  getStageByProCodeChange(proCodeID): Promise<any> {
    return this.vProjectSummaryApi.find({
      'fields': ['ProjectCodeID', 'CurrentStage'],
      'where': {
        'ProjectCodeID': {
          'inq': proCodeID
        }
      }
    }).toPromise().then((datas: any[]) => {
      const proCodeCurrentStage = datas.reduce((p, t) => {
        if (!p[t['ProjectCodeID']]) {
          p[t['ProjectCodeID']] = t['CurrentStage'];
        }
        return p;
      }, {});
      const cFlow = [];
      for (const key in proCodeCurrentStage) {
        if (proCodeCurrentStage.hasOwnProperty(key)) {
          const current = proCodeCurrentStage[key];
          if (!cFlow.includes(current)) {
            cFlow.push(current);
          }
        }
      }
      return cFlow;
    });
  }

  queryKpiDataByIds(plant, selectValue: {
    id: number,
    type: number,
    cFlow: string
  }[]): Observable<any[]> {
    return forkJoin(
      selectValue.map(x => this.uiPageApi.KpiDataSet(
        plant, null, null, [], null, [], [], [{ id: x.id, type: x.type }], x.cFlow
      ))
    );
  }

  // 根据查询条件获取 StageID
  queryKpiData(selectValue: ClsDfcKpiSelect): Observable<any[]> {
    return this.uiPageApi.KpiDataSet(
      selectValue.plant,
      selectValue.bu,
      selectValue.custom,
      selectValue.modelType,
      selectValue.standard,
      selectValue.proCode,
      selectValue.proName,
      selectValue.modelName,
      selectValue.cFlow
    );
  }

  // 查询 奖惩规则中的实际工时
  queryRuleActualData(modelId, stages): Observable<KpiReportCache[]> {
    const query: LoopBackFilter = {
      'where': {
        'modelId': modelId
      }
    };
    if (stages.length > 0) {
      query.where.stage = { 'inq': stages };
    }
    return this.kpiReportCacheApi.find(query);
  }

  async getMembers(data) {
    let resModel = { 'members': [], 'picId': [] };
    let resMilitary = { 'members': [], 'picId': [] };
    if (data.type === 1) {
      const modelData = await this.basicModelService.findById(data.modelId, {
        'include': [{
          'relation': 'stages',
          'scope': {
            'where': {
              'Stage': 'RFQ'
            },
            'include': { 'targetOperationSigns': ['workflow', 'senderInfo'] }
          }
        }]
      }).toPromise().catch(error => {
        return null;
      });
      if (!!modelData && modelData['stages'].length > 0
        && !!modelData['stages'][0]['targetOperationSigns']
        && modelData['stages'][0]['targetOperationSigns'].length > 0) {
        const sendersInfo = modelData['stages'][0]['targetOperationSigns'];
        resModel = sendersInfo.reduce((p, t) => {
          if (!!t['senderInfo'] && !p['picId'].includes(t['senderInfo']['EmpID'])) {
            p['members'].push(t['senderInfo']);
            p['picId'].push(t['senderInfo']['EmpID']);
          }
          return p;
        }, resModel);
      }
    } else {
      const modelData = await this.groupModelService.findById(data.modelId, {
        'include': [{
          'relation': 'groupModelMappings',
          'scope': {
            'include': [{
              'relation': 'basicModel',
              'scope': {
                'include': [{
                  'relation': 'stages',
                  'scope': {
                    'where': {
                      'Stage': 'RFQ'
                    },
                    'include': { 'targetOperationSigns': ['workflow', 'senderInfo'] }
                  }
                }]
              }
            }]
          }
        }]
      }).toPromise().catch(error => {
        return null;
      });
      if (!!modelData && modelData['groupModelMappings'].length > 0) {
        modelData['groupModelMappings'].forEach(groupMapping => {
          if (!!groupMapping['basicModel'] && groupMapping['basicModel']['stages'].length > 0
            && !!groupMapping['basicModel']['stages'][0]['targetOperationSigns']
            && groupMapping['basicModel']['stages'][0]['targetOperationSigns'].length > 0) {
            const sendersInfo = groupMapping['basicModel']['stages'][0]['targetOperationSigns'];
            resModel = sendersInfo.reduce((p, t) => {
              if (!!t['senderInfo'] && !p['picId'].includes(t['senderInfo']['EmpID'])) {
                p['members'].push(t['senderInfo']);
                p['picId'].push(t['senderInfo']['EmpID']);
              }
              return p;
            }, resModel);
          }
        });
      }
    }
    const militaryData = await this.militaryOrderSignApi.find({
      'where': {
        'projectNameID': data.ProjectNameID
      },
      'include': [
        { 'workflow': { 'workflowSigns': 'member' } }
      ]
    }).toPromise();
    if (militaryData.length > 0) {
      if (!militaryData[0]['workflow'] && militaryData[0]['workflow']['workflowSigns'].length > 0) {
        resMilitary = militaryData[0]['workflow']['workflowSigns'].reduce((p, t) => {
          if (!!t['member']
            && ['DFI_LEADER'].includes(t['member']['role'])
            && !p['picId'].includes(t['member']['EmpID'])
            && !resModel['picId'].includes(t['member']['EmpID'])) {
            p['members'].push(t['member']);
            p['picId'].push(t['member']['EmpID']);
          }
          return p;
        }, resMilitary);
      }
    }
    return resModel.members.concat(resMilitary.members);
  }

  // 查詢獎懲規則
  queryRewardRule(): Promise<any> {
    return this.rewardSignApi.find({
      'where': {
        'model': 'DFC'
      },
      'include': [{
        'relation': 'workflow',
        'scope': {
          'where': {
            'status': 1
          }
        }
      }],
      'order': 'date desc'
    }).toPromise().then((rewardDatas) => {
      for (let index = 0; index < rewardDatas.length; index++) {
        const rewardData = rewardDatas[index];
        if (!!rewardData['workflow']) {
          this.RewardRule = rewardData['content'];
          break;
        }
      }
      return this.RewardRule;
    });
  }

  async getRfqStageID(info) {
    return await this.basicModelService.findById(info['id'], {
      'include': [{
        'relation': 'stages',
        'scope': {
          'where': {
            'Stage': 'RFQ'
          }
        }
      }]
    }).toPromise().catch(error => {
      return null;
    });
  }
}
