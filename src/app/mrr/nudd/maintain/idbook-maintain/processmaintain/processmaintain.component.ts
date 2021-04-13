import { Component, OnInit, Input } from '@angular/core';
import { IdbookMaintainService } from '../idbook-maintain.service';
import { ProcessInterface } from '@service/mrr-sdk';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-processmaintain',
  templateUrl: './processmaintain.component.html',
  styleUrls: ['./processmaintain.component.scss']
})
export class ProcessmaintainComponent implements OnInit {
  @Input() data;
  @Input() formData;
  @Input() enableUse;
  @Input() SQMLeaderUse: boolean;
  isVisible = false;
  uploading = false;
  processName;
  constructor(private service: IdbookMaintainService,
    private message: NzMessageService,
    private modalService: NzModalService) { }

  ngOnInit() {
  }

  addProcess() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  save() {
    this.uploading = true;
    const param: ProcessInterface = {
      name: this.processName,
      productId: this.formData.product
    };
    this.service.addProcess(param).subscribe(
      res => {
        this.message.create('success', 'Added successfully！');
        this.data.push({
          id: res.id,
          name: res.name,
          productId: this.formData.product,
          materials: [],
          operations: []
        });
        this.isVisible = false;
        this.uploading = false;
      },
      err => {
        this.message.create('error', 'Server Error！');
        this.uploading = false;
      });
  }

  // 刪除確認框
  showDeleteConfirm(data): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.service.deleProcessById(data.id).subscribe(
          res => {
            this.message.create('success', 'Successfully deleted！');
            this.data = this.data.filter(function (item) {
              return item.id !== data.id;
            });
          },
          err => {
            this.message.create('error', 'Server Error！');
          });
      },
      nzCancelText: 'No'
    });
  }
}
