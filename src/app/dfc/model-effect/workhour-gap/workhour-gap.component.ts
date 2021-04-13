import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  Observable,
  of
} from 'rxjs';
import {
  debounceTime,
  switchMap
} from 'rxjs/operators';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  DfcWorkhourGapQuery
} from './workhour-gap';
import {
  WorkhourGapService
} from './workhour-gap.service';
import {
  DownexcelService
} from '@service/downexcel.service';
import {
  DfcCommonService
} from 'app/shared/dfc-common/service/dfc-common.service';
import {
  DfcSelectNewService
} from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-workhour-gap',
  templateUrl: './workhour-gap.component.html',
  styleUrls: ['./workhour-gap.component.scss']
})
export class WorkhourGapComponent implements OnInit, OnDestroy {
  @ViewChild('DFCWorkhourGap') dfcWorkhourGap: ElementRef;
  proCodeDataSet;
  dataTotle;
  tableshow = false;
  i = 1;
  data2 = [];
  dataEx;
  FirstEchartParam = {
    legendData: [],
    series: []
  };
  m = -1;
  cf;
  dataTable = [];
  option;
  bbb;
  dataF = [];
  frist = false;
  queryFlag = false;

  nzScroll = {
    upTable: { x: '100%', y: '0px' },
    downTable: { x: '100%', y: '0px' }
  };
  nzWidthConfig = {
    upTable: ['8%', '8%', '8%', '18%', '18%', '18%', '8%', '8%', '8%'],
    downTable: ['5%', '5%', '5%', '5%', '8%', '7%', '5%'],
    default: ['5%', '5%', '5%', '5%', '8%', '7%', '5%']
  };

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  datas;
  selectPlant = [];
  selectCustom = [];
  selectProjectName = [];
  selectCFlow = [];
  selectProduct = [];
  echartFlag = true;
  querySelect = { ...DfcWorkhourGapQuery };
  typeObjectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  modelObjectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelectOther = {
    tempListOfProcessSelectOption: [], // 暫存 製程的下拉內容
    tempProCodeData: {} // 暫存 Project Code 內容
  };
  allpro;
  timeFlag = 'a';
  // 製程相關
  tempListOfProcessSelectOption = []; // 暫存的下拉內容

  // 全部的projectName
  tempProjectNameList = [];

