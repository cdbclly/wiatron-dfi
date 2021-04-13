import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MaterialYrService } from 'app/dfq/rfi/maintain/material-yr-maintain/material-yr.service';
import { NzMessageService } from 'ng-zorro-antd';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';
import { MailInterface, WorkflowSignApi, Workflow, WorkflowSign, WorkflowApi } from '@service/dfi-sdk';
import { ActivatedRoute } from '@angular/router';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { Part, PartApi, View_ModelMaterialApi, DiscussionApi } from '@service/dfq_sdk/sdk';
import { PercentPipe } from 'app/shared/percent.pipe';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-new-signing-details',
  templateUrl: './new-signing-details.component.html',
  styleUrls: ['./new-signing-details.component.scss']
})
export class NewSigningDetailsComponent implements OnInit, OnDestroy {

  @Input() data;                              // 點擊良率的那條Modelmaterial數據
  isLoading = false;
  showEcharts = false;
  targetYrOptions;
  userName;
  userId;                                      // 当前需要签核的人
  workflowSign = [];                           // 已有的签核资料workflowSign
  status = ['Approve', 'Reject'];              // 当前签核状态
  createBy;                                      // 送签人员
  createOn;                                     // 送签日期
  current;                                     // 当前签核人
  Worlkflow;
  selectSite;
  selectModel;
  getSigner: boolean;
  canSendSign: boolean;
  showData: boolean;
  hasSigned: boolean;
  showSignatureModal = false;
  comments: string;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  showDetail = false;
  tableShow = false;
  signEnable = false;
  signers = [];
  signerMails: string;
  senderMail: string;
  trans = {};
  destroy$ = new Subject();

