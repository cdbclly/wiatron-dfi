import { WorkflowSignInterface } from 'app/service/dfi-sdk/models/WorkflowSign';
import { Component, OnInit } from '@angular/core';
import { MeetingReviewTestService } from './meeting-review-test.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import {
  BusinessUnitInterface,
  PlantInterface,
  BusinessGroupInterface,
  SiteInterface,
  CustomerInterface,
  StageInterface,
  NPIMODELInterface,
  ExitMeetingResultInterface,
  NPITEAMMEMBERHEADInterface,
  NPITEAMMEMBERLISTInterface,
  NPICHECKLIST_EMInterface,
  CheckListLog,
  ExitMeetingResult
} from '@service/dfq_sdk/sdk';
import { forkJoin, of, throwError, OperatorFunction } from 'rxjs';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UserInterface } from '@service/portal/sdk';
import { JudgeStatusPipe } from 'app/dfq/exit-meeting/judge-status.pipe';
import { NzNotificationService } from 'ng-zorro-antd';
import { PicturereportService } from 'app/mrr/nudd/analyse/pictureanalysereport/picturereport.service';
import { WorkflowCounterSignInterface, Workflow, WorkflowApi, MailInterface } from '@service/dfi-sdk';
import { MemberApi } from '@service/dfc_sdk/sdk/services/custom/Member';
import { WaivePipe } from 'app/dfq/waive.pipe';
import { Member } from '@service/dfc_sdk/sdk';

@Component({
  selector: 'app-meeting-review-test',
  templateUrl: './meeting-review-test.component.html',
  styleUrls: ['./meeting-review-test.component.scss']
})
export class MeetingReviewTestComponent implements OnInit {

  waivePipe: WaivePipe = new WaivePipe();
  tableHtml = '<table border="1"><tr> <th>role</th> <th>name</th> <th>judge</th> <th>comments</th></tr>';  // 沒有結束標籤，在發郵件時添上

  user = {
    id: localStorage.getItem('$DFI$userID'),
    role: null
  };

