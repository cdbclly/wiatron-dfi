import { switchMap, map } from 'rxjs/operators';
import { WorkflowSignInterface } from './../../../../service/mrr-sdk/models/WorkflowSign';
import { Utils } from './../../../../dfq/utils';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SigningService } from '../signing.service';
import { forkJoin, of } from 'rxjs';
import { MailInterface } from '@service/dfi-sdk';

@Component({
  selector: 'app-signingdetail',
  templateUrl: './signingdetail.component.html',
  styleUrls: ['./signingdetail.component.scss']
})
export class SigningdetailComponent implements OnInit, OnChanges {
  @Input() plant;
  @Input() product;
  @Input() projectCode;
  @Input() users;
  @Input() site;
  @Input() Signers;
  @Input() projectName;
  @Input() currentRole;
  @Input() plantMan = { id: undefined, user: '', comment: '', judge: undefined, enable: false };
  @Input() pmHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false };
  @Input() signingDetails;

  reportUrl: string;
  signingUrl: string;

  ifRDEnable = false;
  // ifGSQMEnable = false;
  ifSQMEnable = false;
  // 是否顯示pmhead,qmhead
  ifHeaderShow = false;
  // 是否添加pmhead,qmhead
  addHeaders = false;

  tableList = [];
  dataLists = [];
  shows = [];
  rdData = [];
  // gsqmData = [];
  plantManData = [];
  sqmData = [];
  pmData = [];
  sendEnable = false;

  userId: string;

  isSubmitVisible = false;
  // send data
  updateData = [];
  plantManName: any;
  pmName: any;

  allMails: string;
  isVisible = false;
  itemsDetail = [];
  isVisiblePic = false;
  imageUrl: string;
  comments = [];
  constructor(
    private service: SigningService,
    private modalService: NzModalService,
    private signingService: SigningService,
    private message: NzMessageService,
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
  }

  ngOnInit() {
  }

  ngOnChanges() {
    const temp = [];
    this.shows.length = 0;
    if (this.signingDetails.length !== 0) {
      for (let index = 0; index < this.signingDetails.length; index++) {
        for (let j = 0; j < this.signingDetails[index].workflowSigns.length; j++) {
          this.signingDetails[index].workflowSigns[j].designItem = this.signingDetails[index].desc;
          this.signingDetails[index].workflowSigns[j].modelResultId = this.signingDetails[index].facts.modelResultId;
          this.signingDetails[index].workflowSigns[j].current = this.signingDetails[index].current;
        }
        temp.push(this.signingDetails[index].workflowSigns);
      }
    }
    this.shows = [].concat.apply([], temp);
    const roleGroup = Utils.groupBy(this.shows, 'role');
    for (const role in roleGroup) {
      if (role === 'RD') {
        let rdNo = 1;
        for (let index = 0; index < roleGroup[role].length; index++) {
          roleGroup[role][index].key = rdNo;
          rdNo++;
        }
        this.rdData = roleGroup[role];
        if (this.currentRole === 'RD') {
          for (let index = 0; index < this.rdData.length; index++) {
            if (this.rdData[index].userId === this.userId) {
              this.ifRDEnable = true;
            }
          }
        }
      } else if (role === 'SQM') {
        let sqmNo = 1;
        for (let index = 0; index < roleGroup[role].length; index++) {
          roleGroup[role][index].key = sqmNo;
          sqmNo++;
        }
        this.sqmData = roleGroup[role];
        if (this.currentRole === 'SQM') {
          for (let index = 0; index < this.sqmData.length; index++) {
            if (this.sqmData[index].userId === this.userId) {
              this.ifSQMEnable = true;
            }
          }
        }
      } else if (role === 'Plant Manager') {
        this.ifHeaderShow = true;
        this.plantManData = roleGroup[role];
        this.plantManName = this.plantManData[0].userId;
        if (this.currentRole === 'Plant Manager') {
          for (let index = 0; index < this.plantManData.length; index++) {
            if (this.plantManData[index].userId === this.userId) {
              this.plantMan.enable = true;
            }
          }
        }
      } else if (role === 'PM Head') {
        this.ifHeaderShow = true;
        this.pmData = roleGroup[role];
        this.pmName = this.pmData[0].userId;
        if (this.currentRole === 'PM Head') {
          for (let index = 0; index < this.pmData.length; index++) {
            if (this.pmData[index].userId === this.userId) {
              this.pmHead.enable = true;
            }
          }
        }
      }
    }
  }

  setSendEnable() {
    if (this.currentRole === 'RD') {
      if (this.rdData.length === this.rdData.filter(res => res.isAgree !== null).length) {
        this.sendEnable = true;
      }
    } else if (this.currentRole === 'SQM') {
      if (this.sqmData.length === this.sqmData.filter(res => res.isAgree !== null).length) {
        this.sendEnable = true;
      }
    } else if (this.currentRole === 'Plant Manager') {
      if (this.plantManData[0].isAgree !== null) {
        this.sendEnable = true;
      }
    } else if (this.currentRole === 'PM Head') {
      if (this.pmData[0].isAgree !== null) {
        this.sendEnable = true;
      }
    }
  }

  submit() {
    this.signingUrl = `${location.origin}${'/dashboard/nudd/nuddsigning'}?site=${this.site}&plant=${this.plant}&product=${this.product}&projectCode=${this.projectCode}&projectName=${this.projectName}`;
    this.reportUrl = `${location.origin}${'/dashboard/nudd/nuddreport'}?site=${this.site}&product=${this.product}&projectName=${this.projectName}`;
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.signingService.nuddSignUpd.next('submit');
        if (this.users.length !== 0) {
          this.allMails = '';
          for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].mail.email && this.allMails.indexOf(this.users[index].mail.email) === -1) {
              this.allMails += this.users[index].mail.email + ';';
            }
          }
        }
        this.sendEnable = false;
        if (this.currentRole === 'RD') {
          this.sendSignData(this.rdData);
          this.ifRDEnable = false;
        } else if (this.currentRole === 'SQM') {
          for (let index = 0; index < this.shows.length; index++) {
            if (this.shows[index].isAgree === 0) {
              this.addHeaders = true;
            }
          }
          this.sendSignData(this.sqmData);
          this.ifSQMEnable = false;
        } else if (this.currentRole === 'Plant Manager') {
          this.sendHeadSignData(this.plantManData);
          this.plantMan.enable = false;
        } else if (this.currentRole === 'PM Head') {
          this.sendHeadSignData(this.pmData);
          this.pmHead.enable = false;
        }
      }
    });
  }
  getComment(comment) {
    if (comment.length > 500) {
      this.message.create('error', 'Please enter within 500 words！');
      return;
    }
  }
  sendHeadSignData(headData) {
    const dataSetArray = [];
    for (let index = 0; index < headData.length; index++) {
      const flowSign: WorkflowSignInterface = {
        isAgree: headData[0].isAgree,
        comment: headData[0].comment
      };
      const obsFlow = this.service.updateWorkFlowSign(headData[index].id, flowSign).pipe(
        switchMap((res: WorkflowSignInterface[]) => {
          return of(res);
        }));
      dataSetArray.push(obsFlow);
    }
    forkJoin(dataSetArray).pipe(map(res => {
      if (this.currentRole === 'Plant Manager') {
        // 送PM HEAD
        this.sendMail(this.users.find(reso => reso.stageDesc.toUpperCase() === 'PM HEAD').mail.email);
      } else if (this.currentRole === 'PM Head') {
        for (let index = 0; index < this.pmData.length; index++) {
          if (this.pmData[0].isAgree === 1 && this.plantManData[0].isAgree === 1) {
            this.completeSign(this.pmData[index].workflowId, '1');
          } else {
            this.completeSign(this.pmData[index].workflowId, '2');
          }
        }
        if (this.pmData[0].isAgree === 1 && this.plantManData[0].isAgree === 1) {
          this.updateModelResultStatus(this.shows[0].modelResultId, '2');
        } else {
          this.updateModelResultStatus(this.shows[0].modelResultId, '3');
        }
      }
    })).subscribe(res => { }, err => this.sendEnable = true);
  }

  private sendSignData(data) {
    const dataSetArray = [];
    for (let index = 0; index < data.length; index++) {
      const flowSign: WorkflowSignInterface = {
        isAgree: data[index].isAgree,
        comment: data[index].comment
      };
      const obsFlow = this.service.updateWorkFlowSign(data[index].id, flowSign).pipe(
        switchMap((res: WorkflowSignInterface[]) => {
          return of(res);
        }));
      dataSetArray.push(obsFlow);
    }
    forkJoin(dataSetArray).subscribe((res: any) => {
      this.updateData = res;
      // 增加QM PM HEAD
      if (this.currentRole === 'SQM') {
        for (let index = 0; index < res.length; index++) {
          if (res[index].isAgree === 0) {
            this.addHeaders = true;
          }
        }
        if (this.addHeaders) {
          const addArray = [];
          for (let index = 0; index < res.length; index++) {
            const qmHead: WorkflowSignInterface = {
              role: 'Plant Manager',
              previousWorkflowSignId: res[index].id,
              workflowId: res[index].workflowId,
              userId: this.users.find(reso => reso.stageDesc.toUpperCase() === 'PLANT MANAGER').picId
            };
            const pmHead: WorkflowSignInterface = {
              role: 'PM Head',
              workflowId: res[index].workflowId,
              userId: this.users.find(reso => reso.stageDesc.toUpperCase() === 'PM HEAD').picId
            };
            const form = [qmHead, pmHead];
            const obsFlow = this.service.addWorkFlowSigns(form).pipe(
              switchMap((reso: WorkflowSignInterface[]) => {
                return of(reso);
              }));
            addArray.push(obsFlow);
          }
          forkJoin(addArray).pipe(
            map(
              resou => {
                for (let index = 0; index < resou.length; index++) {
                  const qmFlowSign: WorkflowSignInterface = {
                    nextWorkflowSignId: resou[index][1].id
                  };
                  const pmFlowSign: WorkflowSignInterface = {
                    previousWorkflowSignId: resou[index][0].id
                  };
                  const sqmFlowSign: WorkflowSignInterface = {
                    nextWorkflowSignId: resou[index][0].id
                  };
                  this.service.updateWorkFlowSign(this.updateData.filter(sour => sour.workflowId === resou[index][0].workflowId)[0].id, sqmFlowSign).subscribe();
                  this.service.updateWorkFlowSign(resou[index][0].id, qmFlowSign).subscribe();
                  this.service.updateWorkFlowSign(resou[index][1].id, pmFlowSign).subscribe();
                }
              }
            )).subscribe();
        } else {
          for (let index = 0; index < data.length; index++) {
            this.completeSign(data[index].workflowId, '1');
          }
          this.updateModelResultStatus(this.shows[0].modelResultId, '2');
        }
      }
      // 寄信
      if (this.currentRole === 'RD') {
        this.sendMail(this.users.find(reso => reso.stageDesc.toUpperCase() === 'SQM').mail.email);
      } else if (this.currentRole === 'SQM' && this.addHeaders) {
        this.sendMail(this.users.find(reso => reso.stageDesc.toUpperCase() === 'PLANT MANAGER').mail.email);
      }
    }, err => this.sendEnable = true);

  }

  completeSign(workFlowId, stauts) {
    this.service.updateWorkFlowStatus(workFlowId, {
      status: stauts
    }).subscribe();
  }

  updateModelResultStatus(modelResultId, stauts) {
    this.service.updateModelResultStatus(modelResultId, {
      status: stauts
    }).subscribe(res => {
      this.sendAllMail(this.allMails);
    }, err => console.log(err));
  }

  sendAllMail(receiver) {
    const mail: MailInterface = {
      subject: 'NUDD Signing notification',
      content: '[' + this.projectName + ']signing completed,please review it.' + '<br>Link <a href="' + this.reportUrl + '">MRR NUDD system</a> for detail information(需使用Google Chrome登陸)',
      sender: 'dfi@wistron.com',
      receiver: receiver
    };
    this.service.createMail(mail).subscribe(res => {
      this.isSubmitVisible = true;
      setTimeout(() => {
        this.isSubmitVisible = false;
      }, 3000);
    });
  }

  sendMail(receiver) {
    const mail: MailInterface = {
      subject: '[' + this.projectName + ']' + 'Nudd notification',
      content: '[' + this.projectName + ']NUDD need you judge(risk item),please review it.' + '<br>Link <a href="' + this.signingUrl + '">MRR NUDD system</a> for detail information(需使用Google Chrome登陸)',
      sender: 'dfi@wistron.com',
      receiver: receiver
    };
    this.signingService.createMail(mail).subscribe(res => {
      this.isSubmitVisible = true;
      setTimeout(() => {
        this.isSubmitVisible = false;
      }, 3000);
    });
  }
  showItemDetail(i) {
    this.signingService.getFacts(i).subscribe(res => {
      this.itemsDetail = res;
      console.log(res);
      this.isVisible = true;
    });
  }
  handleCancel() {
    this.isVisible = false;
  }
  cancel() {
    this.isVisiblePic = false;
  }
  // 點擊圖片放大
  clickEventHandler(data) {
    this.imageUrl = data;
    this.isVisiblePic = true;
  }
}
