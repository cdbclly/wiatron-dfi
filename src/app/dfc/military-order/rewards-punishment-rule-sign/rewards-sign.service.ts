import { Injectable } from '@angular/core';
import { WorkflowApi as WorkflowDFcApi, RewardSignApi, WorkflowSignApi, MemberApi } from '@service/dfc_sdk/sdk';
import { WorkflowApi as WorkflowDFiApi, WorkflowSignatoryApi, WorkflowFormApi, WorkflowFormMappingApi } from '@service/dfi-sdk';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
@Injectable({
  providedIn: 'root'
})
export class RewardsSignService {

  constructor(
    private workflowApi: WorkflowDFcApi,
    private workflowDFiApi: WorkflowDFiApi,
    private rewardSignApi: RewardSignApi,
    private workflowSignApi: WorkflowSignApi,
    private memberApi: MemberApi,
    private workflowSignatoryApi: WorkflowSignatoryApi,
    private workflowFormApi: WorkflowFormApi,
    private workflowFormMappingApi: WorkflowFormMappingApi,
    private meetingReviewTestService: MeetingReviewTestService
  ) { }

  // 查詢表格數據
  queryRule(model): Promise<any> {
    return this.rewardSignApi.find({
      'where': {
        'model': model
      },
      'include': [{
        'relation': 'workflow'
      }],
      'order': 'date desc'
    }).toPromise().then(data => {
      const res = {
        version: '',
        rule: {},
        data: {},
        recently: {}
      };
      for (let index = 0; index < data.length; index++) {
        const rewardData = data[index];
        if (index === 0) {
          res.recently = rewardData;
        }
        if (rewardData['workflow']['status'] === 1) {
          res.version = rewardData['version'];
          res.rule = rewardData['content'];
          res.data = rewardData;
          break;
        }
      }
      return res;
    });
  }

  // 查询送签人状态
  querySender(empID): Promise<any> {
    return this.memberApi.findById(empID, {
      'fields': ['Dept', 'Role', 'EName']
    }).toPromise().then(data => {
      return data;
    }).catch(error => {
      console.log(error);
    });
  }

  // 送簽查詢表單是否正在簽核
  isSign(signID): Promise<any> {
    return this.workflowApi.findById(signID).toPromise().then(data => {
      if (![1, 2].includes(data['status'])) {
        return true;
      } else {
        return false;
      }
    }).catch(error => {
      return false;
    });
  }

