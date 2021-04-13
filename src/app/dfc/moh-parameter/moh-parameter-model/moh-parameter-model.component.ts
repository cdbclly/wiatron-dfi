import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { MohParameterService, DfcMOHParamMapping } from '../moh-parameter.service';
import { FileService } from '@service/file.service';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { DfcMohParameterModelQuery } from './moh-parameter-model';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-moh-parameter-model',
  templateUrl: './moh-parameter-model.component.html',
  styleUrls: ['./moh-parameter-model.component.scss']
})
export class MohParameterModelComponent implements OnInit {
  @Input() nzScrollY;
  @Input() routeModel;

  // // 下拉框類設定
  querySelect = { ...DfcMohParameterModelQuery };
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelectOther = {
    tempListOfProcessSelectOption: [], // 暫存 製程的下拉內容
    tempProCodeData: {}, // 暫存 Project Code 內容
    tempCurrentStage: {}, // 暫存 當前Stage 內容
    proData: { // 暂存当前选择框中的值
      proCode: '',
      proName: '',
      model: ''
    }
  };
  stageIDs: any[] = []; // ProjectCode確定後先存儲C0,C1等字樣的信息，可以刪改的, 在ProjectName選完後, 查詢出相關C流程時, 存儲可以刪除的StageID
  stageIDFlag = false; // 是否为对的C阶段

  // 上傳時需要用的參數
  showLoading = false;

  // 表格相關設定 及 參數
  nzWidthConfig = ['70px', '100px', '120px', '120px', '100px', '180px', '180px', '180px', '100px',
    '150px', '150px',
    '150px', '150px', '150px', '150px', '150px', '150px', '150px',
    '150px', '150px', '150px', '150px', '150px', '150px', '150px',
    '150px', '150px', '150px', '150px', '150px', '150px', '150px',
    '150px', '150px', '150px', '150px', '150px', '150px', '150px',
    '80px'];
  totalLength = this.nzWidthConfig.reduce((p, t) => {
    return p + parseInt(t, 10);
  }, 0).toString() + 'px';

