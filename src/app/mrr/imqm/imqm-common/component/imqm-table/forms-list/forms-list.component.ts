import { map } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { AbnormalApi, TraceBackApi, EarlyWarningApi } from '@service/imqm-sdk';
import { DatePipe } from '@angular/common';
import { FormsListService } from './forms-list.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit, OnChanges {

  @Input() seriesTotalData;
  @Input() isEdit;
  tableData;
  @Output() subTableDetail = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();
  @Output() rejectForm = new EventEmitter<any>();
  tableW = ['60px', '150px', '60px'];
  rawData;
  isActive = true;
  constructor(private abnormalService: AbnormalApi,
    private traceBackService: TraceBackApi,
    private earlyService: EarlyWarningApi,
    private _service: FormsListService,
    private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['seriesTotalData']);
    if (changes['seriesTotalData'].firstChange === false) {
      console.log(changes['seriesTotalData'], changes['seriesTotalData'].currentValue, changes['seriesTotalData']['currentValue']);
      this.tableData = changes['seriesTotalData'].currentValue;
      // debugger;
      console.log(this.tableData);
    }
  }

  ngOnInit() {
    if (this.seriesTotalData) {
      this.tableData = this.seriesTotalData;
    }
  }

  showTrdTable(item) {
    // this.rawData = JSON.parse(item['rawData']);
    // if (item['objName'] === 'abnormal') {
    //   const rawData = this.abnormalService.get(item['number']).subscribe(res => {

    //   });
    // }
    if (item['objName'] === 'traceBack') {
      item['type'] = 'trace';
    }
    console.log(item);
    this.subTableDetail.emit(item);
  }

  async showDetail(item) {
    // 检查权限
    const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'));
    if (item['objName'] === 'abnormal') {
      this._service.getAbnormalRawData(item['number']).subscribe(result => {
        const res = result['rawData'];
        item['rawData'] = JSON.parse(res[0]['rawData']);
        item['shift'] = res[0]['shift'];
        item['cpkResult'] = res[0]['cpkResult'];
        item['spcResult'] = res[0]['spcResult'];
        item['machineID'] = res[0]['machineID'];
        item['rawData']['yieldRate'] = item['rawData']['yieldRate'] ? item['rawData']['yieldRate'] * 100 + '%' : '';
        item['measureslist'] = [];
        item['measureslist'].push(res[0]['countermeasures'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        item['reasonlist'] = [];
        item['reasonlist'].push(res[0]['reason'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        // item = res[0];
        // debugger;
        console.log(item);
      });
    }
    if (item['objName'] === 'earlyWarn') {
      const res = await this._service.getEarlyWarnRawData(item['number']);
        // debugger;
        item['rawData'] = JSON.parse(res[0]['rawData']);
        item['shift'] = res[0]['shift'];
        item['cpkResult'] = res[0]['cpkResult'];
        item['spcResult'] = res[0]['spcResult'];
        item['machineID'] = res[0]['machineID'];
        item['rawData']['yieldRate'] = item['rawData']['yieldRate'] ? item['rawData']['yieldRate'] * 100 + '%' : '';
        item['measureslist'] = [];
        item['measureslist'].push(res[0]['countermeasures'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        item['reasonlist'] = [];
        item['reasonlist'].push(res[0]['reason'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        // item = res[0];
        console.log(item);
    }
    if (item['objName'] === 'traceBack') {
      // debugger;
      this._service.getTraceBackRawData(item['number']).subscribe(result => {
        const res = result['rawData'];
        item['rawData'] = JSON.parse(res[0]['rawData']);
        item['shift'] = res[0]['shift'];
        item['cpkResult'] = res[0]['cpkResult'];
        item['spcResult'] = res[0]['spcResult'];
        item['machineID'] = res[0]['machineID'];
        item['rawData']['yieldRate'] = item['rawData']['yieldRate'] ? item['rawData']['yieldRate'] * 100 + '%' : '';
        item['reasonlist'] = [];
        item['measureslist'] = [];
        // 新增三个数据
        item['reasonRemark'] = res[0]['reasonRemark'];
        item['reasonCode'] = res[0]['reasonCode'];
        item['ReasonDesc'] = res[0]['ReasonDesc'];
        item['flag'] = res[0]['flag'];
        // 獲取原因對策
        this._service.getTraceReplayList(item['number']).subscribe(reply => {
          reply.forEach(mp => {
            item['measureslist'].push(mp['countermeasures'] + '--' + (mp['updateTime'] !== null ? this.datePipe.transform(mp['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
            item['reasonlist'].push(mp['reason'] + '--' + (mp['updateTime'] !== null ? this.datePipe.transform(mp['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
          });
        });
        // debugger
        console.log('点击第二层列表中的+弹出的第三层数据====\n', item);
      });
    }
    if (item['objName'] === 'fakeData') {
      this._service.getFakeDataRawData(item['number']).subscribe(result => {
        const res = result['rawData'];
        item['rawData'] = JSON.parse(res[0]['rawData']);
        item['shift'] = res[0]['shift'];
        item['cpkResult'] = res[0]['cpkResult'];
        item['spcResult'] = res[0]['spcResult'];
        item['machineID'] = res[0]['machineID'];
        item['rawData']['yieldRate'] = item['rawData']['yieldRate'] ? item['rawData']['yieldRate'] * 100 + '%' : '';
        item['measureslist'] = [];
        item['measureslist'].push(res[0]['countermeasures'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        item['reasonlist'] = [];
        item['reasonlist'].push(res[0]['reason'] + '--' + (res[0]['updateTime'] ? this.datePipe.transform(res[0]['updateTime'], 'yyyy-MM-dd HH:mm') : 'NA'));
        // item = res[0];
        // debugger;
        console.log(item);
      });
    }
    this.isActive = roles['23']['edit'];
      console.log(this.isActive);
    // this.subTableDetail.emit(item);
  }

  close(formId, type) {
    console.log(formId);
    this.closeForm.emit({formId: formId, type: type});
  }

  reject(formId, type) {
    this.rejectForm.emit({formId: formId, type: type});
  }

}