  // 查詢 送簽 相關人員信息
  async sendMember(): Promise<any> {
    const signConfig = JSON.parse(localStorage.getItem('DFC_SignConfig'));
    const workflowForm = await this.workflowFormApi.find({
      'where': {
        'name': signConfig['Reward']
      },
      'limit': 1
    }).toPromise().then(datas => {
      return datas[0];
    });
    if (!!workflowForm) {
      const workflowFormMap = await this.workflowFormMappingApi.find({
        'where': {
          'workflowFormId': workflowForm['id']
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
          return signatoryDatas;
        }
      }
    }
  }

  // 獲取簽核人員下拉框
  getSignMemberSelect(plant, member): Promise<any> {
    return this.memberApi.findById(member).toPromise().then(data => {
      return [{
        value: data['EmpID'],
        label: data['EmpID'] + '\t' + data['Name'] + '\t' + data['EName']
      }];
    }).catch(error => console.log(error));
  }

  // 送簽
  async sendSign(rule, version, desc, list, workflowMappingID): Promise<any> {
    const workFlow = await this.workflowApi.CreateNewSigningFlow(desc, list, workflowMappingID).toPromise().then(data => data).catch(error => console.log(error));
    this.workflowDFiApi.patchAttributes(workFlow['data']['id'], {
      'status': 0,
      'workflowFormMappingId': workflowMappingID
    }).subscribe(data => console.log(data), error => console.log(error));
    const rewardSign = await this.rewardSignApi.patchOrCreate({
      'signID': workFlow['data']['id'],
      'version': version,
      'content': JSON.stringify(rule),
      'date': new Date(),
      'sender': localStorage.getItem('$DFI$userID'),
      'model': 'DFC'
    }).toPromise().then(data => data).catch(error => console.log(error));
    return rewardSign;
  }

  // dfq查詢 送簽 相關人員信息
  async dfqSendMember(): Promise<any> {
    const workflowForm = await this.workflowFormApi.find({
      'where': {
        'name': 'DFQ0002'
      }
    }).toPromise();
    let workflowFormMap;
    if (!!workflowForm) {
      workflowFormMap = await this.workflowFormMappingApi.find({
        'where': {
          'workflowFormId': workflowForm[0]['id']
        }
      }).toPromise();
    }
    if (!!workflowFormMap) {
      const signatoryDatas = await this.workflowSignatoryApi.find({
        'where': {
          'workflowFormMappingId': workflowFormMap[0]['id']
        },
        'order': 'stage asc'
      }).toPromise().then(data => {
        return data;
      });
      return signatoryDatas;
    }
  }

  // dfq送簽
  async dfqSendSign(rule, version, desc, list, workflowMappingID): Promise<any> {
    const workFlow = await this.workflowApi.CreateNewSigningFlow(desc, list, workflowMappingID).toPromise().then(data => data).catch(error => console.log(error));
    this.workflowDFiApi.patchAttributes(workFlow['data']['id'], {
      'status': 0,
      'workflowFormMappingId': workflowMappingID
    }).subscribe(data => console.log(data), error => console.log(error));
    const rewardSign = await this.rewardSignApi.patchOrCreate({
      'signID': workFlow['data']['id'],
      'version': version,
      'content': JSON.stringify(rule),
      'date': new Date(),
      'sender': localStorage.getItem('$DFI$userID'),
      'model': 'DFQ'
    }).toPromise().then(data => {
      // 送簽人發送郵件給第一個簽核人
      this.dfqSendMail(workFlow['data']['id']);
    }).catch(error => console.log(error));
    return rewardSign;
  }

  // 查詢當前簽核人是否同意
  queryCurrent(signID, userId) {
    return this.workflowSignApi.find({
      where: {
        'workflowId': signID,
        'userId': userId
      }
    });
  }

  // 簽核同意，發送郵件
  async dfqSendMail(signID) {
    // 查找送簽人的Email
    let mail = '';
    const emails = [];
    const senderId = await this.rewardSignApi.find({
      fields: 'sender',
      where: {
        signID: signID
      }
    }).toPromise();
    const sendSignMember = await this.memberApi.findById(senderId[0]['sender']).toPromise();
    mail = sendSignMember['Email'];
    // 獲取當前簽核人的userId
    this.workflowApi.getCurrentUser(signID, false).subscribe(signData => {
      // 判斷是否是最后一個簽核人
      if (JSON.stringify(signData) !== '{}') {
        this.memberApi.findById(signData['userId']).subscribe(memberData => {
          const mails = memberData['Email'];
          const url = `${location.origin}/dashboard/dfc/dfq-rewards-punishment-sign?signID=${signID}`;
          const notice = {
            subject: '【DFQ系統提醒】DFQ獎懲規則更新簽核',
            content: 'Dear Sir:<br>DFQ獎懲規則簽核中，請及時登陸DFQ系統完成獎懲規則簽核.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
            sender: 'dfi@wistron.com',
            receiver: mails
          };
          this.meetingReviewTestService.createMail(notice).toPromise();
        });
      } else {
        // 如果是最後一個簽核人，最後一個簽核人就發送郵件給所有簽核的人
        this.workflowSignApi.find({
          'where': {
            'workflowId': signID
          }
        }).subscribe(workflowSignDatas => {
          workflowSignDatas.forEach(workflowSignData => {
            this.memberApi.findById(workflowSignData['userId']).subscribe(memberData => {
              emails.push(memberData['Email']);
            });
          });
          emails.push(mail);
          const url = `${location.origin}/dashboard/dfc/dfq-rewards-punishment-sign?signID=${signID}`;
          const notice = {
            subject: '【DFQ系統提醒】DFQ獎懲規則簽核完成',
            content: 'Dear Sir:<br>獎懲規則簽核完成，此後DFQ績效評比將以此為標準追踪作業.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
            sender: 'dfi@wistron.com',
            receiver: emails
          };
          this.meetingReviewTestService.createMail(notice).subscribe();
        });
      }
    });
  }
  // 簽核不同意，發送郵件
  async SendFail(signID) {
    // 查找送簽人的Email
    let mail = '';
    const emails = [];
    const senderId = await this.rewardSignApi.find({
      fields: 'sender',
      where: {
        signID: signID
      }
    }).toPromise();
    const sendSignMember = await this.memberApi.findById(senderId[0]['sender']).toPromise();
    mail = sendSignMember['Email'];
    this.workflowSignApi.find({
      'where': {
        'workflowId': signID
      }
    }).subscribe(workflowSignDatas => {
      if (workflowSignDatas[0]['isAgree'] === false) {
        this.memberApi.findById(workflowSignDatas[1]['userId']).subscribe(memberData => {
          emails.push(memberData['Email']);
          emails.push(mail);
          console.log(emails);
          const url = `${location.origin}/dashboard/dfc/dfq-rewards-punishment-sign?signID=${signID}`;
          const notice = {
            subject: '【DFQ系統提醒】DFQ獎懲規則簽核失敗',
            content: 'Dear Sir:<br>獎懲規則簽核中, ' + localStorage.getItem('$DFI$userName') + '簽核未通過.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
            sender: 'dfi@wistron.com',
            receiver: emails
          };
          this.meetingReviewTestService.createMail(notice).subscribe();
        });
      } else if (workflowSignDatas[1]['isAgree'] === false) {
        this.memberApi.findById(workflowSignDatas[0]['userId']).subscribe(memberData => {
          emails.push(memberData['Email']);
          emails.push(mail);
          const url = `${location.origin}/dashboard/dfc/dfq-rewards-punishment-sign?signID=${signID}`;
          const notice = {
            subject: '【DFQ系統提醒】DFQ獎懲規則簽核失敗',
            content: 'Dear Sir:<br>獎懲規則簽核中, ' + localStorage.getItem('$DFI$userName') + '簽核未通過.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
            sender: 'dfi@wistron.com',
            receiver: emails
          };
          this.meetingReviewTestService.createMail(notice).subscribe();
        });
      }
    });
  }
}