  nzScroll = { x: this.totalLength, y: this.nzScrollY };
  // objectKeys = Object.keys; // 方便遍歷paramMapping對象, 用於表格頭部顯示
  paramMapping = DfcMOHParamMapping;
  dataSet;
  editCache;
  actionEnabled = true;

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['MOHCondition']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  // I18N
  destroy$ = new Subject();
  trans;
  constructor(
    private mohParameterService: MohParameterService,
    private dfcSelectService: DfcSelectNewService,
    private message: NzMessageService,
    private fileService: FileService,
    private translate: TranslateService
  ) {
    // 初始化I18N
    this.translate.get(['dfc.dfc-site', 'dfc.dfc-customer', 'dfq-product', 'dfc.dfc-Manpower',
      'dfc.dfc-Manpower(Man)', 'dfc.dfc-productive-forces', 'dfq.dfq-yield', 'dfc.dfc-working-days-per-month',
      'dfc.dfc-working-hours', 'dfc.dfc-line-balance-rate', 'dfc.must-select-plant'
    ]).subscribe(res => {
      this.querySelect.plant.style.label = res['dfc.dfc-site'];
      this.querySelect.custom.style.label = res['dfc.dfc-customer'];
      this.querySelect.productType.style.label = res['dfq.dfq-product'];
      this.paramMapping.RunIn = 'Runin' + res['dfc.dfc-Manpower'];
      this.paramMapping.SMTMan = 'SMT Online' + res['dfc.dfc-Manpower(Man)'];
      this.paramMapping.SMTProductionRate = 'SMT' + res['dfc.dfc-productive-forces'];
      this.paramMapping.SMTYield = 'SMT' + res['dfq.dfq-yield'];
      this.paramMapping.SMTMonthDay = 'SMT' + res['dfc.dfc-working-days-per-month'];
      this.paramMapping.SMTDayHour = 'SMT' + res['dfc.dfc-working-hours'];
      this.paramMapping.DipBalance = 'DIP' + res['dfc.dfc-line-balance-rate'] + '(%)';
      this.paramMapping.DIPProductionRate = 'DIP' + res['dfc.dfc-productive-forces'];
      this.paramMapping.DIPYield = 'DIP' + res['dfq.dfq-yield'] + '(%)';
      this.paramMapping.DIPMonthDay = 'DIP' + res['dfc.dfc-working-days-per-month'];
      this.paramMapping.DIPDayHour = 'DIP' + res['dfc.dfc-working-hours'];
      this.paramMapping.LCMBalance = 'LCM' + res['dfc.dfc-line-balance-rate'] + '(%)';
      this.paramMapping.LCMProductionRate = 'LCM' + res['dfc.dfc-productive-forces'];
      this.paramMapping.LCMYield = 'LCM' + res['dfq.dfq-yield'] + '(%)';
      this.paramMapping.LCMMonthDay = 'LCM' + res['dfc.dfc-working-days-per-month'];
      this.paramMapping.LCMDayHour = 'LCM' + res['dfc.dfc-working-hours'];
      this.paramMapping.FABalance = 'FA ' + res['dfc.dfc-line-balance-rate'] + '(%)';
      this.paramMapping.FAProductionRate = 'FA ' + res['dfc.dfc-line-balance-rate'] + '(%)';
      this.paramMapping.FAYield = 'FA ' + res['dfq.dfq-yield'] + '(%)';
      this.paramMapping.FAMonthDay = 'FA ' + res['dfc.dfc-working-days-per-month'];
      this.paramMapping.FADayHour = 'FA ' + res['dfc.dfc-working-hours'];
      this.trans = res['dfc.must-select-plant'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.dfc-site', 'dfc.dfc-customer', 'dfq-product', 'dfc.dfc-Manpower',
        'dfc.dfc-Manpower(Man)', 'dfc.dfc-productive-forces', 'dfq.dfq-yield', 'dfc.dfc-working-days-per-month',
        'dfc.dfc-working-hours', 'dfc.dfc-line-balance-rate', 'dfc.must-select-plant'
      ]).subscribe(res => {
        this.querySelect.plant.style.label = res['dfc.dfc-site'];
        this.querySelect.custom.style.label = res['dfc.dfc-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.paramMapping.RunIn = 'Runin' + res['dfc.dfc-Manpower'];
        this.paramMapping.SMTMan = 'SMT Online' + res['dfc.dfc-Manpower(Man)'];
        this.paramMapping.SMTProductionRate = 'SMT' + res['dfc.dfc-productive-forces'];
        this.paramMapping.SMTYield = 'SMT' + res['dfq.dfq-yield'];
        this.paramMapping.SMTMonthDay = 'SMT' + res['dfc.dfc-working-days-per-month'];
        this.paramMapping.SMTDayHour = 'SMT' + res['dfc.dfc-working-hours'];
        this.paramMapping.DipBalance = 'DIP' + res['dfc.dfc-line-balance-rate'] + '(%)';
        this.paramMapping.DIPProductionRate = 'DIP' + res['dfc.dfc-productive-forces'];
        this.paramMapping.DIPYield = 'DIP' + res['dfq.dfq-yield'] + '(%)';
        this.paramMapping.DIPMonthDay = 'DIP' + res['dfc.working-days-per-month'];
        this.paramMapping.DIPDayHour = 'DIP' + res['dfc.dfc-working-hours'];
        this.paramMapping.LCMBalance = 'LCM' + res['dfc.dfc-line-balance-rate'] + '(%)';
        this.paramMapping.LCMProductionRate = 'LCM' + res['dfc.dfc-productive-forces'];
        this.paramMapping.LCMYield = 'LCM' + res['dfq.dfq-yield'] + '(%)';
        this.paramMapping.LCMMonthDay = 'LCM' + res['dfc.working-days-per-month'];
        this.paramMapping.LCMDayHour = 'LCM' + res['dfc.dfc-working-hours'];
        this.paramMapping.FABalance = 'FA ' + res['dfc.dfc-line-balance-rate'] + '(%)';
        this.paramMapping.FAProductionRate = 'FA ' + res['dfc.dfc-line-balance-rate'] + '(%)';
        this.paramMapping.FAYield = 'FA ' + res['dfq.dfq-yield'] + '(%)';
        this.paramMapping.FAMonthDay = 'FA ' + res['dfc.working-days-per-month'];
        this.paramMapping.FADayHour = 'FA ' + res['dfc.dfc-working-hours'];
        this.trans = res['dfc.must-select-plant'];
      });
    });
  }

