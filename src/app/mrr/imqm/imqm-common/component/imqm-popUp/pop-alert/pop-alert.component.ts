import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CloseRateAutoTrackServiceService } from './../../../../pages/manage-board/pages/close-rate-auto-track/close-rate-auto-track-service.service';
import { ActivatedRoute } from '@angular/router';
import { ToolkitService } from '../../../service';

@Component({
  selector: 'app-pop-alert',
  templateUrl: './pop-alert.component.html',
  styleUrls: ['./pop-alert.component.scss']
})
export class PopAlertComponent implements OnInit, OnChanges {

  @Input() data;
  @Output() dateItem = new EventEmitter<any>();
  formItem;
  maxHeadWidth;
  subDetailFormHeadWidth;
  subDetailFormMaxHead;
  subDetailFormListData;
  tableData;
  isVisible = false;
  // isVisibleSub = false;
  footer = null;
  cancelOK = false;
  // cancelOKSub = false;
  // footerSub = null;
  constructor(private route: ActivatedRoute,
    private toolService: ToolkitService,
    private _service: CloseRateAutoTrackServiceService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].firstChange) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      console.log(changes['data'].currentValue);
      this.buildTable(changes['data'].currentValue);
    }
  }

  ngOnInit() {
  }

  buildTable(rawTableData) {
    // this.tableData =  this.route.snapshot.data['injectResolve']['alertSubDetail'];
    this.tableData = rawTableData;
  }

  showSubFormTable(formItem) {
    console.log('发送到上一界面的数据 formItem \n', formItem);
    // 子组件通过 eventemit 主动向父组件广播数据；dateItem 变量在父组件abnormalboard.html即可找到
    this.dateItem.emit(formItem);
  }

  closeForm(detail) {
    if (detail['type'] === 'abnormal') {
      this._service.closeAbnormalForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'earlyWarn') {
      this._service.closeEarlyWarnForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'traceBack') {
      this._service.closeTraceBackForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
      });
    }
  }

  rejectForm(detail) {
    if (detail['type'] === 'abnormal') {
      this._service.rejectAbnormalForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'earlyWarn') {
      this._service.rejectEarlyWarnForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'traceBack') {
      this._service.rejectTraceBackForm(detail['formId']).subscribe(res => {
        this.tableData.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
      });
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // handleOkSub(): void {
  //   this.isVisibleSub = false;
  // }

  // handleCancelSub(): void {
  //   this.isVisibleSub = false;
  // }

}
