import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MaterialYrService } from 'app/dfq/rfi/maintain/material-yr-maintain/material-yr.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { BaseDataSigningService } from '../../base-data-signing/base-data-signing.service';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';
import { MailInterface } from '@service/dfi-sdk';
import { ActivatedRoute } from '@angular/router';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-target-yield-signing',
  templateUrl: './target-yield-signing.component.html',
  styleUrls: ['./target-yield-signing.component.scss']
})
export class TargetYieldSigningComponent implements OnInit, OnDestroy {

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
  trans = {};
  destroy$ = new Subject();

  constructor(
    private materialYrService: MaterialYrService,
    private modalService: NzModalService,
    private baseDataSigningService: BaseDataSigningService,
    private yrGenerateService: YrGenerateService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private meetingReviewTestService: MeetingReviewTestService,
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
    this.GetshowData();
    this.getEchart(this.trans['analysisChart'], this.trans['rdDesignYield'], this.trans['systemPushyield'], this.trans['bestYieldCombination']);
  }

  GetshowData() {
    this.hasSigned = false;
    // 查詢簽核的歷史記錄
    // 根據机种名project,查询wolkflowid关联wolkflowsing
    this.materialYrService.getWorlkflow(this.data['model']).subscribe(res => {
      this.Worlkflow = res;
      this.workflowSign = res[0]['workflowSigns'];
      this.createOn = res[0]['createOn'];
      this.createBy = res[0]['createBy'];
      this.current = res[0]['current'];
      if (!this.current) {
        this.hasSigned = true;
      }
    });
  }

  signing() {
    this.isLoading = true;
    this.yrGenerateService.setToken();
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { this.isLoading = false; },
      nzOnOk: async () => {
        this.isLoading = true;
        if (this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['isAgree'] != 0 && this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['isAgree'] != 1) {
          this.message.create('warning', '請選擇簽核狀態!');
          this.isLoading = false;
          return;
        }
        this.baseDataSigningService.updateflowSign(this.current, {
          isAgree: this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['isAgree'],
          comment: this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['comment']
        }).subscribe(async res => {
          await this.materialYrService.getWorlkflow(this.data['model']).subscribe(async resd => {
            // 改變viewmodelMateril裡面disscussion的status為1
            if (this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['isAgree'] == 0) {
              this.baseDataSigningService.getViewModelMateril(this.data['site'], this.data['plant'], this.data['model']).subscribe(ModelMaterial => {
                for (let index = 0; index < ModelMaterial.length; index++) {
                  this.baseDataSigningService.updateDiscussion(ModelMaterial[index]['discussionId'], {
                    status: 1
                  }).subscribe(final => {
                    // 直接fail
                    this.baseDataSigningService.updateworkflow(resd[0]['id'], {
                      status: 2,
                      current: null
                    }).subscribe();
                  });
                }
              });
              // 如果簽核未通過發送郵件給所有人
              let returnmail = '';
              for (let k = 0; k < resd[0]['workflowSigns'].length; k++) {
                await this.yrGenerateService.findUserById(resd[0]['workflowSigns'][k]['userId']).toPromise().then(reso => {
                  returnmail += reso['email'] + ';';
                });
              }
              await this.yrGenerateService.findUserById(resd[0]['createBy']).toPromise().then(senger => {
                returnmail += senger['email'] + ';';
                const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                const notice: MailInterface = {
                  subject: '【DFQ系統提醒】DFQ 目標良率簽核未通過',
                  content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '目標良率簽核,' + this.userName + '簽核未通過' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                  sender: 'dfi@wistron.com',
                  receiver: returnmail
                };
                this.meetingReviewTestService.createMail(notice).subscribe();
              });
            }
            if (this.workflowSign.find(item => item.userId === this.userId && item.id === this.current)['isAgree'] == 1) {
              // 會送多次！！！！！
              for (let k = 0; k < resd[0]['workflowSigns'].length; k++) {
                if (resd[0]['current']) {
                  // 簽核通過發送給下一位需要簽核的人
                  if (resd[0]['current'] === resd[0]['workflowSigns'][k].id) {
                    let nextmail = '';
                    await this.yrGenerateService.findUserById(resd[0]['workflowSigns'][k].userId).toPromise().then(reso => {
                      nextmail += reso['email'] + ';';
                      const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                      const notice: MailInterface = {
                        subject: '【DFQ系統提醒】DFQ 目標良率簽核',
                        content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '機種目標良率預測已完成並啟動簽核，請登陸DFQ系統及時簽核..' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                        sender: 'dfi@wistron.com',
                        receiver: nextmail
                      };
                      this.meetingReviewTestService.createMail(notice).subscribe();
                    });
                  }
                }
                // 最後一位檢核后改變狀態發送簽核完畢郵件
                if (!resd[0]['current'] && k === resd[0]['workflowSigns'].length - 1) {
                  // 改變狀態
                  let pass = true;
                  for (let l = 0; l < resd[0]['workflowSigns'].length; l++) {
                    if (resd[0]['workflowSigns'][l]['isAgree'] == 0) {
                      pass = false;
                    }
                  }
                  this.baseDataSigningService.updateworkflow(resd[0]['id'], {
                    status: pass ? 1 : 2
                  }).subscribe(async final => {
                    // 發送郵件
                    let lastmails = '';
                    for (let j = 0; j < this.workflowSign.length; j++) {
                      await this.yrGenerateService.findUserById(this.workflowSign[j].userId).toPromise().then(reso => {
                        lastmails += reso['email'] + ';';
                      });
                    }
                    if (pass) {
                      await this.yrGenerateService.findUserById(resd[0]['createBy']).toPromise().then(senger => {
                        lastmails += senger['email'] + ';';
                        const url = `${location.origin}/dashboard/rfi/signing/yr-generate-signing?sitePlant=${this.data.site}-${this.data.plant}&projectName=${this.data.model}`;
                        const notice: MailInterface = {
                          subject: '【DFQ系統提醒】DFQ 目標良率簽核完畢',
                          content: 'Dear Sir:<br>' + this.data.customer + '客戶' + this.data.model + '機種目標良率已預測並簽核完畢，此後機種良率改善將以此為目標作業.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                          sender: 'dfi@wistron.com',
                          receiver: lastmails
                        };
                        this.meetingReviewTestService.createMail(notice).subscribe();
                      });
                    }
                    this.isLoading = false;
                    this.hasSigned = true;
                    this.GetshowData();
                  });
                } else {
                  this.isLoading = false;
                  this.hasSigned = true;
                  this.GetshowData();
                }
              }
            } else {
              this.isLoading = false;
              this.hasSigned = true;
              this.GetshowData();
            }
          });
        });
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
          data: [(this.data.originalYieldRate * 100).toFixed(2), (this.data.improvedYieldRate * 100).toFixed(2), (this.data.bestYieldRate * 100).toFixed(2)],
          barWidth: 80,
        }
      ]
    };
    this.showEcharts = true;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