  ngOnInit() {
    this.initSelect(); // 初始化下拉框
    if (!!this.routeModel) {
      this.querySelectOther.proData.proCode = this.routeModel['projectCode'];
      this.querySelectOther.proData.proName = this.routeModel['projectName'];
      this.query();
    }
  }

  initSelect() {
    // 清空選項值
    this.querySelect.plant.value = '';
    this.querySelect.bu.value = '';
    this.querySelect.productType.value = '';
    this.querySelect.proName.value = '';
    this.querySelect.proCode.value = '';
    this.querySelect.model.value = '';
    // 初始化下拉框
    this.initPlantSelect();
    this.initBuSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.initProNameSelect();
    this.initModelSelect();
    // 獲取產品下拉框中數據
    this.productTypeSelect();
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.plant.select.selectList = data);
    // 对厂别自动带入本厂的标签
    this.querySelect.plant.value = localStorage.getItem('DFC_Plant');
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      this.buSelect(datas); // 改變 BU 的值
      this.customerSelect(datas);
      this.proNameSelect(datas);
      this.querySelect.bu.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
  }

  // BU下拉框
  initBuSelect() {
    // 監聽下拉框的值改變
    const changeBuList = (bu?) => {
      return of(bu);
    };
    const changeBuList$: Observable<string> = this.querySelect.bu.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeBuList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeBuList$.subscribe(datas => {
      this.customerSelect(this.querySelect.plant.value, datas);
      this.proNameSelect(this.querySelect.plant.value, datas, '', this.querySelect.productType.value);
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
    // 搜索相關查詢
    const searchBuList = (bu?) => {
      return of(bu);
    };
    const searchBuList$: Observable<string[]> = this.querySelect.bu.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchBuList$.subscribe(datas => {
      this.buSelect(this.querySelect.plant.value, datas);
    });
  }

  buSelect(plant?, bu?) {
    this.dfcSelectService.getBU(plant, bu).subscribe(data => this.querySelect.bu.select.selectList = data);
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
      if (this.querySelect.plant.value) {
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          datas,
          this.querySelect.productType.value
        );
      }
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
    });

    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變Plant的值
      }
    });
  }

  customerSelect(plant?, bu?, customer?) {
    this.dfcSelectService.getCustom(plant, bu, customer).subscribe(data => this.querySelect.custom.select.selectList = data);
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
      this.proNameSelect(this.querySelect.plant.value, this.querySelect.bu.value, this.querySelect.custom.value, datas);
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
  }

  productTypeSelect() {
    this.dfcSelectService.getProductType().subscribe(data => this.querySelect.productType.select.selectList = data);
  }

  // 幾種下拉框
  initProCodeSelect() {
    // 監聽下拉框的值改變
    const changeProCodeList = (pName?) => {
      return of(pName);
    };
    const changeProCodeList$: Observable<string> = this.querySelect.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProCodeList$.subscribe(datas => {
      this.querySelect.proCode.select.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
      this.querySelect.proCode.value = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Value'] : '';
      this.querySelectOther.proData.proCode = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Label'] : '';
      const proNameData = this.querySelect.proName.select.selectList.find(d => d.Value === this.querySelect.proName.value);
      this.querySelectOther.proData.proName = !!proNameData ? proNameData['Label'] : '';
      this.querySelect.model.value = '';
      this.querySelectOther.proData.model = '';
    });
    // 搜索相關查詢
    const searchProCodeList = (pName?) => {
      return of(pName);
    };
    const searchProCodeList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProCodeList$.subscribe(datas => {
      this.proCodeSelect(
        this.querySelect.plant.value,
        this.querySelect.bu.value,
        this.querySelect.productType.value,
        datas); // 改變Plant的值
    });
  }

  proCodeSelect(plant?, bu?, custom?, productType?, proCode?) {
    this.dfcSelectService.getProCode(plant, bu, custom, productType, proCode, true).subscribe(data => {
      this.querySelect.proCode.select.selectList = data;
    });
  }


  // 幾種下拉框
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
      this.querySelectOther.proData.proCode = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Label'] : '';
      const proNameData = this.querySelect.proName.select.selectList.find(d => d.Value === this.querySelect.proName.value);
      this.querySelectOther.proData.proName = !!proNameData ?
        (this.querySelectOther.proData.proCode.includes('DMA-') ? proNameData['Label'].split('-')[1] : proNameData['Label']) : '';
      this.querySelect.model.value = '';
      this.querySelectOther.proData.model = '';
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
        this.querySelect.bu.value,
        this.querySelect.custom.value,
        this.querySelect.productType.value,
        datas); // 改變Plant的值
    });
  }

  proNameSelect(plant?, bu?, custom?, productType?, proName?) {
    this.dfcSelectService.getProName(plant, bu, custom, productType, proName, true).subscribe(data => {
      this.querySelect.proName.select.selectList = data['proName'];
      this.querySelectOther.tempProCodeData = data['proCode'];
      this.querySelectOther.tempCurrentStage = data['currentStage'];
    });
  }

  // Model下拉框
  initModelSelect() {
    // 監聽下拉框的值改變
    const changeModelList = (model?) => {
      return of(model);
    };
    const changeModelList$: Observable<string> = this.querySelect.model.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeModelList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeModelList$.subscribe(datas => {
      const modelData = this.querySelect.model.select.selectList.find(d => d.Value === this.querySelect.model.value);
      this.querySelectOther.proData.model = !!modelData ? modelData['Label'] : '';
    });
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
    this.dfcSelectService.getModel(proName, model).subscribe(datas => {
      this.querySelect.model.select.selectList = [];
      if (!!this.querySelect.proName.value) {
        this.querySelect.model.select.selectList = datas['list'];
        this.querySelect.model.value = datas['def'];
        const modelData = datas['list'].find(d => d.Value === datas['def']);
        this.querySelectOther.proData.model = !!modelData ? modelData['Label'] : '';
        this.querySelect.model.change$.next(datas['def']);
      }
    });
  }

  query() {
    if (!this.querySelect.plant.value) {
      this.message.create('error', '必須選擇 廠別');
      return;
    }
    this.dataSet = []; // 清空表格數據
    const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === this.querySelect.plant.value);
    const queryValue = {
      plant: this.querySelect.plant.value,
      bu: this.querySelect.bu.value,
      customer: this.querySelect.custom.value,
      proCode: this.querySelectOther.proData.proCode,
      proName: this.querySelectOther.proData.proName,
      modelName: this.querySelectOther.proData.model,
      productType: this.querySelect.productType.value
    };
    this.mohParameterService.queryModelParam(queryValue, plantMap['PlantName']).then(data => {
      this.dataSet = data;
      this.updateEditCache();
    });
  }

  // 机种 - 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {}; // 清空缓存数据
    this.dataSet.forEach(item => {
      if (!this.editCache[item.No]) {
        this.editCache[item.No] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // 表格编辑事件
  startEdit(key: string) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
  }

  // 表格編輯事件
  saveEdit(key: string) {
    this.mohParameterService.saveModelParam(this.editCache[key].data, this.dataSet[(parseInt(key, 10) - 1)], this.querySelect.plant.value)
      .then(data => {
        if (data['result'] === 'success') {
          this.message.create('success', 'Saved successfully！');
          const dataSet = JSON.parse(JSON.stringify(this.dataSet));
          dataSet[(parseInt(key, 10) - 1)] = this.editCache[key].data;
          this.dataSet = [];
          this.dataSet = dataSet;
        } else {
          this.message.create('error', 'Save failed！');
        }
        this.cancelEdit(key);
      });
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
  }

  // 上傳方法
  upload(file) {
    this.fileService.postDFCFile(file, 'mohCondition')
      .subscribe(res => {
        this.showLoading = false;
        let success = 0;
        let fail = 0;
        for (let i = 0; i < res['length']; i++) {
          if (res[i]['result'] === 'fail') {
            fail++;
          } else {
            success++;
          }
        }
        const message = 'Updated successfully: ' + success + ', failed: ' + fail;
        this.message.create('success', message);
        this.mohParameterService.modelUploadLog(this.querySelect.plant.value, res);
      }, error => {
        const err = 'Upload failed: ' + JSON.stringify(error.error.error.message);
        this.message.create('error', err);
        this.showLoading = false;
      });
  }

  // 下載
  download() {
    if (!this.querySelect.plant.value) {
      this.message.create('error', this.trans);
      return;
    }
    this.fileService.downloadMOHConditions(this.querySelect.plant.value, this.querySelectOther.proData.proCode, this.querySelectOther.proData.proName, this.querySelectOther.proData.model);
  }
}
