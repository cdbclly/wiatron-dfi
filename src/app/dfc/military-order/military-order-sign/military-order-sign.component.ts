import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DfcMilitaryOrderQueryStyle, DfcMilitaryOrderQuerySelect, ClsDfcMilitaryOrderQuery } from './military-order-sign';
import { MilitaryOrderSignService } from './military-order-sign.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap, map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-military-order-sign',
  templateUrl: './military-order-sign.component.html',
  styleUrls: ['./military-order-sign.component.scss']
})
export class MilitaryOrderSignComponent implements OnInit {

  @ViewChild('DFCMilitaryOrder') dfcMilitaryOrder: ElementRef;
  // 下拉框設定
  queryStyle = DfcMilitaryOrderQueryStyle;
  queryValue: ClsDfcMilitaryOrderQuery = { plant: '', bu: '', custom: '', modelType: '', signStatus: '', proCode: '', proName: '' };
  querySelect = DfcMilitaryOrderQuerySelect;
  queryClick = false; // 點擊查詢按鈕
  title;
  thisPage;
  thisPageHeight;
  modalWidth;
  queryLoading = false;
  transNotice = {};
  constructor(
    private militaryOrderSignService: MilitaryOrderSignService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private translate: TranslateService
  ) {
    // 初始化i18n;
    this.translate.get(['military-order.sign-status', 'mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product']).subscribe(res => {
      this.queryStyle.signStatus.label = res['military-order.sign-status'];
      this.queryStyle.plant.label = res['mrr.mrr-plant'];
      this.queryStyle.custom.label = res['mrr.mrr-customer'];
      this.queryStyle.modelType.label = res['mrr.mrr-product'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['military-order.sign-status', 'mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product']).subscribe(res => {
        this.queryStyle.signStatus.label = res['military-order.sign-status'];
        this.queryStyle.plant.label = res['mrr.mrr-plant'];
        this.queryStyle.custom.label = res['mrr.mrr-customer'];
        this.queryStyle.modelType.label = res['mrr.mrr-product'];
      });
    });
    this.route.params.subscribe(r => {
      this.thisPage = r['page'];
      this.queryClick = false;
      this.cleanQueryValue();
      if (this.thisPage === 'query') {
        this.queryStyle.signStatus.red = true;
        this.queryStyle.proName.red = false;
        this.title = '軍令狀查詢';
      } else {
        this.queryStyle.signStatus.red = false;
        this.queryStyle.proName.red = true;
        this.title = '軍令狀簽核';
      }
      // 对厂别自动带入本厂的标签
      this.queryValue.plant = localStorage.getItem('DFC_Plant');
    });
    this.route.queryParams.subscribe(params => {
      if (
        params['plant'] &&
        params['proCode'] &&
        params['proName']) {
        this.queryValue.plant = params['plant'];
        this.queryValue.proCode = params['proCode'];
        this.queryValue.proName = params['proName'];
        this.query();
      }
    });
  }

  ngOnInit() {
    this.querySelect.proCode.selectDisabled = true;
    this.thisPageHeight = (this.dfcMilitaryOrder.nativeElement.offsetHeight - 185) + 'px';
    this.modalWidth = this.dfcMilitaryOrder.nativeElement.offsetWidth - 250;
    this.initPlantSelect();
    this.initBUSelect();
    this.initCustomSelect();
    this.initModelTypeSelect();
    this.initProCodeSelect();
    this.initProNameSelect();
    this.route.queryParams.subscribe(params => {
      if (
        params['proName']) {
        this.queryValue.proName = params['proName'];
        this.query();
      }
    });
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.querySelect.plant.selectList = [];  // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.plant.selectList = data);
  }

  // 廠別下拉框改變
  changePlant() {
    this.queryValue.bu = '';
    this.queryValue.custom = '';
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.querySelect.bu.selectList = [];
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    if (!!this.queryValue.plant) {
      this.buSearch('');
      this.customSearch('');
      this.proNameSearch('');
    }
  }

