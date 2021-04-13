import { Component, OnInit } from '@angular/core';
import { NuddUploadService } from './nudd-upload.service';
import { FileService } from '@service/file.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UtilsService } from '@service/utils.service';
import { MailInterface } from '@service/dfi-sdk';
import { environment } from 'environments/environment';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
@Component({
  selector: 'app-nudd-upload',
  templateUrl: './nudd-upload.component.html',
  styleUrls: ['./nudd-upload.component.scss']
})
export class NuddUploadComponent implements OnInit {
  projectName: any;
  site;
  a = [];
  uploadFileName;
  dataSet = [];
  dataList = [];
  formData = {
  };
  fromPartDocument = [];
  fromModelDocument = [];
  type = [];
  types = [];
  part = [];
  parts = [];
  file: File[] = [];
  isVisible = false;
  isOkLoading = false;
  uploading = false;
  addllFlag = false;
  addFileFlag = false;
  fileContainer = '';
  form = {
    'path': null,
    'dimensionId': null,
    'partId': null,
    'modelId': null
  };
  formModel = {
    'modelId': null,
    'path': null
  };
  queryFlagShow = false;
  receivers: any;
  // 權限控制
  role: string;
  enableUse = false;
  SQMLeaderUse = false;
  constructor(private nuddUploadService: NuddUploadService,
    private fileService: FileService,
    private message: NzMessageService,
    private utilsService: UtilsService,
    private modalService: NzModalService) { }

  ngOnInit() {
    this.role = localStorage.getItem('$DFI$userRole');
    const roles = this.role.toUpperCase().split(',');
    if (roles.indexOf('SQM') !== -1 || roles.indexOf('IT') !== -1) {
      this.enableUse = true;
    }
    if (roles.indexOf('SQM LEADER') !== -1) {
      this.SQMLeaderUse = true;
      this.enableUse = true;
    }
  }

  showModal(): void {
    this.isVisible = true;
    this.form = {
      'path': null,
      'dimensionId': null,
      'partId': null,
      'modelId': null
    };
    this.formModel = {
      'modelId': null,
      'path': null
    };
    this.file = [];
  }

  notice(mail) {
    this.nuddUploadService.sendEmail(mail).subscribe(res => {
    },
      err => {
        this.message.create('error', 'Failed to send mail！');
      });
  }

  queryFlag(event) {
    if (environment.enable) {
      this.receivers = environment['NUDD_IDBOOK_RECEIVER'][this.site];
    } else {
      this.utilsService.getConfig()
        .subscribe(res => {
          this.receivers = res['NUDD_IDBOOK_RECEIVER'][this.site];
        });
    }
    this.getDimension();
    this.getPartDocument();
    this.getModelDocument();
    this.getFromPart();
    if (event !== null) {
      this.site = event[3];
      this.fileContainer = event[3] + '_' + event[2] + '_' + event[1] + '_';
      this.queryFlagShow = event[0];
      this.projectName = event[1];
      this.dataList.length = 0;
    }
    this.nuddUploadService.getModel(this.projectName).subscribe(
      res => {
        this.dataSet = res;
        const list = [];
        this.dataSet[0]['partDocuments'].forEach(item => {
          let flag = true;
          for (let i = 0; i < list.length; i++) {
            if ((item.dimensionId === list[i].dimensionId) && (item.partId === list[i].partId)) {
              if (item.id > list[i].id) {
                list[i] = item;
              }
              flag = false;
            }
          }
          if (flag) {
            list.push(item);
          }
        });
        this.dataSet[0]['partDocuments'] = list;
      });
  }

  getPartDocument() {
    this.nuddUploadService.getPartDocument().subscribe(
      res => {
        this.fromPartDocument = res;
      });
  }

  getModelDocument() {
    this.nuddUploadService.getModelDocument().subscribe(
      res => {
        this.fromModelDocument = res;
      });
  }

  download(data, container) {
    this.fileService.downloadMRRFile(container, data.path.split('/')[data.path.split('/').length - 1]);
  }

  handleFileInput(evt: any) {
    this.uploadFileName = evt.files[0].name;
    this.file = evt.files.item(0);
  }

  // 取消
  handleCancel(): void {
    // 關閉model彈窗
    this.isVisible = false;
    // 清空文件列表
    this.file = [];
  }

