import { TranslateService } from '@ngx-translate/core';
import {
  OnDestroy,
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  ProcessApi,
  BasicModelApi,
  BasicModelInterface,
  GroupModelApi,
  GroupModelInterface,
  ModelOperationsApi,
  ProjectCodeProfileApi,
  ProjectNameProfileApi,
  OperationLogApi,
  ProjectNameProfileInterface,
  ProjectCodeProfileInterface
} from '@service/dfc_sdk/sdk';
import {
  Observable,
  of
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  flatMap,
  mergeMap
} from 'rxjs/operators';
import {
  FileService
} from '@service/file.service';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  ActivatedRoute
} from '@angular/router';
import {
  WorkhourMaintainService
} from './workhour-maintain.service';
import {
  DfcCommonService
} from 'app/shared/dfc-common/service/dfc-common.service';
import {
  DfcWorkhourMaintainQuery
} from './workhour-maintain';
import {
  DfcSelectNewService
} from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-workhour-maintain',
  templateUrl: './workhour-maintain.component.html',
  styleUrls: ['./workhour-maintain.component.scss']
})
export class WorkhourMaintainComponent implements OnInit, OnDestroy {

  allChecked = false;
  disabledDeleteButton = true;
  checkedNumber = 0;
  displayData: Array<DFCWorkhourMaintainTabelData> = [];
  indeterminate = false;

  isDeleteVisible = false; // 刪除對話框是否出現
  isAfterDeleteVisible = false; // 刪除后對話框是否出現
  operating = false;

  dataSet = []; // 表格数据暂存  DFCWorkhourMaintainTabelData
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editrow = ''; // 记录编辑状态时的表格行序号, 方便失去焦点时做判断
  editIndex: number; // 记录当前编辑的表格行数
  // 編輯后失去焦點 聯合判斷, inputBlur = true && inputClick = false 時 彈出儲存框
  inputBlur = false; // 記錄input編輯框是否 失去焦點, 默認為false
  inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
  isEditSaveVisible = false; // 储存框是否出现

  // dfc-txt 裡面的內容顯示
  isSpanShowFlag = false; // 判斷 是否 出現
  spanPlant: string;
  spanCustomer: string;
  spanFamily: string;
  spanName: string;
  spanCFlow: string;

  rfqMapping = true; // 是否顯示 綁定選項
  rfqShowSpan = true;
  rfqFamilySelectValue: string;
  rfqFamilySelectList = [];
  rfqNameSelectValue: string;
  rfqNameSelectList = [];
  proNameIDList = [];

  // 表格相關
  actionList = [];
  @ViewChild('DFCModelWorkhour') dfcModelWorkhour: ElementRef;
  nzWidthConfig = ['80px', '100px', '200px', '150px', '200px', '100px', '100px'];
  nzScrollX = 930;
  nzScroll: {};

  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['ModelOperation']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  // 下拉框有關參數設定
  querySelect = {
    ...DfcWorkhourMaintainQuery
  };
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelectOther = {
    tempListOfProcessSelectOption: [], // 暫存 製程的下拉內容
    tempProCodeData: {}, // 暫存 Project Code 內容
    tempCurrentStage: {} // 暫存 當前Stage 內容
  };
  stageIDs: any[] = []; // ProjectCode確定後先存儲C0,C1等字樣的信息，可以刪改的, 在ProjectName選完後, 查詢出相關C流程時, 存儲可以刪除的StageID
  stageIDFlag = false; // 是否为对的C阶段
  rfqMappingFlag = false; // 没有做 Mapping 动作 则不能 上传工时

  targetSignFlag = false; // 没有目标工时 已签核 标志
  // 中間 RFQ Mapping 使用的參數設定