  modelDataSet: any = {};
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private workhourGapService: WorkhourGapService,
    private message: NzMessageService,
    private downExcelService: DownexcelService,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.comparison-type', 'dfc.select-comparison-type']).subscribe(res => {
      this.querySelect.plant.style.label = res['dfq.dfq-plant'];
      this.querySelect.custom.style.label = res['dfq.dfq-customer'];
      this.querySelect.productType.style.label = res['dfq.dfq-product'];
      this.querySelect.process.style.label = res['mrr.nudd-process'];
      this.querySelect.cFlow.style.label = res['dfq.dfq-cflow'];
      this.querySelect.kind.style.label = res['dfc.comparison-type'];
      this.trans['selectComparison'] = res['dfc.select-comparison-type'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.comparison-type', 'dfc.select-comparison-type']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfq.dfq-plant'];
        this.querySelect.custom.style.label = res['dfq.dfq-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.querySelect.process.style.label = res['mrr.nudd-process'];
        this.querySelect.cFlow.style.label = res['dfq.dfq-cflow'];
        this.querySelect.kind.style.label = res['dfc.comparison-type'];
        this.trans['selectComparison'] = res['dfc.select-comparison-type'];
      });
    });
    this.initSelect(); // 初始化下拉框
    const tableHeight = (this.dfcWorkhourGap.nativeElement.offsetHeight - 240) + 'px';
    this.nzScroll.upTable.y = tableHeight;
    this.nzScroll.downTable.y = tableHeight;
  }

  initSelect() {
    // 清空選項值
    this.querySelect.productType.value = '';
    this.querySelect.process.value = '';
    this.querySelect.kind.value = '';
    this.querySelect.plant.value = '';
    this.querySelect.custom.value = '';
    this.querySelect.proName.value = '';
    this.querySelect.proCode.value = '';
    this.querySelect.model.value = '';
    this.querySelect.cFlow.value = '';
    // 初始化下拉框
    this.initPlantSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.initProcessSelect();
    this.initProNameSelect();
    this.initModelSelect();
    // 獲取產品下拉框中數據
    this.productTypeSelect();
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => {
      this.querySelect.plant.select.selectList = data;
      this.getStagePlant();
    });
    // 对厂别自动带入本厂的标签
    this.querySelect.plant.value = localStorage.getItem('DFC_Plant');
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      if (!!datas) {
        this.customerSelect(datas); // 改變客戶
        this.proNameSelect(datas);
        this.getStagePlant();
      }
      this.querySelect.process.select.selectList = [];
      if (!!this.querySelect.productType.value && !!datas) {
        this.processSelect(datas, this.querySelect.productType.value); // 改變  製程 的值
      }
      this.querySelect.custom.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
    });
  }

  // 客戶別下拉框
  initCustomerSelect() {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<string> = this.querySelect.custom.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
      if (!!this.querySelect.plant.value) {
        this.proNameSelect(this.querySelect.plant.value, datas, this.querySelect.productType.value);
      }
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
    });
    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      if (!!this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, datas); // 改變Plant的值
      }
    });
  }

  customerSelect(plant?, customer?) {
    this.dfcSelectService.getCustom(plant, '', customer).subscribe(data => this.querySelect.custom.select.selectList = data);
  }

  // 產品別下拉框
  initProductTypeSelect() {
    // 監聽下拉框的值改變
    const changeProductTypeList = (productType?) => {
      return of(productType);
    };
    const productTypeList$: Observable<string> = this.querySelect.productType.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProductTypeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    productTypeList$.subscribe(datas => {
      this.querySelect.process.select.selectList = [];
      if (!!this.querySelect.plant.value && !!datas) {
        this.processSelect(this.querySelect.plant.value, datas); // 改變  製程 的值
      }
      if (!!this.querySelect.plant.value) {
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.custom.value, datas,);
      }
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
    });
  }

  productTypeSelect() {
    this.dfcSelectService.getProductType().subscribe(data => this.querySelect.productType.select.selectList = data);
  }

  // 製程下拉框
  initProcessSelect() {
    this.dfcSelectService.getProcess().subscribe(datas => this.querySelectOther.tempListOfProcessSelectOption = datas);
    // 監聽下拉框的值改變
    const changeProcessList = (process?) => {
      return of(process);
    };
    const changeProcessList$: Observable<string> = this.querySelect.process.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProcessList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProcessList$.subscribe(datas => {
      if (!!datas) {
        this.querySelect.kind.select.selectDisabled = false;
      } else {
        this.querySelect.kind.select.selectDisabled = true;
        this.querySelect.kind.value = '';
      }
    });
  }

  processSelect(plant?, productType?) {
    this.dfcCommonService.getProcess(plant, productType).subscribe(datas => {
      if (datas.length > 0) {
        this.querySelect.process.select.selectList = this.querySelectOther.tempListOfProcessSelectOption.filter(t => datas[0]['processCode'].split(',').includes(t.Value));
      } else {
        this.querySelect.process.select.selectList = [];
      }
    });
  }

  // 機種下拉框
  initProNameSelect() {
    // 監聽下拉框的值改變
    const changeProNameList = (pName?) => {
      return of(pName);
    };
    const changeProNameList$: Observable<string> = this.querySelect.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProNameList$.subscribe(datas => {
      this.modelSelect(datas);
      this.querySelect.proCode.select.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
      this.querySelect.proCode.value = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Value'] : '';
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
    });
    // 搜索相關查詢
    const searchProNameList = (pName?) => {
      return of(pName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProNameList$.subscribe(datas => {
      this.proNameSelect(
        this.querySelect.plant.value,
        this.querySelect.custom.value,
        this.querySelect.productType.value,
        datas); // 改變Plant的值
    });
  }

  proNameSelect(plant?, custom?, productType?, proName?) {
    this.dfcSelectService.getProName(plant, '', custom, productType, proName, true).subscribe(data => {
      this.querySelect.proName.select.selectList = data['proName'];
      this.querySelectOther.tempProCodeData = data['proCode'];
      console.log(this.querySelectOther);
    });
  }

  // Model下拉框
  initModelSelect() {
    // 搜索相關查詢
    const searchModelList = (model?) => {
      return of(model);
    };
    const searchModelList$: Observable<string[]> = this.querySelect.model.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchModelList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchModelList$.subscribe(datas => {
      this.modelSelect(this.querySelect.proName.value, datas); // 改變Plant的值
    });
  }

  modelSelect(proName?, model?) {
    this.dfcSelectService.getModel(proName, model, true).subscribe(datas => {
      this.querySelect.model.select.selectList = datas['list'];
      if (!!this.querySelect.proName.value) {
        this.querySelect.model.value = datas['def'];
      }
    });
  }

  getStagePlant() {
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    const addStage = [{ Value: 'C0', Label: 'C0' }, { Value: 'C1', Label: 'C1' }];
    if (stageShowFlag) {
      if (this.querySelect.cFlow.select.selectList.length < 8) {
        this.querySelect.cFlow.select.selectList.splice(1, 0, ...addStage);
      }
    } else {
      if (this.querySelect.cFlow.select.selectList.length === 8) {
        this.querySelect.cFlow.select.selectList.splice(1, 2);
      }
    }
  }

  // 向表格中添加數據.
  add() {
    this.cf = false;
    if (!this.querySelect.plant.value
      || !this.querySelect.productType.value
      || !this.querySelect.custom.value
      || !this.querySelect.proCode.value
      || !this.querySelect.proName.value
      || !this.querySelect.cFlow.value) {
      return;
    }
    // console.log(this.dataTable);
    this.dataTable.forEach(data => {
      if (this.querySelect.plant.value === data.plant.Value
        && this.querySelect.proName.value === data.ProjectName.Value
        && this.querySelect.cFlow.value === data.cFlow.Value
        && this.querySelect.model.value === data.Model.Value) {
        this.cf = true;
        return;
      }
    });
    if (this.cf === true) {
      return;
    }
    this.frist = true;
    this.m = this.m + 1;
    const userPlant = this.querySelect.plant.select.selectList.find(data => data.Value === this.querySelect.plant.value);
    const userCustom = this.querySelect.custom.select.selectList.find(data => data.Value === this.querySelect.custom.value);
    const userCode = this.querySelect.proCode.select.selectList.find(data => data.Value === this.querySelect.proCode.value);
    const userName = this.querySelect.proName.select.selectList.find(data => data.Value === this.querySelect.proName.value);
    const model = this.querySelect.model.select.selectList.find(data => data.Value === this.querySelect.model.value);
    const userCflow = this.querySelect.cFlow.select.selectList.find(data => data.Value === this.querySelect.cFlow.value);
    const product = this.querySelect.productType.select.selectList.find(data => data.Value === this.querySelect.productType.value);
    this.dataTable = [...this.dataTable, {
      key: this.m,
      plant: userPlant,
      custom: userCustom,
      ProjectCode: userCode,
      ProjectName: userName,
      Model: model,
      cFlow: userCflow,
      product: product
    }];
  }

  deleteProMember(data: string, i) {
    // 删除数据
    this.dataTable = this.dataTable.filter(d => {
      if (d.key !== data) {
        return d;
      }
    });
  }

  // 獲取查詢的數據
  async query() {
    // 防止鼠標連點
    this.echartFlag = true;
    if (this.dataTable.length === 0) {
      this.echartFlag = false;
    }
    if ((this.querySelect.process.value && !this.querySelect.kind.value)) {
      this.message.create('error', this.trans['selectComparison']);
      return;
    }
    if ((!this.querySelect.process.value && this.querySelect.kind.value)
      || (this.querySelect.process.value && !this.querySelect.kind.value)
      || (this.dataTable.length === 0)) {
      return;
    }
    if (this.timeFlag === 'b') {
      return;
    }
    this.timeFlag = 'b';
    this.dataF = [];
    const models = [];
    this.dataTable.forEach(element => {
      console.log(element);
      models.push({
        'expand': false,
        'model': element['Model'].Value,
        'cFlow': element['cFlow'].Value,
        'custom': element['custom'].Value,
        'projectName': element['ProjectName'].Label,
        'modelName': element['Model'].Label,
      });
    });
    this.tableshow = false;
    this.dataTotle = await this.workhourGapService.getdata(models, this.querySelect.process.value, this.querySelect.kind.value).then(res => {
      this.option = res['option'];
      if (!!this.querySelect.process.value) {
        this.dataEx = res['nameList'];
        this.modelDataSet = res['modelDataSet'];
        // nzWidthConfig 內容變化
        this.nzWidthConfig.downTable = [...this.nzWidthConfig.default];
        let width = 0;
        if (res['nameList'].length > 0) {
          width = 60 / (res['nameList'].length);
        }
        res['nameList'].forEach(nameList => {
          this.nzWidthConfig.downTable.push(width + '%');
        });
        this.tableshow = true;
      }
      this.timeFlag = 'a';
    });
  }

  download() {
    const table = document.getElementById('downdata');
    this.downExcelService.exportTableAsExcelFile(table, 'IdBookData');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