  // 查詢表單
  meetinQueryForm: FormGroup;
  bgs: BusinessGroupInterface[];
  bus: BusinessUnitInterface[];
  sites: SiteInterface[];
  plants: PlantInterface[];
  customers: CustomerInterface[];
  stages: StageInterface[];
  models: NPIMODELInterface[];
  site: string;
  disableRepeatFormSubmit = false;
  signStatus;
  // Judge History
  meetingResults: ExitMeetingResultInterface[] = [];
  exitMeetingId: string;
  id: number;
  workFlowIds = [];
  cfe = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'CFE', enName: '' };
  pmHead = { id: undefined, user: '', comment: '', enable: false, name: 'PM Head', enName: '' };
  buQmHead = { id: undefined, user: '', comment: '', enable: false, name: 'BU QM Head', enName: '' };
  buHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BU Head', enName: '' };
  bgQmHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BG QM Head', enName: '' };
  plant = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'Plant Manager', enName: '' };

  // function
  functionStatus: { count: number, total: number, color: string, name: string }[] = [];

  // 系統判定結果
  plantId: string;
  judgeStatus: number;
  isPass: boolean;

  // 送出按鈕的顯示與否
  showSendButton = false;

  // mail會使用到連回來的url
  url: string;

  npiCheckList: NPICHECKLIST_EMInterface[] = [];

  // checklist judgement status
  checklistStatus;

  teamMembersSendArray = [];
  signing: WorkflowSignInterface[] = [];
  param: any;
  result: any;
  workFlows = [];
  signingUserArray: any;
  flowFormMappingId: number;
  key;

  constructor(
    private userService: MemberApi,
    private meetingReviewTestService: MeetingReviewTestService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private pictureReportService: PicturereportService,
    private workflowService: WorkflowApi
  ) {
    this.bgs = this.route.snapshot.data['bgsResolver'];
    this.sites = this.route.snapshot.data['sitesResolver'];
    this.customers = this.route.snapshot.data['customersResolver'];
    this.stages = this.route.snapshot.data['stagesResolver'];
  }
  ngOnInit() {
  }
  queryForm(event) {
    this.meetinQueryForm = event;
    this.query(this.meetingReviewTestService.getMeetingId(this.meetinQueryForm));
  }
  query($obs) {
    if (this.disableRepeatFormSubmit) {
      return;
    }
    this.exitMeetingId = '';
    this.meetingResults.length = 0;
    this.disableRepeatFormSubmit = true;
    this.isPass = true;
    this.cfe = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'CFE', enName: '' };
    this.pmHead = { id: undefined, user: '', comment: '', enable: false, name: 'PM Head', enName: '' };
    this.buQmHead = { id: undefined, user: '', comment: '', enable: false, name: 'BU QM Head', enName: '' };
    this.buHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BU Head', enName: '' };
    this.bgQmHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BG QM Head', enName: '' };
    this.plant = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'Plant Manager', enName: '' };
    this.functionStatus.length = 0;
    this.npiCheckList.length = 0;
    this.checklistStatus = {
      overall: { closed: [], ongoing: [], open: [], na: [] },
      mustDo: { closed: [], ongoing: [], open: [] }
    };
    $obs.pipe(
      map((res) => {
        if (!res['exitMeetingId']) {
          return throwError('No exitMeetingId');
        }
        this.site = res['siteId'];
        this.exitMeetingId = res['exitMeetingId'];
        this.plantId = res['plantId'];
        this.url = res['url'];
        this.param = res['param'];
        this.id = res['id'];
        this.signStatus = res['signStatus'];
        this.key = res['key'];
        this.meetingReviewTestService.getFormMappingId(res['key']).subscribe(data => this.flowFormMappingId = data);
        return res['exitMeetingId'];
      }),
      this.getMeetingResult(),
      this.getWorkFlows(),
      this.getCheckListEm(),
      this.checkForSigning()
    ).subscribe(() => {
      if (this.signStatus !== 2) { this.showSendButton = false; }
      this.disableRepeatFormSubmit = false;
    });
  }

  getMeetingResult = () => switchMap(() => {
    return this.meetingReviewTestService.getMeetingResult({
      where: {
        exitMeetingId: this.id
      },
      order: 'id DESC'
    })
      .pipe(
        map((resultsRes: ExitMeetingResult[]) => {
          this.meetingResults = resultsRes;
          // collect workflow id of exit meeting result
          if (this.meetingResults.length > 0) {
            this.workFlowIds = [];
            for (let i = 0; i < this.meetingResults.length; i++) {
              this.workFlowIds.push(this.meetingResults[0].workflowId);
            }
          } else {
            this.workFlowIds = [];
          }
          return this.meetingResults;
        })
      );
  })

  getWorkFlows = () => switchMap(() => {
    return this.workflowService.find({
      where: {
        id: { inq: this.workFlowIds }
      },
      order: 'id DESC'
    })
      .pipe(
        map((workflows: Workflow[]) => {
          this.workFlows = workflows;
          return this.workFlows;
        })
      );
  })

  getCheckListEm = () => switchMap(() => {
    return this.meetingReviewTestService.getCheckListEm(this.site, this.exitMeetingId, this.meetingResults, this.plantId)
      .pipe(
        map((res: {
          functionStatus: { count: number, total: number, color: string, name: string }[],
          itemsData,
          judgeStatus: number,
          showSendButton: boolean,
          npiCheckList
        }) => {
          this.functionStatus = res.functionStatus;
          this.checklistStatus = res.itemsData;
          this.judgeStatus = res.judgeStatus;
          this.isPass = this.meetingReviewTestService.getResultByPlantId(this.plantId, this.judgeStatus);
          this.showSendButton = res.showSendButton;
          this.npiCheckList = res.npiCheckList;
        }
        )
      );
  }
  )

  getSigning = (): OperatorFunction<any, any> => switchMap(
    () => {
      const signer = {
        cfe: this.cfe,
        pmHead: this.pmHead,
        buQmHead: this.buQmHead,
        buHead: this.buHead,
        bgQmHead: this.bgQmHead,
        plant: this.plant
      };
      return this.meetingReviewTestService.setSigner(
        this.meetingResults,
        this.user,
        this.meetinQueryForm,
        signer,
        this.workFlows
      ).pipe(
        map((res: { cfe, pmHead, buQmHead, buHead, bgQmHead, plant }) => {
          // CFE
          this.cfe = res.cfe;
          this.userService.findById(this.cfe.user).subscribe((user: Member) => this.cfe.enName = user.EName);
          // PM Head
          this.pmHead = res.pmHead;
          this.userService.findById(this.pmHead.user).subscribe((user: Member) => this.pmHead.enName = user.EName);
          // BU QM Head
          this.buQmHead = res.buQmHead;
          this.userService.findById(this.buQmHead.user).subscribe((user: Member) => this.buQmHead.enName = user.EName);
          // BU Head
          this.buHead = res.buHead;
          this.userService.findById(this.buHead.user).subscribe((user: Member) => this.buHead.enName = user.EName);
          // BG QM Head
          this.bgQmHead = res.bgQmHead;
          this.userService.findById(this.bgQmHead.user).subscribe((user: Member) => this.bgQmHead.enName = user.EName);
          // Plant Manager
          this.plant = res.plant;
          this.userService.findById(this.plant.user).subscribe((user: Member) => this.plant.enName = user.EName);
        }));
    }
  )

  getNpiRole = (setSigner = true) => switchMap(
    (form: any) => {
      return this.meetingReviewTestService.getNpiRole(
        {
          where: {
            SITE: form.site,
            PLANT: form.plant,
            MODEL: form.model
          }
        }
      ).pipe(
        switchMap(
          (teamHeadersRes: NPITEAMMEMBERHEADInterface) => {
            return this.meetingReviewTestService.getNpiTeamMemberList({
              where: {
                SITE: form.site,
                LISTID: teamHeadersRes.LISTID
              }
            });
          }),
        map(
          (teamMembersRes: NPITEAMMEMBERLISTInterface[]) => {
            this.teamMembersSendArray.length = 0;
            teamMembersRes.forEach(item => {
              if (!this.teamMembersSendArray.includes(item.EMAIL)) {
                this.teamMembersSendArray.push(item.EMAIL);
              }
            });
            if (setSigner) {
              const tempCfe = teamMembersRes.find((element: NPITEAMMEMBERLISTInterface) => element.ROLE.toUpperCase() === 'CFE');
              if (tempCfe) {
                this.cfe.user = tempCfe['EMPLOYEEID'];
              }
              const tempPmHead = teamMembersRes.find((element: NPITEAMMEMBERLISTInterface) => element.ROLE.toUpperCase() === 'PM HEAD');
              if (tempPmHead) {
                this.pmHead.user = tempPmHead['EMPLOYEEID'];
              }
            }
          }
        )
      );
    }
  )

  checkForSigning = (): OperatorFunction<any, any> => switchMap(() => {
    this.cfe = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'CFE', enName: '' };
    this.pmHead = { id: undefined, user: '', comment: '', enable: false, name: 'PM Head', enName: '' };
    this.buQmHead = { id: undefined, user: '', comment: '', enable: false, name: 'BU QM Head', enName: '' };
    this.buHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BU Head', enName: '' };
    this.bgQmHead = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'BG QM Head', enName: '' };
    this.plant = { id: undefined, user: '', comment: '', judge: undefined, enable: false, name: 'Plant Manager', enName: '' };
    if (this.workFlows.length > 0) {

      return this.meetingReviewTestService.getSigning({
        include: {
          relation: 'workflowCounterSigns'
        },
        where: {
          workflowId: this.workFlows[0].id
        },
        order: 'id DESC'
      }).pipe(
        switchMap(
          (res) => {
            this.signing = res;
            // 判断是否有签核历史/最新一笔签核状态为4就重新开一笔签核
            // getSigning初始签核人
            if (res.length <= 1 || this.meetingResults[0].signStatus === 4) {

              return of(this.meetinQueryForm).pipe(
                this.getNpiRole(),
                this.getSigning()
              );

            } else {
              const signer = {
                cfe: this.cfe,
                pmHead: this.pmHead,
                buQmHead: this.buQmHead,
                buHead: this.buHead,
                bgQmHead: this.bgQmHead,
                plant: this.plant
              };
              return of({ signingRes: res, signer: signer }).pipe(
                this.getSignerForSignin(),
                switchMap(
                  () => {
                    return of(this.meetinQueryForm).pipe(
                      this.getNpiRole(false)
                    );
                  }
                )
              );
            }
          }
        ),
      );
    } else {
      return of(this.meetinQueryForm).pipe(
        this.getNpiRole(),
        this.getSigning()
      );
    }
  })

  getSignerForSignin = () => switchMap(
    (res: any) => {
      return this.meetingReviewTestService._setSignerCommend(res.signingRes, this.meetingResults, res.signer, true).pipe(
        map(
          (commendRes) => {
            return this.meetingReviewTestService._setSignerAndEnable(commendRes, this.meetingResults, this.user);
          }
        )
      );
    })

  send() {
    if (this.disableRepeatFormSubmit || !this.user.role) {
      return;
    }

    if (this.user.role.name.toUpperCase() === 'CFE' || this.user.role.name.toUpperCase() === 'PM HEAD' || this.user.role.name.toUpperCase() === 'BU QM HEAD') {
      if (this.judgeStatus < 4 && this.user.role.comment.length < 20) {
        this.notification.blank('Alert',
          this.user.role.name.toUpperCase() === 'CFE' ? '對於工廠工時/良率/費用產生的影響進行描述，請至少輸入20字' : '請至少輸入20字',
          { nzDuration: 2000 });
        return;
      }
    }
    if (this.user.role.name.toUpperCase() === 'CFE' || this.user.role.name.toUpperCase() === 'BU HEAD' || this.user.role.name.toUpperCase() === 'BG QM HEAD' || this.user.role.name.toUpperCase() === 'PLANT MANAGER') {
      if (this.user.role.judge === null || this.user.role.judge === undefined || !this.user.role.comment) {
        this.notification.blank('Alert', this.user.role.name + '未評判/未進行描述!', { nzDuration: 2000 });
        return;
      }
    }
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send this one?</b>',
      nzOkText: 'Send',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.tableHtml = '<table border="1"><tr> <th>role</th> <th>name</th> <th>judge</th> <th>comments</th></tr>';
        if (this.user.role.name.toUpperCase() === 'CFE') {
          this.tableHtml += `<tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                              <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                              <td>${this.cfe.comment}</td></tr>`;

          const meetingResult: ExitMeetingResultInterface = {
            exitMeetingId: this.id,
            status: this.judgeStatus
          };
          let workFlowStatus;
          // sign status
          if (this.isPass && this.cfe.judge === 1) {
            meetingResult.signStatus = 5; // completed
            workFlowStatus = '2';
          } else if (this.isPass && this.cfe.judge === 0) {
            meetingResult.signStatus = 4; // rejectd
            workFlowStatus = '1';
          } else if (!this.isPass && this.cfe.judge === 0) {
            meetingResult.signStatus = 4; // rejectd
            workFlowStatus = '1';
          } else if (!this.isPass && this.cfe.judge === 1) {
            meetingResult.signStatus = 3; // ongoing
            workFlowStatus = '0';
          }
          let exitMeetingResultId;

          this.meetingReviewTestService.createExitMeetingResult(meetingResult)
            .pipe(
              switchMap(
                (res) => {
                  this.result = res;
                  return this.pictureReportService.addWorkFlow({
                    desc: this.exitMeetingId,
                    current: 0,
                    status: workFlowStatus,
                    workflowFormMappingId: this.flowFormMappingId,
                    routingParameter: this.param
                  } as Workflow);
                }
              ),
              switchMap(
                (result: Workflow) => {
                  const updateArray = [];
                  let signingUserArray;
                  if (this.cfe.judge === 1 && this.isPass) {
                    // change npi status to completed
                    updateArray.push(this.meetingReviewTestService.updateNpiMeetingStatus(this.exitMeetingId, 5, this.meetinQueryForm['site']));
                    signingUserArray = [
                      this.cfe
                    ];
                  } else if (this.cfe.judge === 1 && !this.buQmHead.user && !this.buHead.user && !this.isPass) {
                    signingUserArray = [
                      this.cfe, this.pmHead, this.bgQmHead, this.plant
                    ];
                  } else if (this.cfe.judge === 1 && !this.buQmHead.user && !this.isPass) {
                    signingUserArray = [
                      this.cfe, this.pmHead, this.buHead, this.bgQmHead, this.plant,
                    ];
                  } else if (this.cfe.judge === 1 && !this.buHead.user && !this.isPass) {
                    signingUserArray = [
                      this.cfe, this.pmHead, this.buQmHead, this.bgQmHead, this.plant
                    ];
                  } else if (this.cfe.judge === 1 && this.buHead.user && this.buQmHead.user && !this.isPass) {
                    signingUserArray = [
                      this.cfe, this.pmHead, this.buQmHead, this.buHead, this.bgQmHead, this.plant
                    ];
                  } else {
                    // update em head status
                    updateArray.push(this.meetingReviewTestService.updateEmHeadStatus(4, this.user, this.id));
                    // change npi status to rejected(4)
                    updateArray.push(this.meetingReviewTestService.updateNpiMeetingStatus(this.exitMeetingId, 4, this.meetinQueryForm['site']));
                    signingUserArray = [
                      this.cfe
                    ];
                    this.showSendButton = false;
                  }

                  this.signingUserArray = signingUserArray;
                  const obsArray = [];
                  signingUserArray.forEach(
                    (item: any, idx) => {
                      if (item.name.toUpperCase() === 'CFE' || item.name.toUpperCase() === 'PM HEAD' || item.name.toUpperCase() === 'BU HEAD' || (!this.buHead.user && item.name.toUpperCase() === 'BG QM HEAD')) {
                        if (signingUserArray.length === 1) {
                          const newLocal = {
                            userId: item.user,
                            role: item.name,
                            previousWorkflowSignId: null,
                            nextWorkflowSignId: null,
                            isAgree: item.judge,
                            comment: item.comment,
                            workflowId: result.id
                          };
                          obsArray.push(
                            this.meetingReviewTestService.createSigning(newLocal as WorkflowSignInterface)
                          );
                        } else {
                          const newLocal = {
                            userId: item.user,
                            role: item.name,
                            previousWorkflowSignId: item.name.toUpperCase() === 'CFE' ? null : (item.name.toUpperCase() === 'PM HEAD' ? this.cfe.id : (item.name.toUpperCase() === 'BU HEAD' ? this.pmHead.id : (item.name.toUpperCase() === 'BG QM HEAD' ? this.pmHead.id : null))),
                            nextWorkflowSignId: item.name.toUpperCase() === 'CFE' ? this.pmHead.id : (item.name.toUpperCase() === 'PM HEAD' ? (this.buHead.user ? this.buHead.id : this.bgQmHead.id) : null),
                            isAgree: item.judge,
                            comment: item.comment,
                            workflowId: result.id
                          };
                          obsArray.push(
                            this.meetingReviewTestService.createSigning(newLocal as WorkflowSignInterface)
                          );
                        }
                        // 將workflowId存回meetingresult
                        this.meetingReviewTestService.patchexitMeetingResultAttributes(this.result.id, { workflowId: result.id }).subscribe();
                      }
                    }
                  );

                  exitMeetingResultId = this.result.id;
                  // 加上刚送出result
                  this.meetingResults = [this.result, ...this.meetingResults];

                  this.workFlows = [result, ...this.workFlows];

                  forkJoin(updateArray).subscribe();
                  return forkJoin(obsArray);
                }
              ),
              switchMap(
                (res: any) => {
                  // add countersign
                  res.forEach((item: any) => {
                    if (item.role.toUpperCase() === 'PM HEAD' && this.buQmHead.user) {
                      this.meetingReviewTestService.createCounterSigning({
                        userId: this.buQmHead.user,
                        role: this.buQmHead.name,
                        isAgree: null,
                        comment: null,
                        workflowSignId: item.id
                      } as WorkflowCounterSignInterface).subscribe();
                    } else if (item.role.toUpperCase() === 'BU HEAD') {
                      this.meetingReviewTestService.createCounterSigning({
                        userId: this.bgQmHead.user,
                        role: this.bgQmHead.name,
                        isAgree: null,
                        comment: null,
                        workflowSignId: item.id
                      } as WorkflowCounterSignInterface).subscribe();
                      this.meetingReviewTestService.createCounterSigning({
                        userId: this.plant.user,
                        role: this.plant.name,
                        isAgree: null,
                        comment: null,
                        workflowSignId: item.id
                      } as WorkflowCounterSignInterface).subscribe();
                    } else if (item.role.toUpperCase() === 'BG QM HEAD') {
                      this.meetingReviewTestService.createCounterSigning({
                        userId: this.plant.user,
                        role: this.plant.name,
                        isAgree: null,
                        comment: null,
                        workflowSignId: item.id
                      } as WorkflowCounterSignInterface).subscribe();
                    }
                    // change pre/next
                    try {
                      if (this.signingUserArray.length !== 1) {
                        this.meetingReviewTestService.upsetSigning({
                          id: item.id,
                          userId: item.userId,
                          role: item.role,
                          previousWorkflowSignId: item.role.toUpperCase() === 'CFE' ? null : (item.role.toUpperCase() === 'PM HEAD' ? res.find(data => data.role.toUpperCase() === 'CFE').id : (item.role.toUpperCase() === 'BU HEAD' ? res.find(data => data.role.toUpperCase() === 'PM HEAD').id : (item.role.toUpperCase() === 'BG QM HEAD' ? res.find(data => data.role.toUpperCase() === 'PM HEAD').id : null))),
                          nextWorkflowSignId: item.role.toUpperCase() === 'CFE' ? res.find((data: any) => data.role.toUpperCase() === 'PM HEAD').id : (item.role.toUpperCase() === 'PM HEAD' ? (this.buHead.user ? (res.find(data => data.role.toUpperCase() === 'BU HEAD').id) : (res.find(data => data.role.toUpperCase() === 'BG QM HEAD').id)) : null),
                          isAgree: item.isAgree,
                          comment: item.comment,
                          workflowId: item.workflowId
                        }).subscribe();
                      }
                    } catch (error) {
                    }

                  });
                  this.meetingReviewTestService.dataChanged.next('change');
                  return of(res[0]);
                }
              ),
              switchMap(
                (data: WorkflowSignInterface) => {
                  if (this.isPass) {
                    this.saveCfeMailnotice().subscribe();
                  } else if (!this.isPass && data.isAgree === 0) {
                    this.cfe.comment = '';
                    this.cfe.judge = undefined;
                    this.saveCfeMailnotice().subscribe();
                  } else if (!this.isPass && data.isAgree === 1) {
                    this.saveCfeMail().subscribe();
                  }
                  return of(null);
                }
              ),
              switchMap(
                () => {
                  const tempArray = [];
                  let checklistlog: CheckListLog;
                  for (let index = 0; index < this.npiCheckList.length; index++) {
                    checklistlog = new CheckListLog();
                    checklistlog.SITE = this.site;
                    checklistlog.EXITMEETINGID = this.exitMeetingId;
                    checklistlog.exitMeetingResultId = exitMeetingResultId;
                    checklistlog.SEQ = this.npiCheckList[index].SEQ;
                    checklistlog.ITEMDESC = this.npiCheckList[index].ITEMDESC;
                    checklistlog.CHECKPOINT = this.npiCheckList[index].CHECKPOINT;
                    checklistlog.PROCESS = this.npiCheckList[index].PROCESS;
                    checklistlog.CHECKFUNCTIONPIC = this.npiCheckList[index].CHECKFUNCTIONPIC;
                    checklistlog.CHECKFUNCTIONROLE = this.npiCheckList[index].CHECKFUNCTIONROLE;
                    checklistlog.JUDGMENT = this.npiCheckList[index].JUDGMENT;
                    checklistlog.PROBLEMDESC = this.npiCheckList[index].PROBLEMDESC;
                    checklistlog.TAKEACTIONROLE = this.npiCheckList[index].TAKEACTIONROLE;
                    checklistlog.TAKEACTIONPIC = this.npiCheckList[index].TAKEACTIONPIC;
                    checklistlog.TARGETDATE = this.npiCheckList[index].TARGETDATE;
                    checklistlog.ACTUALDATE = this.npiCheckList[index].ACTUALDATE;
                    checklistlog.ATTACHMENTFILENAME = this.npiCheckList[index].ATTACHMENTFILENAME;
                    checklistlog.REMARK = this.npiCheckList[index].REMARK;
                    checklistlog.CREATEDBY = this.npiCheckList[index].CREATEDBY;
                    checklistlog.CREATEDATE = this.npiCheckList[index].CREATEDATE;
                    checklistlog.UPDATEDBY = this.npiCheckList[index].UPDATEDBY;
                    checklistlog.UPDATEDDATE = this.npiCheckList[index].UPDATEDATE;
                    checklistlog.ALLOWEDITFLAG = this.npiCheckList[index].ALLOWEDITFLAG;
                    checklistlog.ACTION = this.npiCheckList[index].ACTION;
                    checklistlog.MUSTDO = !!this.npiCheckList[index].MUSTDO;

                    tempArray.push(this.meetingReviewTestService.upsetCheckListLog(checklistlog));
                  }
                  return forkJoin(tempArray);
                }
              ),
              this.checkForSigning(),
            ).subscribe(
              () => {
                this.disableRepeatFormSubmit = false;
              }
            );

        } else {
          const signing: WorkflowSignInterface = {
            userId: this.user.id,
            isAgree: (this.user.role.name.toUpperCase() === 'PM HEAD' || this.user.role.name.toUpperCase() === 'BU QM HEAD') ? 1 : this.user.role.judge,
            comment: this.user.role.comment,
            role: this.user.role.name
          };
          this.meetingReviewTestService.updateSigning(this.user.role.name, this.user.role.id, signing, this.buHead.user)
            .pipe(
              this.checkForSigning(),
              switchMap(
                () => {
                  this.meetingReviewTestService.dataChanged.next('change');
                  switch (this.user.role.name.toUpperCase()) {
                    case 'PM HEAD':
                      if (this.buQmHead.user) {
                        if (this.buQmHead.comment) {
                          this.tableHtml += `
                          <tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                          <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                          <td>${this.cfe.comment}</td></tr>
                          <tr> <td>${this.pmHead.name}</td>
                          <td>${this.pmHead.enName}</td> <td>無</td>
                          <td>${this.pmHead.comment}</td></tr>
                          <tr> <td>${this.buQmHead.name}</td>
                          <td>${this.buQmHead.enName}</td> <td>無</td>
                          <td>${this.buQmHead.comment}</td></tr>`;
                          return this.getMailReceiver().pipe(
                            this.sendMail()
                          );
                        }
                      } else {
                        this.tableHtml += `
                        <tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                        <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                        <td>${this.cfe.comment}</td></tr>
                        <tr><td>${this.pmHead.name}</td>
                        <td>${this.pmHead.enName}</td> <td>無</td>
                        <td>${this.pmHead.comment}</td></tr>`;
                        return this.getMailReceiver().pipe(
                          this.sendMail()
                        );
                      }

                      break;
                    case 'BU QM HEAD':
                      if (this.pmHead.comment) {
                        this.tableHtml += `
                        <tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                        <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                        <td>${this.cfe.comment}</td></tr>
                        <tr><td>${this.pmHead.name}</td>
                          <td>${this.pmHead.enName}</td> <td>無</td>
                          <td>${this.pmHead.comment}</td></tr>
                          <tr> <td>${this.buQmHead.name}</td>
                          <td>${this.buQmHead.enName}</td> <td>無</td>
                          <td>${this.buQmHead.comment}</td></tr>`;
                        return this.getMailReceiver().pipe(
                          this.sendMail()
                        );
                      }
                      break;

                    case 'BU HEAD':
                    case 'BG QM HEAD':
                    case 'PLANT MANAGER':
                      if (this.buQmHead.user) {
                        this.tableHtml += `
                            <tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                            <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                            <td>${this.cfe.comment}</td></tr>
                            <tr> <td>${this.pmHead.name}</td>
                            <td>${this.pmHead.enName}</td> <td>無</td>
                            <td>${this.pmHead.comment}</td></tr>
                            <tr> <td>${this.buQmHead.name}</td>
                            <td>${this.buQmHead.enName}</td> <td>無</td>
                            <td>${this.buQmHead.comment}</td></tr>`;
                      } else {
                        this.tableHtml += `
                        <tr><td>${this.cfe.name}</td><td>${this.cfe.enName}</td>
                        <td>${this.cfe.judge === 1 ? 'Agreed' : 'Not Agreed'}</td>
                        <td>${this.cfe.comment}</td></tr>
                        <tr><td>${this.pmHead.name}</td>
                        <td>${this.pmHead.enName}</td> <td>無</td>
                        <td>${this.pmHead.comment}</td></tr>`;
                      }
                      return this.updateSignStatusAndSendMail();
                    default:
                      break;
                  }
                }
              )
            ).subscribe(
              () => {
                this.disableRepeatFormSubmit = false;
              }
            );
        }
      }
    });
  }

  saveCfeMailnotice() {
    const tempCfe = this.cfe;
    return this.getMailReceiver('all').pipe(
      switchMap(
        (res: any) => {
          res += this.teamMembersSendArray.join(';');
          const notice: MailInterface = {
            subject: '[' + this.meetinQueryForm['model'] + ']' + this.meetinQueryForm['stage'] + 'exit BU CFE judge result:' + new JudgeStatusPipe().transform(this.judgeStatus),
            content: 'Please be informed below information:<br> [' + this.meetinQueryForm['model'] + '] ' + this.meetinQueryForm['stage'] + ' exit final judge result is: ' + new JudgeStatusPipe().transform(this.judgeStatus) + '<br>CFE judge is: ' + (tempCfe.judge === 1 ? 'Agree' : 'Not Agree') + '. CFE comment is: ' + tempCfe.comment + '. Sign time: ' + this.getTime() + '<br>Link <a href="' + this.url + '">click here</a> for detail information(需使用Google Chrome登陸)' + this.tableHtml + '</table>',
            sender: 'dfi@wistron.com',
            receiver: res
          };
          return this.meetingReviewTestService.createMail(notice);
        }
      )
    );
  }

  saveCfeMail() {
    return this.getMailReceiver('cfe')
      .pipe(
        this.sendMail()
      );
  }

  sendMail = () => switchMap(
    (res: any) => {

      const notice: MailInterface = {
        subject: '[' + this.meetinQueryForm['model'] + ']' + this.meetinQueryForm['stage'] + ' exit judge notification',
        content: '[' + this.meetinQueryForm['model'] + ']' + this.meetinQueryForm['stage'] + ' exit need you judge, please review it.<br>Link <a href="' + this.url + '">DFQ C4/C5 system</a> for detail information(需使用Google Chrome登陸)' + this.tableHtml + '</table>',
        sender: 'dfi@wistron.com',
        receiver: res
      };

      return this.meetingReviewTestService.createMail(notice);
    }
  )

  getMailReceiver(roleType?) {
    let receiver = '';
    return this.meetingReviewTestService.findUserById(this.cfe.user).pipe(
      switchMap(
        (cfe: UserInterface) => {
          if (roleType === 'all' && !receiver.includes(cfe.email)) {
            receiver += cfe.email + ';';
          }
          return this.meetingReviewTestService.findUserById(this.pmHead.user);
        }
      ),
      switchMap(
        (pmHead: UserInterface) => {
          if ((roleType === 'all' || roleType === 'cfe') && !receiver.includes(pmHead.email)) {
            receiver += pmHead.email + ';';
          }
          return this.meetingReviewTestService.findUserById(this.buQmHead.user);
        }
      ),
      switchMap(
        (buQmHead: UserInterface) => {
          if ((roleType === 'all' || roleType === 'cfe') && !receiver.includes(buQmHead.email) && this.buQmHead.user) {
            receiver += buQmHead.email + ';';
          }
          return this.meetingReviewTestService.findUserById(this.bgQmHead.user);
        }
      ),
      switchMap(
        (bgQmHead: UserInterface) => {
          if (roleType !== 'cfe' && !receiver.includes(bgQmHead.email)) {
            receiver += bgQmHead.email + ';';
          }
          return this.meetingReviewTestService.findUserById(this.buHead.user);
        }
      ),
      switchMap(
        (buHead: UserInterface) => {
          if (roleType !== 'cfe' && !receiver.includes(buHead.email)) {
            receiver += buHead.email + ';';
          }
          return this.meetingReviewTestService.findUserById(this.plant.user);
        }
      ),
      map(
        (plant: UserInterface) => {
          if (roleType !== 'cfe' && !receiver.includes(plant.email)) {
            receiver += plant.email + ';';
          }
          return receiver;
        }
      )
    );
  }

  updateSignStatusAndSendMail() {
    let ifSendMail = true;
    let isLast = true;
    if (this.buHead.user) {
      const buHead = this.signing.find(item => item.role.toUpperCase() === 'BU HEAD');
      if (buHead.isAgree === 0) {
        ifSendMail = false;
      }
      for (let index = 0; index < buHead.workflowCounterSigns.length; index++) {
        if (buHead.workflowCounterSigns[index].isAgree === 0) {
          ifSendMail = false;
        }
      }
      if (buHead.isAgree !== 0 && buHead.isAgree !== 1) {
        isLast = false;
      }
      for (let index = 0; index < buHead.workflowCounterSigns.length; index++) {
        if (buHead.workflowCounterSigns[index].isAgree !== 0 && buHead.workflowCounterSigns[index].isAgree !== 1) {
          isLast = false;
        }
      }
    } else {
      const bgQmHead = this.signing.find(item => item.role.toUpperCase() === 'BG QM HEAD');
      if (bgQmHead.isAgree === 0) {
        ifSendMail = false;
      }
      for (let index = 0; index < bgQmHead.workflowCounterSigns.length; index++) {
        if (bgQmHead.workflowCounterSigns[index].isAgree === 0) {
          ifSendMail = false;
        }
      }
      if (bgQmHead.isAgree !== 0 && bgQmHead.isAgree !== 1) {
        isLast = false;
      }
      for (let index = 0; index < bgQmHead.workflowCounterSigns.length; index++) {
        if (bgQmHead.workflowCounterSigns[index].isAgree !== 0 && bgQmHead.workflowCounterSigns[index].isAgree !== 1) {
          isLast = false;
        }
      }
    }

    let signStatus;
    let flowSignStatus;
    if (ifSendMail && isLast) {
      signStatus = 5;
      flowSignStatus = 1;
    } else if (!ifSendMail && isLast) {
      signStatus = 4;
      flowSignStatus = 2;
    }

    if (isLast) {
      if (this.buHead.user) {
        this.tableHtml += `<tr> <td>${this.buHead.name}</td> <td>${this.buHead.enName}</td> <td>${this.waivePipe.transform(this.buHead.judge)}</td>
        <td>${this.buHead.comment}</td></tr> <tr><td>${this.bgQmHead.name}</td> <td>${this.bgQmHead.enName}</td> <td>${this.waivePipe.transform(this.buHead.judge)}</td>
        <td>${this.bgQmHead.comment}</tr> <tr><td>${this.plant.name}</td> <td>${this.plant.enName}</td> <td>${this.waivePipe.transform(this.plant.judge)}</td>
        <td>${this.plant.comment}</tr>`;
      } else {
        this.tableHtml += `<tr><td>${this.bgQmHead.name}</td> <td>${this.bgQmHead.enName}</td> <td>${this.waivePipe.transform(this.bgQmHead.judge)}</td>
        <td>${this.bgQmHead.comment}</tr> <tr><td>${this.plant.name}</td> <td>${this.plant.enName}</td> <td>${this.waivePipe.transform(this.plant.judge)}</td>
        <td>${this.plant.comment}</tr>`;
      }

      return of(this.meetingResults[0].id).pipe(
        this.getSignResult(),
        switchMap(
          () => {

            const tempArray = [];
            // update em head status
            tempArray.push(this.meetingReviewTestService.updateEmHeadStatus(signStatus, this.user, this.id));
            // update npi status
            tempArray.push(this.meetingReviewTestService.updateNpiMeetingStatus(this.exitMeetingId, signStatus, this.meetinQueryForm['site']));
            forkJoin(
              tempArray
            ).subscribe();

            return of(null);
          }
        ),
        switchMap(
          () => {
            return this.updateSignStatus(signStatus);
          }
        ),
        switchMap(
          () => {
            return this.updateFlowSignStatus(flowSignStatus);
          }
        ),
        this.getMeetingResult(),
        this.sendMailNotice()
      );
    }
    return of(null);

  }

  getSignResult = () => switchMap(
    () => {
      const query = {
        where: {
          workflowId: this.workFlows[0].id
        },
        order: 'id DESC'
      };
      return this.meetingReviewTestService.getSigning(query)
        .pipe(
          map(
            (res: WorkflowSignInterface[]) => {
              let waive;
              let isAgree = true;
              if (res.length !== 0) {
                for (let l = 0; l < res.length; l++) {
                  if (res[l].isAgree === 0) {
                    isAgree = false;
                    break;
                  }
                }
                if (isAgree) {
                  waive = 'Waive';
                } else if (this.isPass && isAgree) {
                  waive = 'Waive';
                } else if (!isAgree) {
                  waive = 'Not Waive';
                }
              }
              return waive;
            }
          )
        );
    }
  )

  sendMailNotice = () => switchMap(
    (waive) => {
      return this.getMailReceiver('all').pipe(
        switchMap(
          (res: any) => {
            res += this.teamMembersSendArray.join(';');
            const notice: MailInterface = {
              subject: '[' + this.meetinQueryForm['model'] + '] ' + this.meetinQueryForm['stage'] + ' exit BU head/BG QM/Plant manager judge result:' + waive,
              content: 'Please be informed below information:<br>[' + this.meetinQueryForm['model'] + '] ' + this.meetinQueryForm['stage'] + 'exit  final judge result is: ' + waive + '<br>Link <a href="' + this.url + '">click here</a> for detail information(需使用Google Chrome登陸)' + this.tableHtml + '</table>',
              sender: 'dfi@wistron.com',
              receiver: res
            };
            return this.meetingReviewTestService.createMail(notice);
          }
        )
      );
    }
  )

  updateSignStatus(signStatus) {

    const exitMeetingResultd: ExitMeetingResultInterface = {
      signStatus: signStatus
    };
    return this.meetingReviewTestService.patchexitMeetingResultAttributes(this.meetingResults[0].id, exitMeetingResultd);
  }

  updateFlowSignStatus(signStatus) {
    return this.meetingReviewTestService.patchWorkFlowAttributes(this.workFlows[0].id, {
      status: signStatus
    });
  }

  getTime() {
    function num(s) {
      return s < 10 ? '0' + s : s;
    }
    const dd = new Date();
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();
    return y + '/' + num(m) + '/' + num(d);
  }
}
