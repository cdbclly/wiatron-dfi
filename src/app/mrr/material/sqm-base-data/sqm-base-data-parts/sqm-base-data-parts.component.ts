import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MrrMaterialSelectService } from '../../mrr-material-select.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SqmBaseDataService } from '../sqm-base-data.service';
import { View_LatestTargetYield } from '@service/mrr-sdk';
import { PartsAddModelList } from '../sqm-base-data';
import { NzTransferComponent, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { MrrMaterialMessageService } from '../../mrr-material-message.service';
import { ManufaturerInputService } from '../../manufaturer-input/manufaturer-input.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-sqm-base-data-parts',
  templateUrl: './sqm-base-data-parts.component.html',
  styleUrls: ['./sqm-base-data-parts.component.scss']
})
export class SqmBaseDataPartsComponent implements OnInit {
  @ViewChild('nzTransferAddModel') nzTransferAddModel: NzTransferComponent;

  validateForm: FormGroup;
  vendor = {
    flag: false,
    vendorCode: '',
    partNumberVendorId: null
  };
  btn = {
    type: '',
    copy: {
      disableFlag: true,
      menu: [],
      currentStage: '',
      chooseStage: ''
    },
    order: {
      disableFlag: true,
      clickFlag: false
    }
  };

  // 下拉框的相關設定
  // 1.廠別
  plants = {
    query: [],
    add: []
  };
  plantsChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 2.客戶
  customers = {
    query: [],
    add: []
  };
  customerChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  customerSearchChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 3.廠商
  manufacturers = {
    query: [],
    add: []
  };
  manufacturerSearchChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  manufacturerChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 4.Project Code
  projectCodes = {
    query: [],
    add: []
  };
  projectCodeChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  projectCodeSearchChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 5.Project Name
  projectNames = {
    query: [],
    add: []
  };
  projectNameChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  projectNameSearchChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  productId = {
    query: '',
    add: ''
  }; // 由 選擇 ProjectName時, 帶出 ProductType
  currentStage = {
    query: '',
    add: ''
  }; // 由 選擇 ProjectName時, 帶出 當前 Stage
  // 6.Stage
  stages = {
    query: [],
    add: []
  };
  stageChange$ = new BehaviorSubject('');
  // 7.Part
  parts = {
    query: [],
    add: []
  };
  partChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 8.料號
  partNumbers = {
    query: [],
    add: []
  };
  partNumbersChange$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  partNumbersSearch$ = {
    query: new BehaviorSubject(''),
    add: new BehaviorSubject('')
  };
  // 9.廠商代碼
  vendorCodes = {
    query: [],
    add: []
  };
  vendorCodeChange$ = new BehaviorSubject('');

  // 表格數據
  partsDataSet: View_LatestTargetYield[] = [];
  editCache: {
    [key: string]: { edit: boolean; data: View_LatestTargetYield };
  } = {};
  nzWidthConfig = [
    '5.5%',
    '5.6%',
    '7.6%',
    '9.8%',
    '9.6%',
    '9.1%',
    '8.3%',
    '5.2%',
    '8.3%',
    '4.6%',
    '9.2%',
    '9.4%',
    '6.8%'
  ];

  // 新機種料號維護
  modelValidateForm: FormGroup;
  intput = {
    partNumber: '',
    vendorName: ''
  };
  addModelList = new PartsAddModelList();
  nzTitle = '新機種料號維護';
  addModelFlag = false;
  addModelPartNumberData = {
    AMPL: [],
    PLM: [],
    Part: {},
    AMPLReduce: {},
    PLMReduce: {}
  };
  partNumberBtnClick = false;
  addModelPartLoading = false;
  // Process序號/目標良率調整
  addOrderModelFlag = false;
  addModelNzWidthConfig = ['15%', '30%', '30%', '25%'];

  // 料號 與 機種 綁定情況
  partNumProFlag = false;
  partNumProDataSet = [];
  partNumberProAddFlag = false;
  partNumberProAddSelect = {
    list: [],
    value: '',
    search$: new BehaviorSubject('')
  };

  // 路由傳過來的數據
  routeData = {
    flag: false,
    data: {}
  };
  routeDataCheck = {
    flag: true,
    msg: ''
  };

