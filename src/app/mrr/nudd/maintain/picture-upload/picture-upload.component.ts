import { Component, OnInit } from '@angular/core';
import { PictureUploadService } from './picture-upload.service';
import { UploadFile, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { FileService } from '@service/file.service';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss']
})
export class PictureUploadComponent implements OnInit {
  // 編輯權限
  enableUse = false;
  role: string;
  SQMLeaderUse = false;

  isVisible = false;
  isOkLoading = false;
  table = [];
  addDesign = {
    id: null,
    name: null,
    picturePath: null,
    processTypeId: null
  };
  uploading = false;
  add3DFlag = true;
  addFileFlag = false;
  change;
  queryFlag = false;
  file: File[] = [];
  fileContainer = '';
  designItems;
  picture;
  previewVisible = false;
  itemId;
  id;
  constructor(
    private service: PictureUploadService,
    private http: HttpClient,
    private fileService: FileService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) { }

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

  onInitForm(event) {
    this.getDesignById(event);
  }

  OnFlag(event) {
    this.queryFlag = event;
  }

  getDesignById(id) {
    this.service.getDesignById(id).subscribe(res => {
      this.table = res;
    });
  }

  getFileName(filePath: string) {
    if (filePath === null || filePath === '') {
      return null;
    }
    const fileName = filePath.split('/')[filePath.split('/').length - 1];
    return fileName;
  }
  // 點擊上傳圖片
  showModal(data, index): void {
    this.itemId = data.id;
    this.fileContainer = data.id + '_';
    if (data.picturePath === null || data.picturePath === '') {
      this.add3DFlag = true;
      this.addDesign = {
        id: null,
        name: null,
        picturePath: null,
        processTypeId: null
      };
      this.file = [];
      this.change = null;
      if (data !== null) {
        this.addDesign = {
          id: data.id,
          name: data.name,
          picturePath: data.picturePath,
          processTypeId: data.processTypeId
        };
        this.change = index;
      }
      this.isVisible = true;
      this.addFileFlag = true;
    }
  }

  // 取消
  handleCancel(): void {
    // 關閉model彈窗
    this.isVisible = false;
    // 清空文件列表
    this.file = [];
  }

  beforeUpload = (file: File): boolean => {
    // 向文件列表里加一個文件
    this.file.length === 0 ? this.file.push(file) : (this.file[0] = file);
    this.addFileFlag = false;
    this.add3DFlag = true;
    if (this.file[0]) {
      const fileType = this.file[0].type;
      let fileErrMsg = '';
      if (this.file[0].size > 1048576) {
        fileErrMsg = 'File too large. File must be less than 1 MB.';
      } else if (
        fileType !== 'image/jpeg' &&
        fileType !== 'image/jpg' &&
        fileType !== 'image/gif' &&
        fileType !== 'image/png'
      ) {
        fileErrMsg = 'The file type is invalid. Only accept JPG, GIF and PNG types！';
        this.message.create('error', fileErrMsg);
        this.file = [];
      }
    }
    return false;
  }

  handleUpload(): void {
    const container = '3dpicture';
    this.uploading = true;
    this.fileService
      .postMRRFile(
        this.file[0],
        container,
        this.fileContainer + this.file[0].name
      )
      .subscribe(
        (res: {}) => {
          // 加載狀態關閉
          this.addDesign.picturePath =
            DFILoopBackConfig.getPath().toString() +
            '/api/containers/' +
            container +
            '/download/' +
            res['result']['files']['fileKey'][0]['name'];
          this.handleOK();
          this.addFileFlag = true;
          this.add3DFlag = false;
        },
        err => {
          this.message.create('error', 'File upload failed！');
          this.uploading = false;
        }
      );
  }

  // 上傳記錄
  handleOK() {
    this.isOkLoading = true;
    this.service.addDesign(this.addDesign).subscribe(
      res => {
        // 如果是修改被選擇的TD
        if (this.change !== null) {
          this.table[this.change] = res;
        } else {
          // 新增的字段
          // table數據加一條新增字段
          this.table.push(res);
        }
        this.message.create('success', 'Saved successfully！');
        // 關閉彈窗
        this.isVisible = false;
        this.uploading = false;
      },
      err => {
        this.message.create('error', 'Save failed！');
        this.isOkLoading = false;
        this.uploading = false;
      }
    );
  }

  // 刪除確認框
  showDeleteConfirm(data): void {
    const container = '3dpicture';
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        const fileName = this.getFileName(data.picturePath);
        this.fileService.deleteMRRFile(container, fileName).subscribe(
          res => {
            this.delete3D(data);
          },
          err => {
            this.message.create('error', 'Failed to delete file！');
          }
        );
      },
      nzCancelText: 'No',
      nzOnCancel: () => { }
    });
  }

  // 點擊顯示圖片
  showPicture(id) {
    // 判斷是否上傳了文件，有上傳就直接點擊預覽圖片
    if (this.getFileName('this.picturePath')) {
      this.service.getDesignItem(id).subscribe(resu => {
        this.designItems = resu;
        this.picture = this.designItems[0]['picturePath'];
      });
    } else {
      this.service.getDesignItem(this.itemId).subscribe(res => {
        this.designItems = res;
        this.picture = this.designItems[0]['picturePath'];
      });
    }
    this.previewVisible = true;
  }

  // 刪除LL文件path
  delete3D(param) {
    param.picturePath = null;
    this.service.addDesign(param).subscribe(
      res => {
        this.message.create('success', 'Successfully deleted！');
        // 通過data.id保留不等於data.id的字段
        this.table = this.table.filter(data => data.id !== param.id);
        this.table.push(res);
        this.addFileFlag = true;
      },
      err => {
        this.message.create('error', 'Failed to delete！');
      }
    );
  }
}