  // 初始化 BU 下拉框
  initBUSelect() {
    this.querySelect.bu.selectList = [];
    const getBUList = (bu: string) => {
      if (!!this.queryValue.plant) {
        return this.militaryOrderSignService.getBUSelect(this.queryValue.plant, bu);
      }
    };
    const buList$: Observable<string[]> = this.querySelect.bu.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getBUList));
    buList$.subscribe(datas => {
      this.querySelect.bu.selectList = datas.filter(data => !!data);
      this.querySelect.bu.isLoading = false;
    });
  }

  buSearch(value: string): void {
    this.querySelect.bu.isLoading = true;
    this.querySelect.bu.searchChange$.next(value);
  }

  changeBU() {
    this.queryValue.custom = '';
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.customSearch('');
    this.proNameSearch('');
  }

  // 初始化 客戶 下拉框
  initCustomSelect() {
    this.querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!this.queryValue.plant) {
        return this.militaryOrderSignService.getCustomerSelect(custom, this.queryValue.plant, this.queryValue.bu);
      }
    };
    const customList$: Observable<string[]> = this.querySelect.custom.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));
    customList$.subscribe(datas => {
      this.querySelect.custom.selectList = datas.filter(data => !!data);
      this.querySelect.custom.isLoading = false;
    });
  }

  customSearch(value: string): void {
    this.querySelect.custom.isLoading = true;
    this.querySelect.custom.searchChange$.next(value);
  }

  // 客戶下拉框 值改變, 清空 ProjectCode, ProjectName的值
  changeCustomAndModelType() {
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.proNameSearch('');
  }

  // 初始化產品下拉框
  initModelTypeSelect() {
    this.querySelect.modelType.selectList = []; // 清空選擇框的值
    this.militaryOrderSignService.getModelType().then(datas => this.querySelect.modelType.selectList = datas);
  }

  // 初始化 ProjectName
  initProNameSelect() {
    this.querySelect.proName.selectList = []; // 清空選擇框的值
    const getProNameList = (proName: string) => {
      if (!!this.queryValue.plant) {
        return this.militaryOrderSignService.getProNameSelect(proName, this.queryValue);
      }
    };
    const proNameList$: Observable<string[]> = this.querySelect.proName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProNameList));
    proNameList$.subscribe(datas => {
      this.querySelect.proName.selectList = datas.filter(data => !!data);
      this.querySelect.proName.isLoading = false;
    });
  }

  proNameSearch(value: string): void {
    this.querySelect.proName.isLoading = true;
    this.querySelect.proName.searchChange$.next(value);
  }

  // ProjectCode下拉框 值改變, 清空ProjectName的值
  changeProName(value) {
    if (!value) {
      this.queryValue.proCode = null;
      return;
    }
    const projectCode = this.querySelect.proName.selectList.find(
      (item) => {
        if (item.Value === value) {
          return item;
        }
      });
    this.dfcCommonService.getProjectCodeProfile([projectCode.ProjectCodeID]).pipe(
      map(
        (projectCodeData: any) => {
          projectCodeData = projectCodeData.map(
            (item) => {
              item.Value = item.ProjectCodeID;
              item.Label = item.ProjectCode;
              return item;
            }
          );
          this.queryValue.proCode = projectCodeData[0].ProjectCodeID;
          this.querySelect.proCode.selectList = projectCodeData;
        }
      )).subscribe();
  }

  // 初始化 ProjectCode
  initProCodeSelect() {
    this.querySelect.proCode.selectList = []; // 清空選擇框的值
    const getProCodeList = (proCode: string) => {
      if (!!this.queryValue.plant) {
        return this.militaryOrderSignService.getProCodeSelect(proCode, this.queryValue);
      }
    };
    const proCodeList$: Observable<string[]> = this.querySelect.proCode.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProCodeList));
    proCodeList$.subscribe(datas => {
      this.querySelect.proCode.selectList = datas.filter(data => !!data);
      this.querySelect.proCode.isLoading = false;
    });
  }

  // 清除选择框中的值
  cleanQueryValue() {
    this.queryValue = { plant: '', bu: '', custom: '', modelType: '', signStatus: '', proCode: '', proName: '' };
  }

  query() {
    if (this.thisPage === 'sign' && !this.queryValue.proName) {
      this.message.create('error', 'Please select the projectName you need to query！');
      return;
    }
    if (this.thisPage === 'query' && !this.queryValue.plant) {
      this.message.create('error', 'Please select the plant you need to query！');
      return;
    }
    this.queryClick = true;
    this.queryLoading = true;
    if (this.thisPage === 'query') {
      this.militaryOrderSignService.queryTabel(this.queryValue).then(data => {
        this.militaryOrderSignService.queryTablePush(data);
        this.queryLoading = false;
      });
    } else if (this.thisPage === 'sign') {
      this.militaryOrderSignService.querySign(this.queryValue).then(data => {
        this.militaryOrderSignService.querySignPush(data);
        this.queryLoading = false;
      });
    }
  }
}