  // cFlowDropDownList: {Value: number, Label: string}[] = [];
  cFlowDropDownList: any = {};
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private projectCodeProfileServer: ProjectCodeProfileApi,
    private projectNameProfileServer: ProjectNameProfileApi,
    private modelOperationsServer: ModelOperationsApi,
    private message: NzMessageService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private operationLogServer: OperationLogApi,
    private workhourMaintainService: WorkhourMaintainService,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private basicModelService: BasicModelApi,
    private groupModelService: GroupModelApi,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    // 初始化I18N;
    this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product',
      'report.select-all', 'dfc.forecast.must-select-C', 'dfc.forecast.must-plant-C', 'dfc.forecast.must-rfq-proname',
      'dfc.forecast.no-workhour', 'dfc.forecast.apply-success', 'dfc.forecast.apply-fail']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfq.dfq-plant'];
        this.querySelect.custom.style.label = res['dfq.dfq-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.querySelect.process.style.label = res['mrr.nudd-process'];
        this.querySelect.cFlow.style.label = res['dfq.dfq-cflow'];
        this.trans['select-all'] = res['report.select-all'];
        this.trans['must-select-C'] = res['dfc.forecast.must-select-C'];
        this.trans['must-plant-C'] = res['dfc.forecast.must-plant-C'];
        this.trans['must-rfq-proname'] = res['dfc.forecast.must-rfq-proname'];
        this.trans['no-workhour'] = res['dfc.forecast.no-workhour'];
        this.trans['apply-success'] = res['dfc.forecast.apply-success'];
        this.trans['apply-fail'] = res['dfc.forecast.apply-fail'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-cflow', 'dfq.dfq-customer', 'dfq.dfq-product',
        'report.select-all', 'dfc.forecast.must-select-C', 'dfc.forecast.must-plant-C', 'dfc.forecast.must-rfq-proname',
        'dfc.forecast.no-workhour', 'dfc.forecast.apply-success', 'dfc.forecast.apply-fail']).subscribe(res => {
          this.querySelect.plant.style.label = res['dfq.dfq-plant'];
          this.querySelect.custom.style.label = res['dfq.dfq-customer'];
          this.querySelect.productType.style.label = res['dfq.dfq-product'];
          this.querySelect.process.style.label = res['mrr.nudd-process'];
          this.querySelect.cFlow.style.label = res['dfq.dfq-cflow'];
          this.trans['select-all'] = res['report.select-all'];
          this.trans['must-select-C'] = res['dfc.forecast.must-select-C'];
          this.trans['must-plant-C'] = res['dfc.forecast.must-plant-C'];
          this.trans['must-rfq-proname'] = res['dfc.forecast.must-rfq-proname'];
          this.trans['no-workhour'] = res['dfc.forecast.no-workhour'];
          this.trans['apply-success'] = res['dfc.forecast.apply-success'];
          this.trans['apply-fail'] = res['dfc.forecast.apply-fail'];
        });
    });
    await this.initSelect(); // 初始化下拉框
    this.nzScroll = {
      x: this.nzScrollX + 'px',
      y: (this.dfcModelWorkhour.nativeElement.offsetHeight - 185) + 'px'
    };
    this.route.queryParams.subscribe(param => {
      if (param['Plant'] && param['Product'] && param['ProjectNameID']) {
        this.querySelect.plant.value = param['Plant'];
        this.querySelect.productType.value = param['Product'];
        this.querySelect.custom.value = param['Customer'];
        this.projectNameProfileServer.findById(param['ProjectNameID']).subscribe(proName => {
          this.querySelect.proName.select.selectList.push({ Value: proName['ProjectNameID'], Label: proName['ProjectName'] });
          this.querySelect.proCode.select.selectList.push({ Value: proName['ProjectCodeID'], Label: proName['ProjectCode'] });
          this.querySelect.proName.value = proName['ProjectNameID'];
          this.querySelect.proCode.value = proName['ProjectCodeID'];
          this.modelSelect();
        });
      }
    });
  }

  initSelect() {
    // 清空選項值
    this.querySelect.plant.value = '';
    this.querySelect.bu.value = '';
    this.querySelect.custom.value = '';
    this.querySelect.productType.value = '';
    this.querySelect.process.value = '';
    this.querySelect.proName.value = '';
    this.querySelect.proCode.value = '';
    this.querySelect.model.value = '';
    this.querySelect.cFlow.value = '';
    // 初始化下拉框
    this.initPlantSelect();
    this.initBuSelect();
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
      if (!!datas) {
        this.buSelect(datas); // 改變 BU 的值
        this.customerSelect(datas); // 改變客戶
        this.processSelect(datas, this.querySelect.productType.value);
        this.proNameSelect(datas);
      }
      if (!this.querySelect.plant.value) {
        this.querySelect.bu.value = '';
        this.querySelect.custom.value = '';
        this.querySelect.proName.value = '';
        this.querySelect.proCode.value = '';
        this.querySelect.productType.value = '';
        this.querySelect.process.value = '';
      }
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
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
      if (this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, datas);
        this.proNameSelect(this.querySelect.plant.value, datas, '', this.querySelect.productType.value);
      }
      if (!this.querySelect.plant.value) {
        this.querySelect.custom.value = '';
        this.querySelect.productType.value = '';
        this.querySelect.proName.value = '';
        this.querySelect.proCode.value = '';
      }
      this.querySelect.model.value = '';
      this.querySelect.cFlow.value = '';
    });
    // 搜索相關查詢
    const searchBuList = (bu?) => {
      return of(bu);
    };
    const searchBuList$: Observable<string[]> = this.querySelect.bu.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchBuList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.buSelect(this.querySelect.plant.value, datas);
      }
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
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.bu.value, datas, this.querySelect.productType.value);
      }
      if (!this.querySelect.custom.value) {
        this.querySelect.productType.value = '';
        this.querySelect.process.value = '';
        this.querySelect.proName.value = '';
        this.querySelect.proCode.value = '';
      }
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
      if (this.querySelect.plant.value) {
        this.processSelect(this.querySelect.plant.value, datas); // 改變  製程 的值
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.bu.value, this.querySelect.custom.value, datas, this.querySelect.proName.value);
      }
      if (!this.querySelect.productType.value) {
        this.querySelect.proName.value = '';
        this.querySelect.proCode.value = '';
      }
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
      if (datas) {
        this.modelSelect(datas);
        this.querySelect.proCode.value = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Value'] : '';
      }
      this.querySelect.proCode.select.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
      if (!this.querySelect.proName.value) {
        this.querySelect.proCode.value = '';
      }
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
      if (this.querySelect.plant.value) {
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          this.querySelect.productType.value,
          datas); // 改變Plant的值
      }
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
      if (!!this.querySelect.proName.value) {
        this.dfcSelectService.getStage(datas).subscribe(stageDatas => {
          stageDatas = this.getStagePlant(stageDatas);
          this.querySelect.cFlow.select.selectList = stageDatas;
          let flagStage = false;
          this.stageIDs = [];
          this.cFlowDropDownList = {};
          stageDatas.forEach(stageData => {
            if (stageData['Label'] === this.querySelectOther.tempCurrentStage[this.querySelect.proName.value]) {
              this.querySelect.cFlow.value = stageData['Value'];
              flagStage = true;
            }
            if (flagStage) {
              this.stageIDs.push(stageData['Value']);
            }
            this.cFlowDropDownList[stageData['Label']] = stageData;
          });
        });
      }
    });
    // 搜索相關查詢
    const searchModelList = (model?) => {
      return of(model);
    };
    const searchModelList$: Observable<string[]> = this.querySelect.model.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchModelList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchModelList$.subscribe(datas => {
      if (this.querySelect.proName.value) {
        this.modelSelect(this.querySelect.proName.value, datas); // 改變Plant的值
      }
    });
  }

  modelSelect(proName?, model?) {
    this.dfcSelectService.getModel(proName, model).subscribe(datas => {
      this.querySelect.model.select.selectList = datas['list'];
      this.querySelect.model.style.red = (datas['list'].length > 0 ? true : false);
      this.querySelect.cFlow.style.red = (datas['list'].length > 0 ? true : false);
      if (datas['list'].length === 0) {
        this.showSpan();
      }
      if (!!this.querySelect.proName.value) {
        this.querySelect.model.value = datas['def'];
        this.querySelect.model.change$.next(datas['def']);
      }
    });
  }

  getStagePlant(stageDatas) {
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    if (!stageShowFlag) {
      const index = stageDatas.findIndex(d => d.Label === 'C0');
      stageDatas.splice(index, 2);
    }
    return stageDatas;
  }


  // 查詢表格數據
  query() {
    if (!this.querySelect.plant.value
      || !this.querySelect.custom.value
      || !this.querySelect.productType.value
      || !this.querySelect.process.value
      || !this.querySelect.proName.value
      || !this.querySelect.proCode.value
      || (this.querySelect.model.select.selectList.length > 0 && !this.querySelect.model.value)
    ) {
      this.message.create('error', this.trans['select-all']);
      return;
    }
    if (this.querySelect.model.select.selectList.length > 0 && !this.querySelect.cFlow.value) {
      this.message.create('error', this.trans['must-select-C']);
      return;
    }
    this.dataSet = [];
    if (this.querySelect.model.select.selectList.length === 0) {
      this.showSpan();
      return;
    }
    this.actionList = [];
    this.stageIDFlag = this.stageIDs.includes(this.querySelect.cFlow.value);
    if (this.stageIDFlag) {
      this.nzWidthConfig = ['60px', '80px', '100px', '200px', '150px', '200px', '100px', '100px', '90px'];
      this.nzScrollX = 1080;
    } else {
      this.nzWidthConfig = ['80px', '100px', '200px', '150px', '200px', '100px', '100px'];
      this.nzScrollX = 930;
    }
    this.modelOperationsServer.ModelOpTime(this.querySelect.cFlow.value, this.querySelect.process.value).subscribe(modelOperaDatas => {
      const dataArray: Array<DFCWorkhourMaintainTabelData> = [];
      let flag = false;
      modelOperaDatas['data'].forEach(modelOperaData => {
        flag = false;
        if (modelOperaData['action']) {
          this.updateActionList(modelOperaData['action']);
        }
        for (let i = 0; i < dataArray.length; i++) {
          const data = dataArray[i];
          if (data.modelOperationID === modelOperaData['modelOperationID']) {
            flag = true;
            let total = data.total;
            total += modelOperaData['costtime'];
            data.total = total;
            const action = data.action;
            let actionFlag = false;
            for (let j = 0; j < action.length; j++) {
              const act = action[j];
              if (act.name === modelOperaData['action']) {
                action[j].costtime = modelOperaData['costtime'];
                actionFlag = true;
                break;
              }
            }
            if (!actionFlag) {
              if (modelOperaData['action']) {
                action.push({
                  name: modelOperaData['action'],
                  costtime: modelOperaData['costtime']
                });
              }
            }
            data.action = action;
            break;
          }
        }
        if (!flag) {
          const action = [];
          this.actionList.forEach(actionL => {
            if (actionL === modelOperaData['action']) {
              action.push({
                name: modelOperaData['action'],
                costtime: modelOperaData['costtime']
              });
            } else {
              action.push({
                name: actionL,
                costtime: 0
              });
            }
          });
          dataArray.push({
            Checked: false,
            modelOperationID: modelOperaData['modelOperationID'],
            process: modelOperaData['process'],
            Module: modelOperaData['Module'],
            material: modelOperaData['material'],
            factor: modelOperaData['factor'],
            factorDetail: modelOperaData['factorDetail'],
            count: modelOperaData['count'],
            action: action,
            total: modelOperaData['costtime'],
          });
        }
      });
      dataArray.forEach(data => {
        const action = data.action;
        const length = action.length;
        for (let i = length; i < this.actionList.length; i++) {
          const actionL = this.actionList[i];
          action.push({
            name: actionL,
            costtime: 0
          });
        }
        this.dataSet = [...this.dataSet, {
          Checked: false,
          modelOperationID: data.modelOperationID,
          process: data.process,
          Module: data.Module,
          material: data.material,
          factor: data.factor,
          factorDetail: data.factorDetail,
          count: data.count,
          action: action,
          total: (data.total * data.count)
        }];
      });
      this.showSpan();
      this.updateEditCache();
    });
  }

  // IsRfq 顯示與綁定 事件
  showSpan() {
    this.isSpanShowFlag = true;
    this.rfqMapping = true;
    this.targetSignFlag = false;
    this.spanPlant = this.querySelect.plant.value;
    this.spanCustomer = this.querySelect.custom.value;
    this.spanFamily = this.querySelectOther.tempProCodeData[this.querySelect.proName.value]['Label'];
    const pName = this.querySelect.proName.select.selectList.find(t => this.querySelect.proName.value === t['Value']);
    this.spanName = pName['Label'];
    // 查询出 CFlow的名字
    const cFlow = this.querySelect.cFlow.select.selectList.find(t => this.querySelect.cFlow.value === t['Value']);
    this.spanCFlow = !cFlow ? '' : cFlow['Label'];
    if (this.spanCFlow === 'RFQ') {
      this.workhourMaintainService.queryTargetSign(this.querySelect.cFlow.value, this.querySelect.process.value).subscribe(d => {
        this.targetSignFlag = d;
      });
    }
    this.workhourMaintainService.queryRfqInfo(this.querySelect.proName.value).subscribe(rfqInfo => {
      this.rfqFamilySelectValue = rfqInfo['RfqProjectCode'];
      this.rfqNameSelectValue = rfqInfo['RfqProjectName'];
      this.rfqShowSpan = rfqInfo['IsRfq'];
      // IsRfq綁定
      if (!rfqInfo['RfqProjectName'] && !rfqInfo['IsRfq']) {
        this.rfqMapping = false;
        this.rfqFamilySelectList = [rfqInfo['RfqProjectCode']];
        this.rfqFamilySelectValue = rfqInfo['RfqProjectCode'];
        this.rfqNameSelectList = [];
        this.projectNameProfileServer.find<ProjectNameProfileInterface>({
          where: {
            'and': [{
              'ProjectCode': rfqInfo['RfqProjectCode']
            },
            {
              'IsPLMProject': false
            }
            ]
          },
          include: ['basicModels', 'projectCodeProfile']
        }).subscribe(NameDatas => {
          NameDatas.forEach(NameData => {
            if (NameData.basicModels.length === 0) {
              return;
            }
            this.rfqNameSelectList.push({
              'Label': NameData.projectCodeProfile.Plant + '-' + NameData.ProjectName,
              'ProjectNameID': NameData.ProjectNameID
            });
          });
        });
      }
    });
  }

  // 更新列表中的ActionList
  updateActionList(action: string) {
    if (!this.actionList.includes(action)) {
      let index: number;
      if (this.stageIDFlag) {
        index = (this.nzWidthConfig.length - 3);
      } else {
        index = (this.nzWidthConfig.length - 2);
      }
      this.actionList.push(action);
      this.nzWidthConfig.splice(index, 0, '80px');
      this.nzScrollX += 80;
      this.nzScroll = {
        x: this.nzScrollX + 'px',
        y: (this.dfcModelWorkhour.nativeElement.offsetHeight - 185) + 'px'
      };
    }
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {}; // 清理缓存状态
    this.dataSet.forEach(item => {
      if (!this.editCache[item.modelOperationID]) {
        this.editCache[item.modelOperationID] = {
          edit: false,
          data: {
            ...item
          }
        };
      }
    });
  }

  // nzCurrentPageDataChange -- 當前頁面展示的回調函數
  currentPageDataChange($event: Array<DFCWorkhourMaintainTabelData>) {
    this.displayData = $event;
  }

  // 頁數改變(nzPageSizeChange), 頁碼改變(nzPageIndexChange) 時用的回調函數, 刷新table信息
  refreshStatus() {
    const allChecked = this.displayData.every(value => value.Checked === true);
    const allUnChecked = this.displayData.every(value => !value.Checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledDeleteButton = !this.dataSet.some(value => value.Checked);
    this.checkedNumber = this.dataSet.filter(value => value.Checked).length;
  }

  // 全選事件
  checkAll(value: boolean) {
    this.displayData.forEach(data => {
      data.Checked = value;
    });
    this.refreshStatus();
  }

  // 表格编辑事件
  startEdit(key: string, index: number) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.editrow = key;
    this.editIndex = index;
  }

  saveEdit(key: string) {
    this.inputClick = false;
    this.inputBlur = false;
    const updataData = {
      Count: this.editCache[key].data['count']
    };
    const logData = {
      New: this.editCache[key].data['count'],
      Old: this.dataSet[this.editIndex]['count'],
      ModelOperationID: this.dataSet[this.editIndex]['modelOperationID'],
      Process: this.dataSet[this.editIndex]['Process'],
    };
    if (this.editCache[key].data['count'] === '0' || !this.editCache[key].data['count']) {
      this.modelOperationsServer.deleteById(key).subscribe(rs => {
        this.editCache[key].edit = false;
        this.isEditSaveVisible = false;
        this.actionEnabled = true;
        this.editrow = '';
        this.dataSet = this.dataSet.filter(d => d.modelOperationID !== key);
      }, error => console.log('error:\n' + error));
    } else {
      this.modelOperationsServer.patchAttributes(key, updataData).subscribe(rs => {
        this.editCache[key].edit = false;
        this.isEditSaveVisible = false;
        this.actionEnabled = true;
        this.editrow = '';
        this.dataSet[this.editIndex]['count'] = this.editCache[key].data['count'];
      }, error => console.log(error));
    }
    // 將操作信息存入緩存
    const pName = this.querySelect.proName.select.selectList.find(proData => proData['Value'] === this.querySelect.proName.value);
    const stage = this.querySelect.cFlow.select.selectList.find(stageData => stageData['Value'] === this.querySelect.cFlow.value);
    const logMsg = 'update\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
      '\nProjectCode: ' + this.querySelectOther.tempProCodeData[this.querySelect.proName.value]['Label'] +
      ' [ProjectCodeID: ' + this.querySelectOther.tempProCodeData[this.querySelect.proName.value]['Value'] +
      ']\tProjectName: ' + pName['Label'] + '[ProjectNameID: ' + pName['Value'] +
      ']\tC流程: ' + stage['Label'] + '[StageID: ' + stage['Value'] +
      ']\tModelOperationID: ' + logData.ModelOperationID + '\tProcess: ' + logData.Process +
      '\n修改信息, 如下:\n' + 'Count: ' + logData.Old + ' -> ' + logData.New;
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '機種工時資料維護',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }

  // 失去焦点时, 弹出是否储存对话框
  onblurEdit(key: string) {
    this.inputBlur = true; // 記錄input編輯框是否 失去焦點, 默認為false
    this.inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
    setTimeout(() => {
    }, 500);
  }

  onclickEdit(key: string) {
    this.inputClick = true;
    this.inputBlur = false;
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
    this.isEditSaveVisible = false;
    this.inputClick = false;
    this.inputBlur = false;
    this.editrow = '';
  }

  handleUploadFile(input) {
    this.fileToUpload = input.files.item(0);
    if (this.fileToUpload) {
      const fileType = this.fileToUpload.type;
      let fileErrMsg = '';
      const validExts = new Array('.xlsx', '.xls', '.csv');
      let fileExt = this.fileToUpload.name;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        fileErrMsg = 'Invalid file type. Only Excel types are accepted.';
      }
      if (!!fileErrMsg) {
        this.message.create('error', fileErrMsg);
        this.fileToUpload = null;
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.fileToUpload.name;
    } else {
      this.uploadFileName = '';
    }
  }

  upload(file) {
    if (!this.querySelect.cFlow.value) {
      this.message.create('error', this.trans['must-select-C']);
    } else {
      this.showLoading = true;
      this.fileService.postDFCFile(file, 'model', {
        stageid: this.querySelect.cFlow.value,
        process: this.querySelect.process.value
      }).subscribe(data => {
        this.message.create('success', 'Upload successfully!');
        this.showLoading = false;
        // 將操作信息存入緩存
        const logMsg = 'upload\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
          '\n上傳文件信息, 如下:\n' + JSON.stringify(data);
        this.operationLogServer.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: '機種工時資料維護',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
      }, error => {
        const err = 'Upload failed: ' + JSON.stringify(error.error.error.message);
        this.message.create('error', err);
        this.showLoading = false;
      });
    }
  }

  download() {
    if (!this.querySelect.plant.value || !this.querySelect.cFlow.value) {
      this.message.create('error', this.trans['must-plant-C']);
    } else {
      this.fileService.downloadDFCFile(
        this.querySelect.process.value,
        this.querySelect.plant.value,
        this.querySelect.productType.value,
        this.querySelect.cFlow.value);
    }
  }

  // 綁定RFQ資料
  saveRFQ() {
    if (!this.rfqNameSelectValue) {
      this.message.create('error', this.trans['must-rfq-proname']);
      return;
    }
    this.projectNameProfileServer.getBasicModels(this.rfqNameSelectValue).pipe(
      flatMap(x => x), // rfq的BasicModel
      map((x: BasicModelInterface) => {
        return this.basicModelService.patchAttributes(x.modelId, {
          projectNameId: this.querySelect.proName.value
        }); // 把rfq的projectNameId 修改為BA的projectNameId
      }),
      mergeMap(x => x)
    ).subscribe();
    this.projectNameProfileServer.getGroupModels(this.rfqNameSelectValue).pipe(
      flatMap(x => x),
      map((x: GroupModelInterface) => {
        return this.groupModelService.patchAttributes(x.groupModelId, {
          projectNameId: this.querySelect.proName.value
        }); // 把rfq的projectNameId 修改為BA的projectNameId
      }),
      mergeMap(x => x)
    ).subscribe();
    this.projectNameProfileServer.findById(this.rfqNameSelectValue).pipe(
      map(
        (oldProjectName: ProjectNameProfileInterface) => {
          return this.projectNameProfileServer.patchAttributes(this.querySelect.proName.value, {
            RfqProjectCode: oldProjectName.ProjectCode,
            RfqProjectName: oldProjectName.ProjectName
          }); // 講綁定的rfq機種，綁定給該BA機種
        }
      ),
      switchMap(x => x)
    ).subscribe();
    this.projectCodeProfileServer.find({ where: { ProjectCode: this.rfqFamilySelectValue } }).pipe(
      flatMap(x => x),
      map(
        (oldProjectCode: ProjectCodeProfileInterface) => {
          return this.projectCodeProfileServer.patchAttributes(this.querySelect.proCode.value, {
            RfqDueDay: oldProjectCode.RfqDueDay
          });
        }
      )
    ).subscribe();
    this.projectNameProfileServer.patchAttributes(this.rfqNameSelectValue, {
      Status: 4
    }).subscribe(data => {
      this.message.create('success', 'Saved successfully！');
      this.showSpan();
    });
  }

  // 刪除相關事件
  operateDelete() {
    this.isDeleteVisible = true;
  }

  cancelDelete() {
    this.dataSet.forEach(data => data.Checked = false);
    this.isDeleteVisible = false;
    this.refreshStatus();
    this.operating = false;
  }

  Delete() {
    const deleteIDs: string[] = [];
    this.dataSet.forEach(data => {
      if (data.Checked) {
        deleteIDs.push(data.modelOperationID);
      }
    });
    for (let i = 0; i < deleteIDs.length; i++) {
      if (i === (deleteIDs.length - 1)) {
        this.modelOperationsServer.deleteById(deleteIDs[i]).subscribe(rs => {
          this.query();
          this.isDeleteVisible = false;
          this.isAfterDeleteVisible = true;
          this.refreshStatus();
          this.operating = false;
          setTimeout(() => {
            this.isAfterDeleteVisible = false;
          }, 1000);
        }, error => {
          console.log('error:\n' + error);
        });
      } else {
        this.modelOperationsServer.deleteById(deleteIDs[i]).subscribe(rs => { }, error => console.log('error:\n' + error));
      }
    }
  }

  cloneOperationTime() {
    const index = this.querySelect.cFlow.select.selectList.findIndex(d => d.Value === this.querySelect.cFlow.value);
    if (index < 1) {
      this.message.create('error', this.trans['no-workhour']);
      return;
    }
    const data = this.querySelect.cFlow.select.selectList[index - 1];
    this.modelOperationsServer.CloneOperationTime(data['Value'], this.querySelect.cFlow.value).subscribe(res => {
      this.message.create('success', this.trans['apply-success']);
    }, error => {
      this.message.create('error', this.trans['apply-fail']);
      console.log(error);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * 頁面表格資料 類
 */
export class DFCWorkhourMaintainTabelData {
  Checked: boolean; // 該列是否選中
  modelOperationID: number; // ID值, 為ModelOperation的標誌
  process: string; // 製程
  Module: string; // 模塊
  material: string; // 物料
  factor: string; // 因素
  factorDetail: string; // 因素細項
  count: number; // 數量
  action: {
    name: string, // 動作名稱
    costtime: number // 花費時間
  }[];
  total: number; // 總花費時間
}
