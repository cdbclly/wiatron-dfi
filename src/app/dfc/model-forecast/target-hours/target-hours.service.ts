import { Injectable } from '@angular/core';
import { ProjectCodeProfileApi, MemberApi, V_ProjectSummaryApi } from '@service/dfc_sdk/sdk';
import { WorkflowFormMappingApi, WorkflowFormApi, WorkflowSignatoryApi } from '@service/mrr-sdk';
@Injectable({
  providedIn: 'root'
})
export class TargetHoursService {

  constructor(
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private memberApi: MemberApi,
    private workflowSignatoryApi: WorkflowSignatoryApi,
    private workflowFormApi: WorkflowFormApi,
    private workflowFormMappingApi: WorkflowFormMappingApi,
    private vProjectSummaryApi: V_ProjectSummaryApi
  ) { }

  // 獲取BU下拉框
  async getBU(plant, bu): Promise<any> {
    const proCodeDatas = await this.projectCodeProfileApi.find({
      'include': {
        'relation': 'BU',
        'scop': {
          'fields': ['BU']
        }
      },
      'fields': ['ProfitCenter'],
      'where': {
        'Plant': { 'inq': plant }
      }
    }).toPromise();
    const profitCenters = proCodeDatas.reduce((p, t) => {
      if (!!t['BU'] && t['BU']['BU'].toUpperCase().includes(bu.toUpperCase())) {
        if (!p['bu'].includes(t['BU']['BU'])) {
          p['bu'].push(t['BU']['BU']);
          p['select'].push({ Value: t['BU']['BU'], Label: t['BU']['BU'] });
        }
      }
      return p;
    }, { bu: [], select: [] });
    return profitCenters['select'];
  }

  // 獲取 客戶 下拉框
  async getCustom(plant, bu, custom): Promise<any> {
    const query: any = {
      'where': {
        'Plant': { 'inq': plant }
      },
      'fields': ['Customer']
    };
    if (bu.length > 0) {
      query.where['BU'] = { 'inq': bu };
    }
    if (custom) {
      query.where['Customer'] = { 'like': custom };
    }
    const proSummaryDatas = await this.vProjectSummaryApi.find(query).toPromise();
    const res = proSummaryDatas.reduce((p, t) => {
      if (!p['custom'].includes(t['Customer'])) {
        p['custom'].push(t['Customer']);
        p['select'].push({ Value: t['Customer'], Label: t['Customer'] });
      }
      return p;
    }, { custom: [], select: [] });
    return res['select'];
  }

  // 簽核人員 機構IE 下拉框查詢
  async sendIEMember(name, proCodeID): Promise<any> {
    const memberData = await this.projectCodeProfileApi.getMembers(proCodeID, {
      'fields': ['EmpID', 'Name', 'EName'],
      'where': {
        'and': [
          { 'Role': 'IE' },
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

  // 查詢出 課級主管
  sendSupervisor(member): Promise<any> {
    return this.memberApi.findById(member, {
      'fields': ['Supervisor']
    }).toPromise().then(data => {
      return this.memberApi.find({
        'fields': ['EmpID', 'Name', 'EName'],
        'where': {
          'or': [
            { 'EmpID': { 'like': data['Supervisor'] + '%' } },
            { 'EName': { 'like': data['Supervisor'] + '%' } }
          ]
        }
      }).toPromise().then(superData => {
        if (!!superData && superData.length > 0) {
          return {
            Value: superData[0]['EmpID'],
            Label: superData[0]['EmpID'] + '\t' + superData[0]['Name'] + '\t' + superData[0]['EName']
          };
        }
      }).catch(error => console.log(error));
    }).catch(error => console.log(error));
  }

  // 查詢 送簽 相關人員信息,  PIC 會以 ,分割
  async sendMember(process, proCodeID): Promise<any> {
    console.log(111);
    const proCode = await this.projectCodeProfileApi.findById(proCodeID, { 'fields': ['Plant'] }).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    const signConfig = JSON.parse(localStorage.getItem('DFC_SignConfig'));
    const workflowForm = await this.workflowFormApi.find({
      'where': {
        'name': signConfig['Target']
      },
      'limit': 1
    }).toPromise().then(datas => {
      return datas[0];
    });
    const workflowFormKey = 'Target_' + proCode['Plant'] + '_' + process;
    const workflowFormMap = await this.workflowFormMappingApi.find({
      'where': {
        'workflowFormId': workflowForm['id'],
        'key': workflowFormKey
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

  // 根据ID 查询出对应的 Member资讯
  getMember(empID) {
    return this.memberApi.findById(empID, {
      'fields': ['EmpID', 'Name', 'EName']
    }).toPromise().then(data => {
      return { Value: data['EmpID'], Label: data['EmpID'] + '\t' + data['Name'] + '\t' + data['EName'] };
    }).catch(error => console.log(error));
  }

  checkBomCost(datas) {
    let flag = true;
    for (let index = 0; index < datas.length; index++) {
      const data = datas[index];
      if (!!data.PICID && !(!!data.BOMCost || data.BOMCost === 0)) {
        flag = false;
        break;
      }
    }
    return flag;
  }
}
