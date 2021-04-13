import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { FileService } from '@service/file.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { NewmodelMaintainService } from './newmodel-maintain.service';
import { DfcNewmodelMaintainQuery } from './newmodel-maintain';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { PlantNamePipe } from 'app/shared/pipe';
import { ProjectCodeProfileApi, ProjectNameProfileApi, ProjectMemberApi, ProjectMember, MemberApi, LoopBackFilter, ProjectModuleApi, OperationLogApi, ProjectCodeProfile, Member } from '@service/dfc_sdk/sdk';
import { LoopBackAuth } from '@service/portal/sdk/services';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-newmodel-maintain',
  templateUrl: './newmodel-maintain.component.html',
  styleUrls: ['./newmodel-maintain.component.scss']
})

export class NewmodelMaintainComponent implements OnInit, OnDestroy {
  stageShowFlag = true; // C0~C1是否顯示
  // 查詢條件使用的參數
  // 查询时下拉框设定
  // 只顯示Status為Ongoing的Project
  showAll = true;
  currentIndex = 0;
  ModelTypeSelectValue: string; // modeltype 下拉框选值
  listOfModelTypeSelectOption = []; // modeltype下拉框内容
  allChecked = false;
  disabledDeleteButton = true;
  checkedNumber = 0;
  displayData: Array<DFCNewModelTableData> = [];
  data = []; // 表格数据暂存
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editrow = ''; // 记录编辑状态时的表格行序号, 方便失去焦点时做判断
  // 編輯后失去焦點 聯合判斷, inputBlur = true && inputClick = false 時 彈出儲存框
  inputBlur = false; // 記錄input編輯框是否 失去焦點, 默認為false
  inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
  isEditSaveVisible = false; // 储存框是否出现
  isDeleteVisible = false; // 刪除對話框是否出現
  isAfterDeleteVisible = false; // 刪除后對話框是否出現
  indeterminate = false;
  operating = false;
  queryLoading = false;
  isProjectMemberListVisible = false; // 對話框是否出現
  proCodeDataCache = []; // 對新增Member進行緩存
  proCodeID: string; // 暂存点击进来后的projectCodeID
  proCode: string; // 暫存點擊進來後的projectCode
  isEditMemberVisible = false; // ProjectMember新增對話框是否出現
  isSamePlant: boolean; // ProjectMember新增刪除的時候, 只有該廠的人才有權限操作
  roles = ['NPI', 'IE', 'PE', 'PME', 'Packing PME', 'QA', 'SQM', 'EE', 'ME', 'Packing ME', 'PM']; // role下拉框的值
  memberSearchChange$ = new BehaviorSubject('');
  isMemberListLoading = false;
  isRoleListLoading = false;
  proCustomer: string; // 记录当前ProjectCodeProfile中的  Customer是否有值, 没有的话在新增的时候, 改变其值
  // Schedule 點擊下一頁所需的參數
  isScheduleDataVisible = false; // 對話框是否出現
  scheduleDataSet = new DFCNewModelScheduleData(); // 對話框中的表格數據
  // 新增ProjectName
  isAddProjectNameVisible = false;     // 對話框是否出現
  isDFiLeader = false;  // 判斷是否是 有 ProjectName的修改權限
  userID = '';
  userPlant = '';
  userSite = '';
  userRole = '';
  addProjectNameDataCache = {
    ProjectName: '',
    ProjectCode: '',
    ProjectCodeID: '',
    FCST: '',
    RunIn: '',
    IsPLMProject: false,
    IsRfq: false
  };   // 暂存的新增数据
  addProjectNameInput: string; // 新增时ProjectName输入框中的值
  addProjectNameFlag = false; // 新增时判断 输入是否合法, 不正确, 则出现提示
  addProjectNameSpan = '该Project Name已存在！'; // 新增时判断 输入是否合法, 不正确, 则出现提示内容
  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  listOfAvailables = [
    { text: '可用', value: true },
    { text: '不可用', value: false }
  ];
  listOfSearchAvailables = [];
  @ViewChild('DFCNewModel') dfcNewModel: ElementRef;
  nzWidthConfig = ['65px', '75px', '85px', '150px', '105px', '105px', '105px', '150px', '150px', '120px',
    '180px', '220px', '220px', '150px', '120px', '150px', '120px', '120px'];
  nzScroll: {} = {
    x: this.nzWidthConfig.reduce((p, t) => {
      return p + parseInt(t, 10);
    }, 0) + 'px'
  };
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['ModelProfiles']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [];
  querySelect = { ...DfcNewmodelMaintainQuery };
  queryValue = {  // 暂存 查询时的 proCode与proName
    proCode: '',
    proName: ''
  };
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelectOther = {
    tempProCodeData: {} // 暫存 Project Code 內容
  };
  productType = [];
  // 新增Model的model
  addModelVisible = false;
  addGroupModelVisible = false;
  isModelDeleteVisible = false;
  addGroupModelType = '新增';
  // 編輯的model
  editModel = {
    type: 1,
    modelName: '',
    productType: '',
    FCST: '',
    isMilitary: true
  };
  editGroupModel;
  // originData
  modelDataSet;
  deleteItem;
  groupModelMappingSelect;
  isGroupModelMapping;
  searchRole; // MemberList搜索角色使用
  searchMember; // MemberList搜索人員使用
  // mrr流程所用全局變量
  mrrShowFlag = false; // mrr流程展示flag
  oldMrrData; // 編輯之前的mrr資料
  addMrrRemarkFlag = false;  // mrr不做原因填寫flag
  allMrrRemarkFlag = false;  // 所有mrr模塊不做原因填寫flag
  mrrRemarkconfirmLoading = false; // mrr不做原因填寫確認loading
  allmrrRemarkconfirmLoading = false;
  inputMrrRemark; // mrr不做原因的雙向綁定
  inputAllMrrRemark; // mrr所有模塊不做的原因雙向綁定
  mrrModuleTitle; // mrr不做原因的彈框標題雙向綁定
  addMrrRemarkData;  // 填寫理由的資料
  mrrRemarks; // 顯示的mrr流程不做原因
  // DFQ流程所用全局变量
  DFQFlag = true;
  DFQShowFlag = false; // DFQ流程展示flag
  oldDFQData; // 編輯之前的DFQ資料
  addDFQRemarkFlag = false;  // DFQ不做原因填寫flag
  DFQRemarkconfirmLoading = false; // DFQ不做原因填寫確認loading
  inputDFQRemark; // DFQ不做原因的雙向綁定
  DFQModuleTitle; // DFQ不做原因的彈框標題雙向綁定
  addDFQRemarkData;  // 填寫理由的資料
  DFQRemarks; // 顯示的DFQ流程不做原因
  selectedProjecCode: ProjectCodeProfile;
  members: ProjectMember[];
  editingMember = new ProjectMember();
  modelDatas;
  searchRoles;
  showSelect = false;
  showSelectIcon = true;
  searchEnames;
  showSelect2 = false;
  showSelectIcon2 = true;
  editData;
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private projectCodeProfileService: ProjectCodeProfileApi,
    private projectNameProfileServer: ProjectNameProfileApi,
    private projectMemberService: ProjectMemberApi,
    private memberService: MemberApi,
    private message: NzMessageService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private operationLogServer: OperationLogApi,
    private dfcSelectService: DfcSelectNewService,
    private newmodelMaintainService: NewmodelMaintainService,
    private projectModuleApi: ProjectModuleApi,
    private plantNamePipe: PlantNamePipe,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private authService: LoopBackAuth,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.DFILeader();
    this.initSelect(); // 初始化下拉框
    this.initModelTypeSelect();
    this.nzScroll = {
      x: this.nzWidthConfig.reduce((p, t) => {
        return p + parseInt(t, 10);
      }, 0) + 'px'
      , y: (this.dfcNewModel.nativeElement.offsetHeight - 130) + 'px'
    };
    this.route.params.subscribe(r => {
      if (!r.projectCodeID || !r.projectNameID) {
        return;
      }
      this.projectCodeProfileService.findById(r.projectCodeID).subscribe(data => {
        this.querySelect.proCode.select.selectList = [{ Value: data['ProjectCodeID'], Label: data['ProjectCode'] }];
        this.querySelect.proCode.value = data['ProjectCodeID'];
      });
      this.projectNameProfileServer.findById(r.projectNameID).subscribe(data => {
        this.querySelect.proName.select.selectList = [{ Value: data['ProjectNameID'], Label: data['ProjectName'] }];
        this.querySelect.proName.value = data['ProjectNameID'];
      });
      this.route.queryParams.subscribe(d => {
        if (!!d.Plant) {
          this.querySelect.plant.value = d.Plant;
        }
        this.query(r.projectCodeID, r.projectNameID);
      });
    });
    this.route.queryParams.subscribe(param => {
      if (param['Plant'] && param['ProjectNameID']) {
        this.querySelect.plant.value = param['Plant'];
        this.showAll = false;
        this.projectNameProfileServer.findById(param['ProjectNameID']).subscribe(data => {
          this.querySelect.proName.select.selectList = [{ Value: data['ProjectNameID'], Label: data['ProjectName'] }];
          this.querySelect.proName.value = data['ProjectNameID'];
          this.query();
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
    this.querySelect.proName.value = '';
    this.querySelect.proCode.value = '';
    // 初始化I18N;
    this.translate.get(['dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'base-data.nudd-automatic-evaluation', 'base-data.product-standard-document',
      'base-data.automatic-tracking-of-material-yield', 'base-data.vendor-information-management', 'base-data.yield-prediction-of-new-rfi-models',
      'base-data.not-maintain-product', 'base-data.fill-remark-notice',
      'base-data.notDo-nudd-title', 'base-data.notDo-product-title', 'base-data.notDo-material-title', 'base-data.notDo-vendor-title', 'base-data.notDo-rfi-title']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfq.dfq-plant'];
        this.querySelect.custom.style.label = res['dfq.dfq-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.trans['nudd'] = res['base-data.nudd-automatic-evaluation'];
        this.trans['product'] = res['base-data.product-standard-document'];
        this.trans['material'] = res['base-data.automatic-tracking-of-material-yield'];
        this.trans['vendor'] = res['base-data.vendor-information-management'];
        this.trans['rfi'] = res['base-data.yield-prediction-of-new-rfi-models'];
        this.trans['not-maintain-product'] = res['base-data.not-maintain-product'];
        this.trans['fill-remark-notice'] = res['base-data.fill-remark-notice'];
        this.trans['notDo-nudd-title'] = res['base-data.notDo-nudd-title'];
        this.trans['notDo-product-title'] = res['base-data.notDo-product-title'];
        this.trans['notDo-material-title'] = res['base-data.notDo-material-title'];
        this.trans['notDo-vendor-title'] = res['base-data.notDo-vendor-title'];
        this.trans['notDo-rfi-title'] = res['base-data.notDo-rfi-title'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'base-data.nudd-automatic-evaluation', 'base-data.product-standard-document',
        'base-data.automatic-tracking-of-material-yield', 'base-data.vendor-information-management', 'base-data.yield-prediction-of-new-rfi-models',
        'base-data.not-maintain-product', 'base-data.fill-remark-notice',
        'base-data.notDo-nudd-title', 'base-data.notDo-product-title', 'base-data.notDo-material-title', 'base-data.notDo-vendor-title', 'base-data.notDo-rfi-title']).subscribe(res => {
          this.querySelect.plant.style.label = res['dfq.dfq-plant'];
          this.querySelect.custom.style.label = res['dfq.dfq-customer'];
          this.querySelect.productType.style.label = res['dfq.dfq-product'];
          this.trans['nudd'] = res['base-data.nudd-automatic-evaluation'];
          this.trans['product'] = res['base-data.product-standard-document'];
          this.trans['material'] = res['base-data.automatic-tracking-of-material-yield'];
          this.trans['vendor'] = res['base-data.vendor-information-management'];
          this.trans['rfi'] = res['base-data.yield-prediction-of-new-rfi-models'];
          this.trans['not-maintain-product'] = res['base-data.not-maintain-product'];
          this.trans['fill-remark-notice'] = res['base-data.fill-remark-notice'];
          this.trans['notDo-nudd-title'] = res['base-data.notDo-nudd-title'];
          this.trans['notDo-product-title'] = res['base-data.notDo-product-title'];
          this.trans['notDo-material-title'] = res['base-data.notDo-material-title'];
          this.trans['notDo-vendor-title'] = res['base-data.notDo-vendor-title'];
          this.trans['notDo-rfi-title'] = res['base-data.notDo-rfi-title'];
        });
    });
    // 初始化下拉框
    this.initPlantSelect();
    this.initBuSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.initProCodeSelect();
    this.initProNameSelect();
    // 獲取產品下拉框中數據
    this.productTypeSelect();
  }

  // 廠別下拉框選擇
  async initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.plant.select.selectList = data);
    for (const item of this.querySelect.plant.select.selectList) {
      item.Label = await this.plantNamePipe.transform(item.Value);
    }
    // 对厂别自动带入本厂的标签
    this.querySelect.plant.value = localStorage.getItem('DFC_Plant');
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      this.querySelect.bu.value = '';
      this.querySelect.custom.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      if (!!datas) {
        this.customerSelect(datas);
        this.buSelect(datas); // 改變 BU 的值
        this.proCodeSelect(datas);
        this.proNameSelect(datas);
      }
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
      if (!!this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, datas);
        this.proCodeSelect(this.querySelect.plant.value, datas, '', this.querySelect.productType.value);
        this.proNameSelect(this.querySelect.plant.value, datas, '', this.querySelect.productType.value);
      }
      this.querySelect.custom.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
    });
    // 搜索相關查詢
    const searchBuList = (bu?) => {
      return of(bu);
    };
    const searchBuList$: Observable<string[]> = this.querySelect.bu.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchBuList$.subscribe(datas => {
      if (!!this.querySelect.plant.value) {
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
        this.proCodeSelect(this.querySelect.plant.value, this.querySelect.bu.value, datas, this.querySelect.productType.value);
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.bu.value, datas, this.querySelect.productType.value);
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
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      if (!!this.querySelect.plant.value) {
        this.proCodeSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          datas);
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          datas);
      }
    });
  }

  productTypeSelect() {
    this.dfcSelectService.getProductType().subscribe(data => {
      this.querySelect.productType.select.selectList = data;
      data.forEach(arg => {
        if (!this.productType.includes(arg.Value)) {
          this.productType.push(arg.Value);
        }
      });
    });
  }

  // Project Code下拉框
  initProCodeSelect() {
    // 監聽下拉框的值改變
    const changeProCodeList = (pCode?) => {
      return of(pCode);
    };
    const changeProCodeList$: Observable<string> = this.querySelect.proCode.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProCodeList$.subscribe(datas => {
      if (!!this.querySelect.plant.value && !!datas) {
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          this.querySelect.productType.value,
          datas
        );
      }
    });
    // 搜索相關查詢
    const searchProCodeList = (pCode?) => {
      return of(pCode);
    };
    const searchProCodeList$: Observable<string[]> = this.querySelect.proCode.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProCodeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProCodeList$.subscribe(datas => {
      if (!!this.querySelect.plant.value) {
        this.proCodeSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          this.querySelect.productType.value,
          datas); // 改變Plant的值
      }
    });
  }

  proCodeSelect(plant?, bu?, custom?, productType?, proCode?) {
    this.newmodelMaintainService.getProCode(plant, bu, custom, productType, proCode, this.showAll).subscribe(data => {
      this.querySelect.proCode.select.selectList = data.reduce((p, t) => {
        if (!p['temp'].includes(t['Label'])) {
          p['temp'].push(t['Label']);
          p['res'].push(t);
        }
        return p;
      }, { 'temp': [], 'res': [] })['res'];
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
      if (!!datas) {
        this.querySelect.proCode.select.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
      } else {
        this.querySelect.proCode.value = '';
        this.proCodeSelect(this.querySelect.plant.value, this.querySelect.bu.value, this.querySelect.productType.value);
      }
    });
    // 搜索相關查詢
    const searchProNameList = (pName?) => {
      return of(pName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProNameList$.subscribe(datas => {
      if (!!this.querySelect.plant.value) {
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.bu.value,
          this.querySelect.custom.value,
          this.querySelect.productType.value,
          this.querySelect.proCode.value,
          datas); // 改變Plant的值
      }
    });
  }

  proNameSelect(plant?, bu?, custom?, productType?, proCode?, proName?) {
    this.newmodelMaintainService.getProName(plant, bu, custom, productType, proCode, proName, this.showAll).subscribe(data => {
      this.querySelect.proName.select.selectList = data['proName'].reduce((p, t) => {
        if (!p['temp'].includes(t['Label'])) {
          p['temp'].push(t['Label']);
          p['res'].push(t);
        }
        return p;
      }, { 'temp': [], 'res': [] })['res'];
      this.querySelectOther.tempProCodeData = data['proCode'];
    });
  }

  initModelTypeSelect() {
    this.listOfModelTypeSelectOption = []; // 清空选择框中的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.listOfModelTypeSelectOption = datas;
    });
  }

  StatusMapping(a: number) {
    const mappingTable = ['On Going', 'End Of Life', 'Closed', 'Pending', 'RFQ Mapping'];
    return mappingTable[a];
  }

  // 查詢按鈕查詢事件
  async query(proCodeID?, proNameID?, all = false) {
    // 清空proCode与proName的值
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.queryLoading = true;
    const tmpIndex = this.currentIndex;
    if (!!this.editrow) {
      this.cancelEdit(this.editrow);
    }
    if (!this.querySelect.plant.value) {
      this.message.error('Please select the plant！');
      this.queryLoading = false;
      return;
    }
    if (this.querySelect.plant.value === localStorage.getItem('DFC_Plant')) {
      this.isSamePlant = true;
    } else {
      this.isSamePlant = false;
    }
    // route 進入
    let query: LoopBackFilter;
    if (proCodeID && proNameID) {
      query = {
        include: [{
          relation: 'projectNames',
          scope: {
            where: {
              ProjectNameID: proNameID
            },
            include: [{ 'militaryOrders': 'workflow' }, 'projectModules']
          }
        }, 'BU', 'member'],
        where: {
          ProjectCodeID: proCodeID,
          Plant: this.querySelect.plant.value
        }
      };
    } else {
      query = {
        where: {
          'Plant': this.querySelect.plant.value
        },
        include: [{
          relation: 'projectNames',
          scope: {
            where: {
            },
            include: [{ 'militaryOrders': 'workflow' }, 'projectModules']
          }

        }, 'BU', 'member']
      };
      if (this.showAll) {
        query.include[0].scope.where['Status'] = 0;
      }
      if (!!this.querySelect.proCode.value) {
        const proCode = this.querySelect.proCode.select.selectList.find(d => d.Value === this.querySelect.proCode.value);
        this.queryValue.proCode = proCode.Label;
        query.where['ProjectCode'] = this.queryValue.proCode;
      }
      if (!!this.querySelect.proName.value) {
        const proName = this.querySelect.proName.select.selectList.find(d => d.Value === this.querySelect.proName.value);
        this.queryValue.proName = proName.Label;
        query.include[0].scope.where['ProjectName'] = this.queryValue.proName;
      }
      if (!!this.querySelect.custom.value) {
        query.where['Customer'] = this.querySelect.custom.value;
      }
      if (!!this.querySelect.productType.value) {
        query.where['ModelType'] = this.querySelect.productType.value;
      }
      if (!!this.querySelect.plmStatus.value) {
        query.where['PLMProjectStatus'] = this.querySelect.plmStatus.value;
      }
    }
    this.projectCodeProfileService.find(query).subscribe((data: ProjectCodeProfile[]) => {
      data = data.filter(x => x.projectNames.length > 0);
      // flat map
      const rfqCodes: {}[] = [];
      data.forEach(element => {
        rfqCodes.push(...element['projectNames'].map(y => y['RfqProjectCode']).filter(x => x != null && x !== '' && x !== 'None'));
      });
      this.projectCodeProfileService.find({
        where: {
          ProjectCode: { inq: rfqCodes },
          field: ['ProjectCode']
        },
        include: 'member'
      }).subscribe(rfqDatas => {
        const rfqCode = rfqDatas.map(x => x['ProjectCode']);
        let dfcNewModelScheduleData: DFCNewModelScheduleData; // 暫存Project Code的C0~C6資料
        data = data.filter(data => {
          if (!!this.querySelect.bu.value) {
            if (!!data['BU'] && data['BU']['BU'] === this.querySelect.bu.value) {
              return data;
            }
          } else {
            return data;
          }
        });
        this.data = [];
        let index = 0; // dataSetde No計數器
        data.forEach(codeData => {
          const stageShowFlag = false;
          let available;
          if (codeData['Status']) {
            available = '可用';
          } else {
            available = '不可用';
          }
          dfcNewModelScheduleData = {
            RfqDueDate: this.changeScheduleData(codeData['RfqDueDay']),
            C0DueDate: stageShowFlag ? this.changeScheduleData(codeData['C0DueDay']) : '',
            C1DueDate: stageShowFlag ? this.changeScheduleData(codeData['C1DueDay']) : '',
            C2DueDate: this.changeScheduleData(codeData['C2DueDay']),
            C3DueDate: this.changeScheduleData(codeData['C3DueDay']),
            C4DueDate: this.changeScheduleData(codeData['C4DueDay']),
            C5DueDate: this.changeScheduleData(codeData['C5DueDay']),
            C6DueDate: this.changeScheduleData(codeData['C6DueDay'])
          };
          codeData['projectNames'].forEach(nameData => {
            nameData.projectModules.forEach(module => {
              if (module['moduleName'] === 'nudd') {
                nameData['nudd'] = module['enabled'];
                nameData['nuddId'] = module['id'];
                nameData['nuddRemark'] = module['remark'];
              } else if (module['moduleName'] === 'material') {
                nameData['material'] = module['enabled'];
                nameData['materialId'] = module['id'];
                nameData['materialRemark'] = module['remark'];
              } else if (module['moduleName'] === 'productDocument') {
                nameData['productDocument'] = module['enabled'];
                nameData['productDocumentId'] = module['id'];
                nameData['productDocumentRemark'] = module['remark'];
              } else if (module['moduleName'] === 'vendorFile') {
                nameData['vendorFile'] = module['enabled'];
                nameData['vendorFileId'] = module['id'];
                nameData['vendorFileRemark'] = module['remark'];
              } else if (module['moduleName'] === 'rfi') {
                nameData['rfi'] = module['enabled'];
                nameData['rfiId'] = module['id'];
                nameData['rfiRemark'] = module['remark'];
              }
            });
            // 定義一個mrr模塊全選
            if (nameData['nudd'] && nameData['material'] && nameData['vendorFile'] && nameData['productDocument']) {
              nameData['allModule'] = true;
            } else {
              nameData['allModule'] = false;
            }
            if (((nameData['ProjectName'] + '') === this.queryValue.proName
              || (!this.queryValue.proName))) {
              index++;
              const plant = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === codeData['Plant']);
              this.data = [...this.data, {
                isPM: codeData['member'].findIndex(x => x.MemberID === this.userID && x.Role === 'PM') > -1 || codeData['ProjectPM'] === this.userID,
                isRoleNPI: codeData.member.some(member => this.authService.getToken().userId === member.MemberID),
                ProjectCodeID: codeData['ProjectCodeID'],
                ProjectPM: codeData['ProjectPM'],
                Checked: false,
                IsPLMProject: nameData['IsPLMProject'],
                IsRfq: nameData['IsRfq'],
                No: (index + ''),
                Plant: (!plant) ? codeData['Plant'] : plant['Plant'],
                Site: (!plant) ? codeData['Plant'] : plant['Site'],
                BU: codeData['BU'] ? codeData['BU']['BU'] : '',
                PlantCode: codeData['Plant'],
                ProjectCode: codeData['ProjectCode'],
                ModelType: codeData['ModelType'],
                Customer: codeData['Customer'],
                ProjectNameID: nameData['ProjectNameID'],
                ProjectName: nameData['ProjectName'],
                member: codeData.member,
                Schedule: dfcNewModelScheduleData,
                StageShowFlag: stageShowFlag,
                FCST: nameData['FCST'],
                RunIn: nameData['RunIn'],
                Status: nameData['Status'],
                Status2: codeData['Status'], // 1/0
                available: available, // 可用/不可用
                PLMProjectStatus: codeData['PLMProjectStatus'],
                Remark: nameData['Remark'],
                RfqProjectCode: nameData['RfqProjectCode'],
                hasRfq: rfqCode.includes(nameData['RfqProjectCode']),
                rfqMapping: (!nameData['IsRfq'] && !!nameData['RfqProjectName']) || nameData['IsRfq'],
                expand: false,
                // 军令状是否启动, 启动之后, 无法再对该机种进行修改
                militaryFlag: (!!nameData['militaryOrders'] && (!!nameData['militaryOrders']['signID'] || nameData['militaryOrders']['signID'] === 0)),
                disMrrCheckBox: true, // 添加mrr個流程
                nuddId: nameData['nuddId'],
                materialId: nameData['materialId'],
                productDocumentId: nameData['productDocumentId'],
                vendorFileId: nameData['vendorFileId'],
                nudd: nameData['nudd'],
                material: nameData['material'],
                productDocument: nameData['productDocument'],
                vendorFile: nameData['vendorFile'],
                nuddRemark: nameData['nuddRemark'],
                materialRemark: nameData['materialRemark'],
                productDocumentRemark: nameData['productDocumentRemark'],
                vendorFileRemark: nameData['vendorFileRemark'],
                // 添加DFQ流程
                disDFQCheckBox: true,
                rfiId: nameData['rfiId'],
                rfi: nameData['rfi'],
                rfiRemark: nameData['rfiRemark'],
                allModule: nameData['allModule']
              }];
            }
          });
        });
        this.queryLoading = false;
        this.updateEditCache();
        this.refreshStatus();
        this.currentIndex = tmpIndex;
      });
    });
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {};
    this.data.forEach(item => {
      if (!this.editCache[item.No]) {
        this.editCache[item.No] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // nzCurrentPageDataChange -- 當前頁面展示的回調函數
  currentPageDataChange($event: Array<DFCNewModelTableData>) {
    this.displayData = $event;
  }

  // 頁數改變(nzPageSizeChange), 頁碼改變(nzPageIndexChange) 時用的回調函數, 刷新table信息
  refreshStatus() {
    const allChecked = this.displayData.every(value => value.Checked === true);
    const allUnChecked = this.displayData.every(value => !value.Checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledDeleteButton = !this.data.some(value => value.Checked);
    this.checkedNumber = this.data.filter(value => value.Checked).length;
  }

  // 全選事件
  checkAll(value: boolean) {
    for (let index = 0; index < this.data.length; index++) {
      if (!this.displayData[index].IsPLMProject && this.userID === this.data[index].ProjectPM) {
        this.displayData[index].Checked = value;
      }
    }
    this.refreshStatus();
  }

  // QueryHasRfq
  QueryHasRfq(index) {
    this.data[index].hasRfq = true;
    if (!this.data[index].IsRfq) {
      this.projectCodeProfileService.find({
        where: {
          ProjectCode: this.data[index].RfqProjectCode,
          Plant: this.data[index].PlantCode
        }
      }).subscribe(
        result => {
          if (result.length > 0) {
            this.data[index].hasRfq = true;
          } else {
            this.data[index].hasRfq = false;
          }
        }
      );
    }
  }

  // 表格编辑事件
  startEdit(key: string) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.editrow = key;
    this.data.forEach(data => {   // 點擊編輯按鈕啟用mrr流程checkBox
      if (data.No === key) {
        data.disMrrCheckBox = false;
        data.disDFQCheckBox = false;
        this.oldDFQData = {
          rfi: data.rfi,
          rfiRemark: data.rfiRemark
        };
        this.oldMrrData = {
          nudd: data.nudd,
          nuddRemark: data.nuddRemark,
          productDocument: data.productDocument,
          productDocumentRemark: data.productDocumentRemark,
          material: data.material,
          materialRemark: data.materialRemark,
          vendorFile: data.vendorFile,
          vendorFileRemark: data.vendorFileRemark,
          allModule: data.allModule
        };
      }
    });
  }

  // mrr流程添加全選狀態
  allValueChange(data, selectAll) {
    // 清空上一次填寫的理由
    this.inputAllMrrRemark = null;
    if (!selectAll) {
      // 填mrr所有模塊取消理由
      this.allMrrRemarkFlag = true;
      data.nudd = false;
      data.material = false;
      data.productDocument = false;
      data.vendorFile = false;
      data.allModule = false;
      this.editData = data;
    } else {
      data.nudd = true;
      data.material = true;
      data.productDocument = true;
      data.vendorFile = true;
      data.allModule = true;
      this.editData = data;
    }
  }

  // 如果取消mrr勾選，彈出填寫不勾選原因的彈框
  nuddValueChange(data, nudd) {
    data.nudd = nudd;
    this.editData = data;
    if (!nudd) {
      this.addMrrRemarkFlag = true;
      this.addMrrRemarkData = {
        id: data.nuddId,
        projectNameProfileId: data.ProjectNameID,
        moduleName: 'nudd',
        enabled: nudd
      };
      this.mrrModuleTitle = this.trans['notDo-nudd-title'];
      this.inputMrrRemark = null; // 清空上一次填寫的理由
    }
  }

  productDocumentValueChange(data, productDocument) {
    data.productDocument = productDocument;
    this.editData = data;
    if (!productDocument) {
      this.addMrrRemarkFlag = true;
      this.addMrrRemarkData = {
        id: data.productDocumentId,
        projectNameProfileId: data.ProjectNameID,
        moduleName: 'productDocument',
        enabled: productDocument
      };
      this.mrrModuleTitle = this.trans['notDo-product-title'];
      this.inputMrrRemark = null; // 清空上一次填寫的理由
    }
  }

  materialValueChange(data, material) {
    data.material = material;
    this.editData = data;
    if (!material) {
      this.addMrrRemarkFlag = true;
      this.addMrrRemarkData = {
        id: data.materialId,
        projectNameProfileId: data.ProjectNameID,
        moduleName: 'material',
        enabled: material
      };
      this.mrrModuleTitle = this.trans['notDo-material-title'];
      this.inputMrrRemark = null; // 清空上一次填寫的理由
    }
  }

  vendorFileValueChange(data, vendorFile) {
    data.vendorFile = vendorFile;
    this.editData = data;
    if (!vendorFile) {
      this.addMrrRemarkFlag = true;
      this.addMrrRemarkData = {
        id: data.vendorFileId,
        projectNameProfileId: data.ProjectNameID,
        moduleName: 'vendorFile',
        enabled: vendorFile
      };
      this.mrrModuleTitle = this.trans['notDo-vendor-title'];
      this.inputMrrRemark = null; // 清空上一次填寫的理由
    }
  }

  // 如果取消DFQ勾選，彈出填寫不勾選原因的彈框
  DFQValueChange(data, rfi) {
    data.rfi = rfi;
    this.editData = data;
    if (!rfi) {
      this.addDFQRemarkFlag = true;
      this.addDFQRemarkData = {
        id: data.rfiId,
        projectNameProfileId: data.ProjectNameID,
        moduleName: 'rfi',
        enabled: rfi
      };
      this.DFQModuleTitle = this.trans['notDo-rfi-title'];
      this.inputDFQRemark = null; // 清空上一次填寫的理由
    }
  }

  // mrr原因填寫確認按鈕
  addMrrRemark() {
    if (!this.inputMrrRemark.replace(/\s/g, '')) {
      this.message.create('error', 'Please fill in the reason！');
      this.allmrrRemarkconfirmLoading = false;
      return;
    } else {
      const updateData = {
        id: this.addMrrRemarkData.id,
        projectNameProfileId: this.addMrrRemarkData.projectNameProfileId,
        moduleName: this.addMrrRemarkData.moduleName,
        enabled: 0,
        remark: this.inputMrrRemark,
      };
      this.projectModuleApi.upsert(updateData).subscribe(res => {
        this.data.forEach(item => {
          if (this.addMrrRemarkData.id === item['nuddId']) {
            item['nuddRemark'] = this.inputMrrRemark;
          } else if (this.addMrrRemarkData.id === item['productDocumentId']) {
            item['productDocumentRemark'] = this.inputMrrRemark;
          } else if (this.addMrrRemarkData.id === item['materialId']) {
            item['materialRemark'] = this.inputMrrRemark;
          } else if (this.addMrrRemarkData.id === item['vendorFileId']) {
            item['vendorFileRemark'] = this.inputMrrRemark;
          }
        });
        this.message.create('success', 'Fill in successfully！');
        this.allmrrRemarkconfirmLoading = false;
        this.addMrrRemarkFlag = false;
      });
    }
  }

  // mrr原因填寫取消按鈕
  cancelAddMrrRemark() {
    this.addMrrRemarkFlag = false;
    // 若取消理由填寫，那麼則將選框恢復為true
    this.data.forEach(data => {
      if (this.addMrrRemarkData.id === data.nuddId) {
        data.nudd = 1;
      } else if (this.addMrrRemarkData.id === data.productDocumentId) {
        data.productDocument = 1;
      } else if (this.addMrrRemarkData.id === data.materialId) {
        data.material = 1;
      } else if (this.addMrrRemarkData.id === data.vendorFileId) {
        data.vendorFile = 1;
      }
    });
  }

  // allmrr原因填寫確定按鈕
  addAllMrrRemark() {
    if (!this.inputAllMrrRemark.replace(/\s/g, '')) {
      this.allmrrRemarkconfirmLoading = false;
      return;
    } else {
      const modules = ['nudd', 'material', 'productDocument', 'vendorFile'];
      for (let i = 0; i < modules.length; i++) {
        const updateProjectMoudle = {
          id: '',
          projectNameProfileId: this.editData.ProjectNameID,
          moduleName: '',
          enabled: 0,
          remark: this.inputAllMrrRemark,
        };
        for (const key in this.editData) {
          if (key === modules[i] + 'Id') {
            updateProjectMoudle.id = this.editData[key];
            updateProjectMoudle.moduleName = modules[i];
            this.projectModuleApi.upsert(updateProjectMoudle).subscribe(res => {
              if (i === modules.length - 1) {
                this.message.create('success', 'Fill in successfully！');
                this.allmrrRemarkconfirmLoading = false;
                this.allMrrRemarkFlag = false;
              }
            });
          }
        }
      }
    }
  }

  // all mrr原因填寫取消按鈕
  cancelAllMrrRemark() {
    // 若取消理由填寫，那麼則將選框恢復為true
    for (const key in this.editData) {
      if (Object.prototype.hasOwnProperty.call(this.editData, key)) {
        if (key === 'nudd' || key === 'material' || key === 'productDocument' || key === 'vendorFile' || key === 'allModule') {
          this.editData[key] = true;
        }
        if (key === 'nuddRemark' || key === 'materialRemark' || key === 'productDocumentRemark' || key === 'vendorFileRemark') {
          this.editData[key] = null;
        }
      }
    }
    this.allMrrRemarkFlag = false;
  }

  // DFQ原因填寫確認按鈕
  addDFQRemark() {
    this.DFQRemarkconfirmLoading = true;
    if (!this.inputDFQRemark.replace(/\s/g, '')) {
      this.message.create('error', 'Please fill in the reason！');
      this.DFQRemarkconfirmLoading = false;
      return;
    } else {
      const updateData = {
        id: this.addDFQRemarkData.id,
        projectNameProfileId: this.addDFQRemarkData.projectNameProfileId,
        moduleName: this.addDFQRemarkData.moduleName,
        enabled: 0,
        remark: this.inputDFQRemark,
      };
      this.projectModuleApi.upsert(updateData).subscribe(res => {
        this.data.forEach(item => {
          if (this.addDFQRemarkData.id === item['rfiId']) {
            item['rfiRemark'] = this.inputDFQRemark;
          }
        });
        this.message.create('success', 'Fill in successfully！');
        this.DFQRemarkconfirmLoading = false;
        this.addDFQRemarkFlag = false;
      });
    }
  }

  // DFQ原因填寫取消按鈕
  cancelAddDFQRemark() {
    this.addDFQRemarkFlag = false;
    // 若取消理由填寫，那麼則將選框恢復為true
    this.data.forEach(data => {
      if (this.addDFQRemarkData.id === data.rfiId) {
        data.rfi = true;
      }
    });
  }

  // 保存編輯
  async saveEdit(key: string) {
    if (!this.productType.includes(this.editCache[key].data.ModelType)) {
      this.message.create('error', this.trans['not-maintain-product']);
      return;
    }
    this.inputClick = false;
    this.inputBlur = false;
    const updataID = this.editCache[key].data['ProjectNameID'];
    const updataData = {
      FCST: this.editCache[key].data['FCST'],
      RunIn: this.editCache[key].data['RunIn'],
      Remark: this.editCache[key].data['Remark'],
    };
    // 記錄保存前的信息
    const logData = {
      Role: (this.userID === this.editCache[key].data['ProjectPM']) ? 'PM' : this.userRole,
      ProjectCode: this.data[(parseInt(key, 10) - 1)]['ProjectCode'],
      ProjectCodeID: this.data[(parseInt(key, 10) - 1)]['ProjectCodeID'],
      ProjectName: this.data[(parseInt(key, 10) - 1)]['ProjectName'],
      ProjectNameID: this.data[(parseInt(key, 10) - 1)]['ProjectNameID'],
      Old: {
        ModelType: this.data[(parseInt(key, 10) - 1)]['ModelType'],
        FCST: this.data[(parseInt(key, 10) - 1)]['FCST'],
        RunIn: this.data[(parseInt(key, 10) - 1)]['RunIn'],
        nudd: this.data[(parseInt(key, 10) - 1)]['nudd']

      },
      New: {
        ModelType: this.editCache[key].data['ModelType'],
        FCST: this.editCache[key].data['FCST'],
        RunIn: this.editCache[key].data['RunIn'],
        nudd: this.data[(parseInt(key, 10) - 1)]['nudd']
      }
    };
    if (this.editData) {
      //  更新打勾的数据 mrr及DFQ流程
      const updateProjectMoudle = {
        id: '',
        projectNameProfileId: this.editData.ProjectNameID,
        moduleName: '',
        enabled: 1,
        remark: '',
      };
      for (const property in this.editData) {
        if (Object.prototype.hasOwnProperty.call(this.editData, property)) {
          if (property === 'nudd' || property === 'material' || property === 'productDocument' || property === 'vendorFile' || property === 'rfi') {
            if (this.editData[property]) {
              updateProjectMoudle.id = this.editData[property + 'Id'];
              updateProjectMoudle.moduleName = property;
              updateProjectMoudle.remark = '';
              await this.projectModuleApi.upsert(updateProjectMoudle).toPromise();
            }
          }
        }
      }
      this.editData.disMrrCheckBox = true; // 點擊關閉按鈕禁用mrr流程checkBox
      this.editData.disDFQCheckBox = true;   // 點擊關閉按鈕禁用DFQ流程checkBox
    }
    this.projectNameProfileServer.patchAttributes(updataID, updataData).subscribe(rs => {
      this.editCache[key].edit = false;
      this.actionEnabled = true;
      this.isEditSaveVisible = false;
      this.editrow = '';
      this.editData = {};
      this.query();
      this.data[(parseInt(key, 10) - 1)]['FCST'] = this.editCache[key].data['FCST'];
      this.data[(parseInt(key, 10) - 1)]['RunIn'] = this.editCache[key].data['RunIn'];
    }, error => console.log(error));
    this.projectCodeProfileService.patchAttributes(this.editCache[key].data['ProjectCodeID'], {
      ModelType: this.editCache[key].data['ModelType']
    }).subscribe(rs => {
      this.editCache[key].edit = false;
      this.actionEnabled = true;
      this.isEditSaveVisible = false;
      this.editrow = '';
      this.query();
      this.data[(parseInt(key, 10) - 1)]['ModelType'] = this.editCache[key].data['ModelType'];
    }, error => console.log(error));
    // 將操作信息存入緩存
    const logMsg = 'update\t廠別: ' + this.querySelect.plant.value + '\tRole: ' + logData.Role + '\t' +
      localStorage.getItem('$DFI$userName') + '\tProjectCode: ' +
      logData.ProjectCode + ' [ProjectCodeID: ' + logData.ProjectCodeID +
      ']\tProjceName: ' + logData.ProjectName + ' [ProjectNameID: ' + logData.ProjectNameID +
      ']\nModelType: ' + logData.Old.ModelType + '->' + logData.New.ModelType +
      '\nFCST: ' + logData.Old.FCST + '->' + logData.New.FCST +
      '\nRunIn: ' + logData.Old.RunIn + '->' + logData.New.RunIn;
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '新機種信息維護',
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

  // 取消編輯按鈕
  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
    this.isEditSaveVisible = false;
    this.inputClick = false;
    this.inputBlur = false;
    this.editrow = '';
    let newData = {};
    const modules = ['nudd', 'material', 'productDocument', 'vendorFile', 'rfi'];
    this.data.forEach(data => {   // 點擊關閉按鈕禁用mrr流程checkBox
      if (data.No === key) {
        data.disMrrCheckBox = true;
        data.disDFQCheckBox = true;
        // 若取消修改的選框的內容，則恢復原始狀態
        data.rfi = this.oldDFQData.rfi;
        data.rfiRemark = this.oldDFQData.rfiRemark;
        data.nudd = this.oldMrrData.nudd;
        data.nuddRemark = this.oldMrrData.nuddRemark;
        data.productDocument = this.oldMrrData.productDocument;
        data.productDocumentRemark = this.oldMrrData.productDocumentRemark;
        data.material = this.oldMrrData.material;
        data.materialRemark = this.oldMrrData.materialRemark;
        data.vendorFile = this.oldMrrData.vendorFile;
        data.vendorFileRemark = this.oldMrrData.vendorFileRemark;
        data.allModule = this.oldMrrData.allModule;
        // 取消編輯后，模塊狀態恢復為true，則將未勾選理由清空置為null
        for (const mrr of modules) {
          let projectModuleId;
          let projectModuleRemark;
          let enabled;
          if (mrr === 'nudd') {
            projectModuleId = data['nuddId'];
            projectModuleRemark = this.oldMrrData.nuddRemark;
            enabled = this.oldMrrData.nudd;
          }
          if (mrr === 'material') {
            projectModuleId = data['materialId'];
            projectModuleRemark = this.oldMrrData.materialRemark;
            enabled = this.oldMrrData.material;
          }
          if (mrr === 'productDocument') {
            projectModuleId = data['productDocumentId'];
            projectModuleRemark = this.oldMrrData.productDocumentRemark;
            enabled = this.oldMrrData.productDocument;
          }
          if (mrr === 'vendorFile') {
            projectModuleId = data['vendorFileId'];
            projectModuleRemark = this.oldMrrData.vendorFileRemark;
            enabled = this.oldMrrData.vendorFile;
          }
          if (mrr === 'rfi') {
            projectModuleId = data['rfiId'];
            projectModuleRemark = this.oldDFQData.rfiRemark;
            enabled = this.oldDFQData.rfi;
          }
          newData = {
            id: data[`${mrr}Id`],
            projectNameProfileId: data.ProjectNameID,
            moduleName: mrr,
            enabled: enabled,
            remark: projectModuleRemark
          };
          this.projectModuleApi.upsert(newData).subscribe(upmr => {
          }, error => console.log(error));
        }
      }
    });
  }

  listProjectMembers(index: number) {
    this.selectedProjecCode = this.data[index];
    this.members = this.data[index].member;
    this.isProjectMemberListVisible = true;
    this.showSelect = false;
    this.showSelectIcon = true;
    this.showSelect2 = false;
    this.showSelectIcon2 = true;
    this.searchRoles = undefined;
    this.editingMember.MemberID = undefined;
  }

  cancelEditProjectMember() {
    this.isProjectMemberListVisible = false;
  }

  editMember(member: ProjectMember) {
    this.editingMember = new ProjectMember();
    if (member) {
      // deep copy
      Object.assign(this.editingMember, member);
    } else {
      this.editingMember.ProjectCodeID = this.selectedProjecCode.ProjectCodeID;
    }
    this.isEditMemberVisible = true;
  }

  upsertMember(member: ProjectMember) {
    this.projectMemberService.upsert<ProjectMember>(member).subscribe({
      next: result => {
        if (member.id) {
          this.members.splice(this.members.findIndex(element => element.id === member.id), 1, result);
          this.members = [...this.members];
        } else {
          this.members = [...this.members, result];
        }
        this.selectedProjecCode.member = this.members;
        this.isEditMemberVisible = false;
        this.messageService.success('Update completed！');
      },
      error: err => this.handleError(err.message)
    });
  }

  deleteMember(data: ProjectMember) {
    this.projectMemberService.deleteById<any>(data.id).subscribe({
      next: result => {
        if (result.count) {
          this.members = this.members.filter(member => member.id !== data.id);
          this.selectedProjecCode.member = this.members;
          this.messageService.success('Successfully deleted！');
        } else {
          this.handleError('Failed to delete！');
        }
      },
      error: err => this.handleError(err.message)
    });
  }

  getMember(member: Member) {
    this.editingMember.MemberID = member ? member.EmpID : undefined;
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.memberService.findById(localStorage.getItem('$DFI$userID')).subscribe(data => {
      this.isDFiLeader = data['DFILeader'];
      this.userID = data['EmpID'];
      this.userPlant = data['Plant'];
      this.userSite = data['Site'];
      this.userRole = data['Role'];
    });
  }

  onMemberSearch(value: string): void {
    this.isMemberListLoading = true;
    this.memberSearchChange$.next(value);
  }

  cancelAddMember() {
    this.isEditMemberVisible = false;
  }

  // Schedule點擊事件
  showScheduleModal(projectcode, data, flag) {
    this.isScheduleDataVisible = true;
    this.scheduleDataSet = data;
    this.editrow = projectcode;
    this.stageShowFlag = flag;
  }

  scheduleListStyle() {
    if (this.stageShowFlag) {
      return { height: '400px' };
    } else {
      return { height: '290px' };
    }
  }

  // 日期变换
  changeScheduleData(date): string {
    if (!date) {
      return null;
    }
    const changeDate = new Date(date);
    if (changeDate < new Date('1971/01/01')) {
      return null;
    } else {
      changeDate.toLocaleDateString();
      return changeDate.toLocaleDateString();
    }
  }

  handleScheduleCancel() {
    this.isScheduleDataVisible = false;
    this.editrow = '';
  }

  // 刪除相關事件
  operateDelete() {
    this.isDeleteVisible = true;
  }

  cancelDeleteModel() {
    this.isModelDeleteVisible = false;
  }

  cancelDelete(event: EventEmitter<boolean>) {
    if (event) {
      this.data.forEach(data => data.Checked = false);
      this.isDeleteVisible = false;
      this.refreshStatus();
      this.operating = false;
    }
  }

  async Delete(event: EventEmitter<boolean>) {
    const deleteIDs: string[] = [];
    const logDatas: {
      ProjectCodeID: string,
      ProjectCode: string,
      ProjectNameID: string,
      ProjectName: string
    }[] = [];
    this.data.forEach(data => {
      if (data.Checked) {
        deleteIDs.push(data.ProjectNameID);
        logDatas.push({
          ProjectCode: data.ProjectCode,
          ProjectCodeID: data.ProjectCodeID,
          ProjectName: data.ProjectName,
          ProjectNameID: data.ProjectNameID,
        });
      }
    });
    if (event) {
      for (let i = 0; i < deleteIDs.length; i++) {
        if (i === (deleteIDs.length - 1)) {
          await this.projectModuleApi.find({ where: { projectNameProfileId: deleteIDs } }).toPromise().then(async ee => {
            for (let index = 0; index < ee.length; index++) {
              await this.projectModuleApi.deleteById(ee[index]['id']).toPromise();
            }
          });
          await this.projectNameProfileServer.deleteById(deleteIDs[i]).toPromise().then(rs => {
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
          this.projectNameProfileServer.deleteById(deleteIDs[i]).subscribe(rs => { }, error => console.log('error:\n' + error));
        }
      }
      // 將操作信息存入緩存
      let logMsg = 'delete\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
        '\n刪除機種如下:';
      logDatas.forEach(logData => {
        logMsg += '\nProjectCode: ' + logData.ProjectCode + ' [ProjectCodeID: ' + logData.ProjectCodeID +
          ']\tProjectName: ' + logData.ProjectName + '[ProjectNameID: ' + logData.ProjectNameID + ']';
      });
      this.operationLogServer.create({
        userID: localStorage.getItem('$DFI$userID'),
        APname: '新機種信息維護',
        data: logMsg
      }).subscribe(rs => console.log(rs), error => console.log(error));
    }
  }

  // 新增ProjectCode&Name事件
  copy(data: {}) {
    this.isAddProjectNameVisible = true;
    this.addProjectNameDataCache = {
      ProjectName: data['ProjectName'],
      ProjectCode: data['ProjectCode'],
      ProjectCodeID: data['ProjectCodeID'],
      FCST: data['FCST'],
      RunIn: data['RunIn'],
      IsPLMProject: false,
      IsRfq: data['IsRfq']
    };
    this.addProjectNameInput = data['ProjectName'];
  }

  // 取消新增
  handleAddProjectNameCancel() {
    this.addProjectNameDataCache = {
      ProjectName: '',
      ProjectCode: '',
      ProjectCodeID: '',
      FCST: '',
      RunIn: '',
      IsPLMProject: false,
      IsRfq: false
    };
    this.isAddProjectNameVisible = false;
    this.addProjectNameFlag = false;
  }

  // 保存新增信息
  handleAddProjectNameSave() {
    if (this.addProjectNameInput === this.addProjectNameDataCache.ProjectName) {
      this.addProjectNameFlag = true;
      this.addProjectNameSpan = 'The Project Name already exists！';
      return;
    }
    this.addProjectNameDataCache.ProjectName = this.addProjectNameInput;
    const logData = JSON.parse(JSON.stringify(this.addProjectNameDataCache));
    this.projectNameProfileServer.upsert(this.addProjectNameDataCache).subscribe(addData => {
      this.addProjectNameFlag = false;
      this.addProjectNameDataCache = {
        ProjectName: '',
        ProjectCode: '',
        ProjectCodeID: '',
        FCST: '',
        RunIn: '',
        IsPLMProject: false,
        IsRfq: false
      };
      this.isAddProjectNameVisible = false;
      this.query();
      // 將操作信息存入緩存
      const logMsg = 'add\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
        '\n複製新增機種信息如下:' +
        '\nProjectCode: ' + addData['ProjectCode'] + '[ProjectCodeID: ' + addData['ProjectCodeID'] +
        ']\tProjectName: ' + addData['ProjectName'] + '[ProjectNameID: ' + addData['ProjectNameID'] +
        '\nFCST: ' + addData['FCST'] +
        '\nRunIn: ' + addData['RunIn'];
      this.operationLogServer.create({
        userID: localStorage.getItem('$DFI$userID'),
        APname: '新機種信息維護',
        data: logMsg
      }).subscribe(rs => console.log(rs), error => console.log(error));
    }, error => {
      console.log('error:\n' + error);
    });
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
    this.showLoading = true;
    const para = { role: this.userRole, empID: this.userID, empPlant: this.userPlant };
    this.fileService.postDFCFile(file, 'project', para)
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
        this.query();
        // 將操作信息存入緩存
        const logMsg = 'upload\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
          '\n上傳文件信息, 如下:\n' + JSON.stringify(res);
        this.operationLogServer.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: '新機種信息維護',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
      }, error => {
        const err = 'Upload failed: ' + JSON.stringify(error.error.error.message);
        this.message.create('error', err);
        this.showLoading = false;
      });
  }

  download() {
    this.fileService.downloadNewModel(this.data.map(x => x.ProjectNameID));
  }

  // new DFC
  onclickNewDFC(projectNameID, key) {
    if (!this.productType.includes(this.editCache[key].data.ModelType)) {
      this.message.create('error', this.trans['not-maintain-product']);
      return;
    }
    this.projectNameProfileServer.NewDfc(projectNameID, this.userID).subscribe(
      result => {
        this.cancelEdit(key);
        this.query();
      }
    );
  }

  // stop DFC
  onclickStopDFC(projectNameID, key, remark) {
    if (!this.productType.includes(this.editCache[key].data.ModelType)) {
      this.message.create('error', this.trans['not-maintain-product']);
      return;
    }
    if (!remark || remark.length < 21) {
      this.message.create('error', this.trans['fill-remark-notice']);
      return;
    }
    this.projectNameProfileServer.StopDfc(projectNameID).subscribe(
      result => {
        this.saveEdit(key);
        this.cancelEdit(key);
        this.query();
      }
    );
  }

  onclickResumeDFC(projectNameID, key) {
    if (!this.productType.includes(this.editCache[key].data.ModelType)) {
      this.message.create('error', this.trans['not-maintain-product']);
      return;
    }
    this.projectNameProfileServer.ResumeDfc(projectNameID).subscribe(
      result => {
        this.cancelEdit(key);
        this.query();
      }
    );
  }

  // No need DFC
  onclickNoNeedDFC(projectNameID, key, remark) {
    if (!this.productType.includes(this.editCache[key].data.ModelType)) {
      this.message.create('error', this.trans['not-maintain-product']);
      return;
    }
    if (!remark || remark.length < 21) {
      this.message.create('error', this.trans['fill-remark-notice']);
      return;
    }
    this.projectNameProfileServer.NoNeedDfc(projectNameID).subscribe(
      result => {
        this.saveEdit(key);
        this.cancelEdit(key);
        this.query();
      }
    );
  }

  nzExpandChange(event, data) {
    if (event) {
      // search
      this.searchModel(data);
    } else {
      delete data.modelData;
    }
  }

  searchModel(data) {
    const projectNameId = data.ProjectNameID;
    data.modelData = forkJoin(
      this.newmodelMaintainService.getModel({
        projectNameId
      }),
      this.newmodelMaintainService.getGroupModel({
        projectNameId
      })
    ).pipe(
      map(
        (models) => {
          models[0].forEach(
            (item) => {
              item['type'] = 1;
              item['deleteFlag'] = (data.ProjectName === item['modelName']) ? false : true;
              // 判断 目标工时有无签核
              if (!!item.stages && item.stages.length > 0 && item.stages[0].targetOperationSigns.length > 0) {
                const signList = item.stages[0].targetOperationSigns.reduce((p, t) => {
                  p[t['process']] = (!!t['workflow']['status'] || t['workflow']['status'] === 0) ? t['workflow']['status'] + '' : '';
                  return p;
                }, {});
                let flag = false;
                for (const key in signList) {
                  if (signList.hasOwnProperty(key)) {
                    const sign = signList[key];
                    switch (sign) {
                      case '0':
                      case '1': {
                        flag = flag || true;
                        break;
                      }
                      default: {
                        flag = flag || false;
                        break;
                      }
                    }
                  }
                }
                item['targetSignFlag'] = flag;
              } else {
                item['targetSignFlag'] = false;
              }
            }
          );
          this.groupModelMappingSelect = models[0];
          models[1].forEach(
            (item) => {
              item['modelName'] = item.groupModelName;
              item['type'] = 2;
              item['deleteFlag'] = true;
              item['targetSignFlag'] = false;
            }
          );
          return [].concat.apply([], models);
        }
      )
    );
  }

  nzExpandChangeGroupModel(event, data) {
    if (event) {
      this.newmodelMaintainService.getGroupModelMapping(data.groupModelId).pipe(
        map(
          (groupModelMapping) => {

            return groupModelMapping.map(
              (item: any) => {
                const findModel = this.groupModelMappingSelect.find(
                  (model) => {
                    return model.modelId === item.modelId;
                  }
                );
                if (findModel) {
                  item['modelName'] = findModel.modelName;
                }
                return item;
              }
            );
          }
        ),
        tap(
          (modelArray) => {
            data.modelData = modelArray;
          }
        )
      ).subscribe();
    } else {
      delete data.modelData;
    }
  }

  addOrUpdateModelData(modelDataSet, data) {
    if (modelDataSet.militaryFlag) {
      this.messageService.info('軍令狀已啟動, 該機種已鎖定');
    }
    else if (!modelDataSet.rfqMapping) {
      this.messageService.info('機種沒有綁定RFQ機種信息, 請到機種工時資料維護界面做綁定');
    }
    else {
      this.addModelVisible = true;
      this.modelDataSet = modelDataSet;
      this.editModel['projectNameId'] = modelDataSet.ProjectNameID;
      this.editModel = data ? data : this.editModel;
    }
  }

  endAddOrUpdateModel() {
    this.addModelVisible = false;
    this.searchModel(this.modelDataSet);
    this.editModel = {
      type: 1,
      modelName: '',
      productType: '',
      FCST: '',
      isMilitary: true
    };
  }

  addOrUpdateGroupModelData(modelDataSet, groupModel) {
    this.addGroupModelVisible = true;
    this.modelDataSet = modelDataSet;
    this.editGroupModel = groupModel;
    this.addGroupModelType = '新增';
  }

  endAddOrUpdateGroupModel() {
    this.addGroupModelVisible = false;
    this.isModelDeleteVisible = false;
    this.searchModel(this.modelDataSet);
  }

  openDeleteModel(modelData, data) {
    this.isModelDeleteVisible = true;
    this.deleteItem = modelData;
    this.modelDataSet = data;
  }

  openDeleteGroupModelMapping(groupModelData, data) {
    this.isModelDeleteVisible = true;
    this.isGroupModelMapping = true;
    this.deleteItem = groupModelData;
    this.modelDataSet = data;
  }

  openEditGroupModelMapping(groupModelData, data) {
    this.addGroupModelVisible = true;
    this.addGroupModelType = '修改';
    this.modelDataSet = data;
    this.editGroupModel = groupModelData;
  }

  deleteModel() {
    let obs;
    if (this.isGroupModelMapping) {
      obs = this.newmodelMaintainService.deleteGroupModelMapping(this.deleteItem.groupModelMappingid);
    } else if (this.deleteItem.modelId) {
      obs = this.newmodelMaintainService.deleteModel(this.deleteItem.modelId);
    } else if (this.deleteItem.groupModelId) {
      obs = this.newmodelMaintainService.deleteGroupModel(this.deleteItem.groupModelId);
    }
    obs.subscribe(
      () => {
        this.isGroupModelMapping = false;
        this.endAddOrUpdateGroupModel();
      }
    );
  }

  // 顯示mrr流程不做的理由
  showMrrRemark(data) {
    this.mrrShowFlag = true;
    this.mrrRemarks = [
      { remark: data.nuddRemark, moduleName: this.trans['nudd'] },
      { remark: data.productDocumentRemark, moduleName: this.trans['product'] },
      { remark: data.materialRemark, moduleName: this.trans['material'] },
      { remark: data.vendorFileRemark, moduleName: this.trans['material'] }
    ];
  }

  // 關閉mrr彈窗
  cancelMrrModel() {
    this.mrrShowFlag = false;
  }

  // 顯示DFQ流程不做的理由
  showDFQRemark(data) {
    this.DFQShowFlag = true;
    this.DFQRemarks = [
      { remark: data.rfiRemark, moduleName: this.trans['rfi'] },
    ];
  }

  // 關閉DFQ彈窗
  cancelDFQModel() {
    this.DFQShowFlag = false;
  }

  // 篩選Available欄位
  filterAvailable(listOfSearchAvailables: boolean[]): void {
    this.listOfSearchAvailables = listOfSearchAvailables;
    this.search();
  }

  search(): void {
    /** filter data **/
    let data = [];
    data = this.data
      .filter(item => this.listOfSearchAvailables && this.listOfSearchAvailables.length > 0 ? this.listOfSearchAvailables.includes(item['Status2']) : true);
    this.data = data;
  }

  handleError(message: string) {
    this.modalService.error({
      nzTitle: 'Error',
      nzContent: message
    });
  }

  searchMyRole() {
    this.showSelect = true;
    this.showSelectIcon = false;
  }


  searchEname() {
    this.showSelect2 = true;
    this.showSelectIcon2 = false;
  }

  reset() {
    this.showSelect = false;
    this.showSelectIcon = true;
    this.searchRoles = undefined;
    this.searchOneRole();
  }

  reset2() {
    this.showSelect2 = false;
    this.showSelectIcon2 = true;
    this.editingMember.MemberID = undefined;
    this.searchOneEname();
  }

  searchOneRole(): void {
    this.members = this.selectedProjecCode.member
      .filter(item => this.searchRoles ? this.searchRoles.includes(item['Role']) : true);
  }

  searchOneEname(): void {
    this.members = this.selectedProjecCode.member
      .filter(item => this.editingMember.MemberID ? this.editingMember.MemberID.includes(item['MemberID']) : true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * 頁面表格資料 類
 */
export class DFCNewModelTableData {
  Checked: boolean; // 該列是否選中
  No: string; // 對應表格中的No
  IsPLMProject: boolean;
  IsRfq: boolean;
  Plant: string; // Plant
  PlantCode: string; // PlantCode
  Site: string;
  ModelType: string; // ProjectCodeProFiles中的ModelType
  ProjectCode: string; // 對應表格中的ProjectCode
  ProjectCodeID: string; // ProjectCodeID
  Customer: string; // Project Code下一級的 資料內容 相關的Customer
  ProjectNameID: string; // ProjectNameID, 數據庫中的資料
  ProjectName: string; // 對應表格中的ProjectName
  Schedule: DFCNewModelScheduleData; // C0-C6, 表格中顯示為固定值 C0-C6, 點擊后顯示具體的
  FCST: number; // FCST(K)值
  RunIn: number; // Run-In 人力
  Status: string;
  Remark: string;
  RfqProjectCode: string;
  hasRfq: boolean;
}

/**
 * Schedule詳細資料 類
 */
export class DFCNewModelScheduleData {
  RfqDueDate: string;
  C0DueDate?: string;
  C1DueDate?: string;
  C2DueDate: string;
  C3DueDate: string;
  C4DueDate: string;
  C5DueDate: string;
  C6DueDate: string;

  constructor() {
    this.RfqDueDate = '';
    this.C0DueDate = '';
    this.RfqDueDate = '';
    this.C0DueDate = '';
    this.C1DueDate = '';
    this.C2DueDate = '';
    this.C3DueDate = '';
    this.C4DueDate = '';
    this.C5DueDate = '';
    this.C6DueDate = '';
  }
}
