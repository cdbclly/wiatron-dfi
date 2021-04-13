import { BaseDataSigningService } from './../base-data-signing.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NewmaterialService } from 'app/dfq/rfi/maintain/newmaterial-yr-maintain/newmaterial.service';
import { WorkflowApi } from '@service/dfc_sdk/sdk';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';
import { MaterialYrService } from 'app/dfq/rfi/maintain/material-yr-maintain/material-yr.service';
import { MailInterface } from '@service/dfi-sdk';
import { MeetingReviewTestService } from 'app/dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { MboardService } from 'app/dfq/rfi/maintain/mboard-maintain/mboard.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-model-detials-siging',
  templateUrl: './model-detials-siging.component.html',
  styleUrls: ['./model-detials-siging.component.scss']
})
export class ModelDetialsSigingComponent implements OnInit, OnDestroy {
  @Input() editmodelMaterial;
  @Input() showModalTable;
  @Input() allData;
  @Input() noFlowIdDataLength;
  @Output() finishSigned = new EventEmitter<any>();

  tableShow = false;
  signTable = [];
  isVisible = false;
  isLoading = false;
  showAll = false;
  modalVisible = false;
  modalData = { factors: [], factorTypes: [] };
  sendLoading = false;
  isSigner = false;
  userId: string;
  signingData: {}[];
  isSigning = false;
  signers = [];
  userName;
  isYou = false;
  destroy$ = new Subject();

  status = ['Approve', 'Reject'];
  getSigner: boolean;
  canSendSign: boolean;
  showData: any;
  finishSign: boolean;
  youFinish: boolean;
  signClosed = false;
  SuperVisor: any;
  createOn: any;
  createBy: any;
  trans = {};

