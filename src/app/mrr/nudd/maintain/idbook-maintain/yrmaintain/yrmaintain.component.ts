import { filter } from 'rxjs/operators';
import { Product } from './../../../../../service/dfi-sdk/models/Product';
import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NzMessageService, NzModalService, NzColDirective } from 'ng-zorro-antd';
import { IdbookMaintainService } from '../idbook-maintain.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-yrmaintain',
  templateUrl: './yrmaintain.component.html',
  styleUrls: ['./yrmaintain.component.scss']
})
export class YrmaintainComponent implements OnInit {
  @Input() data;
  @Input() formData;
  @Input() enableUse;
  @Input() SQMLeaderUse: boolean;
  isVisible = false;
  uploading = false;
  name;
  yieldRate;
  clickProduct;
  editId: string | null;
  editCache: { [key: string]: any } = {};
  @ViewChild(NzColDirective, { read: ElementRef }) inputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }
  constructor(private message: NzMessageService,
    private modalService: NzModalService,
    private service: IdbookMaintainService) { }

  ngOnInit() {
  }

  add() {
    this.isVisible = true;
    this.clickProduct = this.formData.product;
  }

  handleCancel() {
    this.isVisible = false;
    this.uploading = false;
    this.name = '';
    this.yieldRate = null;
  }

  save(action) {
    this.uploading = true;
    if (action === '材料維護') {
      const param = {
        productId: this.clickProduct,
        desc: this.name,
        yieldRate: this.yieldRate,
      };
      this.service.addMaterial(param).subscribe(
        res => {
          this.message.create('success', 'Added successfully！');
          this.data.push(res);
          this.data = this.data.slice();
          this.handleCancel();
        },
        err => {
          this.message.create('error', 'Server Error！');
          this.uploading = false;
        });
    } else {
      const param = {
        productId: this.clickProduct,
        name: this.name,
        yieldRate: this.yieldRate,
      };
      this.service.addOperation(param).subscribe(
        res => {
          this.handleCancel();
          this.data.push(res);
          this.data = this.data.slice();
          this.message.create('success', 'Added successfully！');
        },
        err => {
          this.message.create('error', 'Server Error！');
          this.uploading = false;
        });
    }
  }


  // 刪除確認框
  showDeleteConfirm(data): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this record？',
      nzContent: '',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        if (this.formData.action === '材料維護') {
          this.service.deleteMaterial(data.id).subscribe(
            res => {
              this.message.create('success', 'Successfully deleted！');
              this.data = this.data.filter(function (item) {
                return item.id !== data.id;
              });
            },
            err => {
              this.message.create('error', 'Server Error！');
            });
        } else {
          this.service.deleteOperation(data.id).subscribe(
            res => {
              this.message.create('success', 'Successfully deleted！');
              this.data = this.data.filter(function (item) {
                return item.id !== data.id;
              });
            },
            err => {
              this.message.create('error', 'Server Error！');
            });
        }
      },
      nzCancelText: 'No'
    });
  }

  // 編輯良率
  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }
  saveYr(id) {
    // 點擊保存，將修改的數據以及id傳到數據庫
    const data = this.data.filter(d => d.id === id);
    if (this.formData.action === '材料維護') {
      this.service.getNewMaterial(data[0]).subscribe(res => {
        // 點擊保存時，收起編輯框
        this.editId = null;
        this.data = this.data.slice(); // 刷新
        this.message.create('success', 'Successfully modified！');
      });
    } else {
      this.service.getNewOperation(data[0]).subscribe(res => {
        // 點擊保存時，收起編輯框
        this.editId = null;
        this.data = this.data.slice();
        this.message.create('success', 'Successfully modified！');
      });
    }
  }
}