  relatedProjectSelect = []; // 'query' | ProName ProCode 下拉框
  notRelatedProjectSelect = []; // 'add' | ProName ProCode 下拉框
  plantProject = [];
  viewLastestTargetYield = [];
  RTYid;
  exitPartNumberSet;
  exitPartNumberFlag = false;
  queryLoading = false;
  saveProjectLoading = false;
  queryPartNumerLoading = false;
  currentPlant;
  clickNotice;
  title = {};
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private messageService: MrrMaterialMessageService,
    private sqmBaseDataService: SqmBaseDataService,
    private manufaturerInputService: ManufaturerInputService,
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.material-model-partNo-binding', 'mrr.material-vendor-info', 'mrr.material-model-info', 'mrr.material-noVendor-notice', 'mrr.material-exitPartNo',
      'mrr.material-noModel', 'mrr.material-newModel-title', 'mrr.material-process-notice', 'mrr.material-no-RTY', 'mrr.material-model-partNo', 'mrr.material-add-process-notice', 'mrr.material-order-process-notice',
      'mrr.material-other-process1', 'mrr.material-other-process2', 'mrr.material-copy-model-PartNo', 'mrr.mrr-maintain', 'mrr.material-no-product']).subscribe(res => {
        this.clickNotice = res['mrr.material-model-partNo-binding'];
        this.title['vendorInfo'] = res['mrr.material-vendor-info'];
        this.title['modelInfo'] = res['mrr.material-model-info'];
        this.title['noVendor'] = res['mrr.material-noVendor-notice'];
        this.title['exitPartNo'] = res['mrr.material-exitPartNo'];
        this.title['noModel'] = res['mrr.material-noModel'];
        this.title['modalTitle'] = res['mrr.material-newModel-title'];
        this.title['processNotice'] = res['mrr.material-process-notice'];
        this.title['noRTY'] = res['mrr.material-no-RTY'];
        this.title['modelPartNo'] = res['mrr.material-model-partNo'];
        this.title['addProcessNotice'] = res['mrr.material-add-process-notice'];
        this.title['orderProcessNotice'] = res['mrr.material-order-process-notice'];
        this.title['otherProcess1'] = res['mrr.material-other-process1'];
        this.title['otherProcess2'] = res['mrr.material-other-process2'];
        this.title['copyModel'] = res['mrr.material-copy-model-PartNo'];
        this.title['maintain'] = res['mrr.mrr-maintain'];
        this.title['noProduct'] = res['mrr.material-no-product'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-model-partNo-binding', 'mrr.material-vendor-info', 'mrr.material-model-info', 'mrr.material-noVendor-notice', 'mrr.material-exitPartNo',
        'mrr.material-noModel', 'mrr.material-newModel-title', 'mrr.material-process-notice', 'mrr.material-no-RTY', 'mrr.material-model-partNo', 'mrr.material-add-process-notice', 'mrr.material-order-process-notice',
        'mrr.material-other-process1', 'mrr.material-other-process2', 'mrr.material-copy-model-PartNo', 'mrr.mrr-maintain', 'mrr.material-no-product']).subscribe(res => {
          this.clickNotice = res['mrr.material-model-partNo-binding'];
          this.title['vendorInfo'] = res['mrr.material-vendor-info'];
          this.title['modelInfo'] = res['mrr.material-model-info'];
          this.title['noVendor'] = res['mrr.material-noVendor-notice'];
          this.title['exitPartNo'] = res['mrr.material-exitPartNo'];
          this.title['noModel'] = res['mrr.material-noModel'];
          this.title['modalTitle'] = res['mrr.material-newModel-title'];
          this.title['processNotice'] = res['mrr.material-process-notice'];
          this.title['noRTY'] = res['mrr.material-no-RTY'];
          this.title['modelPartNo'] = res['mrr.material-model-partNo'];
          this.title['addProcessNotice'] = res['mrr.material-add-process-notice'];
          this.title['orderProcessNotice'] = res['mrr.material-order-process-notice'];
          this.title['otherProcess1'] = res['mrr.material-other-process1'];
          this.title['otherProcess2'] = res['mrr.material-other-process2'];
          this.title['copyModel'] = res['mrr.material-copy-model-PartNo'];
          this.title['maintain'] = res['mrr.mrr-maintain'];
          this.title['noProduct'] = res['mrr.material-no-product'];
        });
    });
    this.validateForm = this.fb.group({
      partNumber: [null, [Validators.required]],
      manufacturer: [null],
      plant: [null],
      customer: [null],
      projectCode: [null, [Validators.required]],
      projectName: [null],
      part: [null],
      stage: [null, [Validators.required]]
    });
    this.modelValidateForm = this.fb.group({
      selectPlant: [null, [Validators.required]],
      partNumber: [null, [Validators.required]],
      manufacturer: [null, [Validators.required]],
      vendorCode: [null, [Validators.required]],
      vendorName: [null, [Validators.required]],
      checkBox: [null, [Validators.required]],
      plant: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      projectCode: [null, [Validators.required]],
      projectName: [null, [Validators.required]],
      stage: [null, [Validators.required]],
      part: [null, [Validators.required]]
    });

    this.modelValidateForm.controls['vendorName'].disable({
      onlySelf: true,
      emitEvent: true
    });
    // 初始化下拉框
    this.initSelect('query', this.validateForm);
    this.initSelect('add', this.modelValidateForm);

    this.manufaturerInputService.toSqmBaseDataParts$.subscribe(d => {
      // 路由傳參進來
      if (d) {
        this.routeData.flag = true;
        this.routeData.data = d;
        this.addModelFlag = true;
        this.addModelPartLoading = true;
        this.btn.type = 'add';
        this.modelValidateForm.controls['selectPlant'].setValue(d.value.plant);
        this.modelValidateForm.controls['partNumber'].setValue(
          d.value.partNumber
        );
        this.partNumbersChange$[this.btn.type].next(d.value.partNumber);
      }
    });
  }
  /**
   * 初始化 各種下拉框
   *
   * @memberof SqmBaseDataPartsComponent
   */
  initSelect(key, validateForm: FormGroup) {
    this.initPartNumberSelect(key, validateForm);
    this.initManufaturerSelect(key, validateForm);
    this.initPlantSelect(key, validateForm);
    this.initCustomSelect(key, validateForm);
    this.initProjectCodeSelect(key, validateForm);
    this.initProjectNameSelect(key, validateForm);
    if (key === 'add') {
      this.initAddOtherSelect(key, validateForm);
    }
  }

  /**
   * 初始化 PartNumber 下拉框
   *
   * @param {*} key 'query'
   * @memberof SqmBaseDataPartsComponent
   */
  partNumberSelect(key, query) {
    this.selectService
      .getPartNumber(query)
      .subscribe(data => {
        this.partNumbers[key] = data;
      });
  }
  initPartNumberSelect(key, validateForm: FormGroup) {
    this.partNumberSelect(key, {});
    // 料號改變時 帶出已維護過的ProjectCode
    this.partNumbersChange$[key].subscribe(partNumber => {
      this.clearSelectValue('partNumber', key, validateForm);
      if (partNumber && key === 'query') {
        this.projectSelectRelated(key, partNumber);
      }
    });
  }

  /**
   * 初始化 廠商 下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  initManufaturerSelect(key, validateForm: FormGroup) {
    this.manufacturerChange$[key].subscribe(manufacturer => {
      this.clearSelectValue('manufacturer', key, validateForm);
      if (manufacturer && key === 'query') {
        this.projectSelectRelated(key, validateForm.value.partNumber, manufacturer);
      }
    });
  }

  /**
   * 初始化 廠別 下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  getPlantSelect(key) {
    this.selectService.getPlant().subscribe(data => {
      this.plants[key] = data;
    });
  }
  initPlantSelect(key, validateForm: FormGroup) {
    this.getPlantSelect(key);
    // 監聽下拉框的值改變
    this.plantsChange$[key].subscribe(datas => {
      this.clearSelectValue('plant', key, validateForm);
      if ((datas && key === 'query') || validateForm.value.checkBox === 'm') {
        this.customerSelect(key, datas);
      } else if (
        datas &&
        key === 'add' &&
        validateForm.value.checkBox === 'p' &&
        !this.addModelPartLoading
      ) {
        this.customers.add = this.addModelPartNumberData.PLMReduce[
          'plantRelation'
        ][datas]['customerList'];
      }
    });
  }

  /**
   * 初始化 客戶 下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  customerSelect(key, plant?, customer?) {
    this.selectService
      .getCustomer(plant, customer)
      .subscribe(data => {
        this.customers[key] = data;
      });
  }
  initCustomSelect(key, validateForm: FormGroup) {
    // 監聽下拉框的值改變
    this.customerChange$[key].subscribe(datas => {
      this.clearSelectValue('customer', key, validateForm);
      if (datas && key === 'query') {
        this.projectSelectRelated(key, validateForm.value.partNumber, validateForm.value.manufacturer, validateForm.value.plant, datas);
      } else if (datas &&
        key === 'add' &&
        validateForm.value.checkBox === 'm') {
        this.projectSelectNotRelated(key, validateForm.value.plant, datas);
      } else if (
        datas &&
        key === 'add' &&
        validateForm.value.checkBox === 'p' &&
        !this.addModelPartLoading
      ) {
        this.projectCodes.add = this.addModelPartNumberData.PLMReduce[
          'plantRelation'
        ][this.modelValidateForm.value.plant]['customerRelation'][datas][
          'projectCodeList'
        ];
      }
    });
    // 搜索相關查詢
    this.customerSearchChange$[key].subscribe(datas => {
      if (datas) {
        this.customerSelect(key, validateForm.value.plant, datas);
      }
    });
  }

  /**
   * 初始化 Project Code下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  initProjectCodeSelect(key, validateForm: FormGroup) {
    // 監聽下拉框的值改變
    this.projectCodeChange$[key].subscribe(datas => {
      this.clearSelectValue('projectCode', key, validateForm);
      if (datas && !this.routeData.flag) {
        if (key === 'query') {
          this.projectNames[key] = [];
          const viewLastestTargetYield = this.viewLastestTargetYield.filter(
            p => p['projectCode'] === datas
          );
          this.projectNames[key].push({
            Value: viewLastestTargetYield[0]['projectName'],
            Label: viewLastestTargetYield[0]['projectName'],
            ProductType: viewLastestTargetYield[0]['product'],
            CurrentStage: viewLastestTargetYield[0]['stage']
          });
          if (!validateForm.value.projectName) {
            this.productId[key] = this.projectNames[key][0]['ProductType'];
            this.partSelect(key, this.productId[key])
          }
          this.stageSelect(key, validateForm.value.projectCode);
        } else if (key === 'add' && validateForm.value.checkBox === 'm') {
          if (this.plantProject.length) {
            this.projectNames[key] = [];
            const plantProject = this.plantProject.filter(
              p => p['projectCode'] === datas
            );
            this.projectNames[key].push({
              Value: plantProject[0]['projectName'],
              Label: plantProject[0]['projectName'],
              ProductType: plantProject[0]['productType'],
              CurrentStage: plantProject[0]['currentStage']
            });
          }
          this.stageSelect(key, validateForm.value.projectCode);
        } else if (
          key === 'add' &&
          validateForm.value.checkBox === 'p' &&
          !this.addModelPartLoading
        ) {
          this.projectNames.add = [
            this.addModelPartNumberData.PLMReduce['plantRelation'][
            validateForm.value.selectPlant
            ]['customerRelation'][validateForm.value.customer][
            'projectCodeRelation'
            ][datas]['projectName']
          ];
          this.stageSelect(key, validateForm.value.projectCode);
        }
      } else {
        if (this.relatedProjectSelect && key === 'query') {
          this.projectCodes[key] = this.relatedProjectSelect['ProjectCode'];
        } else if (this.notRelatedProjectSelect && key === 'add') {
          this.projectCodes[key] = this.notRelatedProjectSelect['ProjectCode'];
        }
      }
    });
    // 搜索相關查詢
    this.projectCodeSearchChange$[key].subscribe(datas => {
      if (datas) {
        if (key === 'query') {
          this.projectCodes[key] = this.relatedProjectSelect[
            'ProjectCode'
          ].filter(v => v.startsWith(datas.trim()));
        } else if (key === 'add' && validateForm.value.checkBox === 'm') {
          this.projectCodes[key] = this.projectCodes[key].filter(v => v.startsWith(datas.trim()));;
        }
      }
    });
  }
  // 根據查詢條件 獲取 ProjectName 與 ProjectCode from View_LastestTargetYield
  projectSelectRelated(key, partNumer?, manufacturer?, plant?, customer?, proCode?, proName?) {
    this.sqmBaseDataService
      .getMaintainProject(partNumer, manufacturer, plant, customer, proCode, proName)
      .subscribe(data => {
        this.manufacturers[key] = data['list']['Manufacturer'];
        this.projectCodes[key] = data['list']['ProjectCode'];
        this.projectNames[key] = data['list']['ProjectName'];
        this.relatedProjectSelect = data['list'];
        this.viewLastestTargetYield = data['dataSet'];
      });
  }
  // 根據廠區和客戶 獲取 ProjectName 與 ProjectCode from V_PlantProject
  projectSelectNotRelated(key, plant?, customer?, proCode?, proName?) {
    this.selectService
      .getProNameProCode('material', plant, null, customer, proCode, proName)
      .subscribe(data => {
        this.projectCodes[key] = data['list']['ProjectCode'];
        this.projectNames[key] = data['list']['ProjectName'];
        this.notRelatedProjectSelect = data['list'];
        this.plantProject = data['dataSet'];
      });
  }
  // 根據ProjectName獲取ProjectCode
  getProCodeByProName(key, plant?, customer?, proName?, proCode?) {
    const mrrModuleName = 'material';
    this.selectService
      .getProCodeByProName(mrrModuleName, plant, null, customer, proName, proCode)
      .subscribe(data => {
        this.projectCodes[key] = data;
      });
  }
  /**
   * 初始化 Project Name 下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  initProjectNameSelect(key, validateForm: FormGroup) {
    // 監聽下拉框的值改變
    this.projectNameChange$[key].subscribe(datas => {
      this.clearSelectValue('projectName', key, validateForm);
      // ProjectName改變時 需要 綁定 ProductType 以便 之後的查詢
      if (datas && !this.routeData.flag) {
        if (key === 'query') {
          this.projectCodes[key] = [];
          this.projectCodes[key].push(
            this.viewLastestTargetYield.filter(p => p['projectName'] === datas)[0][
            'projectCode'
            ]
          );
          const pNameInfo = this.projectNames[key].find(n => n.Value === datas);
          this.productId[key] = pNameInfo['ProductType'];
          this.currentStage[key] = pNameInfo['CurrentStage'];
          validateForm.controls['stage'].setValue(
            this.currentStage[key] !== 'EX' ? this.currentStage[key] : ''
          );
          this.partSelect(key, this.productId[key]);
        } else if (key === 'add' && validateForm.value.checkBox === 'm') {
          if (this.plantProject.length) {
            this.projectCodes[key] = [];
            this.projectCodes[key].push(
              this.plantProject.filter(p => p['projectName'] === datas)[0][
              'projectCode'
              ]
            );
          }
          if (this.projectNames[key]) {
            const pNameInfo = this.projectNames[key].find(n => n.Value === datas);
            this.productId[key] = pNameInfo['ProductType'];
            this.currentStage[key] = pNameInfo['CurrentStage'];
            this.partSelect(key, this.productId[key]);
          }
        }
      } else {
        this.productId[key] = '';
        this.currentStage[key] = '';
        if (this.relatedProjectSelect && key === 'query') {
          this.projectNames[key] = this.relatedProjectSelect['ProjectName'];
        } else if (this.notRelatedProjectSelect && key === 'add') {
          this.projectNames[key] = this.notRelatedProjectSelect['ProjectName'];
        }
      }
    });
  }
  // 獲取ProjectName By ProjectCode
  projectNameSelect(key, plant?, customer?, proCode?, proName?) {
    this.selectService
      .getProName(plant, null, customer, proCode, proName)
      .subscribe(data => {
        this.projectNames[key] = data;
      });
  }

  /**
   * 獲取 stage 下拉框資料
   *
   * @param {*} key 'query'|'add'
   * @param {*} projectCode
   * @memberof SqmBaseDataPartsComponent
   */
  stageSelect(key, projectCode) {
    this.selectService
      .getStage(projectCode)
      .subscribe(data => (this.stages[key] = data));
  }

  /**
   * 初始化Part 下拉框
   *
   * @param {*} key 'query'|'add'
   * @memberof SqmBaseDataPartsComponent
   */
  partSelect(key, productId) {
    this.selectService
      .getPart(productId)
      .subscribe(data => (this.parts[key] = data));
  }

  /**
   * 為 add的時候初始化其他下拉框
   *
   * @memberof SqmBaseDataPartsComponent
   */
  initAddOtherSelect(key, validateForm: FormGroup) {
    this.partNumbersChange$[key].subscribe(data => {
      if (data && key === 'add') {
        this.queryPartNumerLoading = true;
        this.sqmBaseDataService
          .getExternalInfo(data.trim(), validateForm.value.selectPlant)
          .subscribe(res => {
            this.exitPartNumberSet = res['res'][1]; // 記錄已經維護過的機種料號
            this.addModelPartNumberData.AMPL = res['res'][0]['AMPL']; // 從SQMS系統抓取廠商信息（現已經寫入到mrr MaterialUsage）
            this.addModelPartNumberData.PLM = res['res'][0]['PLM_allpart']; // 從PLM抓取機種信息（有就自動帶出，沒有就從v_PlantProject抓取）
            this.addModelPartNumberData.AMPLReduce =
              res['partNumberAMPLReduce'];
            this.addModelPartNumberData.PLMReduce = res['partNumberPLMReduce'];
            this.routeDataCheck = res['routeDataRes'];
            this.queryPartNumerLoading = false;
            if (this.addModelPartNumberData.AMPL.length < 1) {
              this.messageService.MessageCode.modalError.param.nzTitle = this.title['noVendor'];
              this.messageService.MessageCode.modalError.param.data = res;
              this.messageService.MessageCode.modalError.param.nzOnOk = () => {
                this.addModelCancel();
              };
              this.messageService.showMessage(
                this.messageService.MessageCode.modalError
              );
            } else if (this.addModelPartNumberData.PLM.length > 0 && this.addModelPartNumberData.PLM[0].error) {
              this.messageService.MessageCode.modalError.param.nzTitle = this.title['noProduct'];
              this.messageService.MessageCode.modalError.param.nzOnOk = () => {
                this.addModelCancel();
              };
              this.messageService.showMessage(
                this.messageService.MessageCode.modalError
              );
            } else {
              this.partNumberBtnClick = true;
              this.setAddModelSelect();
            }
          }, error => {
            this.queryPartNumerLoading = false;
            this.messageService.MessageCode.modalError.param.nzTitle = error['message'];
            this.messageService.showMessage(
              this.messageService.MessageCode.modalError
            );
          });
      }
    });
    this.partNumbersSearch$[key].subscribe(data => {
      if (data && key === 'add') {
        this.partNumberSelect('add', { id: { like: data + '%' } });
      }
    });
    this.manufacturerChange$[key].subscribe(data => {
      if (data && key === 'add' && !this.addModelPartLoading && this.partsDataSet.length < 1) {
        if (Object.keys(this.addModelPartNumberData.AMPLReduce).length > 0) {
          this.vendorCodes.add = this.addModelPartNumberData.AMPLReduce[
            'manufacturerRelation'
          ][data].map(d => d.vendorCode);
        }
      }
      this.clearSelectValue('manufacturer', 'add', validateForm);
    });
    this.vendorCodeChange$.subscribe(data => {
      if (data && !this.addModelPartLoading && this.partsDataSet.length < 1) {
        if (Object.keys(this.addModelPartNumberData.AMPLReduce).length > 0) {
          const vendorCode = this.addModelPartNumberData.AMPLReduce[
            'manufacturerRelation'
          ][this.modelValidateForm.value.manufacturer].find(
            d => d.vendorCode === data
          );
          this.modelValidateForm.controls['vendorName'].setValue(
            vendorCode.vendorName
          );
        }
      }
    });
  }

  /**
   * 放置 新增 下拉框中內容
   *
   * @memberof SqmBaseDataPartsComponent
   */
  setAddModelSelect() {
    this.addModelPartLoading = true;
    // 放置 下拉框中內容
    if (this.addModelPartNumberData.AMPL.length > 0 && !this.routeData.flag) {
      if (this.addModelPartNumberData.AMPL.length === 1) { // 存在manufacturer和vendor一對多的情況
        this.modelValidateForm.controls['manufacturer'].setValue(
          this.addModelPartNumberData.AMPL[0]['MANUFACTURER']
        );
        this.modelValidateForm.controls['vendorCode'].setValue(
          this.addModelPartNumberData.AMPL[0]['VENDORID']
        );
        this.modelValidateForm.controls['vendorName'].setValue(
          this.addModelPartNumberData.AMPL[0]['VENDORNAME']
        );
      }
      this.manufacturers.add = this.addModelPartNumberData.AMPLReduce[
        'manufacturerList'
      ];
      this.vendorCodes.add = this.addModelPartNumberData.AMPLReduce[
        'vendorCodeList'
      ];
      // 判斷是否維護過該料號 by partNumberVendorId
      if (this.exitPartNumberSet.length > 0) {
        this.exitPartNumberFlag = true;
        const maintainSet = this.exitPartNumberSet.reduce((p, t) => {
          if (!p['PartNumberVendorId'].includes(t['partNumberVendorId'])) {
            p['PartNumberVendorId'].push(t['partNumberVendorId']);
          }
          if (!p['Manufacturer'].includes(t['manufacturer'])) {
            p['Manufacturer'].push(t['manufacturer']);
          }
          if (!p['VendorCode'].includes(t['vendorCode'])) {
            p['VendorCode'].push(t['vendorCode']);
          }
          if (!p['Customer'].includes(t['customer'])) {
            p['Customer'].push(t['customer']);
          }
          if (!p['ProjectCode'].includes(t['projectCode'])) {
            p['ProjectCode'].push(t['projectCode']);
          }
          if (!p['ProjectNameList'].includes(t['projectName'])) {
            p['ProjectNameList'].push(t['projectName']);
            p['ProjectName'].push({
              Value: t['projectName'],
              Label: t['projectName'],
              ProductType: t['product'],
              CurrentStage: t['stage']
            });
          }
          if (!p['PartId'].includes(t['partId'])) {
            p['PartId'].push(t['partId']);
            p['Part'].push({
              Value: t['partId'],
              Label: t['parts']
            });
          }
          if (!p['Stage'].includes(t['stage'])) {
            p['Stage'].push(t['stage']);
          }
          return p;
        }, {
          PartNumberVendorId: [], Manufacturer: [], VendorCode: [], Customer: [], ProjectCode: [], ProjectName: [], ProjectNameList: [], PartId: [], Part: [], Stage: []
        });
        this.modelValidateForm.controls['plant'].setValue(
          this.modelValidateForm.value.selectPlant
        );
        // 判斷機種與料號是否一一對應 是的話則帶出相關內容
        if (maintainSet['ProjectCode'].length === maintainSet['PartNumberVendorId'].length) {
          this.modelValidateForm.controls['manufacturer'].setValue(
            maintainSet['Manufacturer'][0]
          );
          this.modelValidateForm.controls['vendorCode'].setValue(
            maintainSet['VendorCode'][0]
          );
          const vendorCode = this.addModelPartNumberData.AMPLReduce[
            'manufacturerRelation'
          ][this.modelValidateForm.value.manufacturer].find(
            d => d.vendorCode === this.modelValidateForm.value.vendorCode
          );
          this.modelValidateForm.controls['vendorName'].setValue(
            vendorCode.vendorName
          );
          this.modelValidateForm.controls['customer'].setValue(
            maintainSet['Customer'][0]
          );
          this.modelValidateForm.controls['projectCode'].setValue(
            maintainSet['ProjectCode'][0]
          );
          this.modelValidateForm.controls['projectName'].setValue(
            maintainSet['ProjectName'][0]['Value']
          );
          this.productId.add = maintainSet['ProjectName'][0]['ProductType'];
          this.modelValidateForm.controls['stage'].setValue(
            maintainSet['ProjectName'][0]['CurrentStage']
          );
          this.modelValidateForm.controls['part'].setValue(
            maintainSet['Part'][0]['Value']
          );
        } else {
          this.modelValidateForm.controls['checkBox'].setValue('m');
        }
        this.manufacturers.add = maintainSet['Manufacturer'];
        this.vendorCodes.add = maintainSet['VendorCode'];
        this.customers.add = maintainSet['Customer'];
        this.projectCodes.add = maintainSet['ProjectCode'];
        this.projectNames.add = maintainSet['ProjectName'];
        this.stages.add = maintainSet['Stage'];
        this.parts.add = maintainSet['Part'];
        this.addModelUpdateList();
        this.messageService.MessageCode.modalError.param.nzTitle = this.title['exitPartNo'];
        this.messageService.showMessage(
          this.messageService.MessageCode.modalError
        );
      } else {
        this.exitPartNumberFlag = false;
        // 資料來自 PLM
        if (this.addModelPartNumberData.PLM.length > 0) {
          this.modelValidateForm.controls['checkBox'].setValue('p');
          this.modelValidateForm.controls['plant'].setValue(
            this.addModelPartNumberData.PLM[0]['plants'][0]
          );
          this.modelValidateForm.controls['customer'].setValue(
            this.addModelPartNumberData.PLM[0]['customer']
          );
          this.modelValidateForm.controls['projectCode'].setValue(
            this.addModelPartNumberData.PLM[0]['projectCode']
          );
          this.modelValidateForm.controls['projectName'].setValue(
            this.addModelPartNumberData.PLM[0]['projectName']
          );
          this.stageSelect(
            'add',
            this.addModelPartNumberData.PLM[0]['projectCode']
          );
          this.productId.add = this.addModelPartNumberData.PLMReduce[
            'plantRelation'
          ][this.addModelPartNumberData.PLM[0]['plants'][0]]['customerRelation'][
            this.addModelPartNumberData.PLM[0]['customer']
          ]['projectCodeRelation'][
            this.addModelPartNumberData.PLM[0]['projectCode']
          ]['productType'];
          this.customers.add = this.addModelPartNumberData.PLMReduce[
            'plantRelation'
          ][this.addModelPartNumberData.PLM[0]['plants'][0]]['customerList'];
          this.projectCodes.add = this.addModelPartNumberData.PLMReduce[
            'plantRelation'
          ][this.addModelPartNumberData.PLM[0]['plants'][0]]['customerRelation'][
            this.addModelPartNumberData.PLM[0]['customer']
          ]['projectCodeList'];
          this.projectNames.add = [
            this.addModelPartNumberData.PLMReduce['plantRelation'][
            this.addModelPartNumberData.PLM[0]['plants'][0]
            ]['customerRelation'][this.addModelPartNumberData.PLM[0]['customer']][
            'projectCodeRelation'
            ][this.addModelPartNumberData.PLM[0]['projectCode']]['projectName']
          ];
          this.parts.add = this.addModelPartNumberData.PLMReduce['plantRelation'][
            this.addModelPartNumberData.PLM[0]['plants'][0]
          ]['customerRelation'][this.addModelPartNumberData.PLM[0]['customer']][
            'projectCodeRelation'
          ][this.addModelPartNumberData.PLM[0]['projectCode']]['parts'];
        } else {
          // 該料號在PLM 無對應的機種資料
          this.messageService.MessageCode.modalError.param.nzTitle = this.title['noModel'];
          this.messageService.showMessage(
            this.messageService.MessageCode.modalError
          );
          this.modelValidateForm.controls['checkBox'].setValue('m');
          this.modelValidateForm.controls['plant'].setValue(
            this.modelValidateForm.value.selectPlant
          );
          this.customerSelect('add', this.modelValidateForm.value.selectPlant);
        }
      }
    } else if (this.routeData.flag) {
      // 路由傳參
      if (this.routeDataCheck.flag) {
        this.manufacturers.add = this.routeData.data['select']['manufacturers'];
        this.vendorCodes.add = this.routeData.data['select']['vendors'].map(
          m => m.id
        );
        this.modelValidateForm.controls['manufacturer'].setValue(
          this.routeData.data['value']['manufacturer']
        );
        this.modelValidateForm.controls['vendorCode'].setValue(
          this.routeData.data['value']['vendor']
        );
        this.modelValidateForm.controls['plant'].setValue(
          this.routeData.data['value']['plant']
        );
        const vendorFind = this.routeData.data['select']['vendors'].find(
          f => f.id === this.routeData.data['value']['vendor']
        );
        this.modelValidateForm.controls['vendorName'].setValue(
          vendorFind ? vendorFind['name'] : ''
        );
        this.productId.add = this.routeData.data['select']['parts'].find(
          f => f.id === this.routeData.data['value']['part']
        )['productId'];
        this.customers.add = this.routeData.data['select']['customers'];
        this.projectCodes.add = this.routeData.data['select']['projectCodes'];
        this.projectNames.add = this.routeData.data['select'][
          'projectNames'
        ].map(m => {
          const res: any = {};
          res.ProductType = this.productId.add;
          res.CurrentStage = '';
          res.Value = m;
          res.Label = m;
          return res;
        });
        this.stages.add = this.routeData.data['select']['stages'];
        this.parts.add = this.routeData.data['select']['parts'].map(p => {
          const res: any = {};
          res.Value = p.id;
          res.Label = p.name;
          return res;
        });
        this.modelValidateForm.controls['checkBox'].setValue('m');
        this.modelValidateForm.controls['customer'].setValue(
          this.routeData.data['value']['customer']
        );
        this.modelValidateForm.controls['projectCode'].setValue(
          this.routeData.data['value']['projectCode']
        );
        this.modelValidateForm.controls['projectName'].setValue(
          this.routeData.data['value']['projectName']
        );
        this.productId.add = this.routeData.data['select']['parts'].find(
          f => f.id === this.routeData.data['value']['part']
        )['productId'];
        this.modelValidateForm.controls['stage'].setValue(
          this.routeData.data['value']['stage']
        );
        this.modelValidateForm.controls['part'].setValue(
          this.routeData.data['value']['part']
        );
        this.addModelUpdateList();
      } else {
        this.messageService.MessageCode.modalError.param.data = {
          routeData: this.routeData.data,
          addModelPartNumberData: this.addModelPartNumberData
        };
        this.messageService.MessageCode.modalError.param.nzTitle = this.routeDataCheck.msg;
        this.messageService.MessageCode.modalError.param.nzOnOk = () => {
          this.addModelCancel();
        };
        this.messageService.showMessage(
          this.messageService.MessageCode.modalError
        );
      }
    } else {
      this.clearSelectValue('partNumber', 'add', this.modelValidateForm);
    }
    this.addModelPartLoading = false;
  }

  /**
   * 按順序清空 下拉框中的值, 傳入 當前 變化的下拉框名稱
   *
   * @param {*} selectType 'plant'|'customer'|'projectCode'|'projectName'|'part'
   * @param {*} operationType 'query'| 'add'
   * @memberof SqmBaseDataPartsComponent
   */
  clearSelectValue(selectType, operationType, validateForm: FormGroup) {
    if (operationType === 'query') {
      this.vendor.flag = false;
      switch (selectType) {
        // 1.查詢下拉框值清空
        case 'partNumber':
          validateForm.controls['manufacturer'].setValue('');
        case 'manufacturer':
          validateForm.controls['plant'].setValue('');
        case 'plant':
          validateForm.controls['customer'].setValue('');
        case 'customer':
          validateForm.controls['projectCode'].setValue('');
          validateForm.controls['projectName'].setValue('');
        case 'projectCode':
        case 'projectName':
          validateForm.controls['part'].setValue('');
          validateForm.controls['stage'].setValue('');
        case 'part':
          validateForm.controls['stage'].setValue('');
          break;
        default:
          break;
      }
    } else {
      if (selectType === 'partNumber') {
        validateForm.controls['manufacturer'].setValue('');
        validateForm.controls['vendorCode'].setValue('');
        validateForm.controls['vendorName'].setValue('');
        validateForm.controls['checkBox'].setValue('');
        validateForm.controls['plant'].setValue('');
        validateForm.controls['customer'].setValue('');
        validateForm.controls['projectCode'].setValue('');
        validateForm.controls['projectName'].setValue('');
        validateForm.controls['stage'].setValue('');
        validateForm.controls['part'].setValue('');
      } else {
        switch (selectType) {
          // 2.addModel下拉框值清空
          case 'manufacturer': {
            validateForm.controls['vendorCode'].setValue('');
            validateForm.controls['vendorName'].setValue('');
            break;
          }
          case 'plant':
            validateForm.controls['customer'].setValue('');
          case 'customer':
            validateForm.controls['projectCode'].setValue('');
            validateForm.controls['projectName'].setValue('');
          case 'projectCode':
          case 'projectName': {
            validateForm.controls['stage'].setValue('');
            validateForm.controls['part'].setValue('');
            break;
          }
          default:
            break;
        }
      }
    }
  }

  /**
   * 复制机种 stage 选择
   *
   * @param {*} item
   * @memberof SqmBaseDataPartsComponent
   */
  btnCopyClick(item) {
    this.btn.copy.chooseStage = item;
  }

  btnSet(datas) {
    // copy
    this.btn.copy.currentStage = datas.length > 0 ? datas[0].stage : '';
    this.btn.copy.disableFlag = this.btn.copy.currentStage ? false : true;
    this.btn.copy.menu = ['C3', 'C4', 'C5', 'C6'];
    if (this.btn.copy.currentStage) {
      this.btn.copy.menu = this.btn.copy.menu.filter(s => s !== this.btn.copy.currentStage);
    }
    const stageOrder = this.btn.copy.menu;
    const findIndex = stageOrder.findIndex(
      d => d === this.btn.copy.currentStage
    );
    this.btn.copy.chooseStage =
      findIndex + 1 > 0 && findIndex + 1 < stageOrder.length
        ? stageOrder[findIndex + 1]
        : '';
  }

  query() {
    this.addModelList.transferList = [];
    this.queryLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.partsDataSet = [];
    this.sqmBaseDataService.getPartsDataSet(this.validateForm).subscribe(
      (datas: View_LatestTargetYield[]) => {
        this.partsDataSet = datas;
        if (this.partsDataSet.length > 0) {
          this.exitPartNumberSet = this.partsDataSet;
          this.exitPartNumberFlag = true;
        } else {
          this.exitPartNumberFlag = false;
        }
        this.vendor.flag = true;
        this.vendor.vendorCode = datas.length > 0 ? datas[0].vendorCode : '';
        this.vendor.partNumberVendorId =
          datas.length > 0 ? datas[0].partNumberVendorId : null;
        this.btnSet(datas);
        this.updateEditCache();
        this.queryLoading = false;
      },
      error => {
        this.messageService.MessageCode.queryError.param.data = error;
        this.messageService.showMessage(
          this.messageService.MessageCode.queryError
        );
        this.queryLoading = false;
      }
    );
  }

  // 表格相關 function -- start
  /**
   * 更新 表格編輯 緩存
   *
   * @memberof SqmBaseDataPartsComponent
   */
  updateEditCache(): void {
    this.partsDataSet.forEach(item => {
      this.editCache[item.order] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  startEdit(order: string) {
    this.editCache[order].edit = true;
  }

  // 編輯保存頁面上的 良率
  saveEdit(data: View_LatestTargetYield, index) {
    this.sqmBaseDataService
      .saveSqmTargetYield(
        this.editCache[data.order].data.partNumberVendorOperationId,
        this.editCache[data.order].data['sqmTargetYieldShow'] / 100
      )
      .subscribe(
        res => {
          this.messageService.MessageCode.saveSuccess.param.data = res;
          this.messageService.showMessage(
            this.messageService.MessageCode.saveSuccess
          );
          this.partsDataSet[index]['sqmTargetYieldShow'] = this.editCache[
            data.order
          ].data['sqmTargetYieldShow'];
          this.partsDataSet[index]['sqmTargetYield'] =
            this.editCache[data.order].data['sqmTargetYieldShow'] / 100;
          this.cancelEdit(data.order.toString());
        },
        error => {
          this.messageService.MessageCode.saveError.param.data = error;
          this.messageService.showMessage(
            this.messageService.MessageCode.saveError
          );
          this.editCache[data.order].data[
            'sqmTargetYieldShow'
          ] = this.partsDataSet[index]['sqmTargetYieldShow'];
          this.partsDataSet[index]['sqmTargetYield'] =
            this.editCache[data.order].data['sqmTargetYieldShow'] / 100;
          this.cancelEdit(data.order.toString());
        }
      );
  }

  cancelEdit(order: string) {
    this.editCache[order].edit = false;
  }
  // 表格相關 function -- end

  // 新機種料號維護 model相關 function -- start
  addModalShow(key) {
    this.btn.type = key;
    switch (key) {
      case 'add':
        this.nzTitle = this.title['modalTitle'];
        break;
      case 'copy':
        this.nzTitle = `${this.title['copyModel']} Critical Process ${this.title['maintain']}`;
        break;
      case 'order':
        this.nzTitle = `${this.title['modelPartNo']} Critical Process ${this.title['maintain']}`;
        break;
      default:
        this.nzTitle = this.title['modalTitle'];
        break;
    }
    // 將 下拉框 中的數值 與 查詢 下拉框中 同步
    this.sqmBaseDataService
      .setPartsAddModelSelectValue(
        this.validateForm,
        this.vendor,
        this.productId.query
      )
      .subscribe(d => {

        // 選擇值 同步
        this.modelValidateForm.controls['selectPlant'].setValue(d.plant);
        this.modelValidateForm.controls['partNumber'].setValue(d.partNumber);
        this.modelValidateForm.controls['manufacturer'].setValue(
          d.manufacturer
        );
        this.modelValidateForm.controls['vendorCode'].setValue(d.vendorCode);
        this.modelValidateForm.controls['vendorName'].setValue(d.vendorName);
        this.modelValidateForm.controls['plant'].setValue(d.plant);
        this.modelValidateForm.controls['customer'].setValue(d.customer);
        this.modelValidateForm.controls['projectCode'].setValue(d.projectCode);
        this.modelValidateForm.controls['projectName'].setValue(d.projectName);
        this.modelValidateForm.controls['stage'].setValue(d.stage);
        this.modelValidateForm.controls['part'].setValue(d.part);

        // 選擇框 同步
        this.plants.add = this.plants.query;
        this.partNumbers.add = this.partNumbers.query;
        this.manufacturers.add = this.manufacturers.query;
        this.vendorCodes.add = this.vendor.flag ? [d.vendorCode] : [];
        this.customers.add = this.customers.query.length ? this.customers.query : [d.customer];
        this.projectCodes.add = this.projectCodes.query;
        this.projectNames.add = this.projectNames.query;
        this.productId.add = this.productId.query;
        this.currentStage.add = this.currentStage.query;
        this.stages.add = this.stages.query;
        this.parts.add = this.parts.query;

        if (key !== 'copy' && this.exitPartNumberFlag) {
          this.addModelUpdateList();
        }
        if (key === 'copy') {
          if (!this.btn.copy.chooseStage) {
            return;
          } else {
            this.modelValidateForm.controls['stage'].setValue(
              this.btn.copy.chooseStage
            );
          }
          if (this.exitPartNumberFlag) {
            this.addModelList.transferList = d.transferList;
            this.addModelList.operationList = d.operationList;
          }
        }
        this.addModelFlag = true;
      });
  }

  // 機種資料來源
  addModelRadioChange(event) {
    if (event === 'p' && !this.addModelPartLoading) {
      this.setAddModelSelect();
    } else if (event === 'm' && !this.addModelPartLoading) {
      this.clearSelectValue('plant', 'add', this.modelValidateForm);
      this.customerSelect('add', this.modelValidateForm.value.selectPlant);
    }
  }

  // 機種料號維護信息保存
  addModelSave() {
    this.saveProjectLoading = true;
    let flag = false;
    if (this.exitPartNumberFlag) {
      const data = this.exitPartNumberSet.filter(d => d['partNumber'] === this.modelValidateForm.value.partNumber && d['projectCode'] === this.modelValidateForm.value.projectCode);
      if (data.length > 0) {
        flag = true;
      }
    }
    if (!this.exitPartNumberFlag || (this.exitPartNumberFlag && !flag)) {
      this.sqmBaseDataService
        .savePartsAddModel(this.btn.type, {
          partNumberVendorId: this.vendor.partNumberVendorId,
          plantId: this.modelValidateForm.value.plant,
          stageId: this.modelValidateForm.value.stage,
          operationList: this.addModelList.operationList,
          srcStageId: this.btn.copy.currentStage,
          partNumberId: this.modelValidateForm.value.partNumber,
          partId: this.modelValidateForm.value.part,
          vendorId: this.modelValidateForm.value.vendorCode,
          manufacturerId: this.modelValidateForm.value.manufacturer,
          projectCode: this.modelValidateForm.value.projectCode,
          vendorName: this.modelValidateForm.controls['vendorName'].value
        })
        .subscribe(
          d => {
            this.messageService.showMessage(
              this.messageService.MessageCode.saveProjectSuccess
            );
            this.saveProjectLoading = false;
            this.addModelCancel();
          },
          e => {
            this.messageService.showMessage(
              this.messageService.MessageCode.saveProjectError
            );
            this.saveProjectLoading = false;
          }
        );
    } else if (this.exitPartNumberFlag || flag) {
      // 當前機種料號已經維護過製程目標良率
      if (this.btn.type === 'add') {
        this.messageService.MessageCode.saveProjectConfirm.param.nzTitle = this.title['addProcessNotice'];
      } else if (this.btn.type === 'order') {
        this.messageService.MessageCode.saveProjectConfirm.param.nzTitle = this.title['orderProcessNotice'];
      } else {
        this.messageService.MessageCode.saveProjectConfirm.param.nzTitle = `${this.title['otherProcess1']}${this.validateForm.value.stage}${this.title['otherProcess2']}${this.btn.copy.chooseStage}`;
      }
      this.messageService.MessageCode.saveProjectConfirm.param.nzOnOk = () => {
        this.sqmBaseDataService
          .savePartsAddModel(this.btn.type, {
            partNumberVendorId: this.vendor.partNumberVendorId,
            plantId: this.modelValidateForm.value.plant,
            stageId: this.modelValidateForm.value.stage,
            operationList: this.addModelList.operationList,
            srcStageId: this.btn.copy.currentStage,
            partNumberId: this.modelValidateForm.value.partNumber,
            partId: this.modelValidateForm.value.part,
            vendorId: this.modelValidateForm.value.vendorCode,
            manufacturerId: this.modelValidateForm.value.manufacturer,
            projectCode: this.modelValidateForm.value.projectCode,
            vendorName: this.modelValidateForm.controls['vendorName'].value
          })
          .subscribe(
            d => {
              this.messageService.showMessage(
                this.messageService.MessageCode.saveProjectSuccess
              );
              this.saveProjectLoading = false;
              this.addModelCancel();
            },
            e => {
              this.messageService.showMessage(
                this.messageService.MessageCode.saveProjectError
              );
              this.saveProjectLoading = false;
            }
          );
      };
      this.messageService.showMessage(
        this.messageService.MessageCode.saveProjectConfirm
      );
      this.messageService.MessageCode.saveProjectConfirm.param.nzOnCancel = () => {
        this.saveProjectLoading = false;
      };
    }
  }

  addModelCancel() {
    this.btn.type = '';
    this.addModelFlag = false;
    this.partNumberBtnClick = false;
    this.routeData.flag = false;
    if (this.partsDataSet.length < 1) {
      this.exitPartNumberFlag = false;
    }
    for (const key in this.modelValidateForm.controls) {
      if (this.modelValidateForm.controls.hasOwnProperty(key)) {
        this.modelValidateForm.controls[key].setValue('');
        this.modelValidateForm.controls[key].updateValueAndValidity();
      }
    };
  }

  // 隱藏機種料號Save 按鈕
  addModelSaveDisabled() {
    if (this.btn.type !== 'add' || this.partsDataSet.length < 1) {
      return false;
    } else {
      return !this.modelValidateForm.valid;
    }
  }

  // 加載Critical Process
  addModelUpdateList() {
    this.addModelList.transferListCache = [];
    this.addModelList.operationListCache = [];
    this.sqmBaseDataService
      .setPartsAddModelTransferList(this.modelValidateForm, this.productId.add)
      .subscribe(d => {
        this.addModelList.transferList = d.transferList;
        this.addModelList.operationList = d.operationList;
        Object.assign(this.addModelList.transferListCache, d.transferList);
        Object.assign(this.addModelList.operationListCache, d.operationList);
      });
  }

  addModelTransferChange(ret: {}) {
    this.addOrderModelShow(ret);
  }

  // 編輯Process 良率
  addModelTransferEdit() {
    this.addOrderModelShow();
  }

  // Process序號/目標良率調整
  addOrderModelShow(ret?) {
    this.addModelList.operationList = this.sqmBaseDataService.setPartsAddOrderModelData(
      ret,
      this.addModelList.operationList
    );
    this.addModelFlag = false;
    this.addOrderModelFlag = true;
  }

  // Process良率 保存
  addOrderModelSave() {
    this.RTYid = this.addModelList.transferList.filter(o => o['operation'] === 'RTY')[0]['operationId'];
    const data = this.addModelList.operationList.filter(o => o['operationId'] === this.RTYid);
    // judge RTY exit and the last one
    if (data.length) {
      if (data[0]['order'] !== this.addModelList.operationList.length) {
        this.message.create('error', this.title['processNotice']);
      } else {
        this.sqmBaseDataService
          .savePartsAddOrderModel(
            this.addModelList.operationList,
            this.addModelList.transferList
          )
          .subscribe(
            d => {
              this.addModelList.transferList = d[1]['transferList'];
              this.addModelList.transferListCache = JSON.parse(
                JSON.stringify(this.addModelList.transferList)
              );
              this.addModelList.operationList = d[0]['operationList'];
              this.addModelList.operationListCache = JSON.parse(
                JSON.stringify(this.addModelList.operationList)
              );
              this.messageService.MessageCode.saveSuccess.param.data = d;
              this.messageService.showMessage(
                this.messageService.MessageCode.saveSuccess
              );
              this.addOrderModelFlag = false;
              this.addModelFlag = true;
            },
            e => {
              this.messageService.MessageCode.saveError.param.data = e;
              this.messageService.showMessage(
                this.messageService.MessageCode.saveError
              );
            }
          );
      }
    } else {
      this.message.create('error', this.title['noRTY']);
    }
  }

  // 取消--將編輯過的數據 返回放入 池子中
  addOrderModelCancel() {
    this.addModelList.transferList = JSON.parse(
      JSON.stringify(this.addModelList.transferListCache)
    );
    this.addModelList.operationList = JSON.parse(
      JSON.stringify(this.addModelList.operationListCache)
    );
    this.addOrderModelFlag = false;
    this.addModelFlag = true;
  }

  // 調整Process順序
  addOrderModelUpDown(index1, index2) {
    this.addModelList.operationList = this.sqmBaseDataService.movePartsAddOrderModelData(
      this.addModelList.operationList,
      index1,
      index2
    );
  }

  // 增加Link--跳轉新機種信息維護 產品
  addModelClickLink() {
    this.sqmBaseDataService
      .queryDfcProjectInfo(
        this.modelValidateForm.value.plant,
        this.modelValidateForm.value.projectCode,
        this.modelValidateForm.value.projectName
      )
      .subscribe(res => {
        this.router.navigate(['/dashboard/dfc/newmodel-maintain'], {
          queryParams: {
            Plant: res.Plant,
            ProjectNameID: res.ProNameId
          }
        });
      });
  }

  // 新機種料號維護 model相關 function -- end

  // 料號 與 機種 綁定情況 -- start
  showPartNumberPro(data) {
    this.currentPlant = data.plant;
    this.partNumProDataSet = [];
    this.sqmBaseDataService.getProjectByPartNumberId(data.partNumber).subscribe(
      d => {
        this.partNumProDataSet = d;
        this.partNumProFlag = true;
      },
      e => {
        this.messageService.MessageCode.queryError.param.data = e;
        this.messageService.showMessage(
          this.messageService.MessageCode.queryError
        );
      }
    );
  }

  partNumProModelCancel() {
    this.partNumProFlag = false;
  }

  partNumProModelAdd() {
    this.partNumberProAddSelect.search$.subscribe(search => {
      const proCode = this.partNumProDataSet.map(d => d.projectCode);
      this.sqmBaseDataService
        .getProject(
          this.validateForm.value.plant ? this.validateForm.value.plant : this.currentPlant,
          this.productId.query,
          proCode,
          search
        )
        .subscribe(d => {
          d = d.filter(t => t['moduleName'] === 'material' && t['moduleEnabled']);
          this.partNumberProAddSelect.list = d;
        });
    });
    this.partNumberProAddFlag = true;
    this.partNumProFlag = false;
  }

  partNumProModelAddSave() {
    this.sqmBaseDataService
      .savePartNumberPro(
        this.validateForm.value.partNumber,
        this.partNumberProAddSelect.value,
        localStorage.getItem('$DFI$userID')
      )
      .subscribe(
        v => {
          this.messageService.MessageCode.saveSuccess.param.data = v;
          this.messageService.showMessage(
            this.messageService.MessageCode.saveSuccess
          );
          this.sqmBaseDataService
            .getProjectByPartNumberId(this.validateForm.value.partNumber)
            .subscribe(d => {
              this.partNumProDataSet = d;
              this.partNumProModelAddCancel();
            });
        },
        e => {
          this.messageService.MessageCode.saveError.param.data = e;
          this.messageService.showMessage(
            this.messageService.MessageCode.saveError
          );
        }
      );
  }

  partNumProModelAddCancel() {
    this.partNumberProAddFlag = false;
    this.partNumProFlag = true;
  }
  // 料號 與 機種 綁定情況 -- end
}
