import { Injectable } from '@angular/core';
import { WorkflowApi as WorkflowDFcApi, WorkflowSignApi, MemberApi } from '@service/dfc_sdk/sdk';
@Injectable({
  providedIn: 'root'
})
export class DfcSignHistoryService {
  constructor(
    private workflowApi: WorkflowDFcApi,
    private workflowSignApi: WorkflowSignApi,
    private memberApi: MemberApi
  ) { }

  // 第一步查詢 current
  query(signID): Promise<any> {
    console.log(typeof signID);
    if ((typeof signID) === 'number') {
      return this.workflowApi.findById(signID).toPromise();
    } else {
      return this.workflowApi.find({
        'where': {
          'id': { 'inq': signID }
        }
      }).toPromise();
    }
  }

  // 查詢當前人員是否有權限Approve
  async queryApproveFlag(current, status, userID): Promise<any> {
    if ((typeof status) === 'number') {
      return this.workflowSignApi.findById(current).toPromise().then(data => {
        if (data['userId'] === userID && status !== 2) {
          return { 'flag': true, 'signID': data['workflowId'], 'currentID': data['id'] };
        } else {
          return { 'flag': false, 'signID': data['workflowId'], 'currentID': data['id'] };
        }
      });
    } else {
      return this.workflowSignApi.find({
        'where': {
          'id': { 'inq': current }
        }
      }).toPromise().then(datas => {
        let flag = { 'flag': false, 'signID': -1, 'currentID': -1 };
        datas.forEach(data => {
          if (data['userId'] === userID && !status.includes(3)) {
            flag = { 'flag': true, 'signID': data['workflowId'], 'currentID': data['id'] };
          }
        });
        return flag;
      });
    }
  }

  // 查詢Approve History
  async querySign(signIDs, formNo, signCode?): Promise<any> {
    const workFlowDatas = await this.workflowSignApi.find({
      'where': {
        'workflowId': { 'inq': signIDs }
      },
      'order': 'id asc'
    }).toPromise().then(datas => {
      // 1.取得開頭的資料
      const startData = datas.map(data => {
        if (!data['previousWorkflowSignId']) {
          return data;
        }
      }).filter(data => !!data);
      // 2.在對每筆資料盡行排序分組
      const list = [];
      startData.forEach((sData, index) => {
        const temp = this.getList(sData, datas, [sData]);
        temp.forEach(t => {
          list.push(t);
        });
      });
      return list;
    });
    const dataSet = [];
    for (let index = 0; index < workFlowDatas.length; index++) {
      const workFlowData = workFlowDatas[index];
      const member = await this.memberApi.findById(workFlowData['userId'], {
        'fields': ['EName', 'EmpID', 'Email', 'Dept', 'Site', 'Role']
      }).toPromise().then(data => {
        return data;
      }).catch(error => {
        console.log(error);
      });
      let s = '';
      if (workFlowData['updateOn']) {
        const date = new Date(workFlowData['updateOn']);
        s = date.toLocaleDateString();
        s = s + '    ' + this.changeTime(date.getHours());
        s = s + ':' + this.changeTime(date.getMinutes());
        s = s + ':' + this.changeTime(date.getSeconds());
      }
      dataSet.push({
        formNo: !signCode ? formNo : signCode,
        site: !member ? '' : member['Site'],
        dept: !member ? '' : member['Dept'],
        role: workFlowData['role'],
        user: !member ? workFlowData['userId'] : member['EName'],
        empID: workFlowData['userId'],
        email: !member ? '' : member['Email'],
        date: s,
        approve: (workFlowData['isAgree'] === true) ? 'Approve' : ((workFlowData['isAgree'] === false) ? 'Reject' : ''),
        comment: workFlowData['comment']
      });
    }
    return dataSet;
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

  getList(list, datas, res) {
    const list2 = datas.find(data => data['id'] === list['nextWorkflowSignId']);
    if (!list2) {
      return res;
    }
    res.push(list2);
    if (!list2['nextWorkflowSignId']) {
      return res;
    } else {
      return this.getList(list2, datas, res);
    }
  }

  // 簽核
  async approve(signID, current, flag, comment): Promise<any> {
    // approve
    if (flag) {
      const workflowSign = await this.workflowApi.Approve(signID, localStorage.getItem('$DFI$userID'), comment).toPromise().then(data => {
        return { 'msg': 'success', 'data': data };
      }).catch(error => {
        console.log(error);
        return { 'msg': 'fail', 'data': error };
      });
      return workflowSign;
    } else {
      const workflowSign = await this.workflowApi.Deny(signID, localStorage.getItem('$DFI$userID'), comment).toPromise().then(data => {
        return { 'msg': 'success', 'data': data };
      }).catch(error => {
        console.log(error);
        return { 'msg': 'fail', 'data': error };
      });
      return workflowSign;
    }
  }

  // 簽核頁面 邀簽 Member下拉框
  async getAddSignMember(member): Promise<any> {
    const members = await this.memberApi.find({
      'fields': ['EmpID', 'Name', 'EName', 'Role'],
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
      p['select'].push({
        Value: {
          empID: t['EmpID'],
          role: t['Role']
        },
        Label: t['EmpID'] + '\t' + t['EName'] + '\t' + t['Name']
      });
      return p;
    }, { 'select': [] });
    return list['select'];
  }

  // 邀簽 人員
  addSignMember(status, signID, empID): Promise<any> {
    switch (status) {
      case 'before': {
        return this.workflowApi.InsertBefore(signID, empID).toPromise().then(res => {
          return { res: 'success' };
        }).catch(error => {
          return { res: 'fail' };
        });
      }
      case 'after': {
        return this.workflowApi.InsertAfter(signID, empID).toPromise().then(res => {
          return { res: 'success' };
        }).catch(error => {
          return { res: 'fail' };
        });
      }
    }
  }
}
