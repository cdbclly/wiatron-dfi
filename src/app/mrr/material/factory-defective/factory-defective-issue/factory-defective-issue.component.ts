import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DownexcelService } from '@service/downexcel.service';
import { FactoryDefectiveService } from '../factory-defective.service';
import { FileService } from '@service/file.service';
import { MrrMaterialMessageService } from '../../mrr-material-message.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { FactoryRecordApi } from '@service/mrr-sdk';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-factory-defective-issue',
  templateUrl: './factory-defective-issue.component.html',
  styleUrls: ['./factory-defective-issue.component.scss']
})
export class FactoryDefectiveIssueComponent implements OnInit, OnChanges {
  @Output() pageRoute = new EventEmitter<any>();
  @Output() topIssue = new EventEmitter<any>();
  @Input() defectIssue;

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

  // Upload or DownLoad
  apiURL =
    DFILoopBackConfig.getPath().toString() +
    '/api/Containers/mrrManuIssuePic/download/';
  isUploadLoading = false;
  showPicture = false;
  showPicSrc = '';
  issueEditFlag = false;
  submitFlag = false;
  Mathround = Math.round;
  input;
  defectQty;
  manufacturer;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  startValue: Date | null = null;
  disabledDate = (startValue: Date): boolean => {
    return false;
  };
  routeFlag = false;
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  fileUploadNotice;
  uploadError;
  object = {};
  constructor(
    private factoryDefectiveService: FactoryDefectiveService,
    private downExcelService: DownexcelService,
    private fileService: FileService,
    private messageService: MrrMaterialMessageService,
    private message: NzMessageService,
    private factoryRecordAPi: FactoryRecordApi,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defectIssue'] && changes['defectIssue'].currentValue) {
      this.defectQty = Number(this.defectIssue['defectQty']);
      this.queryTopIssue(this.defectIssue);
    }
  }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.material-factory-issue-fileUpload', 'mrr.material-factory-issue-error', 'mrr.material-rootcause', 'mrr.material-action', 'mrr.mrr-duedate']).subscribe(res => {
      this.fileUploadNotice = res['mrr.material-factory-issue-fileUpload'];
      this.uploadError = res['mrr.material-factory-issue-error'];
      this.object['rootcause'] = res['mrr.material-rootcause'];
      this.object['action'] = res['mrr.material-action'];
      this.object['dueDate'] = res['mrr.mrr-duedate'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-factory-issue-fileUpload', 'mrr.material-factory-issue-error', 'mrr.material-rootcause', 'mrr.material-action', 'mrr.mrr-duedate']).subscribe(res => {
        this.fileUploadNotice = res['mrr.material-factory-issue-fileUpload'];
        this.uploadError = res['mrr.material-factory-issue-error'];
        this.object['rootcause'] = res['mrr.material-rootcause'];
        this.object['action'] = res['mrr.material-action'];
        this.object['dueDate'] = res['mrr.mrr-duedate'];
      });
    });
    this.route.queryParams.subscribe(d => {
      if (Object.keys(d).length > 0) {
        this.routeFlag = true;
        this.queryTopIssue(d);
      }
    });
  }

  // 處理FA top issue
  queryTopIssue(issueList) {
    this.input = Number(issueList['inputQty']);
    this.manufacturer = issueList['manufacturer'];
    this.factoryDefectiveService.getFactoryIssue(issueList).subscribe((issue: any) => {
      for (let index = 0; index < issue.length; index++) {
        if (!issue[index]['dueDate']) {
          issue[index]['dueDate'] = new Date(
            new Date().setDate(new Date().getDate() + 4)
          );
        }
        if (!issue[index]['status']) {
          issue[index]['status'] = 0;
        }
        if (issue[index]['filePath']) {
          const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
          if (
            !docType.includes(
              issue[index]['filePath']
                .split('.')
                .pop()
                .toLowerCase()
            )
          ) {
            // 上傳非圖片格式
            issue[index]['docType'] = false;
          } else {
            issue[index]['docType'] = true;
          }
        }
      }
      this.topIssueData = issue;
      this.topIssueData.sort(this.sortDefectQty);
      this.topIssueDataCache = JSON.parse(JSON.stringify(this.topIssueData));
      this.submitFlag = this.checkDefectQty(this.topIssueData, this.defectQty);
    });
    // 限制dueDate的範圍
    const date = issueList['manufactureDate'];
    this.disabledDate = (startValue: Date): boolean => {
      if (!startValue) {
        return false;
      }
      return startValue.getTime() < new Date(date).getTime();
    };
  }

  sortDefectQty(a, b) {
    return b.defectQty - a.defectQty;
  }

  // 檢查Top issue不良數是否大於總不良數
  checkDefectQty(data, totalDefectQty) {
    let flag = false;
    let topIssueDefectQty = 0;
    for (let index = 0; index < data.length; index++) {
      topIssueDefectQty += data[index]['defectQty'];
    }
    if (!totalDefectQty) {
      totalDefectQty = 0;
    }
    if (topIssueDefectQty >= totalDefectQty) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  // 上傳文件
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

  // 圖片顯示
  showIssuePicture(filePath) {
    this.showPicSrc = filePath;
    this.showPicture = true;
  }

  edit() {
    this.issueEditFlag = true;
  }

  // 保存編輯
  save() {
    if (this.isExt) {
      let flag = false;
      const checkItem = {
        rootCause: this.object['rootcause'],
        action: this.object['action'],
        dueDate: this.object['dueDate']
      };
      for (let index = 0; index < this.topIssueDataCache.length; index++) {
        const data = this.topIssueDataCache[index];
        for (const key in checkItem) {
          if (checkItem.hasOwnProperty(key)) {
            const itemName = checkItem[key];
            if (data[key]) {
              flag = true;
            } else {
              this.message.create('warning', itemName + ' unfilled！');
              return;
            }
          }
        }
      }
    }
    this.factoryDefectiveService
      .updateFactoryIssue(this.topIssueDataCache, 'save')
      .subscribe(
        res => {
          for (let index = 0; index < res.length; index++) {
            if (res[index]['filePath']) {
              const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
              if (
                !docType.includes(
                  res[index]['filePath']
                    .split('.')
                    .pop()
                    .toLowerCase()
                )
              ) {
                // 上傳非圖片格式
                res[index]['docType'] = false;
              } else {
                res[index]['docType'] = true;
              }
            }
          }
          this.topIssueData = JSON.parse(JSON.stringify(res));
          this.topIssueDataCache = JSON.parse(JSON.stringify(res));
          this.issueEditFlag = false;
          this.message.create('success', 'Saved successfully！');
          setTimeout(() => {
            this.submitFlag = this.checkDefectQty(
              this.topIssueData,
              this.defectQty
            );
          }, 1000);
        },
        error => {
          this.message.create('error', 'Save failed！');
        }
      );
  }

  cancel() {
    this.topIssueDataCache = JSON.parse(JSON.stringify(this.topIssueData));
    this.issueEditFlag = false;
  }

  // SQM 發送郵件 給廠商
  submit() {
    this.messageService.MessageCode.emailConfirm.param.nzOnOk = () => {
      this.factoryDefectiveService
        .updateFactoryIssue(this.topIssueData, 'submit')
        .subscribe(
          (res: any) => {
            for (let index = 0; index < res.length; index++) {
              res[index].input = this.input;
              res[index].manufacturer = this.manufacturer;
              res[index].plantId = this.PlantMapping.find(p => p.PlantCode === res[index].plantId.substr(1, 3)).Plant;
              if (res[index]['filePath']) {
                const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
                if (
                  !docType.includes(
                    res[index]['filePath']
                      .split('.')
                      .pop()
                      .toLowerCase()
                  )
                ) {
                  // 上傳非圖片格式
                  res[index]['docType'] = false;
                } else {
                  res[index]['docType'] = true;
                }
              }
            }
            this.topIssueData = JSON.parse(JSON.stringify(res));
            this.topIssueDataCache = JSON.parse(JSON.stringify(res));
            this.factoryRecordAPi.sendMail(this.topIssueData).subscribe(result => {
              if (result.message === 200) {
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

  // 下載top issue
  download() {
    const table = document.getElementById('topIssueTable');
    this.downExcelService.exportTableAsExcelFile(table, 'Top issue');
  }

  // 下載上傳的Excel、PPT以及PDF等
  downIssueDoc(fileName) {
    this.fileService.downloadMRRFile('mrrManuIssuePic', fileName);
  }

  goBackQuery() {
    const page = 0;
    this.pageRoute.emit(page);
  }
}
