import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MeetingReviewTestService } from '../meeting-review-test.service';
import { map } from 'rxjs/operators';
// DFi SDK
import { WorkflowInterface, View_WorkflowHistoryApi, View_WorkflowHistory, WorkflowSignApi, WorkflowCounterSignApi, WorkflowFormApi, WorkflowSignatoryApi } from '@service/dfi-sdk';
import { ExitMeetingResult, CheckListLog } from '@service/dfq_sdk/sdk';
import { MemberApi } from '@service/dfc_sdk/sdk';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-meeting-review-signer',
  templateUrl: './meeting-review-signer.component.html',
  styleUrls: ['./meeting-review-signer.component.scss']
})
export class MeetingReviewSignerComponent implements OnInit, OnChanges {
  @Input() cfe = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'CFE', enName: '' };
  @Input() pmHead = { id: undefined, user: '', comment: '', enable: false, name: 'PM HEAD', enName: '' };
  @Input() buQmHead = { id: undefined, user: '', comment: '', enable: false, name: 'BU QM Head', enName: '' };
  @Input() buHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BU HEAD', enName: '' };
  @Input() bgQmHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BG QM Head', enName: '' };
  @Input() plant = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'Plant Manager', enName: '' };
  // Judge History
  @Input() meetingResults: ExitMeetingResult[] = [];
  @Input() workFlows: WorkflowInterface[] = [];
  @Input() isPass: boolean;
  @Input() showSendButton: boolean;
  @Output() send = new EventEmitter<any>();
  @Input() user;
  @Input() judgeStatus;
  @Input() key: string;
  checkListColor = [];
  // popup signer history
  signerHistory = {
    show: false,
    data: []
  };

  // popup ExitMeetingJudgement
  historyExitMeetingJudgement = {
    show: false,
    data: []
  };

  // DFILeader 可以修改签核中的签核人员
  DFILeader = false;
  showEdit = false;
  canEdit = false;
  signPics = [];
  signatoryPics = [];
  counterSignPics = [];
  saveLoading = false;
  constructor(
    private meetingReviewTestService: MeetingReviewTestService,
    private workflowHistoryService: View_WorkflowHistoryApi,
    private memberService: MemberApi,
    private WorkflowSignService: WorkflowSignApi,
    private counterSigningService: WorkflowCounterSignApi,
    private workflowFormService: WorkflowFormApi,
    private WorkflowSignatory: WorkflowSignatoryApi,
    private message: NzMessageService

  ) { }

  ngOnInit() {
    const menber = localStorage.getItem('$DFI$userID');
    this.memberService.find({ where: { EmpID: menber } }).toPromise().then(menbers => {
      this.DFILeader = menbers[0]['DFILeader'];
    });
  }
  ngOnChanges(changes) {
    try {
      if (!changes.cfe.firstChange) {
        // 如果签核不存在或者签核结束 不显示编辑按钮
        if (this.workFlows.length < 1 || this.meetingResults[0].signStatus === 4) {
          this.showEdit = false;
          return;
        }
        this.showEdit = true;
        // 查询送签后签核人员记录
        this.WorkflowSignService.find({
          include: {
            relation: 'workflowCounterSigns'
          },
          where: {
            workflowId: this.workFlows[0]['id']
          }
        }).subscribe({
          next: (res) => {
            this.signPics = res;
            for (let i = 0; i < res.length; i++) {
              if (res[i]['workflowCounterSigns'].length > 0) {
                for (let j = 0; j < res[i]['workflowCounterSigns'].length; j++) {
                  this.counterSignPics.push(res[i]['workflowCounterSigns'][j]);
                }
              }
            }
          }, error: e => {
            this.DFILeader = false;
          }
        });
        // 查询送签前维护的签核人员信息
        this.workflowFormService.find({
          where: {
            name: 'DFQ0001'
          },
          include: {
            relation: 'workflowFormMappings',
            scope: {
              where: {
                model: 'DFQ',
                key: this.key
              },
              include: {
                relation: 'workflowSignatories',
              }
            }
          }
        }).subscribe(red => {
          this.signatoryPics = red[0]['workflowFormMappings'][0]['workflowSignatories'].slice();
        });
      }
    } catch (err) {
    }
  }
  edit() {
    this.canEdit = true;
  }
  async save() {
    this.canEdit = false;
    this.saveLoading = true;
    try {
      for (let index = 0; index < this.signPics.length; index++) {
        const signatory = this.signatoryPics.filter(item => item.stageDesc.toUpperCase() === this.signPics[index].role.toUpperCase());
        if (this.signPics[index].role.toUpperCase() === this.cfe.name.toUpperCase()) {
          if (this.signPics[index].userId !== this.cfe.user) {
            this.signPics[index].role = this.cfe.name;
            this.signPics[index].userId = this.cfe.user;
            signatory[0].picId = this.cfe.user;
            signatory[0].isDynamic = 0;
            // 修改workflowSign、修改workflowSignatory
            await this.WorkflowSignService.upsert(this.signPics[index]).toPromise();
            await this.WorkflowSignatory.upsert(signatory[0]).toPromise();
          }
        } else if (this.signPics[index].role.toUpperCase() === this.pmHead.name.toUpperCase()) {
          if (this.signPics[index].userId !== this.pmHead.user) {
            signatory[0].isDynamic = 0;
            signatory[0].picId = this.pmHead.user;
            this.signPics[index].role = this.pmHead.name;
            this.signPics[index].userId = this.pmHead.user;
            // 修改workflowSign、修改workflowSignatory
            await this.WorkflowSignService.upsert(this.signPics[index]).toPromise();
            await this.WorkflowSignatory.upsert(signatory[0]).toPromise();
          }
        } else if (this.signPics[index].role.toUpperCase() === this.buHead.name.toUpperCase()) {
          if (this.signPics[index].userId !== this.buHead.user) {
            this.signPics[index].role = this.buHead.name;
            this.signPics[index].userId = this.buHead.user;
            signatory[0].picId = this.buHead.user;
            // 修改workflowSign、修改workflowSignatory
            await this.WorkflowSignService.upsert(this.signPics[index]).toPromise();
            await this.WorkflowSignatory.upsert(signatory[0]).toPromise();
          }
        }
      }

      for (let i = 0; i < this.counterSignPics.length; i++) {
        const signatory2 = this.signatoryPics.filter(item => item.stageDesc.toUpperCase() === this.counterSignPics[i].role.toUpperCase());
        const param2 = this.counterSignPics[i];
        if (this.counterSignPics[i]['role'].toUpperCase() === this.buQmHead.name.toUpperCase()) {
          if (param2['userId'] !== this.buQmHead.user) {
            param2['userId'] = this.buQmHead.user;
            signatory2[0].picId = this.buQmHead.user;
            // 修改workflowCounterSign、修改workflowSignatory
            await this.counterSigningService.upsert(param2).toPromise();
            await this.WorkflowSignatory.upsert(signatory2[0]).toPromise();
          }
        } else if (this.counterSignPics[i]['role'].toUpperCase() === this.bgQmHead.name.toUpperCase()) {
          if (param2['userId'] !== this.bgQmHead.user) {
            param2['userId'] = this.bgQmHead.user;
            signatory2[0].picId = this.bgQmHead.user;
            // 修改workflowCounterSign、修改workflowSignatory
            await this.counterSigningService.upsert(param2).toPromise();
            await this.WorkflowSignatory.upsert(signatory2[0]).toPromise();
          }

        } else if (this.counterSignPics[i]['role'].toUpperCase() === this.plant.name.toUpperCase()) {
          if (param2['userId'] !== this.plant.user) {
            param2['userId'] = this.plant.user;
            signatory2[0].picId = this.plant.user;
            // 修改workflowCounterSign、修改workflowSignatory
            await this.counterSigningService.upsert(param2).toPromise();
            await this.WorkflowSignatory.upsert(signatory2[0]).toPromise();
          }
        }
      }

      this.saveLoading = false;
      this.message.create('success', '保存成功！');
    } catch (err) {
      this.saveLoading = false;
      this.message.create('error', '保存失败');
    }
  }

  changeCfe(cfe) {
    if (cfe.EmpID) {
      this.cfe.user = cfe.EmpID;
      this.cfe.enName = cfe.EName;
      this.cfe.comment = '';
      this.cfe.judge = undefined;
      this.canEdit = true;
    }

  }
  changePM(pmHead) {
    if (pmHead.EmpID) {
      this.pmHead.user = pmHead.EmpID;
      this.pmHead.comment = '';
      this.pmHead.enName = pmHead.EName;
      this.canEdit = true;
    }
  }
  changebuHead(buHead) {
    if (buHead.EmpID) {
      this.buHead.user = buHead.EmpID;
      this.buHead.comment = '';
      this.buHead.judge = undefined;
      this.buHead.enName = buHead.EName;
      this.canEdit = true;
    }
  }
  changebuQmHead(buQmHead) {
    if (buQmHead.EmpID) {
      this.buQmHead.user = buQmHead.EmpID;
      this.buQmHead.comment = '';
      this.buQmHead.enName = buQmHead.EName;
      this.canEdit = true;
    }
  }
  changebgQmHead(bgQmHead) {
    if (bgQmHead.EmpID) {
      this.bgQmHead.user = bgQmHead.EmpID;
      this.bgQmHead.comment = '';
      this.bgQmHead.judge = undefined;
      this.bgQmHead.enName = bgQmHead.EName;
      this.canEdit = true;
    }
  }
  changeplant(plant) {
    if (plant.EmpID) {
      this.plant.user = plant.EmpID;
      this.plant.comment = '';
      this.plant.judge = undefined;
      this.plant.enName = plant.EName;
      this.canEdit = true;
    }
  }

  openSignerHistoryModal(workflowId: number) {
    this.workflowHistoryService.find({
      where: {
        workflowId: workflowId
      },
      order: 'updateOn'
    })
      .subscribe((res: View_WorkflowHistory[]) => {
        this.signerHistory = {
          data: res,
          show: true
        };
      });
  }

  openExitMeetingJudgement(exitMeetingResultId: number) {
    this.meetingReviewTestService.getCheckListLog({
      where: {
        exitMeetingResultId: exitMeetingResultId
      },
      order: 'SEQ'
    })
      .subscribe((checklistLog: CheckListLog[]) => {
        this.historyExitMeetingJudgement = {
          data: checklistLog,
          show: true
        };
      });
  }

  handleCancel() {
    this.signerHistory = {
      show: false,
      data: []
    };

    this.historyExitMeetingJudgement = {
      show: false,
      data: []
    };
  }

  submitSend() {
    this.send.emit();
  }

  setCurrentRole(role) {
    this.user.role = role;
  }
}
