import { CloseRateAutoTrackServiceService } from './../../../../pages/manage-board/pages/close-rate-auto-track/close-rate-auto-track-service.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolkitService } from '../../../service';

@Component({
  selector: 'app-pop-ng',
  templateUrl: './pop-ng.component.html',
  styleUrls: ['./pop-ng.component.scss']
})
export class PopNgComponent implements OnInit, OnChanges {

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
  cancelOKSub = false;
  footerSub = null;
  constructor(private route: ActivatedRoute, private toolService: ToolkitService, private _service: CloseRateAutoTrackServiceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].firstChange) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.buildTable(changes['data'].currentValue);
    }
  }

  ngOnInit() {
  }

  buildTable(rawTableData) {
    console.log(rawTableData);
    /*this.tableData =  this.route.snapshot.data['injectResolve']['alertSubDetail'];
    this.tableData.forEach(item => {
      item['status'] = rawTableData['seriesName'];
    });*/
    this.tableData = rawTableData;
    console.log(this.tableData);
  }

  showSubFormTable(formItem) {
    this.dateItem.emit(formItem);
    // 跳轉至結案追蹤頁面
    // this.isVisibleSub = true;
    // this.subDetailFormListData = this.route.snapshot.data['injectResolve']['alertTrdDetail'];
    // // 獲取該層彈框最大size，deformat, outlook. 這裡默認第一筆就是。後面接資料了再filter做判斷
    // const subDetailFormMaxSize = this.subDetailFormListData[0]['sizeDetails'];
    // const subDetailFormMaxDeformat = this.subDetailFormListData[0]['deformationDetail'];
    // const subDetailFormMaxOutlook = this.subDetailFormListData[0]['outLookDetail'];

    // const originWidth = ['80px', '150px', '80px'];
    // this.maxHeadWidth = [
    //   {
    //     len: this.subDetailFormListData[0]['maxSizeLen'],
    //     somePx: '50px'
    //   },
    //   {
    //     len: this.subDetailFormListData[0]['maxOutlookLen'],
    //     somePx: '50px'
    //   },
    //   {
    //     len: this.subDetailFormListData[0]['maxDeformate'],
    //     somePx: '50px'
    //   }
    // ];
    // this.subDetailFormHeadWidth = this.toolService.assembleHeadWidth(originWidth, this.maxHeadWidth);
    // console.log(this.subDetailFormHeadWidth);
    // this.subDetailFormMaxHead = {
    //   'maxSize': subDetailFormMaxSize,
    //   'maxDeformat': subDetailFormMaxDeformat,
    //   'maxOutlook': subDetailFormMaxOutlook
    // };
    // this.formItem = {
    //   'formId': formItem['formId'],
    //   'status': formItem['status'],
    //   'factoryName': formItem['factoryName'],
    //   'machine': '002',
    //   'model': 'Bandon',
    //   'name': 'U-case',
    //   'SN': '4601234567',
    //   'shiftDate': '2019-06-05'
    // };
    // console.log(this.subDetailFormMaxHead, formItem);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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
        // console.log(res, this.allFormsList);
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



  // handleOkSub(): void {
  //   this.isVisibleSub = false;
  // }

  // handleCancelSub(): void {
  //   this.isVisibleSub = false;
  // }

}
