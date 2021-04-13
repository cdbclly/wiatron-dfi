import { Component, OnInit } from '@angular/core';
import { LlUploadService } from './ll-upload.service';
import { FileService } from '@service/file.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ContainerApi } from '@service/dfi-sdk';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';

@Component({
  selector: 'app-ll-upload',
  templateUrl: './ll-upload.component.html',
  styleUrls: ['./ll-upload.component.scss']
})
export class LLUploadComponent implements OnInit {
  // 新增修改彈窗顯示判斷
  isVisible = false;
  // 保存后加載判斷
  isOkLoading = false;
  // 表格數據
  table = [];
  // 添加LL請求參數
  addLL = {
    id: null,
    designItemId: null,
    year: null,
    fileName: null,
    path: null
  };
  designItemId;
  // 選擇table的ll的id
  change = null;
  // 文件上傳后加載判斷
  uploading = false;
  addllFlag = false;
  addFileFlag = false;
  queryFlag = false;
  filecontainer = '';
  // 文件列表
  file: File[] = [];

  // 權限管控
  role: string;
  enableUse = false;
  SQMLeaderUse = false;
  constructor(private llUploadService: LlUploadService,
    private fileService: FileService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private containerService: ContainerApi
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

  // 初始化加載table
  OnInitTable(event) {
    this.table = [];
    this.getLLById(event.designItem);
    this.designItemId = event.designItem;
    this.filecontainer = event.dimension + '_' + event.product + '_';
  }

  // 獲取 ll 通過id
  getLLById(id) {
    this.queryFlag = false;
    this.llUploadService.getLLById(id).subscribe(res => { this.table = res; this.queryFlag = true; });
  }

  // 顯示添加修改彈窗
  showModal(data, index): void {
    // 初始化請求參數
    this.addllFlag = true;
    this.addLL = {
      id: null,
      designItemId: this.designItemId,
      year: null,
      fileName: null,
      path: null
    };
    this.file = [];
    this.change = null;
    // 判斷是否是修改還是新增
    if (data !== null) {
      // 獲取選中的td值
      this.addLL = {
        id: data.id,
        designItemId: data.designItemId,
        year: data.year,
        fileName: data.fileName,
        path: data.path
      };
      this.change = index;
    }
    this.isVisible = true;
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
  handleUpload(): void {
    // 加載狀態開啟
    this.uploading = true;
    this.addFile();
  }

  // 上傳記錄
  handleOK() {
    // 時間格式轉換為年
    this.addLL.year = new Date(this.addLL.year).getFullYear().toString();
    this.isOkLoading = true;
    this.upsetLL();
  }

  // 添加文件
  addFile() {
    const container = 'lessonlearned';
    this.fileService.postMRRFile(this.file[0], container, this.filecontainer + this.file[0].name).subscribe(
      (res: {}) => {
        // 加載狀態關閉
        this.addLL.fileName = res['result']['files']['fileKey'][0]['name'];
        const url = DFILoopBackConfig.getPath().toString() + '/api/containers/' + container + '/download/' + res['result']['files']['fileKey'][0]['name'];
        this.addLL.path = url;
        this.handleOK();
        this.addFileFlag = true;
        this.addllFlag = false;
      },
      err => {
        this.message.create('error', 'File upload failed！');
        this.uploading = false;
      }
    );
  }

  // 新增/修改LL記錄
  upsetLL() {
    this.llUploadService.addLL(this.addLL).subscribe(
      res => {
        // 如果是修改被選擇的TD
        if (this.change !== null) {
          this.table[this.change] = res;
        } else { // 新增的字段
          // table數據加一條新增字段
          this.table.push(res);
          this.table = this.table.slice();
        }
        this.message.create('success', 'Saved successfully！');
        // 關閉彈窗
        this.uploading = false;
        this.isVisible = false;
        this.isOkLoading = false;
      },
      err => {
        this.message.create('error', 'Save failed！');
        this.isOkLoading = false;
        this.uploading = false;
      }
    );
  }

  // 刪除LL
  delete(id) {
    this.llUploadService.deleteLL(id).subscribe(
      res => {
        this.message.create('success', 'Successfully deleted！');
        // 通過data.id保留不等於data.id的字段
        this.table = this.table.filter(data => data.id !== id);
      },
      err => {
        this.message.create('error', 'Failed to delete！');
      }
    );
  }

  // 刪除確認框
  showDeleteConfirm(data): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.containerService.removeFile('lessonlearned', data.fileName).subscribe(res => {
          this.delete(data.id);
        },
          err => {
            this.message.create('error', 'File deletion failed！');
          });
      },
      nzCancelText: 'No'
    });
  }
}
