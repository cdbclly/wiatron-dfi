import { DownexcelService } from '@service/downexcel.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ManufaturerInputService } from '../manufaturer-input.service';
import { FileService } from '@service/file.service';
import { MrrMaterialMessageService } from '../../mrr-material-message.service';
import { NzMessageService } from 'ng-zorro-antd';
import { VendorRecordApi } from '@service/mrr-sdk';
import { ActivatedRoute } from '@angular/router';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manufaturer-input-issue',
  templateUrl: './manufaturer-input-issue.component.html',
  styleUrls: ['./manufaturer-input-issue.component.scss']
})
export class ManufaturerInputIssueComponent implements OnInit, OnChanges {
  @Output() pageRoute = new EventEmitter<any>();
  @Input() toTopIssueDate = [];

  topIssueData = [];
  topIssueDataCache = [];

  statusList = [
    { value: 0, label: 'No Data/Submit' },
    { value: 1, label: 'Open' },
    { value: 2, label: 'Reject' },
    { value: 3, label: 'Ongoing' },
    { value: 4, label: 'Tracking' },
    { value: 5, label: 'Close' }
  ];

  math = Math;
  // Upload
  apiURL =
    DFILoopBackConfig.getPath().toString() +
    '/api/Containers/mrrManuIssuePic/download/';
  isUploadLoading = false;
  showPicture = false;
  showPicSrc = '';

  // add Model
  addTopIssueModelFlag = false;
  saveData = {
    vendorRecordId: null,
    input: null,
    defectQty: null,
    issue: null,
    rootcause: null,
    action: null,
    owner: null,
    dueDate: null,
    status: null,
    filePath: null
  };

  issueEditFlag = false;
  checkFlag = false;
  submitFlag = false;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;

  vendorRecordId;
  defectQty: any = null;
  checkDate = new Date();

  routeFlag = false;
  isLoading = false;

