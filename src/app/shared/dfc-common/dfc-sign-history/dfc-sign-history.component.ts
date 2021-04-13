import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from '../dfc-query-input/dfc-query-input.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { DfcSignHistoryService } from './dfc-sign-history.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-dfc-sign-history',
  templateUrl: './dfc-sign-history.component.html',
  styleUrls: ['./dfc-sign-history.component.scss']
})
export class DfcSignHistoryComponent implements OnInit, OnChanges {
  @Input() dfcSignData: {
    signID: any,
    formNo: any,
    signData?: any,
    signCode?: any
  };
  @Input() tableHeight;
  @Input() dfcSignHitoryParam: DfcSignHitoryParam;
  @Output() approveClick = new EventEmitter();
  @Output() down = new EventEmitter();

  // Comment
  comment: {
    style: ClsDfcQueryStyle,
    value: string
  } = {
      style: {
        type: 'input',
        style: { width: '100%' },
        red: false,
        label: 'Comment',
      },
      value: ''
    };

  // 邀簽
  addSignParam: {
    popVisible: boolean,
    select: {
      style: ClsDfcQueryStyle,
      value: string,
      list: ClsDfcQuerySelect
    }
  } = {
      popVisible: false,
      select: {
        style: {
          type: 'select',
          style: { width: '100%' },
          red: false,
          label: 'Member',
          selectType: 'search'
        },
        value: '',
        list: {
          selectList: [],
          searchChange$: new BehaviorSubject('')
        }
      }
    };

  // 表格中的數據
  dataSet = [];
  nzScroll = { x: '100%', y: '' };
  nzWidthConfig = ['16%', '7%', '11%', '10%', '16%', '16%', '14%', '10%'];
  currentID: any;
  status: any;
  currentIDs: any[];
  currentSignID; // 記錄當前查詢人的SignID, 用於 多張表單 如軍令狀 的時候 approve找到對應的 signID

  constructor(
    private dfcSignHistoryService: DfcSignHistoryService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dfcSignData'] && changes['dfcSignData'].currentValue) {
      this.nzScroll = { x: '100%', y: this.tableHeight };
      this.query();
      this.querySign();
    }
  }

  // 第一步查詢
  query() {
    this.dfcSignHistoryService.query(this.dfcSignData.signID).then(datas => {
      if ((typeof this.dfcSignData.signID) === 'number') {
        this.currentIDs = [datas['current']];
        this.status = datas['status'];
      } else {
        this.currentIDs = [];
        this.status = [];
        datas.forEach(data => {
          this.currentIDs.push(data['current']);
          this.status.push(data['status']);
        });
        this.currentIDs = this.currentIDs.filter(data => !!data);
      }
      this.queryApproveFlag();
    });
  }

  // 查詢當前人是否有 權限approve
  queryApproveFlag() {
    if (this.currentIDs.length < 1) {
      this.dfcSignHitoryParam.approveFlag = false;
      return;
    }
    this.dfcSignHistoryService.queryApproveFlag(this.currentIDs, this.status, localStorage.getItem('$DFI$userID')).then(data => {
      this.dfcSignHitoryParam.approveFlag = data['flag'];
      this.currentSignID = data['signID'];
      this.currentID = data['currentID'];
    });
  }

  // 查詢Approve History
  async querySign() {
    let signIDs;
    if ((typeof this.dfcSignData.signID) === 'number') {
      signIDs = [this.dfcSignData.signID];
    } else {
      signIDs = this.dfcSignData.signID;
    }
    this.dfcSignHistoryService.querySign(signIDs, this.dfcSignData.formNo, this.dfcSignData.signCode).then(data => {
      this.dfcSignHitoryParam.dataSet = data;
    });
  }

  // 簽核
  approve(flag) {
    if (!flag && !this.comment.value) {
      this.message.create('error', 'Please fill in the comment！');
      return;
    }
    this.dfcSignHistoryService.approve(this.currentSignID, this.currentID, flag, this.comment.value).then(async (data) => {
      if (data['msg'] === 'success') {
        this.query();
        this.querySign();
        this.message.create('success', 'Sign-off successful！');
        this.approveClick.emit({ 'msg': 'success', 'data': data['data'] });
      } else {
        this.message.create('error', 'Sign-off failed！');
        this.approveClick.emit({ 'msg': 'fail', 'data': data['data'] });
      }
    }).catch(error => {
      this.message.create('error', 'Sign-off failed！');
      this.approveClick.emit({ 'msg': 'fail', 'data': error });
    });
  }

  // 邀簽 -- 點擊事件
  addSignClick() {
    this.addSignParam.popVisible = true;
    const getMemberList = (name: string) => {
      return this.dfcSignHistoryService.getAddSignMember(name);
    };
    const addMemberList$: Observable<string[]> = this.addSignParam.select.list.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getMemberList));
    addMemberList$.subscribe(data => {
      this.addSignParam.select.list.selectList = data;
      this.addSignParam.select.list.isLoading = false;
    });
  }

  addSignMemberSearch(value: string): void {
    this.addSignParam.select.list.isLoading = true;
    this.addSignParam.select.list.searchChange$.next(value);
  }

  addSign(status) {
    if (!this.addSignParam.select.value) {
      this.message.create('error', 'Please select the person invited to sign！');
    }
    this.dfcSignHistoryService.addSignMember(status, this.currentSignID, this.addSignParam.select.value).then(data => {
      if (data['res'] === 'success') {
        this.message.create('success', 'Invitation to sign successfully！');
        this.query();
        this.querySign();
        this.addSignCancel();
      } else {
        this.message.create('error', 'Invitation to sign failed！');
      }
    });
  }

  addSignCancel() {
    this.addSignParam.popVisible = false;
    this.addSignParam.select.value = '';
  }

  // download
  download() {
    this.down.emit(true);
  }
}
export class DfcSignHitoryParam {
  approveFlag: boolean; // 簽核人權限, 控制 是否可以顯示 Approve一欄
  btnApproveFlag: boolean; // 同意簽核 按鈕
  btnRejectFlag: boolean; // 不同意簽核 按鈕
  btnAddSignFlag: boolean; // 邀簽功能 按鈕
  btnDownloadFlag: boolean; // 下載按鈕
  dataSet: {}[]; // 表格中的數據
  btnBeforeAddSignFlag: boolean; // 前置邀簽 按鈕
  btnAfterAddSignFlag: boolean; // 後置邀簽 按鈕

  constructor() {
    this.approveFlag = false;
    this.btnApproveFlag = true;
    this.btnRejectFlag = true;
    this.btnAddSignFlag = false;
    this.btnDownloadFlag = false;
    this.btnBeforeAddSignFlag = false;
    this.btnAfterAddSignFlag = false;
    this.dataSet = [];
  }
}
