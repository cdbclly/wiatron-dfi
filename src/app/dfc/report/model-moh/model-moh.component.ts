import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  ProjectNameProfileApi,
  ProjectCodeProfileApi,
  MOHApi,
  MOHConditionApi,
  MOHAdditionApi,
  V_ProjectSummaryApi
} from '@service/dfc_sdk/sdk';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  of,
  from,
  forkJoin,
  Subject
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  mergeMap,
  takeUntil
} from 'rxjs/operators';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  ActivatedRoute
} from '@angular/router';
import {
  ClsDfcQueryStyle,
  ClsDfcQuerySelect
} from 'app/shared/dfc-common';
import {
  ModelMohService
} from './model-moh.service';
import {
  DfcCommonService
} from 'app/shared/dfc-common/service/dfc-common.service';
import {
  DownexcelService
} from '@service/downexcel.service';
import {
  DfcMOHParamMapping
} from 'app/dfc/moh-parameter/moh-parameter.service';
import {
  GroupModelApi
} from '@service/dfc_sdk/sdk/services/custom/GroupModel';
import {
  BasicModelApi
} from '@service/dfc_sdk/sdk/services/custom/BasicModel';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-model-moh',
  templateUrl: './model-moh.component.html',
  styleUrls: ['./model-moh.component.scss']
})
export class ModelMohComponent implements OnInit {
  tablePaging = true;
  tableColspan = 3;
  processShow = {
    LCM: {
      show: true,
      condition: ['LA', 'LP', 'LT']
    },
    PCBA: {
      show: true,
      condition: ['D', 'DP', 'DT']
    },
    FA: {
      show: true,
      condition: ['A', 'P', 'T']
    },
  };
  modelTableLoading = false;
  querying1: Subscription;
  querying2: Subscription;
  dataSet = []; // 表格数据暂存