  // 添加文件
  beforeUpload = (file: File): boolean => {
    // 向文件列表里加一個文件
    this.file.length === 0 ? this.file.push(file) : this.file[0] = file;
    this.addFileFlag = false;
    this.addllFlag = true;
    return false;
  }

  // 上傳文件
  handleUpload(container): void {
    // 加載狀態開啟
    this.uploading = true;
    this.addFile(container);
  }

  addFile(container) {
    this.fileService.postMRRFile(this.file[0], container, this.fileContainer + this.form.dimensionId + '_' + this.file[0].name).subscribe(
      (res: {}) => {
        if (container === '2d3dfiles') {
          this.form.path = DFILoopBackConfig.getPath().toString() + '/api/containers/' + container + '/download/' + res['result']['files']['fileKey'][0]['name'];
          this.handleOK1();
        } else if (container === 'idbookfiles') {
          this.formModel.path = DFILoopBackConfig.getPath().toString() + '/api/containers/' + container + '/download/' + res['result']['files']['fileKey'][0]['name'];
          this.handleOK2();
        }
        this.isOkLoading = true;
        this.uploading = false;
        this.addFileFlag = true;
        this.addllFlag = false;
      },
      err => {
        this.message.create('error', 'File upload failed！');
        this.uploading = false;
      }
    );
  }

  // 上傳記錄
  handleOK1() {
    this.form.modelId = this.projectName;
    this.nuddUploadService.postPartDocument(this.form).subscribe(
      res => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.message.create('success', 'Added successfully！');
        const mail: MailInterface = {
          subject: 'Nudd Upload File',
          content: 'NUDD upload file success!' + 'filename:' + [this.fileContainer + this.file[0].name],
          sender: 'dfi@wistron.com',
          receiver: this.receivers
        };
        this.notice(mail);
        this.nuddUploadService.getModel(this.projectName).subscribe(
          reso => {
            this.dataSet = reso;
          });
      },
      err => {
        this.message.create('error', 'Add failed！');
        this.isOkLoading = false;
      }
    );
  }

  handleOK2() {
    this.formModel.modelId = this.projectName;
    this.nuddUploadService.addModel(this.formModel).subscribe(
      res => {
        this.isVisible = false;
        this.isOkLoading = false;
        const mail: MailInterface = {
          subject: 'Nudd Upload File',
          content: 'NUDD upload file success!' + 'filename:' + '[' + 'IDbook' + '_' + this.file[0].name + ']',
          sender: 'dfi@wistron.com',
          receiver: this.receivers
        };
        this.notice(mail);
        this.nuddUploadService.getModel(this.projectName).subscribe(
          reso => {
            this.dataSet = reso;
          });
        this.message.create('success', 'Added successfully！');
      },
      err => {
        this.message.create('error', 'Add failed！');
        this.isOkLoading = false;
      }
    );
  }

  getDimension() {
    this.nuddUploadService.getDimension().toPromise().then(res => {
      this.types = res;
      this.types.push({ id: 0, name: 'IDBook' });
    });
  }

  getFromPart() {
    this.nuddUploadService.getFromPart().subscribe(
      res => {
        this.parts = res;
      }
    );
  }

  // 刪除確認框
  showDeleteConfirm(data, container): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        if (data.path !== null) {
          this.deleteFile(container, data.path.split('/')[data.path.split('/').length - 1]).subscribe(res => {
            this.delete(data.id, container);
          },
            err => {
              this.message.create('error', 'File deletion failed！');
            });
        }
      },
      nzCancelText: 'No'
    });
  }

  delete(id, container) {
    if (container === '2d3dfiles') {
      this.nuddUploadService.deletePartDocument(id).subscribe(
        res => {
          this.message.create('success', 'Successfully deleted！');
          this.queryFlag(null);
        },
        err => {
          this.message.create('error', 'Failed to delete！');
        }
      );
    } else if (container === 'idbookfiles') {
      this.nuddUploadService.deleteModelDocument(id).subscribe(
        res => {
          this.message.create('success', 'successfully deleted！');
          this.queryFlag(null);
        },
        err => {
          this.message.create('error', 'Failed to delete！');
        }
      );
    }
  }

  deleteFile(container, fileName) {
    return this.fileService.deleteMRRFile(container, fileName);
  }
}
