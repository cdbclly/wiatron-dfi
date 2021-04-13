import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { LlUploadService } from '../ll-upload.service';

@Component({
  selector: 'app-ll-upload-query',
  templateUrl: './ll-upload-query.component.html',
  styleUrls: ['./ll-upload-query.component.scss']
})
export class LlUploadQueryComponent implements OnInit {
  // Query加載狀態
  isLoading = false;
  // 參數
  form = {
    'product': '',
    'dimension': '',
    'processType': '',
    // 請求參數
    'designItem': ''
  };
  // 下拉框選項
  products = [];
  dimensions = [];
  processTypes = [];
  designItems = [];
  // 參數
  @Output() formData = new EventEmitter<any>();
  constructor(private service: LlUploadService, private message: NzMessageService) { }

  ngOnInit() {
    this.getProduct();
  }

  query() {
    if (this.form.product === '' || this.form.product === null) {
      this.message.create('error', 'Please select product！');
      return;
    } else if (this.form.dimension === '' || this.dimensions === null) {
      this.message.create('error', 'Please select type(2D/3D)！');
      return;
    } else if (this.form.processType === '' || this.form.processType === null) {
      this.message.create('error', 'Please select processType');
      return;
    } else if (this.form.designItem === '' || this.form.designItem === null) {
      this.message.create('error', 'Please select item！');
      return;
    }
    this.isLoading = true;
    this.formData.emit(this.form);
    setTimeout(_ => {
      this.isLoading = false;
    }, 200);
  }
  getProduct() {
    this.service.getProduct().subscribe(res => this.products = res);
  }

  getdimension(data) {
    this.form.designItem = '';
    this.form.processType = '';
    this.form.dimension = '';
    this.dimensions = [];
    this.processTypes = [];
    this.designItems = [];
    this.service.getdimension(data).subscribe(res => this.dimensions = res);
  }

  getProcessType(id) {
    this.form.designItem = '';
    this.form.processType = '';
    this.processTypes = [];
    this.designItems = [];
    this.service.getProcessType(id).subscribe(res => { this.processTypes = res; });
  }

  getDesignItems(id) {
    this.form.designItem = '';
    this.designItems = [];
    this.service.getDesignById(id).subscribe(res => { this.designItems = res; });
  }
}