  // 查詢時的下拉框設定
  // 廠別相關
  plantSelectValue: string;
  listOfPlantSelectOption = []; // 下拉框内容
  // 產品相關
  modelTypeSelectValue: string;
  listOfModelTypeSelectOption = []; // 下拉框内容
  modelTypeSearchChange$ = new BehaviorSubject('');
  isModelTypeListLoading = false;
  modelTypeSelectFlag = true; // 下拉框 是否可用
  // C流程相關
  cFlowSelectValue: string; // 下拉框選中的值
  listOfCFlowSelectOption = ['RFQ', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6']; // 下拉框内容
  cFlowSelectFlag = true; // 下拉框 是否可用
  // 達標狀況
  standardSelectValue: string;
  listOfStandardSelectOption = ['達標', '未達標'];
  // ModelFamily相關
  modelFamilySelectValue;
  listOfModelFamilySelectOption = []; // 下拉框内容
  modelFamilySearchChange$ = new BehaviorSubject('');
  isModelFamilyListLoading = false;
  modelFamilySelectFlag = true; // 下拉框 是否可用
  // ModelName相關
  modelNameSelectValue;
  listOfModelNameSelectOption = []; // 下拉框内容
  modelNameSearchChange$ = new BehaviorSubject('');
  isModelNameListLoading = false;
  modelNameSelectFlag = true; // 下拉框 是否可用
  // 全部的projectName
  tempProjectNameList = [];
  // 報表彈出框
  isReportPopVisible = false; // 默認不可以顯示
  popLeftDataSet = []; // 報表 弹出框左边 相關表格
  modelFieldNotPercented = ['SMTCT', 'SMTMan', 'SMTMonthDay', 'SMTDayHour', 'DIPCT', 'DIPMan', 'DIPDayHour', 'DIPMonthDay', 'LCMCT', 'LCMMan', 'LCMMonthDay', 'LCMDayHour', 'FACT',
    'FAMan', 'FAMonthDay', 'FADayHour'
  ];
  booleanField = ['PCBAType', 'LCMType', 'FAType'];
  popCenterDataSet: {
    StageID: number,
    output: number,
    moh: number,
    fixdepre: number,
    fixamort: number,
    fixrent: number,
    fixTotal: number,
    sfixidl: number,
    sfixsitealloc: number,
    sfixhqsup: number,
    sfixpacout: number,
    sfixhpwr: number,
    sfixrepair: number,
    sfixTotal: number,
    vardl: number,
    varmpa: number,
    varmaterial: number,
    varother: number,
    vartax: number,
    vartravel: number,
    vardrive: number,
    varTotal: number,
    fixdepreR: string,
    fixamortR: string,
    fixrentR: string,
    fixTotalR: string,
    sfixidlR: string,
    sfixsiteallocR: string,
    sfixhqsupR: string,
    sfixpacoutR: string,
    sfixhpwrR: string,
    sfixrepairR: string,
    sfixTotalR: string,
    vardlR: string,
    varmpaR: string,
    varmaterialR: string,
    varotherR: string,
    vartaxR: string,
    vartravelR: string,
    vardriveR: string,
    varTotalR: string
  } = {
      StageID: 0,
      output: 0,
      moh: 0,
      fixdepre: 0,
      fixamort: 0,
      fixrent: 0,
      fixTotal: 0,
      sfixidl: 0,
      sfixsitealloc: 0,
      sfixhqsup: 0,
      sfixpacout: 0,
      sfixhpwr: 0,
      sfixrepair: 0,
      sfixTotal: 0,
      vardl: 0,
      varmpa: 0,
      varmaterial: 0,
      varother: 0,
      vartax: 0,
      vartravel: 0,
      vardrive: 0,
      varTotal: 0,
      fixdepreR: '0',
      fixamortR: '0',
      fixrentR: '0',
      fixTotalR: '0',
      sfixidlR: '0',
      sfixsiteallocR: '0',
      sfixhqsupR: '0',
      sfixpacoutR: '0',
      sfixhpwrR: '0',
      sfixrepairR: '0',
      sfixTotalR: '0',
      vardlR: '0',
      varmpaR: '0',
      varmaterialR: '0',
      varotherR: '0',
      vartaxR: '0',
      vartravelR: '0',
      vardriveR: '0',
      varTotalR: '0'
    }; // 報表 弹出框中間 相關表格

  popRightDataSet: {
    StageID: number,
    output: number,
    moh: number,
    fixdepre: number,
    fixamort: number,
    fixrent: number,
    sfixidl: number,
    sfixsitealloc: number,
    sfixhqsup: number,
    sfixpacout: number,
    sfixhpwr: number,
    sfixrepair: number,
    vardl: number,
    varmpa: number,
    varmaterial: number,
    varother: number,
    vartax: number,
    vartravel: number,
    vardrive: number
  } = {
      StageID: 0,
      output: 0,
      moh: 0,
      fixdepre: 0,
      fixamort: 0,
      fixrent: 0,
      sfixidl: 0,
      sfixsitealloc: 0,
      sfixhqsup: 0,
      sfixpacout: 0,
      sfixhpwr: 0,
      sfixrepair: 0,
      vardl: 0,
      varmpa: 0,
      varmaterial: 0,
      varother: 0,
      vartax: 0,
      vartravel: 0,
      vardrive: 0
    }; // 報表右邊的表格

  // 動態獲取 動作 表格相關 -- 暫時調用
  stageID = []; // 通過查詢之後 獲取到的 StageID值
  @ViewChild('DFCReportMoh') dfcReportMoh: ElementRef;
  nzWidthConfig = ['90px', '90px', '100px', '100px', '100px', '100px', '180px', '180px', '180px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'
  ];
  nzScroll: {} = {
    x: this.nzWidthConfig.reduce((p, t) => {
      return p + parseInt(t, 10);
    }, 0) + 'px'
  };

  nzScrollx = this.nzWidthConfig.reduce((p, t) => {
    return p + parseInt(t, 10);
  }, 0);

  nzTableDefault: {
    nzWidthConfig: string[],
    nzScrollx: number
  } = {
      nzWidthConfig: ['90px', '90px', '100px', '100px', '100px', '100px', '180px', '180px', '180px', '100px', '100px', '100px', '100px', '100px',
        '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'
      ],
      nzScrollx: this.nzWidthConfig.reduce((p, t) => {
        return p + parseInt(t, 10);
      }, 0)
    };
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  queryBUSelect: {
    style: ClsDfcQueryStyle,
    value: string,
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: {
          width: '100%'
        },
        red: false,
        label: 'BU',
        selectType: 'search'
      },
      value: '',
      select: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };
  queryCustomSelect: {
    style: ClsDfcQueryStyle,
    value: string,
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: {
          width: '100%'
        },
        red: false,
        label: '客戶',
        selectType: 'search'
      },
      value: '',
      select: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };
  DFiLeaderFlag = false;

  groupModel = {
    groupModelAndModelValue: [],
    groupModelAndModelSelectOption: [],
    isGroupModelNameListLoading: false,
    searchChange$: new BehaviorSubject('')
  };
  cacheProNameSearchList = [];
  cacheModelNameSearchList = [];
  trans = {};
  constructor(
    private projectCodeProfileServer: ProjectCodeProfileApi,
    private projectNameProfileServer: ProjectNameProfileApi,
    private message: NzMessageService,
    private mohServer: MOHApi,
    private mohAdditionServer: MOHAdditionApi,
    private mohConditionServer: MOHConditionApi,
    private modelMohService: ModelMohService,
    private route: ActivatedRoute,
    private dfcCommonService: DfcCommonService,
    private downExcelService: DownexcelService,
    private groupModelService: GroupModelApi,
    private basicModelService: BasicModelApi,
    private dfcSelectService: DfcSelectNewService,
    private vProjectSummaryApi: V_ProjectSummaryApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['report.dfc-kpi-download']).subscribe(res => {
      this.trans['download'] = res['report.dfc-kpi-download'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['report.dfc-kpi-download']).subscribe(res => {
        this.trans['download'] = res['report.dfc-kpi-download'];
      });
    });
    this.initPlantSelect(); // 初始化 廠別 下拉框
    this.initBUSelect();
    this.initCustomSelect();
    this.initModelTypeSelect(); // 初始化产品下拉框
    this.initNameSelect();
    this.DFILeader();
    this.nzScroll = {
      x: this.nzScrollx + 'px',
      y: (this.dfcReportMoh.nativeElement.offsetHeight - 185) + 'px'
    };
    this.route.params.subscribe(route => {
      if (route.projectNameId || route.modelId) {
        this.boardQuery(route.plant, route.projectNameId, route.modelId, route.type, route.stage);
      } else {
        return;
      }
      this.plantSelectValue = route.plant;
      this.changePlant();
      if (!!route.standard) {
        if (route.standard === 'Down') {
          this.standardSelectValue = '未達標';
        } else {
          this.standardSelectValue = '達標';
        }
      }
    });
    this.route.queryParams.subscribe(route => {
      if (!route.modelGroupType ||
        !route.stage ||
        !route.modelID ||
        !route.plant ||
        !route.modelType) {
        return;
      }
      this.plantSelectValue = route.plant;
      this.modelTypeSelectValue = route.modelType;
      this.cFlowSelectValue = route.stage;
      this.groupModel.groupModelAndModelSelectOption.push({
        modelId: route.modelID,
        type: parseInt(route.modelGroupType, 10),
        modelName: route.modelName
      });
      this.groupModel.groupModelAndModelValue.push(route.modelID);
      this.query();
    });
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.dfcCommonService.DFILeader().subscribe(data => {
      this.DFiLeaderFlag = data['DFILeader'] || data['IsPlantLevel'];
    });
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.listOfPlantSelectOption = []; // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => {
      this.listOfPlantSelectOption = data;
      this.getStagePlant();
    });
    // 对厂别自动带入本厂的标签
    this.plantSelectValue = localStorage.getItem('DFC_Plant');
    this.changePlant();
  }

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.modelMohService.getBU(this.plantSelectValue, bu).then(datas => {
        return datas;
      });
    };
    const buList$: Observable<string[]> = this.queryBUSelect.select.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getBUList));
    buList$.subscribe(datas => {
      this.queryBUSelect.select.selectList = datas.filter(data => {
        return !(!data);
      });
      this.queryBUSelect.select.isLoading = false;
    });
  }

  buSearch() {
    this.modelNameSelectValue = [];
    this.modelFamilySelectValue = [];
    this.dfcCommonService.filterProjectName(
      [this.queryBUSelect.value],
      [this.queryCustomSelect.value],
      [this.modelTypeSelectValue],
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
  }

  // BU
  onBuSearch(value: string): void {
    this.queryBUSelect.select.isLoading = true;
    this.queryBUSelect.select.searchChange$.next(value);
  }

  // 初始化 客戶
  initCustomSelect() {
    const getCustomList = (custom: string) => {
      return this.modelMohService.getCustom(this.plantSelectValue, this.queryBUSelect.value, custom).then(datas => {
        return datas;
      });
    };
    const getCustomList$: Observable<string[]> = this.queryCustomSelect.select.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));
    getCustomList$.subscribe(datas => {
      this.queryCustomSelect.select.selectList = datas.filter(data => {
        return !(!data);
      });
      this.queryCustomSelect.select.isLoading = false;
    });
  }

  customSearch() {
    this.modelNameSelectValue = [];
    this.modelFamilySelectValue = [];
    this.dfcCommonService.filterProjectName(
      [this.queryBUSelect.value],
      [this.queryCustomSelect.value],
      [this.modelTypeSelectValue],
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
  }

  // 客戶
  onCustomSearch(value: string): void {
    this.queryCustomSelect.select.isLoading = true;
    this.queryCustomSelect.select.searchChange$.next(value);
  }

  initModelTypeSelect() {
    this.listOfModelTypeSelectOption = []; // 清空选择框中的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.listOfModelTypeSelectOption = datas;
    });
  }

  // 廠別下拉框選中改變后, 查詢出 產品
  changePlant() {
    this.queryBUSelect.value = null;
    this.modelTypeSelectFlag = false;
    this.cFlowSelectFlag = true;
    this.modelFamilySelectFlag = true;
    this.modelNameSelectFlag = true;
    this.modelTypeSelectValue = null;
    this.cFlowSelectValue = null;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.onBuSearch('');
    this.getStagePlant();
    this.onCustomSearch('');
    this.searchProjectNameList(this.plantSelectValue).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            [this.queryBUSelect.value],
            [this.queryCustomSelect.value],
            [this.modelTypeSelectValue],
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData) => {
          this.listOfModelNameSelectOption = resData;
          this.cacheProNameSearchList = [...resData];

        }
      )).subscribe();
  }

  // 產品
  onModelTypeSearch(value: string): void {
    this.isModelTypeListLoading = true;
    this.modelTypeSearchChange$.next(value);
  }

  // 產品 下拉框選中改變后, 顯示C流程下拉框    查詢出 ModelFamily
  changeModelType() {
    this.cFlowSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.modelNameSelectFlag = true;
    this.cFlowSelectValue = null;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.dfcCommonService.filterProjectName(
      [this.queryBUSelect.value],
      [this.queryCustomSelect.value],
      [this.modelTypeSelectValue],
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
  }

  // C流程 下拉框選中改變后, 查詢出 ModelFamily
  changeCFlow() {
    this.modelFamilySelectFlag = false;
    this.modelNameSelectFlag = false;
    const getModelFamilyList = (modelFamily: string) => {
      const query = {
        'include': {
          'relation': 'BU',
          'scop': {
            'fields': [
              'BU',
              'ProfitCenter'
            ]
          }
        },
        'where': {
          'and': [{
            'ProjectCode': {
              'like': '%' + modelFamily + '%'
            }
          },
          {
            'Plant': this.plantSelectValue
          },
          {
            'ModelType': this.modelTypeSelectValue
          }
          ]
        },
        'limit': 50
      };
      return this.projectCodeProfileServer.find(query).pipe(map((res: any) => res)).pipe(map((list: any) => {
        return list.map(item => {
          if (!!this.queryBUSelect.value) {
            if (!!item['BU'] && this.queryBUSelect.value.includes(item['BU']['BU'])) {
              return {
                ProjectCodeID: item.ProjectCodeID,
                ProjectCode: item.ProjectCode
              };
            }
          } else {
            return {
              ProjectCodeID: item.ProjectCodeID,
              ProjectCode: item.ProjectCode
            };
          }
        });
      }));
    };
    const optionModelFamilyList$: Observable<string[]> = this.modelFamilySearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelFamilyList));
    optionModelFamilyList$.subscribe(data => {
      this.listOfModelFamilySelectOption = data;
      this.isModelFamilyListLoading = false;
    });
  }

  // 初始化 ProName, ModelName 下拉框
  initNameSelect() {
    // ProName
    const getProNameList = (proName: string) => {
      if (!!this.plantSelectValue) {
        return of(proName);
      }
    };
    const getProNameList$: Observable<string> = this.modelNameSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProNameList));
    getProNameList$.subscribe(datas => {
      this.listOfModelNameSelectOption = this.cacheProNameSearchList.filter(d => d.Label.includes(datas));
      this.isModelNameListLoading = false;
    });
    // ModelName
    const getModelNameList = (model: string) => {
      return of(model);
    };
    const getModelNameList$: Observable<string> = this.groupModel.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelNameList));
    getModelNameList$.subscribe(datas => {
      this.groupModel.groupModelAndModelSelectOption = this.cacheModelNameSearchList.filter(d => d.Label.includes(datas));
      this.groupModel.isGroupModelNameListLoading = false;
    });
  }

  // Model Name
  onModelNameSearch(value: string): void {
    this.isModelNameListLoading = true;
    this.modelNameSearchChange$.next(value);
  }

  changeModelName(value) {
    this.listOfModelNameSelectOption = [...this.cacheProNameSearchList];
    if (value.length === 0) {
      this.cFlowSelectFlag = false;
      this.modelFamilySelectValue = [];
      this.modelNameSelectValue = [];
      this.groupModel.groupModelAndModelValue = [];
      return;
    }
    const projectCodeList = this.tempProjectNameList.filter(
      (item) => {
        const hasItem = value.find(
          (modelName) => {
            return modelName === Number(item.ProjectNameID);
          }
        );
        if (hasItem) {
          return item;
        }
      });
    const groupProjectCode = projectCodeList.map(item => item.ProjectCodeID).reduce((p, t) => {
      if (!p.includes(t)) {
        return [...p, t];
      }
      return p;
    }, []);
    this.dfcCommonService.getProjectCodeProfile(groupProjectCode).pipe(
      map(
        (projectCodeData: any) => {
          this.modelFamilySelectValue = projectCodeData;
          return of(null);
        }
      ),
      switchMap(
        () => {
          return this.dfcCommonService.getMappingModelName(value);
        }
      ),
      map(
        (modelNameSelect) => {
          console.log(modelNameSelect);
          this.groupModel.groupModelAndModelSelectOption = modelNameSelect;
          this.cacheModelNameSearchList = [...modelNameSelect];
          const modelReduce = this.groupModel.groupModelAndModelSelectOption.reduce((p, t) => {
            if (!p['projectNameModel'][t['projectNameId']]) {
              p['projectNameModel'][t['projectNameId']] = t['modelId'];
            }
            if (!p['res'][t['modelId']]) {
              p['res'][t['modelId']] = t;
            }
            p['modelID'].push(t['modelId']);
            return p;
          }, {
            'projectNameModel': {},
            'res': {},
            'modelID': []
          });
          this.groupModel.groupModelAndModelValue = this.groupModel.groupModelAndModelValue.filter(d => modelReduce['modelID'].includes(d));
          this.groupModel.groupModelAndModelValue.forEach(d => {
            delete modelReduce['projectNameModel'][modelReduce['res'][d]['projectNameId']];
          });
          for (const proName in modelReduce['projectNameModel']) {
            if (modelReduce['projectNameModel'].hasOwnProperty(proName)) {
              const modelId = modelReduce['projectNameModel'][proName];
              this.groupModel.groupModelAndModelValue.push(modelId);
            }
          }
        }
      )
    ).subscribe();
  }

  onGroupModelSearch(value) {
    this.groupModel.isGroupModelNameListLoading = true;
    this.groupModel.searchChange$.next(value);
  }

  changeroupModel(value) {
    this.groupModel.groupModelAndModelSelectOption = [...this.cacheModelNameSearchList];
  }

  getStagePlant() {
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    const addStage = ['C0', 'C1'];
    if (stageShowFlag) {
      if (this.listOfCFlowSelectOption.length < 8) {
        this.listOfCFlowSelectOption.splice(1, 0, ...addStage);
      }
    } else {
      if (this.listOfCFlowSelectOption.length === 8) {
        this.listOfCFlowSelectOption.splice(1, 2);
      }
    }
  }

  _query(modelInfoArray: Array<any>) {
    return from(modelInfoArray).pipe(
      mergeMap(x => {
        if (x.type === 1) { // basic model
          return forkJoin(
            this.basicModelService.GetMOHReport(x.modelId, x.stage),
            this.basicModelService.findById(x.modelId, { 'include': { 'projectNameProfile': { 'projectCodeProfile': 'BU' } } })
          );
        } else {
          return forkJoin(
            this.groupModelService.GetMOHReport(x.modelId, x.stage),
            this.groupModelService.findById(x.modelId, { 'include': { 'projectNameProfile': { 'projectCodeProfile': 'BU' } } })
          );
        }
      }), map(
        x => {
          if (!!x[0].result.msg && (typeof x[0].result.msg === 'string')) {
            return {
              ModelFamily: x[0].result['projectCode'],
              ModelName: x[0].result['projectName'],
              Plant: x[0].result['plant'],
              BU: x[1]['projectNameProfile']['projectCodeProfile']['ProfitCenter'] ? x[1]['projectNameProfile']['projectCodeProfile']['BU']['BU'] : ' ',
              Custom: x[1]['projectNameProfile']['projectCodeProfile']['Customer'],
              ModelType: x[0].result['modelType'],
              mName: x[0].result['modelName'] || x[0].result['groupModelName'],
              CFlow: x[0].result.stage,
              errorFlag: true,
              errorMsg: x[0].result.msg
            };
          } else if (!!x[0].result.msg && (typeof x[0].result.msg !== 'string')) {
            return {
              ModelFamily: x[0].result['projectCode'],
              ModelName: x[0].result['projectName'],
              mName: x[0].result['modelName'] || x[0].result['groupModelName'],
              errorFlag: true,
              errorMsg: x[0].result.msg.msg
            };
          }
          const mohData = x[0].result;
          if (JSON.stringify(mohData) !== '{}') {
            let mohActualColor;
            if (mohData['mohActual'] === 0 || mohData['mohTarget'] === 0) {
              mohActualColor = 'red';
            } else {
              mohActualColor = (Math.abs((parseFloat(mohData['mohActual']) - parseFloat(mohData['mohTarget'])) / parseFloat(mohData['mohTarget'])) < 0.05) ? 'rgba(80, 80, 80, 1)' : 'red';
            }
            const data = {
              id: mohData.id,
              type: mohData.type,
              StageID: mohData['stageID'],
              Plant: mohData['Plant'],
              BU: x[1]['projectNameProfile']['projectCodeProfile']['BU']['BU'],
              Custom: x[1]['projectNameProfile']['projectCodeProfile']['Customer'],
              ModelType: mohData['ModelType'],
              ModelFamily: mohData['ProjectCode'],
              ModelName: mohData['ProjectName'],
              mName: mohData.modelName || mohData.groupModelName,
              CFlow: mohData.stageInfo.Stage,
              AMOffer: x[1]['quoat'],
              mohTarget: parseFloat(mohData['mohTarget']).toFixed(2),
              mohActual: parseFloat(mohData['mohActual']).toFixed(2),
              mohActualColor: { 'color': mohActualColor },
              LCMOnlineMan: (!mohData['LCMOnlineMan']) ? '-' : Math.ceil(mohData['LCMOnlineMan']),
              PCBAOnlineMan: Math.ceil(mohData['PCBAOnlineMan']),
              FAOnlineMan: Math.ceil(mohData['FAOnlineMan']),
              LCMUPH: (!mohData['LCMUPH']) ? '-' : Math.round(mohData['LCMUPH']),
              PCBAUPH: Math.round(mohData['PCBAUPH']),
              FAUPH: Math.round(mohData['FAUPH']),
              LCMUPPH: (!mohData['LCMUPPH']) ? '-' : parseFloat(mohData['LCMUPPH']).toFixed(2),
              PCBAUPPH: parseFloat(mohData['PCBAUPPH']).toFixed(2),
              FAUPPH: parseFloat(mohData['FAUPPH']).toFixed(2),
              errorFlag: false
            };
            return data;
          }
        }));
  }

  UpdateProcessTable() {
    if (this.querying1) {
      this.querying1.unsubscribe();
    }
    this.querying1 = this.dfcCommonService.getProcess(this.plantSelectValue, this.modelTypeSelectValue).pipe(
      map(
        (process: any) => {
          this.tableColspan = 3;
          this.processShow.LCM.show = true;
          this.processShow.PCBA.show = true;
          this.processShow.FA.show = true;
          if (process.length > 0) {
            const lcmShow = process[0].processCode.split(',').filter(it => this.processShow.LCM.condition.includes(it)).length > 0;
            if (!lcmShow) {
              this.processShow.LCM.show = false;
              this.tableColspan--;
              this.nzWidthConfig.splice((this.nzWidthConfig.length - 4), 3);
              this.nzScrollx -= 300;
            }
            const pcbaShow = process[0].processCode.split(',').filter(it => this.processShow.PCBA.condition.includes(it)).length > 0;
            if (!pcbaShow) {
              this.processShow.PCBA.show = false;
              this.tableColspan--;
              this.nzWidthConfig.splice((this.nzWidthConfig.length - 4), 3);
              this.nzScrollx -= 300;
            }
            const faShow = process[0].processCode.split(',').filter(it => this.processShow.FA.condition.includes(it)).length > 0;
            if (!faShow) {
              this.processShow.FA.show = false;
              this.tableColspan--;
              this.nzWidthConfig.splice((this.nzWidthConfig.length - 4), 3);
              this.nzScrollx -= 300;
            }
            this.nzScroll['x'] = this.nzScrollx + 'px';
          }
        }
      )).subscribe();
  }

  InitialTable() {
    this.stageID = []; // 清空 stageID數組
    this.dataSet = []; // 清空 表格數組
    this.nzWidthConfig = Array.from(this.nzTableDefault.nzWidthConfig);
    this.nzScroll['x'] = this.nzTableDefault.nzScrollx + 'px';
    this.nzScrollx = this.nzTableDefault.nzScrollx;
  }

  // 查詢表格數據
  async query() {
    if (!this.cFlowSelectValue) {
      this.message.create('error', 'Please select the C process！');
      return;
    }
    if (this.querying2) {
      this.querying2.unsubscribe();
    }
    this.InitialTable();
    this.UpdateProcessTable();
    this.queryModel().then(groupModels => {
      groupModels.forEach(model => {
        model.stage = this.cFlowSelectValue;
      });
      this._query(groupModels).pipe(
        map(x => {
          if (x) {
            this.dataSet = [...this.dataSet, x];
          }
        })
      ).subscribe();
    });
  }

  // 查詢 Model信息
  async queryModel() {
    if (!this.modelTypeSelectValue) {
      return [];
    }
    if (this.groupModel.groupModelAndModelValue.length > 0) {
      const modelSelect = this.groupModel.groupModelAndModelValue.map(d => {
        const model = this.groupModel.groupModelAndModelSelectOption.find(g => g.modelId === d);
        return {
          modelId: model.modelId,
          type: model.type
        };
      });
      return modelSelect;
    } else if (this.modelNameSelectValue.length > 0) {
      return await this.dfcCommonService.getMappingModelName(this.modelNameSelectValue).toPromise();
    } else {
      const query: any = {
        'where': {
          'and': [{
            'Plant': this.plantSelectValue
          },
          {
            'ModelType': this.modelTypeSelectValue
          },
          {
            'CurrentStage': {
              'neq': 'EX'
            }
          }
          ]
        },
        'fields': ['ProjectNameID']
      };
      if (!!this.queryBUSelect.value) {
        query.where.and.push({
          'BU': this.queryBUSelect.value
        });
      }
      const summaryDatas = await this.vProjectSummaryApi.find(query).toPromise();
      const proNameList = summaryDatas.reduce((p, t) => {
        if (!p['list'].includes(t['ProjectNameID'])) {
          p['list'].push(t['ProjectNameID']);
        }
        return p;
      }, {
        'list': []
      });
      const result = await this.dfcCommonService.getMappingModelName(proNameList['list']).toPromise();
      result.forEach(x => {
        x.stage = this.cFlowSelectValue;
      });
      return result;
    }
  }

  // 获取查询时需要的modelID
  async getModelIDs() {
    if (this.modelNameSelectValue.length === 0) {
      if (this.modelFamilySelectValue.length === 0) {
        const datas = await this.projectCodeProfileServer.find({
          'include': ['projectNames', {
            'relation': 'BU',
            'scop': {
              'fields': [
                'BU',
                'ProfitCenter'
              ]
            }
          }],
          'where': {
            'and': [{
              'Plant': this.plantSelectValue
            },
            {
              'ModelType': this.modelTypeSelectValue
            }
            ]
          }
        }).toPromise();
        const modelIDs = datas.reduce((p, t) => {
          if (!p['modelIds']) {
            p['modelIds'] = [];
          }
          if (!!this.queryBUSelect.value) {
            if (!!t['BU'] && this.queryBUSelect.value.includes(t['BU']['BU'])) {
              t['projectNames'].forEach(proName => {
                p['modelIds'].push(proName['ProjectNameID']);
              });
            }
          } else {
            t['projectNames'].forEach(proName => {
              p['modelIds'].push(proName['ProjectNameID']);
            });
          }
          return p;
        }, {});
        return (!modelIDs) ? [] : modelIDs['modelIds'];
      } else {
        const datas = await this.projectNameProfileServer.find({
          'fields': ['ProjectNameID'],
          'where': {
            'ProjectCodeID': {
              'inq': this.modelFamilySelectValue
            }
          }
        }).toPromise();
        const modelIDs = datas.reduce((p, t) => {
          if (!p['modelIds']) {
            p['modelIds'] = [];
          }
          p['modelIds'].push(t['ProjectNameID']);
          return p;
        }, {});
        return (!modelIDs) ? [] : modelIDs['modelIds'];
      }
    } else {
      return this.modelNameSelectValue;
    }
  }

  // board进来的查询资料
  async boardQuery(plant, projectNameId, modelId?, type?, stage?) {
    this.plantSelectValue = plant;
    this.InitialTable();
    this.UpdateProcessTable();
    let models;
    if (projectNameId) {
      const projectNameInfo = (await this.dfcCommonService.getProjectName([plant], null, projectNameId.split(',')).toPromise()).filter(x => x['CurrentStage'] === x['Stage']);
      models = (await this.dfcCommonService.getMappingModelName(projectNameInfo.map(x => x['ProjectNameID'])).toPromise()).map(x => {
        return {
          modelId: x.modelId,
          type: x.type,
          stage: projectNameInfo.find(y => y['ProjectNameID'] == x.projectNameId)['Stage']
        }
      });
    } else {
      models = [{ modelId: modelId, type: type, stage: stage }];
    }
    this._query(models).pipe(
      map(x => {
        if (x) {
          this.dataSet = [...this.dataSet, x];
        }
      })
    ).subscribe();
  }

  onClickCFlow(stageID, cFlow, modelID) {
    if (cFlow === 'RFQ') {
      window.open('/dashboard/dfc/target-report/' + stageID + '/A');
    } else {
      window.open('/dashboard/dfc/workhour-report/' + stageID + '/A');
    }
  }

  // 下載資料
  download() {
    if (!this.stageID) {
      this.message.create('error', this.trans['download']);
      return;
    }
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportNestedTableAsExcelFile(table, 'workHour');
      this.tablePaging = true;
    }, 300);
  }

  // 點擊報表事件 -- 彈出框
  clickActural(stageId, plant, data) {
    // 获取左边表格中的数据
    this.mohConditionServer.findOne({
      'where': {
        'StageID': stageId
      }
    }).subscribe(Data => {
      this.popLeftDataSet = [];
      for (const key in DfcMOHParamMapping) {
        if (DfcMOHParamMapping.hasOwnProperty(key)) {
          const paramData = DfcMOHParamMapping[key];
          if (this.booleanField.includes(key)) {
            const indexOf = !!Data[key] ? 1 : 0;
            this.popLeftDataSet.push({
              Param: paramData['Msg'] + (!!Data[key] ? '人力' : 'CT'),
              Value: Data[paramData['Select'][indexOf]]
            });
          } else if (this.modelFieldNotPercented.includes(key)) {
            this.popLeftDataSet.push({
              Param: paramData,
              Value: Data[key]
            });
          } else {
            this.popLeftDataSet.push({
              Param: paramData,
              Value: Data[key] * 100
            });
          }
        }
      }
    });
    // 获取中間表格中的数据
    this.mohServer.GetMOH(stageId).subscribe(Data => {
      const fixTotal = Data['data']['fixdepre'] + Data['data']['fixamort'] + Data['data']['fixrent'];
      const sfixTotal = Data['data']['sfixidl'] + Data['data']['sfixsitealloc'] + Data['data']['sfixhqsup'] +
        Data['data']['sfixpacout'] + Data['data']['sfixhpwr'] + Data['data']['sfixrepair'];
      const varTotal = Data['data']['vardl'] + Data['data']['varmpa'] + Data['data']['varmaterial'] +
        Data['data']['varother'] + Data['data']['vartax'] + Data['data']['vartravel'] +
        Data['data']['vardrive'];
      this.popCenterDataSet = {
        StageID: Data['data']['StageID'],
        output: Data['data']['output'].toFixed(2),
        moh: Data['data']['moh'].toFixed(2),
        fixdepre: Data['data']['fixdepre'].toFixed(2),
        fixdepreR: (Data['data']['fixdepre'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        fixamort: Data['data']['fixamort'].toFixed(2),
        fixamortR: (Data['data']['fixamort'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        fixrent: Data['data']['fixrent'].toFixed(2),
        fixrentR: (Data['data']['fixrent'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        fixTotal: fixTotal.toFixed(2),
        fixTotalR: (fixTotal / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixidl: Data['data']['sfixidl'].toFixed(2),
        sfixidlR: (Data['data']['sfixidl'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixsitealloc: Data['data']['sfixsitealloc'].toFixed(2),
        sfixsiteallocR: (Data['data']['sfixsitealloc'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixhqsup: Data['data']['sfixhqsup'].toFixed(2),
        sfixhqsupR: (Data['data']['sfixhqsup'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixpacout: Data['data']['sfixpacout'].toFixed(2),
        sfixpacoutR: (Data['data']['sfixpacout'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixhpwr: Data['data']['sfixhpwr'].toFixed(2),
        sfixhpwrR: (Data['data']['sfixhpwr'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixrepair: Data['data']['sfixrepair'].toFixed(2),
        sfixrepairR: (Data['data']['sfixrepair'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        sfixTotal: sfixTotal.toFixed(2),
        sfixTotalR: (sfixTotal / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        vardl: Data['data']['vardl'].toFixed(2),
        vardlR: (Data['data']['vardl'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        varmpa: Data['data']['varmpa'].toFixed(2),
        varmpaR: (Data['data']['varmpa'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        varmaterial: Data['data']['varmaterial'].toFixed(2),
        varmaterialR: (Data['data']['varmaterial'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        varother: Data['data']['varother'].toFixed(2),
        varotherR: (Data['data']['varother'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        vartax: Data['data']['vartax'].toFixed(2),
        vartaxR: (Data['data']['vartax'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        vartravel: Data['data']['vartravel'].toFixed(2),
        vartravelR: (Data['data']['vartravel'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        vardrive: Data['data']['vardrive'].toFixed(2),
        vardriveR: (Data['data']['vardrive'] / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2),
        varTotal: varTotal.toFixed(2),
        varTotalR: (varTotal / (Data['data']['output']) / Data['data']['ExRateNTD']).toFixed(2)
      };
      this.isReportPopVisible = true;
    }, error => {
      this.message.create('error', error['message']);
    });
    // 獲取右邊表格數據
    this.mohAdditionServer.find({
      'where': {
        'StageID': stageId
      }
    }).subscribe(mohAdditionData => {
      if (mohAdditionData.length > 0) {
        this.getPopRightDataSet(mohAdditionData[0], mohAdditionData[0]['StageID'], mohAdditionData[0]['Output'], mohAdditionData[0]['MOH']);
      }
    });
  }

  getPopRightDataSet(data, stageID, output, moh) {
    this.popRightDataSet = {
      StageID: stageID,
      output: output,
      moh: moh,
      fixdepre: data['FixDepre'],
      fixamort: data['FixAmort'],
      fixrent: data['FixRent'],
      sfixidl: data['SFixIdl'],
      sfixsitealloc: data['SFixSiteAlloc'],
      sfixhqsup: data['SFixHQSup'],
      sfixpacout: data['SFixPaCOut'],
      sfixhpwr: data['SFixHpwr'],
      sfixrepair: data['SFixRepair'],
      vardl: data['VarDL'],
      varmpa: data['VarMpa'],
      varmaterial: data['VarMaterial'],
      varother: data['VarOther'],
      vartax: data['VarTax'],
      vartravel: data['VarTravel'],
      vardrive: data['VarDrive']
    };
  }

  // 關閉 彈出框
  cancelPop() {
    this.isReportPopVisible = false;
  }

  // 撈全部的projectName
  searchProjectNameList(plant) {
    return this.dfcCommonService.getProjectName([plant]).pipe(
      map(
        (res) => {
          this.tempProjectNameList = res;
        }
      )
    );
  }

  nzExpandChange(event, data) {
    if (event) {
      data.modelData = [];
      this.modelTableLoading = true;
      this.searchModel(data);
    } else {
      delete data.modelData;
    }
  }

  searchModel(data) {
    let countData;
    this.groupModelService.getGroupModelMappings(data.id).pipe(
      switchMap((x: any) => {
        countData = x;
        const query = [];
        x.forEach(y => {
          query.push(this._query([{
            modelId: y.modelId,
            type: 1,
            stage: this.cFlowSelectValue
          }]).toPromise());
        });
        return forkJoin(query);
      })).pipe(
        map(y => {
          y = y.filter(r => !!r);
          y.forEach((modelData: any) => {
            modelData.Count = countData.find(z => z.modelId == modelData.id).count;
          });
          data.modelData = y;
          this.modelTableLoading = false;
        })
      ).subscribe();
  }
}