  disabledDate = (current: Date): boolean => {
    if (current.getTime() < this.checkDate.getTime()) {
      return true;
    } else {
      return false;
    }
  };
  fileUploadNotice;
  uploadError;
  object = {};
  constructor(
    private manufaturerInputService: ManufaturerInputService,
    private messageService: MrrMaterialMessageService,
    private downExcelService: DownexcelService,
    private fileService: FileService,
    private message: NzMessageService,
    private vendorRecordApi: VendorRecordApi,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['toTopIssueDate'] && changes['toTopIssueDate'].currentValue) {
      this.query();
    }
  }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.material-factory-issue-fileUpload', 'mrr.material-factory-issue-error', 'mrr.material-poor-amount', 'mrr.material-issue', 'mrr.material-rootcause', 'mrr.material-action', 'mrr.mrr-duedate']).subscribe(res => {
      this.fileUploadNotice = res['mrr.material-factory-issue-fileUpload'];
      this.uploadError = res['mrr.material-factory-issue-error'];
      this.object['defectQty'] = res['mrr.material-poor-amount'];
      this.object['issue'] = res['mrr.material-issue'];
      this.object['rootcause'] = res['mrr.material-rootcause'];
      this.object['action'] = res['mrr.material-action'];
      this.object['dueDate'] = res['mrr.mrr-duedate'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-factory-issue-fileUpload', 'mrr.material-factory-issue-error', 'mrr.material-poor-amount', 'mrr.material-issue', 'mrr.material-rootcause', 'mrr.material-action', 'mrr.mrr-duedate']).subscribe(res => {
        this.fileUploadNotice = res['mrr.material-factory-issue-fileUpload'];
        this.uploadError = res['mrr.material-factory-issue-error'];
        this.object['defectQty'] = res['mrr.material-poor-amount'];
        this.object['issue'] = res['mrr.material-issue'];
        this.object['rootcause'] = res['mrr.material-rootcause'];
        this.object['action'] = res['mrr.material-action'];
        this.object['dueDate'] = res['mrr.mrr-duedate'];
      });
    });
    this.route.params.subscribe(async param => {
      // by mail link to
      if (param['id']) {
        this.routeFlag = true;
        this.topIssueData = await this.manufaturerInputService
          .getVendorIssueList(param['id'])
          .toPromise();
        // by defectQty sort
        this.topIssueData.sort(this.sortDefectQty);
        this.topIssueDataCache = JSON.parse(JSON.stringify(this.topIssueData));
        // 去重
        const distData = new Map();
        this.toTopIssueDate = this.topIssueData.filter(i => !distData.has(i.vendorRecordId) && distData.set(i.vendorRecordId, 1));
        // the same process total defectQty is (input - output)
        this.defectQty = this.manufaturerInputService.checkTopIssueDefectQty(
          this.topIssueData,
          this.topIssueData
        );
        // can submit
        this.submitFlag = this.topIssueData.reduce((p, c) => {
          p = (p && !!c['status']) || c['status'] === 0;
          return p;
        }, true);
        setTimeout(() => {
          this.checkFlag = this.checkFilledIn(this.topIssueData, false);
        }, 1000);
      }
    });
  }

  sortDefectQty(a, b) {
    return b.defectQty - a.defectQty;
  }

  // 處理top issue
  query() {
    this.checkFlag = false;
    this.manufaturerInputService.queryTopIssue(this.toTopIssueDate).subscribe(
      d => {
        // 記錄 廠商需發送issue的 vendorRecordId
        if (d.length) {
          this.vendorRecordId = d[0]['vendorRecordId'];
        }
        this.defectQty = this.manufaturerInputService.checkTopIssueDefectQty(
          d,
          this.toTopIssueDate
        );
        for (let index = 0; index < d.length; index++) {
          if (d[index]['filePath']) {
            const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
            if (
              !docType.includes(
                d[index]['filePath']
                  .split('.')
                  .pop()
                  .toLowerCase()
              )
            ) {
              // 上傳非圖片格式
              d[index]['docType'] = false;
            } else {
              d[index]['docType'] = true;
            }
          }
        }
        this.topIssueData = d;
        this.topIssueData.sort(this.sortDefectQty);
        this.topIssueDataCache = JSON.parse(JSON.stringify(d));
        this.submitFlag = d.reduce((p, c) => {
          p = (p && !!c['status']) || c['status'] === 0;
          return p;
        }, true);
        setTimeout(() => {
          this.checkFlag = this.checkFilledIn(d, false);
        }, 1000);
      },
      e => {
        this.messageService.MessageCode.queryError.param.data = e;
        this.messageService.showMessage(
          this.messageService.MessageCode.queryError
        );
      }
    );
  }

  defectQtyChange(event, vendorRecordId) {
    this.defectQty[vendorRecordId].filledIn = 0;
    for (let index = 0; index < this.topIssueDataCache.length; index++) {
      this.defectQty[this.topIssueDataCache[index]['vendorRecordId']].filledIn +=
        Number(this.topIssueDataCache[index]['defectQty']);
    }
  }

  getDefectQtyMaxValue(data) {
    const res =
      this.defectQty && (data.vendorRecordId || data.vendorRecordId === 0)
        ? this.defectQty[data.vendorRecordId].defectQty -
        this.defectQty[data.vendorRecordId].filledIn
        : 0;
    return res;
  }

  // 新增 top issue -- start
  showModal() {
    this.saveData = {
      vendorRecordId: null,
      input: null,
      defectQty: null,
      issue: '',
      rootcause: '',
      action: '',
      owner: localStorage.getItem('$DFI$userID'),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      status: 0,
      filePath: ''
    };
    this.addTopIssueModelFlag = true;
  }

  addSelectChange(event) {
    const find = this.toTopIssueDate.find(f => f.vendorRecordId === event);
    this.saveData.input = find.input;
  }

  handleCancel() {
    this.addTopIssueModelFlag = false;
  }

  addTopIssueData() {
    this.isLoading = true;
    this.manufaturerInputService.createTopIssue([this.saveData]).subscribe(
      d => {
        this.query();
        this.messageService.MessageCode.saveSuccess.param.data = d;
        this.messageService.showMessage(
          this.messageService.MessageCode.saveSuccess
        );
        this.isLoading = false;
        this.addTopIssueModelFlag = false;
      },
      e => {
        this.isLoading = false;
        this.messageService.MessageCode.saveError.param.data = e;
        this.messageService.showMessage(
          this.messageService.MessageCode.saveError
        );
        this.addTopIssueModelFlag = false;
      }
    );
  }
  // 新增 top issue -- end

  goBack(page) {
    this.pageRoute.emit(page);
  }

  edit() {
    this.issueEditFlag = true;
  }

  // 保存編輯
  save() {
    this.checkFlag = this.checkFilledIn(this.topIssueDataCache, true);
    if (this.checkFlag) {
      this.manufaturerInputService
        .updateTopIssue(this.topIssueDataCache, 'save')
        .subscribe(
          datas => {
            for (
              let index = 0;
              index < this.topIssueDataCache.length;
              index++
            ) {
              this.topIssueDataCache[index]['nfr'] = (this.topIssueDataCache[index]['input'] && this.topIssueDataCache[index]['defectQty']) ||
                this.topIssueDataCache[index]['defectQty'] === 0
                ? Math.round(
                  (this.topIssueDataCache[index]['defectQty'] / this.topIssueDataCache[index]['input']) * 10000
                ) / 100
                : 0;
              if (this.topIssueDataCache[index]['filePath']) {
                const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
                if (
                  !docType.includes(
                    this.topIssueDataCache[index]['filePath']
                      .split('.')
                      .pop()
                      .toLowerCase()
                  )
                ) {
                  // 上傳非圖片格式
                  this.topIssueDataCache[index]['docType'] = false;
                } else {
                  this.topIssueDataCache[index]['docType'] = true;
                }
              }
            }
            this.topIssueData = JSON.parse(
              JSON.stringify(this.topIssueDataCache)
            );
            this.messageService.MessageCode.saveSuccess.param.data = datas;
            this.messageService.showMessage(
              this.messageService.MessageCode.saveSuccess
            );
            this.issueEditFlag = false;
          },
          e => {
            this.messageService.MessageCode.saveError.param.data = e;
            this.messageService.showMessage(
              this.messageService.MessageCode.saveError
            );
            this.cancel();
          }
        );
    }
  }

  // 取消后 恢復不良數加總
  cancel() {
    this.topIssueDataCache = JSON.parse(JSON.stringify(this.topIssueData));
    this.issueEditFlag = false;
    this.defectQty = this.manufaturerInputService.checkTopIssueDefectQty(
      this.topIssueDataCache,
      this.topIssueDataCache
    );
  }

  // 由廠商 送出
  submit() {
    if (this.checkFlag) {
      this.messageService.MessageCode.submitConfirm.param.nzOnOk = () => {
        this.manufaturerInputService
          .updateTopIssue(this.topIssueData, 'submit')
          .subscribe(
            datas => {
              for (let index = 0; index < this.topIssueData.length; index++) {
                this.topIssueData[index]['status'] = 1;
              }
              this.topIssueDataCache = JSON.parse(
                JSON.stringify(this.topIssueData)
              );
              this.vendorRecordApi
                .sendMail(this.vendorRecordId)
                .subscribe(flag => {
                  if (flag) {
                    this.messageService.showMessage(
                      this.messageService.MessageCode.emailSuccess
                    );
                  } else {
                    this.messageService.showMessage(
                      this.messageService.MessageCode.emailError
                    );
                  }
                });
            },
            e => {
              this.messageService.MessageCode.submitError.param.data = e;
              this.messageService.showMessage(
                this.messageService.MessageCode.submitError
              );
            }
          );
      };
      this.messageService.MessageCode.submitConfirm.param.data = this.topIssueData;
      this.messageService.showMessage(
        this.messageService.MessageCode.submitConfirm
      );
    }
  }

  // SQM 駁回 廠商 issue
  rejectEmail() {
    this.messageService.MessageCode.emailConfirm.param.nzOnOk = () => {
      this.manufaturerInputService
        .updateTopIssue(this.topIssueData, 'reject')
        .subscribe(
          datas => {
            for (let index = 0; index < this.topIssueData.length; index++) {
              this.topIssueData[index]['status'] = 2;
            }
            this.topIssueDataCache = JSON.parse(
              JSON.stringify(this.topIssueData)
            );
            this.vendorRecordApi
              .rejectMail(this.vendorRecordId)
              .subscribe(flag => {
                if (flag) {
                  this.messageService.showMessage(
                    this.messageService.MessageCode.emailSuccess
                  );
                } else {
                  this.messageService.showMessage(
                    this.messageService.MessageCode.emailError
                  );
                }
              });
          },
          e => {
            this.messageService.MessageCode.emailError.param.data = e;
            this.messageService.showMessage(
              this.messageService.MessageCode.emailError
            );
          }
        );
    };
    this.messageService.MessageCode.emailConfirm.param.data = this.topIssueData;
    this.messageService.showMessage(
      this.messageService.MessageCode.emailConfirm
    );
  }

  download() {
    const table = document.getElementById('topIssueTable');
    this.downExcelService.exportTableAsExcelFile(table, 'Top issue');
  }

  // 檢查Top issue填寫項目
  checkFilledIn(dataSet, saveFlag) {
    let checkItem = {};
    let checkFlag = true;

    for (let index = 0; index < dataSet.length; index++) {
      const data = dataSet[index];
      checkItem = {
        defectQty: this.object['defectQty'],
        issue: this.object['issue'],
        rootcause: this.object['rootcause'],
        action: this.object['action'],
        dueDate: this.object['dueDate'],
      };
      for (const item in checkItem) {
        if (checkItem.hasOwnProperty(item)) {
          const itemName = checkItem[item];
          if (!data[item] || data['defectQty'] === 0) {
            if (saveFlag) {
              this.messageService.MessageCode.modalError.param.nzTitle =
                itemName + ' unfilled！';
              this.messageService.MessageCode.modalError.param.data = data;
              this.messageService.showMessage(
                this.messageService.MessageCode.modalError
              );
            }
            checkFlag = false;
            break;
          }
        }
      }
      if (!checkFlag) {
        break;
      }
    }
    return checkFlag;
  }

  /**
   * 上传图片
   *
   * @param {*} input
   * @memberof ManufaturerInputIssueComponent
   */
  handleManuPicUpload(input, data) {
    this.isUploadLoading = true;
    const file: File = input.files.item(0);
    if (file) {
      const fileName = new Date().getTime() + '' + file.name;
      const fileBlobPart = [];
      fileBlobPart.push(file);
      const newFile: File = new File(fileBlobPart, fileName, {
        type: file.type,
        lastModified: file.lastModified
      });

      this.fileService
        .postMRRFile(newFile, 'mrrManuIssuePic', fileName)
        .subscribe(
          upload => {
            if (upload['result']['clamStatus']) {
              this.message.create('success', 'Upload successfully！');
              data['filePath'] = upload['result'].files.fileKey[0].name;
              const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
              if (
                !docType.includes(
                  data['filePath']
                    .split('.')
                    .pop()
                    .toLowerCase()
                )
              ) {
                // 上傳非圖片格式
                data['docType'] = false;
              } else {
                data['docType'] = true;
              }
            } else {
              this.message.create('error', this.fileUploadNotice);
            }
            this.isUploadLoading = false;
          },
          error => {
            this.message.create('error', this.uploadError);
            this.isUploadLoading = false;
          }
        );
    }
  }

  showIssuePicture(filePath) {
    this.showPicSrc = filePath;
    this.showPicture = true;
  }

  // 下載上傳的Excel、PPT以及PDF等
  downIssueDoc(fileName) {
    this.fileService.downloadMRRFile('mrrManuIssuePic', fileName);
  }
}