  constructor(
    private dfcWorkflowService: WorkflowApi,
    private newMaterialYrService: NewmaterialService,
    private message: NzMessageService,
    private yrGenerateService: YrGenerateService,
    private modalService: NzModalService,
    private materialYrService: MaterialYrService,
    private meetingReviewTestService: MeetingReviewTestService,
    private mboardService: MboardService,
    private baseDataSigningService: BaseDataSigningService,
    private translate: TranslateService
  ) {
    this.userId = localStorage.getItem('$DFI$userID');
    this.userName = localStorage.getItem('$DFI$userName');
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.nosupervisor-information', 'dfq.not-matched-the-approval-form']).subscribe(res => {
      this.trans['nosupervisor'] = res['dfq.nosupervisor-information'];
      this.trans['notMatchedForm'] = res['dfq.not-matched-the-approval-form'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.nosupervisor-information', 'dfq.not-matched-the-approval-form']).subscribe(res => {
        this.trans['nosupervisor'] = res['dfq.nosupervisor-information'];
        this.trans['notMatchedForm'] = res['dfq.not-matched-the-approval-form'];
      });
    });
    this.finishSign = false;
    this.getSigner = false;
    this.baseDataSigningService.getflow('RFI物料良率:' + this.editmodelMaterial.model).subscribe(res => {
      if (res.length !== 0) {
        this.createOn = res[0]['createOn'];
        this.createBy = res[0]['createBy'];
      }
      this.signingData = res;
      if (this.showModalTable && this.editmodelMaterial.length !== 0) {
        this.tableShow = true;
        this.canSendSign = false;
        if (this.editmodelMaterial[0]['workflowId']) {
          this.baseDataSigningService.getflowSign(this.editmodelMaterial[0]['workflowId']).subscribe(reso => {
            this.signers = reso;
            if (this.signers[0].status == 1 || this.signers[0].status == 2) {
              this.signClosed = true;
            }
            this.showData = this.signers[0]['workflowSigns'];
            if (this.showData.find(item => item.userId === this.userId)) {
              if (this.showData.find(item => item.userId === this.userId).isAgree !== null) {
                this.youFinish = true;
              } else {
                this.youFinish = false;
              }
            } else {
              this.youFinish = true;
            }
            if (this.editmodelMaterial[0]['workflowId'] && this.signers[0]['status'] == 0) {
              this.isSigning = true;
            }
            this.getSigner = true;
          });
        } else {
          this.showData = null;
          this.canSendSign = true;
        }
      } else {
        this.message.create('warning', 'No material information!');
        return;
      }
    });
  }

  async sendSign() {
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { },
      nzOnOk: async () => {
        this.signClosed = true;
        this.sendLoading = true;
        await this.mboardService.findSuperVisor(this.userId).toPromise().then(async resd => {
          this.SuperVisor = resd[0]['Supervisor'];
          if (this.SuperVisor) {
            const list = [];
            await this.mboardService.findSuperVisor(this.SuperVisor).toPromise().then(async reso => {
              if (reso.length !== 0) {
                list.push({ empID: reso[0]['EmpID'], role: 'Materials Signer' });
                // 查询签核状态 獲取更新后的wolkflow表
                await this.yrGenerateService.getBaseDataSigner(this.editmodelMaterial.site + '_' + this.editmodelMaterial.product).toPromise().then(resul => {
                  if (!resul[0]['workflowFormMappings'].length) {
                    this.message.create('error', this.trans['notMatchedForm']);
                    return;
                  }
                  this.dfcWorkflowService.CreateNewSigningFlow('RFI物料良率:' + this.editmodelMaterial.model, list, resul[0]['workflowFormMappings'][0]['id']).subscribe(res => {
                    this.isSigning = true;
                    this.baseDataSigningService.updateworkflow(res['data']['id'], {
                      createOn: new Date(),
                      createBy: this.userId,
                      routingParameter: `?product=${this.editmodelMaterial.product}&model=${this.editmodelMaterial.model}`
                    }).subscribe();
                    for (let j = 0; j < this.editmodelMaterial.length; j++) {
                      this.materialYrService.updateModelMaterialUpload(this.editmodelMaterial[j]['id'], {
                        workflowId: res['data']['id']
                      }).subscribe(ree => {
                        if (j === this.editmodelMaterial.length - 1) {
                          this.sendLoading = false;
                          this.yrGenerateService.getFirstFlowSignByFlowId(res['data']['id']).subscribe(async rd => {
                            let mails = '';
                            for (let k = 0; k < rd.length; k++) {
                              await this.yrGenerateService.findUserById(rd[k]['userId']).toPromise().then(reso => {
                                mails += reso['email'] + ';';
                              });
                            }
                            const url = `${location.origin}/dashboard/rfi/signing/base-data-signing?product=${this.editmodelMaterial.product}&model=${this.editmodelMaterial.model}`;
                            const notice: MailInterface = {
                              subject: '【DFQ系統提醒】DFQ良率Base Data簽核',
                              content: 'Dear Sir:<br>' + this.editmodelMaterial.customer + '客戶' + this.editmodelMaterial.model + '機種良率Base Data已更新，請登陸DFQ系統簽核，以滿足機種良率預測需要.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                              sender: 'dfi@wistron.com',
                              receiver: mails
                            };
                            this.meetingReviewTestService.createMail(notice).subscribe();
                          });
                        }
                      });
                    }
                  });
                });
              } else {
                // 輸錯提示找不到此主管就不發郵件
                this.message.create('error', this.trans['nosupervisor']);
                return;
              }
            });
          } else {
            // 輸錯提示找不到此主管就不發郵件
            this.message.create('error', this.trans['nosupervisor']);
            return;
          }
        });
      }
    });
  }

  submitSign() {
    this.modalService.confirm({
      nzTitle: '<i>Send Alert</i>',
      nzContent: '<b>Do you Want to Send?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { },
      nzOnOk: async () => {
        this.isLoading = true;
        for (let index = 0; index < this.signers[0]['workflowSigns'].length; index++) {
          if (this.signers[0]['workflowSigns'][index]['isAgree'] != 0 && this.signers[0]['workflowSigns'][index]['isAgree'] != 1) {
            this.message.create('warning', 'Please choose Approved status!');
            this.isLoading = false;
            return;
          }
          this.baseDataSigningService.updateflowSign(this.signers[0]['workflowSigns'][index]['id'], {
            isAgree: this.signers[0]['workflowSigns'][index]['isAgree'],
            comment: this.signers[0]['workflowSigns'][index]['comment']
          }).subscribe(res => {
            let pass = true;
            if (res['isAgree'] == 0) {
              pass = false;
            }
            this.baseDataSigningService.updateworkflow(this.editmodelMaterial[0]['workflowId'], {
              status: pass ? 1 : 2
            }).subscribe(async final => {
              this.isLoading = false;
              this.finishSigned.emit(false);
              // 簽核未通過發送郵件給所有人
              let returnmail = '';
              for (let k = 0; k < this.signers[0]['workflowSigns'].length; k++) {
                await this.yrGenerateService.findUserById(this.signers[0]['workflowSigns'][k]['userId']).toPromise().then(reso => {
                  returnmail += reso['email'] + ';';
                });
              }
              if (!pass) {
                // 送簽人
                await this.yrGenerateService.findUserById(final['createBy']).toPromise().then(senger => {
                  returnmail += senger['email'] + ';';
                  const url = `${location.origin}/dashboard/rfi/signing/base-data-signing?product=${this.editmodelMaterial.product}&model=${this.editmodelMaterial.model}`;
                  const notice: MailInterface = {
                    subject: '【DFQ系統提醒】DFQ 良率Base Data簽核未通過',
                    content: 'Dear Sir:<br>' + this.editmodelMaterial.customer + '客戶' + this.editmodelMaterial.model + '機種良率Base Data,' + this.userName + '簽核未通過' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                    sender: 'dfi@wistron.com',
                    receiver: returnmail
                  };
                  this.meetingReviewTestService.createMail(notice).subscribe();
                });
              }
              // 最後一個人簽核完成后狀態更改完發送完成郵件
              if (pass) {
                for (let m = 0; m < this.allData.length; m++) {
                  this.materialYrService.updateModelMaterialUpload(this.allData[m]['id'], {
                    workflowId: this.editmodelMaterial[0]['workflowId']
                  }).subscribe(
                    async fia => {
                      if (m === this.editmodelMaterial.length - 1) {
                        await this.yrGenerateService.findUserById(final['createBy']).toPromise().then(reso => {
                          returnmail += reso['email'] + ';';
                          const url = `${location.origin}/dashboard/rfi/signing/base-data-signing?product=${this.editmodelMaterial.product}&model=${this.editmodelMaterial.model}`;
                          const notice: MailInterface = {
                            subject: '【DFQ系統提醒】DFQ 良率Base Data簽核完成',
                            content: 'Dear Sir:<br>' + this.editmodelMaterial.customer + '客戶' + this.editmodelMaterial.model + '機種良率Base Data已更新並完成簽核，此後DFQ新機種將以新版本標準作業.' + '<br>DFQ URL:<a href="' + url + '">Link to DFQ Project system to take action.</a> for detail information(需使用Google Chrome登陸)<br><br>Do not reply this mail as it is automatically sent by the system.<br><br>Thank you.<br>DFQ system administrator',
                            sender: 'dfi@wistron.com',
                            receiver: returnmail
                          };
                          this.meetingReviewTestService.createMail(notice).subscribe();
                        });
                      }
                    }
                  );
                }
              }
            });
          });
        }
      }
    });
  }

  async showFactor(id, materialId) {
    // 根據es里因子的id獲取因子的name
    await this.yrGenerateService.getEsByModelMaterialId(id).toPromise().then(async data => {
      this.modalData.factors = data['hits']['hits'][0]._source.factors;
      this.newMaterialYrService.getFactorType(materialId).subscribe(res => {
        this.modalData.factorTypes = res;
        this.modalVisible = true;
      });
    });
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
