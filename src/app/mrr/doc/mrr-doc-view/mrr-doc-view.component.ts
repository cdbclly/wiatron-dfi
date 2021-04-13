import {
  Component,
  OnInit
} from '@angular/core';
import {
  of,
  Observable,
  Subject
} from 'rxjs';
import {
  debounceTime,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  MrrDocSelectService
} from '../mrr-doc-select.service';
import {
  MrrDocViewQuery
} from './mrr-doc-view';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  ProductDocument
} from '@service/mrr-sdk/models/ProductDocument';
import {
  NewModelDocumentApi
} from '@service/mrr-sdk/services/custom/NewModelDocument';
import {
  ActivatedRoute
} from '@angular/router';
import {
  MrrDocViewService
} from './mrr-doc-view.service';
import { DownexcelService } from '@service/downexcel.service';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-mrr-doc-view',
  templateUrl: './mrr-doc-view.component.html',
  styleUrls: ['./mrr-doc-view.component.scss']
})

export class MrrDocViewComponent implements OnInit {
  // bom料號的鍋爐值
  bomFilter1 = '';
  bomFilter2 = '';
  canReadIDbook = false;
  downloadPath = DFILoopBackConfig.getPath().toString() + '/api/Containers/mrrDoc/download/';
  localStorage = localStorage;
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  selectedIndex = 0;
  querySelect = {
    ...MrrDocViewQuery
  }; // 下拉框選項
  searchInput; // 搜索料號 輸入框
  tableFlag = false; // 表格顯示標誌
  dataSet: ProductDocument[];
  // BOM文件
  showBOM2 = false;
  bomLoading = false;
  paging = true;
  bomList = {
    isVisible: false,
    width: '60vw',
    dataSet: [],
    dataSet2: []
  };
  nzScroll = { y: '400px' };
  projectName; // 幾種名稱
  editByPass = false;
  routeFlag = false;
  constructor(
    private mrrDocSelectService: MrrDocSelectService,
    private mrrDocViewService: MrrDocViewService,
    private message: NzMessageService,
    private newModelDocumentApi: NewModelDocumentApi,
    private route: ActivatedRoute,
    private downExcelService: DownexcelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer']).subscribe(res => {
      this.querySelect.site.style.label = res['mrr.mrr-site'];
      this.querySelect.plant.style.label = res['mrr.mrr-plant'];
      this.querySelect.productType.style.label = res['mrr.mrr-product'];
      this.querySelect.custom.style.label = res['mrr.mrr-customer'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer']).subscribe(res => {
        this.querySelect.site.style.label = res['mrr.mrr-site'];
        this.querySelect.plant.style.label = res['mrr.mrr-plant'];
        this.querySelect.productType.style.label = res['mrr.mrr-product'];
        this.querySelect.custom.style.label = res['mrr.mrr-customer'];
      });
    });
    this.canReadIDbook = (localStorage.getItem('$DFI$userRole').toLocaleUpperCase() === 'SQM'
      || localStorage.getItem('$DFI$userRole').toLocaleUpperCase() === 'CMF'
      || localStorage.getItem('$DFI$userRole').toLocaleUpperCase() === 'SQM LEADER');
    this.initSelect();
    this.route.queryParamMap.subscribe(params => {
      if (JSON.stringify(params['params']) === '{}' || !params['params']) {
        return;
      }
      this.routeFlag = true;
      this.mrrDocViewService.routeProNameInfo('productDocument', params['params']['plant'], params['params']['proName']).subscribe(async data => {
        this.querySelect.site.value = data.site;
        this.querySelect.plant.value = params['params']['plant'];
        this.querySelect.productType.value = data.productType;
        this.querySelect.custom.value = data.customer;
        this.querySelect.proName.value = params['params']['proName'];
        await this.productTypeSelect(params['params']['plant']);
        await this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, data.customer); // 改變 客戶別 的值
        await this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, '', params['params']['proName']); // 改變Plant的值
        this.query();
      });
    });
  }

  initSelect() {
    this.initSiteSelect();
    this.initPlantSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.productTypeSelect();
    this.initProCodeSelect();
    this.initProNameSelect();
  }

  // site下拉框選擇
  initSiteSelect() {
    this.mrrDocSelectService.getSite().subscribe(data => this.querySelect.site.select.selectList = data);
    // 監聽下拉框的值改變
    const changeSiteList = (site?) => {
      return of(site);
    };
    const siteList$: Observable<string[]> = this.querySelect.site.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeSiteList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    siteList$.subscribe(datas => {
      this.plantSelect(datas); // 改變Plant的值
      if (!this.routeFlag) {
        this.querySelect.plant.value = '';
        this.querySelect.productType.value = '';
        this.querySelect.custom.value = '';
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const plantList$: Observable<string[]> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    plantList$.subscribe(datas => {
      if (!this.routeFlag) {
        this.productTypeSelect(datas);
        this.customerSelect(datas, this.querySelect.productType.value); // 改變 客戶別 的值
        this.querySelect.productType.value = '';
        this.querySelect.custom.value = '';
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  plantSelect(site?) {
    this.mrrDocSelectService.getPlant(site).subscribe(data => this.querySelect.plant.select.selectList = data);
  }

  // 產品別下拉框
  initProductTypeSelect() {
    // 監聽下拉框的值改變
    const changeProductTypeList = (productType?) => {
      return of(productType);
    };
    const productTypeList$: Observable<string[]> = this.querySelect.productType.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProductTypeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    productTypeList$.subscribe(datas => {
      if (!this.routeFlag) {
        this.customerSelect(this.querySelect.plant.value, datas); // 改變  客戶別 的值
        this.querySelect.custom.value = '';
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  async productTypeSelect(plant?) {
    await this.mrrDocSelectService.getProductType('productDocument', plant).toPromise().then(data => this.querySelect.productType.select.selectList = data);
  }

  // 客戶別下拉框
  initCustomerSelect() {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<string[]> = this.querySelect.custom.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
      if (!this.routeFlag) {
        this.proCodeSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變 Project Code下拉框 的值
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變 機種下拉框 的值
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變Plant的值
    });
  }

  async customerSelect(plant?, productType?, customer?) {
    await this.mrrDocSelectService.getCustomer('productDocument', plant, productType, customer).toPromise().then(data => this.querySelect.custom.select.selectList = data);
  }

  // Project Code下拉框
  initProCodeSelect() {
    // 監聽下拉框的值改變
    const changeProCodeList = (proCode?) => {
      return of(proCode);
    };
    const changeProCodeList$: Observable<string[]> = this.querySelect.proCode.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProCodeList$.subscribe(datas => {
      if (datas && !this.routeFlag) {
        this.querySelect.proName.value = '';
        this.mrrDocSelectService.getProName('productDocument', this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, datas, this.querySelect.proName.value).subscribe(data => {
          this.querySelect.proName.select.selectList = data;
          if (this.querySelect.proName.select.selectList.length === 1) {
            this.querySelect.proName.value = this.querySelect.proName.select.selectList[0]['Value'];
          }
        });
      }
    });
    // 搜索相關查詢
    const searchProCodeList = (proCode?) => {
      return of(proCode);
    };
    const searchProCodeList$: Observable<string[]> = this.querySelect.proCode.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProCodeList$.subscribe(datas => {
      if (datas) {
        this.proCodeSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, datas); // 改變Plant的值
      }
    });
  }

  proCodeSelect(plant?, productType?, customer?, proCode?) {
    this.mrrDocSelectService.getProCode('productDocument', plant, productType, customer, proCode).subscribe(data => this.querySelect.proCode.select.selectList = data);
  }

  // 機種下拉框
  initProNameSelect() {
    // 監聽下拉框的值改變
    const changeProNameList = (proName?) => {
      return of(proName);
    };
    const changeProNameList$: Observable<string[]> = this.querySelect.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProNameList$.subscribe(datas => {
      if (datas && !this.routeFlag) {
        this.querySelect.proCode.value = '';
        this.mrrDocSelectService.getProCode('productDocument', this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, this.querySelect.proCode.value, datas).subscribe(data => {
          this.querySelect.proCode.select.selectList = data;
          if (this.querySelect.proCode.select.selectList.length === 1) {
            this.querySelect.proCode.value = this.querySelect.proCode.select.selectList[0]['Value'];
          }
        });
      }
    });
    // 搜索相關查詢
    const searchProNameList = (proName?) => {
      return of(proName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProNameList$.subscribe(datas => {
      if (datas) {
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, this.querySelect.proCode.value, datas); // 改變Plant的值
      }
    });
  }
  async proNameSelect(plant?, productType?, customer?, proCode?, proName?) {
    await this.mrrDocSelectService.getProName('productDocument', plant, productType, customer, proCode, proName).toPromise().then(data => this.querySelect.proName.select.selectList = data);
  }

  // 查詢
  async query() {
    this.tableFlag = false;
    if (!this.querySelect.plant.value) {
      this.message.create('error', 'Please select plant！');
      return;
    }
    if (!this.querySelect.custom.value) {
      this.message.create('error', 'Please select product！');
      return;
    }
    if (!this.querySelect.proName.value) {
      this.message.create('error', 'Please select projectName！');
      return;
    } else {
      this.projectName = this.querySelect.proName.value;
    }
    this.mrrDocViewService.queryDataSet('productDocument', this.querySelect.plant.value, this.querySelect, '*').subscribe(d => {
      this.dataSet = d;
      if (this.dataSet.length >= 0) {
        this.tableFlag = true;
      }
      this.routeFlag = false;
    });
  }

  sort<T>(arr: Array<any>, fnc: (x: T) => any, mappingTable?: Array<any>) {
    return arr.sort(
      (a, b) => {
        const _a = mappingTable ? mappingTable.indexOf(fnc(a)) : fnc(a);
        const _b = mappingTable ? mappingTable.indexOf(fnc(b)) : fnc(b);
        if (_a > _b) {
          return 1;
        } else if (_a < _b) {
          return -1;
        } else {
          return 0;
        }
      }
    );
  }

  async queryPartNumber(code) {
    const encode = await this.newModelDocumentApi.partNumberEncrypto(code).toPromise();
    window.open('https://plm.wistron.com/Windchill/netmarkets/jsp/ext/queryPartRelatedFiles.jsp?pn=' + encode, '_blank');
  }

  async queryPLM() {
    const code = await this.newModelDocumentApi.partNumberEncrypto(this.searchInput).toPromise();
    window.open('https://plm.wistron.com/Windchill/netmarkets/jsp/ext/queryPartRelatedFiles.jsp?pn=' + code, '_blank');
  }

  async clickBOM() {
    const result = await this.mrrDocViewService.queryPLMAllPart('productDocument', this.querySelect.proName.value);
    this.bomList.dataSet = result;
    this.bomList.isVisible = true;
  }

  cancelBomPop() {
    this.bomList.isVisible = false;
    this.selectedIndex = 0;
    this.showBOM2 = false;
  }

  alert() {
    alert('Permission denied！');
  }

  async queryPLMPartNum(partNumber) {
    this.showBOM2 = true;
    this.bomLoading = true;
    this.selectedIndex = 1;
    this.bomList.dataSet2 = await this.newModelDocumentApi.getPartNumber(partNumber).toPromise();
    this.bomLoading = false;
  }

  selectedIndexChange(index) {
    if (index == 0) {
      this.showBOM2 = false;
    }
  }

  download() {
    this.paging = false;
    const table = document.getElementById('reportPopTable2');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'BOM list');
      this.paging = true;
    }, 300);
  }

  // by Pass 部分
  byPassEdit() {
    this.editByPass = true;
  }

  byPassSave() {
    this.mrrDocViewService.byPassSave(this.dataSet).subscribe(d => {
      this.message.create('success', 'Saved successfully！');
      this.byPassCancel();
    }, error => {
      this.message.create('error', 'Save failed！');
      this.byPassCancel();
    });
  }

  byPassCancel() {
    this.editByPass = false;
  }
}