  constructor(
    private materialYrService: MaterialYrService,
    private yrGenerateService: YrGenerateService,
    private workflowService: WorkflowApi,
    private workflowSignService: WorkflowSignApi,
    private partService: PartApi,
    private discussService: DiscussionApi,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private meetingReviewTestService: MeetingReviewTestService,
    private viewModelMatreial: View_ModelMaterialApi,
    private translate: TranslateService
  ) {
    this.userName = localStorage.getItem('$DFI$userName');
    this.userId = localStorage.getItem('$DFI$userID');
    this.route.queryParams.subscribe(params => {
      if (params['sitePlant'] && params['projectName']) {
        this.selectSite = params['sitePlant'];
        this.selectModel = params['projectName'];
      }
    });
  }
  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.rfi-analysis-chart', 'dfq.rfi-rd-design-yield', 'dfq.rfi-system-push-yield', 'dfq.rfi-best-yield-combination']).subscribe(res => {
      this.trans['analysisChart'] = res['dfq.rfi-analysis-chart'];
      this.trans['rdDesignYield'] = res['dfq.rfi-rd-design-yield'];
      this.trans['systemPushyield'] = res['dfq.rfi-system-push-yield'];
      this.trans['bestYieldCombination'] = res['dfq.rfi-best-yield-combination'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.rfi-analysis-chart', 'dfq.rfi-rd-design-yield', 'dfq.rfi-system-push-yield', 'dfq.rfi-best-yield-combination']).subscribe(res => {
        this.trans['analysisChart'] = res['dfq.rfi-analysis-chart'];
        this.trans['rdDesignYield'] = res['dfq.rfi-rd-design-yield'];
        this.trans['systemPushyield'] = res['dfq.rfi-system-push-yield'];
        this.trans['bestYieldCombination'] = res['dfq.rfi-best-yield-combination'];
      });
    });
    this.getShowData();
    this.getEchart(this.trans['analysisChart'], this.trans['rdDesignYield'], this.trans['systemPushyield'], this.trans['bestYieldCombination']);
  }
  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.signEnable = true;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]); // true/false
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    for (const key in this.mapOfCheckedId) {
      if (this.mapOfCheckedId.hasOwnProperty(key)) {
        if (this.mapOfCheckedId[key] && this.listOfAllData.find(item => item.id == key).userId.toUpperCase() !== this.userId) {
          this.signEnable = false;
        }
      }
    }
    if (this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]).length === 0) {
      this.signEnable = false;
    }
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData = this.listOfDisplayData.filter(ite => ite.workflow && ite.workflow[0].status == 0);
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  showDetails(data) {
    this.showData = data.workflowSigns;
    this.showDetail = true;
  }

  getShowData() {
    this.viewModelMatreial.find({
      where: {
        site: this.data.site,
        plant: this.data.plant,
        modelId: this.data.model,
      }
    }).subscribe(async res => {
      this.listOfAllData = res;
      if (this.listOfAllData[0]['workflowId']) {
        for (let index = 0; index < this.listOfAllData.length; index++) {
          await this.workflowService.find({
            where: {
              id: this.listOfAllData[index].workflowId
            },
            include: {
              relation: 'workflowSigns'
            },
            order: 'modifyOn DESC'
          }).toPromise().then((resd => {
            this.createOn = resd[0]['createOn'];
            this.createBy = resd[0]['createBy'];
            this.listOfAllData[index]['workflow'] = resd;
            this.signerMails = '';
            // find userId
            if (this.listOfAllData[index]['workflow'][0]['current']) {
              this.listOfAllData[index]['userId'] = this.listOfAllData[index]['workflow'][0]['workflowSigns'].find(item => item.id === this.listOfAllData[index]['workflow'][0]['current']).userId;
            } else {
              this.listOfAllData[index]['userId'] = null;
            }
            if (index === this.listOfAllData.length - 1) {
              this.yrGenerateService.findUserById(this.createBy).subscribe(reso => {
                this.senderMail = reso['email'] + ';';
              });
              for (let j = 0; j < resd[0]['workflowSigns'].length; j++) {
                this.yrGenerateService.findUserById(resd[0]['workflowSigns'][j].userId).subscribe(reso => {
                  this.signerMails += reso['email'] + ';';
                });
              }
              this.tableShow = true;
            }
          }));
        }
      } else {
        this.tableShow = true;
      }
    });
  }

  getEchart(analysisChart, rdDesignYield, systemPushyield, bestYieldCombination) {
    this.targetYrOptions = {
      title: [{
        text: analysisChart,
        x: 'center',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      {
        text: `廠別:${this.data.site}-${this.data.plant}\n客戶:${this.data.customer}\n產品別:${this.data.product}`,
        x: '80%',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      }
      ],
      xAxis: [{
        type: 'category',
        splitLine: { show: false },
        axisLabel: {
          show: true,
          // rotate: 315
          fontSize: 14
        },
        data: [rdDesignYield, systemPushyield, bestYieldCombination]
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %'
        },
        show: true,
        max: 100
      }],
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: function (params) {
                // build a color map as your need.
                const colorList = [
                  'rgb(0, 102, 255)', 'rgb(0, 102, 255)', 'rgba(245,201,16,1)'
                ];
                return colorList[params.dataIndex];
              },
              label: { show: true, position: 'inside', formatter: '{c} %' }
            },
          },
          // data: [(this.data.originalYieldRate * 100).toFixed(2), (this.data.improvedYieldRate * 100).toFixed(2), (this.data.bestYieldRate * 100).toFixed(2)],
          data: [(new PercentPipe().transform(this.data.originalYieldRate)).split('%')[0], new PercentPipe().transform(this.data.improvedYieldRate).split('%')[0], new PercentPipe().transform(this.data.bestYieldRate).split('%')[0]],
          barWidth: 80,
        }
      ]
    };
    this.showEcharts = true;
  }

  editMBsignOk() {
    this.comments = '';
    this.showSignatureModal = true;
  }

  editsignCancel() {
    this.showSignatureModal = false;
  }

  cancalSignature() {
    this.showSignatureModal = false;
  }

  cancelSign() {
    this.showDetail = false;
  }

  async sign(agree, comments: string) {
    this.signEnable = false;
    this.isLoading = true;
    let i = 0;
    this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]).forEach((part, idx) => {
      if (part.workflow[0]['workflowSigns'].find(item => item.id === part['workflow'][0]['current']).nextWorkflowSignId) {
        // 签核不通过，直接fail
        if (!agree) {
          this.workflowService.patchAttributes(part.workflow[0].id, {
            status: '2'
          }).subscribe(ree => {
            // update workflow sign
            part['workflowSign'] = {
              isAgree: agree,
              comment: comments
            };
            this.workflowSignService.patchAttributes(part.workflow[0]['workflowSigns'].find(item => item.id === part['workflow'][0]['current']).id, part['workflowSign']).subscribe(
              red => {
                i++;
                if (i === this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]).length) {
                  this.yrGenerateService.findUserById(part.workflow[0]['workflowSigns'].find(item => item.id === part.workflow[0]['workflowSigns'].find(ite => ite.id === part['workflow'][0]['current']).nextWorkflowSignId).userId).subscribe(senger => {
                    const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                    const notice: MailInterface = {
                      subject: '【DFQ系統提醒】DFQ 目標良率簽核未通過',
                      content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '目標良率簽核,' + this.userName + '簽核未通過' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                      sender: 'dfi@wistron.com',
                      receiver: senger['email'] + ';' + this.senderMail
                    };
                    this.meetingReviewTestService.createMail(notice).subscribe();
                  });
                  this.getShowData();
                  this.mapOfCheckedId = {};
                  this.signEnable = true;
                }
              }
            );
            // 修改良率生成頁物料狀態
            this.discussService.patchAttributes(part.discussionId, {
              status: 1
            }).subscribe();
          });
        } else {
          // update workflow sign
          part['workflowSign'] = {
            isAgree: agree,
            comment: comments
          };
          this.workflowSignService.patchAttributes(part.workflow[0]['workflowSigns'].find(item => item.id === part['workflow'][0]['current']).id, part['workflowSign']).subscribe(
            ree => {
              i++;
              if (i === this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]).length) {
                this.yrGenerateService.findUserById(part.workflow[0]['workflowSigns'].find(item => item.id === part.workflow[0]['workflowSigns'].find(ite => ite.id === part['workflow'][0]['current']).nextWorkflowSignId).userId).subscribe(reso => {
                  const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                  const notice: MailInterface = {
                    subject: '【DFQ系統提醒】DFQ 目標良率簽核',
                    content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '機種目標良率預測已完成並啟動簽核，請登陸DFQ系統及時簽核..' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                    sender: 'dfi@wistron.com',
                    receiver: reso['email'] + ';'
                  };
                  this.meetingReviewTestService.createMail(notice).subscribe();
                });
                this.getShowData();
                this.mapOfCheckedId = {};
                this.signEnable = true;
              }
            }
          );
        }
      } else {
        if (part.workflow[0]['status'] != 2) {
          // update workflow
          let a = {
            status: '1'
          };
          if (!agree) {
            a = {
              status: '2'
            };
            // 修改良率生成頁物料狀態
            this.discussService.patchAttributes(part.discussionId, {
              status: 1
            }).subscribe();
          }
          this.workflowService.patchAttributes(part.workflow[0].id, a).subscribe(reu => {
            // update workflow sign
            part['workflowSign'] = {
              isAgree: agree,
              comment: comments
            };
            this.workflowSignService.patchAttributes(part.workflow[0]['workflowSigns'].find(item => item.id === part['workflow'][0]['current']).id, part['workflowSign']).subscribe(
              ree => {
                i++;
                if (i === this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]).length) {
                  if (agree) {
                    this.materialYrService.getWorlkflow(this.data.model).subscribe(
                      res => {
                        if (!res.find(item => item['status'] != 1)) {
                          this.yrGenerateService.findUserById(this.createBy).subscribe(senger => {
                            this.signerMails += senger['email'] + ';';
                            const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                            const notice: MailInterface = {
                              subject: '【DFQ系統提醒】DFQ 目標良率簽核完畢',
                              content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '機種目標良率已預測並簽核完畢，此後機種良率改善將以此為目標作業.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                              sender: 'dfi@wistron.com',
                              receiver: this.signerMails
                            };
                            this.meetingReviewTestService.createMail(notice).subscribe();
                          });
                        }
                      }
                    );
                  } else {
                    const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                    const notice: MailInterface = {
                      subject: '【DFQ系統提醒】DFQ 目標良率簽核未通過',
                      content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '目標良率簽核,' + this.userName + '簽核未通過' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                      sender: 'dfi@wistron.com',
                      receiver: this.senderMail + this.signerMails
                    };
                  }
                  this.getShowData();
                  this.mapOfCheckedId = {};
                  this.signEnable = true;
                }
              }
            );
          });
        }
      }
    });
    this.message.create('info', agree ? '已核准' : '已退回');
    this.isLoading = false;
    this.cancalSignature();
  }


  // update workflow
  refreshWorkflow(part: Part, workflow: Workflow, workflowSign: WorkflowSign): void {
    if (part.workflowId === null) {
      part.workflowId = workflow.id;
    }
    this.partService.patchAttributes(part.id, part).subscribe();
    part['workflow'] = workflow;
    part['workflowSign'] = workflowSign;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
