import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PictureUploadService } from '../picture-upload.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-picture-upload-query',
  templateUrl: './picture-upload-query.component.html',
  styleUrls: ['./picture-upload-query.component.scss']
})
export class PictureUploadQueryComponent implements OnInit {
  isLoading = false;
  form = {
    'product': null,
    'dimension': null,
    'processType': null
  };
  dimensionId;
  processTypeId;
  products = [];
  dimensions = [];
  processTypes = [];
  @Output() processType = new EventEmitter<any>();
  @Output() queryFlag = new EventEmitter<any>();
  constructor(private service: PictureUploadService, private message: NzMessageService) { }

  ngOnInit() {
    this.getdimension();
  }

  query() {
    if (this.dimensionId === null || this.processTypeId === null) {
      this.message.create('error', 'Please enter parameters！');
      return;
    }
    this.isLoading = true;
    this.processType.emit(this.processTypeId);
    this.queryFlag.emit(true);
    setTimeout(_ => {
      this.isLoading = false;
    }, 400);
  }

  getProduct() {
    this.service.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  getdimension() {
    this.dimensionId = null;
    this.service.getdimension().subscribe(res => {
      this.dimensions = res;
    });
  }

  getProcessType() {
    this.processTypeId = null;
    this.service.getProcessType(this.dimensionId).subscribe(res => {
      this.processTypes = res;
    });
  }
}
