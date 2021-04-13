import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { StandartOperationSignService } from './standart-operation-sign.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-standart-operation-sign',
  templateUrl: './standart-operation-sign.component.html',
  styleUrls: ['./standart-operation-sign.component.scss']
})
export class StandartOperationSignComponent implements OnInit, OnDestroy {

  @ViewChild('DFCStandardSign') dfcStandardSign: ElementRef;
  senderID;
  signID;
  formNo;
  page = 0;
  // 下拉框選項
  queryStyle: {
    modelType: ClsDfcQueryStyle,
    process: ClsDfcQueryStyle,
    signStatus: ClsDfcQueryStyle,
    searchUser: ClsDfcQueryStyle
  } = {
      modelType: {
        type: 'select',
        style: { width: '80px', margin: '10px 0 0 0' },
        red: true,
        label: '產品',
        selectType: 'simple'
      },
      process: {
        type: 'select',
        style: { width: '150px', margin: '10px 0 0 0' },
        red: true,
        label: '製程',
        selectType: 'simple'
      },
      signStatus: {
        type: 'select',
        style: { width: '100px', margin: '10px 0 0 0' },
        red: false,
        label: '簽核狀況',
        selectType: 'simple'
      },
      searchUser: {
        type: 'select',
        style: { width: '280px', margin: '10px 0 0 0' },
        red: false,
        label: '簽核人員',
        selectType: 'search'
      }
    };

  querySelect: {
    modelType: ClsDfcQuerySelect,
    process: ClsDfcQuerySelect,
    signStatus: ClsDfcQuerySelect,
    searchUser: ClsDfcQuerySelect
  } = {
      modelType: {
        selectList: []
      },
      process: {
        selectList: []
      },
      signStatus: {
        selectList: [
          { Value: '', Label: 'All' },
          { Value: '0', Label: '簽核中' },
          { Value: '1', Label: '已簽核' },
          { Value: '2', Label: '被駁回' }
        ]
      },
      searchUser: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };
  queryValue = { modelType: '', process: '', signStatus: '', searchUser: '' };

  // 表格相關信息
  dataSet;
  nzWidthConfig = ['80px', '80px', '100px', '100px', '80px', '150px', '100px'];
  nzScroll = { x: '690px', y: '0' };

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['StandardOperationSign']; // 页面上的用户权限
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private standartOperationSignService: StandartOperationSignService,
    private dfcSelectService: DfcSelectNewService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['mrr.nudd-process', 'dfq.dfq-product', 'dfq.dfq-sing-status', 'dfq.dfq-signer']).subscribe(res => {
      this.queryStyle.process.label = res['mrr.nudd-process'];
      this.queryStyle.modelType.label = res['dfq.dfq-product'];
      this.queryStyle.signStatus.label = res['dfq.dfq-sing-status'];
      this.queryStyle.searchUser.label = res['dfq.dfq-signer'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['mrr.nudd-process', 'dfq.dfq-product', 'dfq.dfq-sing-status', 'dfq.dfq-signer']).subscribe(res => {
        this.queryStyle.process.label = res['mrr.nudd-process'];
        this.queryStyle.modelType.label = res['dfq.dfq-product'];
        this.queryStyle.signStatus.label = res['dfq.dfq-sing-status'];
        this.queryStyle.searchUser.label = res['dfq.dfq-signer'];
      });
    });
    this.nzScroll = { x: '690px', y: (this.dfcStandardSign.nativeElement.offsetHeight - 185) + 'px' };
    this.initModelTypeSelect();
    this.initProcessSelect();
    this.initUserSelect();
    this.route.queryParams.subscribe(params => {
      if (params['signID'] && params['formID']) {
        this.onClickNo(params['senderID'], Number(params['signID']), Number(params['formID']));
        this.queryValue.searchUser = localStorage.getItem('$DFI$userID');
        this.dfcSelectService.getMember(localStorage.getItem('$DFI$userID')).subscribe(datas => {
          this.querySelect.searchUser.selectList.push(...datas);
        });
      }
    });
  }

  // 初始化產品下拉框
  initModelTypeSelect() {
    this.querySelect.modelType.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.querySelect.modelType.selectList = datas;
      this.querySelect.modelType.selectList.splice(0, 0, { Value: '', Label: 'All' });
    });
  }

  // 初始化製程下拉框
  initProcessSelect() {
    this.querySelect.process.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProcess().subscribe(datas => {
      this.querySelect.process.selectList = datas;
      this.querySelect.process.selectList.splice(0, 0, { Value: '', Label: 'All' });
    });
  }

  // 初始化簽核人員搜索下拉框
  initUserSelect() {
    // 搜索相關查詢
    const searchUserList = (name?) => {
      return of(name);
    };
    const searchUserList$: Observable<string[]> = this.querySelect.searchUser.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(searchUserList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchUserList$.subscribe(datas => {
      this.searchUserSelect(datas); // 改變Plant的值
    });
  }

  searchUserSelect(name?) {
    this.dfcSelectService.getMember(name).subscribe(data => this.querySelect.searchUser.selectList = data);
  }

  query() {
    this.standartOperationSignService.query(this.queryValue).then(datas => this.dataSet = datas);
  }

  // 表單號點擊事件
  onClickNo(senderID, signID, formNo) {
    this.senderID = senderID;
    this.signID = signID;
    this.formNo = formNo;
    this.page = 1;
  }

  pageroute(event) {
    this.page = event;
    this.query();
  }

  // 撤回簽核
  revoke(signID) {
    this.standartOperationSignService.revoke(signID).subscribe(data => {
      this.query();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
