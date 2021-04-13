import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DfcSignHitoryParam } from 'app/shared/dfc-common';
import { StandartOperationSignService } from '../standart-operation-sign.service';

@Component({
  selector: 'app-standart-operation-sign-detail',
  templateUrl: './standart-operation-sign-detail.component.html',
  styleUrls: ['./standart-operation-sign-detail.component.scss']
})
export class StandartOperationSignDetailComponent implements OnInit, OnChanges {
  @ViewChild('DFCStandardSignDetail') dfcStandardSignDetail: ElementRef;
  @Output() pageroute = new EventEmitter();
  @Input() signID;
  @Input() formNo;
  @Input() senderID;
  // 傳給簽核共用component的參數
  signData: {
    signID: any,
    formNo: any,
    signData: any
  };
  dfcSignHitoryParam = new DfcSignHitoryParam();
  tableHeight;

  // 本頁自定義使用
  applicationData = { deptCode: '', deptName: '', applicant: '', applyDate: '' };
  revokeFlag = false;
  dataSet = [];
  nzWidthConfig;
  nzScroll;
  routeParam;

  constructor(
    private standartOperationSignService: StandartOperationSignService
  ) { }

  ngOnInit() {
    this.tableHeight = (this.dfcStandardSignDetail.nativeElement.offsetHeight - 185) + 'px';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['signID'] && changes['signID'].currentValue) {
      this.dfcSignHitoryParam.btnAddSignFlag = true;
      this.dfcSignHitoryParam.btnBeforeAddSignFlag = true;
      this.signData = {
        signID: this.signID,
        formNo: this.formNo,
        signData: []
      };
      this.query(this.senderID, this.signID, this.formNo);
    }
  }

  query(senderID, signID, formNo) {
    this.standartOperationSignService.queryDetail(senderID, signID, formNo).then(datas => {
      this.applicationData = datas['applicationData'];
      this.dataSet = datas['dataSet'];
      this.revokeFlag = datas['revokeFlag'];
    });
  }

  approveClick(data) {
    if (data['msg'] === 'success') {
      this.query(this.senderID, this.signID, this.formNo);
      if (!data['data']['current']) {
        this.standartOperationSignService.ApplyChange(data['data']['id']);
      }
    }
  }

  click() {
    const page = 0;
    this.pageroute.emit(page);
  }

  revoke() {
    this.standartOperationSignService.revoke(this.signID).subscribe(data => {
      this.revokeFlag = false;
    });
  }
}
