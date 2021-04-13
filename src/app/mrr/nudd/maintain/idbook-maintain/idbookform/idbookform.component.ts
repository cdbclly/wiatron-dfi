import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CriterionService } from '../../criterion-maintain/criterion.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-idbookform',
  templateUrl: './idbookform.component.html',
  styleUrls: ['./idbookform.component.scss']
})
export class IdbookformComponent implements OnInit {

  isLoading = false;
  product;
  action;
  flag = true;
  @Output() queryForm = new EventEmitter<any>();
  products = [];
  actions = ['Mapping', '工藝維護', '材料維護', '製程維護'];

  constructor(private service: CriterionService, private message: NzMessageService) { }

  ngOnInit() {
    this.getProduct();
  }

  query() {
    if (!this.product) {
      this.message.create('error', 'Please select product！');
      return;
    } else if (!this.action) {
      this.message.create('error', 'Please select Action！');
      return;
    }
    const form = {
      'product': this.product,
      'action': this.action
    };
    this.isLoading = true;
    setTimeout(_ => {
      this.isLoading = false;
      this.queryForm.emit(form);
    }, 100);
  }

  getProduct() {
    this.service.getProduct().subscribe(res => this.products = res);
  }

}
