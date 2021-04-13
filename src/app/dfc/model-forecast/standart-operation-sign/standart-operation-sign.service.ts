import { Injectable } from '@angular/core';
import { StandardOperationSignApi, StandardOperationSignContentApi, WorkflowApi, WorkflowSignApi, MemberApi, ProcessApi, V_StanderOperationApi, ModuleMappingApi, FactorApi } from '@service/dfc_sdk/sdk';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StandartOperationSignService {

  constructor(
    private standardOperationSignApi: StandardOperationSignApi,
    private standardOperationSignContentApi: StandardOperationSignContentApi,
    private vStanderOperationApi: V_StanderOperationApi,
    private workflowApi: WorkflowApi,
    private workflowSignApi: WorkflowSignApi,
    private memberApi: MemberApi,
    private processApi: ProcessApi,
    private moduleMappingApi: ModuleMappingApi,
    private factorApi: FactorApi
  ) { }

  async query(queryValue: { modelType: string, process: string, signStatus: string, searchUser: string }): Promise<any> {
    const standardSignQuery: any = {
      'where': {
        'and': [
          { 'modelType': { 'like': queryValue.modelType + '%' } },
          { 'process': { 'like': queryValue.process + '%' } }
        ]
      }
    };
    if (!!queryValue.searchUser) {
      standardSignQuery.where.and.push({ 'sender': queryValue.searchUser });
    }
    const standardSignData = await this.standardOperationSignApi.find(standardSignQuery).toPromise();
    const res = [];
    for (let index = 0; index < standardSignData.length; index++) {
      const standSignData = standardSignData[index];
      const workflowData = await this.workflowApi.findById(standSignData['signID']).toPromise().then(datas => {
        return datas;
      }).catch(error => {
        return error;
      });
      if (!workflowData['name'] && (!queryValue.signStatus || queryValue.signStatus === (workflowData['status'] + ''))) {
        const processData = await this.processApi.findById(standSignData['process']).toPromise().then(data => {
          return data;
        }).catch(error => {
          return {};
        });
        const senderData = await this.memberApi.findById(standSignData['sender'], {
          'fields': ['EName', 'EmpID']
        }).toPromise().then(data => data).catch(error => console.log(error));
        let status;
        let comment = '';
        let searchUserFlag = true;
        let revokeFlag = false;
        switch (workflowData['status']) {
          case 0: {
            status = '簽核中';
            comment = await this.workflowApi.getCurrentUser(standSignData['signID'], false).toPromise().then(workflowSignData => {
              if (localStorage.getItem('$DFI$userID') === standSignData['sender'] && !workflowSignData['previousWorkflowSignId']) {
                revokeFlag = true;
              }
              if ((!!queryValue.searchUser && workflowSignData['userId'] === queryValue.searchUser) || (!queryValue.searchUser)) {
                searchUserFlag = true;
              } else {
                searchUserFlag = false;
              }
              return this.memberApi.findById(workflowSignData['userId'], {
                'fields': ['EmpID', 'EName']
              }).toPromise().then(memberData => {
                return '等待' + memberData['EName'] + '簽核';
              }).catch(error => {
                return '';
              });
            }).catch(error => {
              return '';
            });
            break;
          }
          case 1: {
            status = '已簽核';
            comment = '簽核完成';
            break;
          }
          case 2: {
            comment = await this.workflowSignApi.find({
              'where': {
                'and': [
                  { 'workflowId': workflowData['id'] },
                  { 'isAgree': false }
                ]
              }
            }).toPromise().then(workflowSignData => {
              if (workflowSignData.length > 0) {
                status = '被駁回';
                if ((!!queryValue.searchUser && workflowSignData['userId'] === queryValue.searchUser) || (!queryValue.searchUser)) {
                  searchUserFlag = true;
                } else {
                  searchUserFlag = false;
                }
                return this.memberApi.findById(workflowSignData[0]['userId'], {
                  'fields': ['EmpID', 'EName']
                }).toPromise().then(memberData => {
                  return '被' + memberData['EName'] + '駁回';
                }).catch(error => {
                  console.log(error);
                  return '';
                });
              } else {
                status = '被撤回';
                return '';
              }
            });
            break;
          }
          default: {
            status = '未送簽';
            comment = '未送簽';
            break;
          }
        }
        if (searchUserFlag) {
          res.push({
            'no': standSignData['id'],
            'modelType': standSignData['modelType'],
            'process': !processData ? '' : processData['Name'],
            'processCode': standSignData['process'],
            'sender': senderData['EName'],
            'senderID': senderData['EmpID'],
            'revokeFlag': revokeFlag,
            'status': status,
            'comment': comment,
            'signID': standSignData['signID']
          });
        }
      }
    }
    return res;
  }

  // signDetail 查詢
  async queryDetail(senderID, signID, formNo): Promise<any> {
    const memberData = await this.memberApi.findById(senderID, {
      'fields': ['EmpID', 'EName', 'Dept', 'Role']
    }).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    const standSignData = await this.standardOperationSignApi.findById(formNo).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    const processData = await this.processApi.findById(standSignData['process']).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    const standSignContentData = await this.standardOperationSignContentApi.find({
      'where': {
        'operationId': formNo
      }
    }).toPromise();
    //  定義出大致的 result 格式
    const res = {
      applicationData: {
        deptCode: memberData['Dept'],
        deptName: '',
        applicant: memberData['EName'],
        applyDate: (new Date(standSignData['date'])).toLocaleDateString()
      },
      dataSet: [],
      revokeFlag: false
    };
    const workflowData = await this.workflowApi.findById(signID).toPromise().then(data => {
      return data;
    }).catch(error => console.log(error));
    if (!!workflowData && workflowData['status'] === 0) {
      res['revokeFlag'] = await this.workflowApi.getCurrentUser(signID, false).toPromise().then(data => {
        if (localStorage.getItem('$DFI$userID') === senderID && !data['previousWorkflowSignId']) {
          return true;
        } else {
          return false;
        }
      }).catch(error => {
        return false;
      });
    }
    // 查詢出細項表格中的內容
    for (let index = 0; index < standSignContentData.length; index++) {
      const sData = standSignContentData[index];
      let standardData = [];
      let moduleData;
      if (!!sData['key']['operationCode']) {
        standardData = await this.vStanderOperationApi.find({
          'where': {
            'OperationCode': sData['key']['operationCode']
          }
        }).toPromise();
        moduleData = await this.moduleMappingApi.find({
          'where': {
            'and': [
              { 'ModelType': sData['key']['modelType'] },
              { 'FactorDetailID': standardData[0]['FactorDetailID'] }
            ]
          }
        }).toPromise();
      }
      let msg = '';
      switch (sData['action']) {
        case 'New': {
          msg = '新增標準工時[ 產品: ' + sData['key']['modelType'] +
            '製程: ' + sData['key']['process'] +
            '模組: ' + sData['key']['module'] +
            '物料: ' + sData['key']['material'] +
            '因素: ' + sData['key']['factor'] +
            '因素細項: ' + sData['key']['factorDetail'] +
            '動作: ' + sData['key']['action'] +
            '工時: ' + sData['value'];
          break;
        }
        case 'ModifyTime': {
          msg = '將工時' + standardData[0]['CostTime'] + '修改為:' + sData['value'];
          break;
        }
        case 'ChangeName': {
          const factorData = await this.factorApi.findById(sData['key']['FactorID']).toPromise();
          standardData.push({
            'MaterialName': '',
            'FactorName': factorData['Name'],
            'FactorDetailName': '',
            'ActionName': ''
          })
          msg = '將因素名 修改為:' + sData['value'];
          break;
        }
      }
      res['dataSet'].push({
        modelType: standSignData['modelType'],
        process: processData['Name'],
        module: (!moduleData) ? '' : moduleData[0]['Module'],
        material: (!standardData) ? '' : standardData[0]['MaterialName'],
        factor: (!standardData) ? '' : standardData[0]['FactorName'],
        factorDetail: (!standardData) ? '' : standardData[0]['FactorDetailName'],
        action: (!standardData) ? '' : standardData[0]['ActionName'],
        msg: msg
      });
    }
    return res;
  }

  ApplyChange(signID) {
    this.standardOperationSignApi.ApplyChange(signID).subscribe(data => console.log(data));
  }

  revoke(signID): Observable<any> {
    return this.workflowApi.patchAttributes(signID, { status: 2 });
  }
}
