import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CriterionService } from '../criterion.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-criterion-query',
  templateUrl: './criterion-query.component.html',
  styleUrls: ['./criterion-query.component.scss']
})
export class CriterionQueryComponent implements OnInit {
  isLoading = false;
  // form選擇后的參數
  form = {
    'product': '',
    'dimension': ''
  };
  // 控制Type選擇框是否能輸入
  dimensionFlag = true;
  @Output() queryForm = new EventEmitter<any>();
  @Output() modelFlag = new EventEmitter<any>();
  // 下拉框里的參數
  products = [];
  dimensions = [];

  constructor(
    private service: CriterionService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.getProduct();
    this.getdimension();
  }

  query() {
    if (this.form.product === '' || this.form.product === null) {
      this.message.create('error', 'Please select product！');
      return;
    } else if (this.form.dimension === '' || this.dimensions === null) {
      this.message.create('error', 'Please select type(2D/3D)！');
      return;
    }
    this.isLoading = true;
    setTimeout(_ => {
      this.isLoading = false;
      this.queryForm.emit(this.form);
      this.modelFlag.emit(true);
    }, 400);
  }

  getProduct() {
    this.service.getProduct().subscribe(res => this.products = res);
  }

  getdimension() {
    this.form.dimension = '';
    if (this.form.product === null || this.form.product === '') {
      this.dimensionFlag = true;
      return;
    }
    this.dimensionFlag = false;
    this.service.getdimension(this.form.product).subscribe(res => this.dimensions = res);
  }
}
