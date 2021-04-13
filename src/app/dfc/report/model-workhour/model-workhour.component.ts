
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  ProjectNameProfileApi,
  StageApi,
  TargetOperationsApi,
  ProcessApi,
  V_StanderOperationApi,
  GroupModelApi,
  BasicModelApi,
  StageInterface,
  V_ProjectSummaryApi
} from '@service/dfc_sdk/sdk';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  forkJoin,
  of
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap
} from 'rxjs/operators';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  DFCWorkhourMaintainTabelData
} from 'app/dfc/model-forecast/workhour-maintain/workhour-maintain.component';
import {
  ClsDfcQueryStyle,
  ClsDfcQuerySelect
} from 'app/shared/dfc-common';
import {
  ModelWorkhourService
} from './model-workhour.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  DfcCommonService
} from 'app/shared/dfc-common/service/dfc-common.service';
import {
  DownexcelService
} from '@service/downexcel.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
@Component({
  selector: 'app-model-workhour',
  templateUrl: './model-workhour.component.html',
  styleUrls: ['./model-workhour.component.scss']
})
export class ModelWorkhourComponent implements OnInit {

  PROCESS_VALUE_START_COL = 10;
  tablePaging = true;
  process = ['A', 'D', 'DP', 'DT', 'LA', 'LP', 'LT', 'P', 'T']; // 製程的簡寫和名字是按順序一一對應的，一旦數據庫中的process變了，必須更新process數組
  processHeaders = []; // process的表頭
  tempProcessHeaders = []; // 暫存process的表頭
  querying: Subscription;
  queryingLoading = false;
  dataSet: any[] = []; // 表格数据暂存
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
  // cFlowSelectValues: string;
  listOfCFlowSelectOption = ['RFQ', 'C2', 'C3', 'C4', 'C5', 'C6']; // 下拉框内容
  cFlowSelectFlag = true; // 下拉框 是否可用
  // 達標狀況
  standardSelectValue: string;
  listOfStandardSelectOption = ['達標', '未達標'];
  // ModelFamily相關
  modelFamilySelectValue = [];
  listOfModelFamilySelectOption = []; // 下拉框内容
  modelFamilySearchChange$ = new BehaviorSubject('');
  isModelFamilyListLoading = false;
  modelFamilySelectFlag = true; // 下拉框 是否可用
  // ModelName相關
  modelNameSelectValue = [];
  listOfModelNameSelectOption = []; // 下拉框内容
  modelNameSearchChange$ = new BehaviorSubject('');
  isModelNameListLoading = false;

  // 報表彈出框
  isReportPopVisible = false; // 默認不可以顯示
  @ViewChild('DFCReportWorkhour') dfcReportWorkhour: ElementRef;
  reportPopWidth: number;
  reportPopHeight: number;
  reportPopTitle: string; // 標題顯示
  popDataSet = []; // 報表相關表格
  // 動態獲取 動作 表格相關
  actionList = [];
  nzWidthConfigPop = ['100px', '120px', '120px', '80px', '100px'];
  nzScrollXPop = 520;
  nzScrollPop: {} = {
    x: this.nzScrollXPop + 'px',
    y: '128px'
  };
  nzWidthConfigRep = ['90px', '100px', '100px', '100px', '100px', '150px', '150px', '150px', '150px', '100px', '100px'];
  nzWidthConfigRepDefault = ['60px', '80px', '100px', '100px', '100px', '150px', '150px', '150px', '150px', '100px', '100px'];
  nzScrollRep = {
    x: this.nzWidthConfigRep.reduce((p, t) => {
      return p + parseInt(t, 10);
    }, 0).toString() + 'px',
    y: '0px'
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

  // 全部的projectName
  tempProjectNameList = [];
  groupModel = {
    groupModelAndModelValue: [],
    groupModelAndModelSelectOption: [],
    isGroupModelNameListLoading: false,
    searchChange$: new BehaviorSubject('')
  };
  cacheProNameSearchList = [];
  cacheModelNameSearchList = [];
  searchFactorDetail; // 搜索因素細項 使用

  constructor(
    private projectNameProfileServer: ProjectNameProfileApi,
    private message: NzMessageService,
    private stageServer: StageApi,
    private targetOperationServer: TargetOperationsApi,
    private v_StanderOperationApi: V_StanderOperationApi,
    private processApi: ProcessApi,
    private modelWorkhourService: ModelWorkhourService,
    private vProjectSummaryApi: V_ProjectSummaryApi,
    private route: ActivatedRoute,
    private dfcCommonService: DfcCommonService,
    private downExcelService: DownexcelService,
    private groupModelService: GroupModelApi,
    private basicModelService: BasicModelApi,
    private dfcSelectService: DfcSelectNewService
  ) { }

  async ngOnInit() {
    await this.initPlantSelect(); // 初始化 廠別 下拉框
    await this.initBUSelect();
    await this.initCustomSelect();
    await this.initModelTypeSelect(); // 初始化 产品下拉框
    await this.initNameSelect();
    // 获取当前页面宽度
    this.reportPopWidth = this.dfcReportWorkhour.nativeElement.offsetWidth;
    this.reportPopHeight = (this.dfcReportWorkhour.nativeElement.offsetHeight - 280);
    this.nzScrollPop = {
      x: this.nzScrollXPop + 'px',
      y: this.reportPopHeight + 'px'
    };
    this.processApi.find({}).subscribe(res => {
      this.tempProcessHeaders = res;
    });
    this.route.params.subscribe(param => {
      // 工時追蹤跳轉過來的
      if (param['Plant'] && param['Product'] && param['Stage'] && param['ProjectNameID']) {
        this.plantSelectValue = param['Plant'];
        this.changePlant();
        this.modelTypeSelectValue = param['Product'];
        this.changeModelType();
        this.cFlowSelectValue = param['Stage'];
        this.projectNameProfileServer.findById(param['ProjectNameID'], { include: { relation: 'projectCodeProfile' } }).subscribe(proName => {
          this.listOfModelNameSelectOption.push({ Value: proName['ProjectNameID'], Label: proName['ProjectName'] });
          this.modelNameSelectValue.push(proName['ProjectNameID']);
          this.modelFamilySelectValue.push(proName['projectCodeProfile']);
          this.changeModelName(this.modelNameSelectValue);
          this.query();
        });
      }
    });
    this.route.params.subscribe(route => {
      if (!!route.standard) {
        if (route.standard === 'Down') {
          this.standardSelectValue = '未達標';
        } else {
          this.standardSelectValue = '達標';
        }
      }
      if (!route.plant || !route.type || !route.id || !route.stage || !route.modelType) {
        return;
      }
      this.boardQuery(route.plant, route.modelType, route.id, route.type, route.stage);
      this.plantSelectValue = route.plant;
      this.modelTypeSelectValue = route.modelType;
    });
    this.route.queryParams.subscribe(route => {
      // 是从Dashboard跳转过来的资料
      if (route.dashboardFlag) {
        this.boardRoute(route.plant, route.projectCodeId, route.type);
        return;
      }
      if (!route.plant || !route.stage || !route.modelID) {
        return;
      }
      this.plantSelectValue = route.plant;
      this.modelTypeSelectValue = route.modelType;
      this.basicModelService.getStages(route.modelID, {
        'where': {
          'Stage': route.stage
        }
      }).subscribe(modelStage => {
        this.boardQuery(route.plant, route.modelType, route.modelID, 1, route.stage);
        this.changeAll();
        if (!!route.type) {
          if (route.type === 'Down') {
            this.standardSelectValue = '未達標';
          } else {
            this.standardSelectValue = '達標';
          }
        }
      });
    });
  }

  // 監控ngFor，優化效率
  tableTrackById(index: number, item: any): number {
    return index;
  }

  changeAll() {
    this.modelTypeSelectFlag = false;
    this.cFlowSelectFlag = false;
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

  // 廠別下拉框選中改變后, 查詢出 產品
  changePlant() {
    this.groupModel.groupModelAndModelValue = [];
    this.modelTypeSelectFlag = false;
    this.cFlowSelectFlag = true;
    this.modelTypeSelectValue = null;
    this.cFlowSelectValue = null;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.queryBUSelect.value = null;
    this.queryCustomSelect.value = null;
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

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.modelWorkhourService.getBU(this.plantSelectValue, bu).then(datas => {
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
    this.queryCustomSelect.value = null;
    this.onCustomSearch('');
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

  // 產品
  onBuSearch(value: string): void {
    this.queryBUSelect.select.isLoading = true;
    this.queryBUSelect.select.searchChange$.next(value);
  }

  // 初始化 客戶
  initCustomSelect() {
    const getCustomList = (custom: string) => {
      return this.modelWorkhourService.getCustom(this.plantSelectValue, this.queryBUSelect.value, custom).then(datas => {
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

  // 產品 下拉框選中改變后, 顯示C流程下拉框    查詢出 ModelFamily
  changeModelType() {
    this.groupModel.groupModelAndModelValue = [];
    this.cFlowSelectFlag = false;
    this.cFlowSelectValue = null;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
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
      console.log(111);
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
          }, { 'projectNameModel': {}, 'res': {}, 'modelID': [] });
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

  changeroupModel(event) {
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

  async query() {
    this.queryModel().then(groupModels => {
      this._query(groupModels).pipe(
        map(x => {
          console.log(x);
          this.dataSet = x;
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
        return { modelId: model.modelId, type: model.type };
      });
      return modelSelect;
    } else if (this.modelNameSelectValue.length > 0) {
      return await this.dfcCommonService.getMappingModelName(this.modelNameSelectValue).toPromise();
    } else {
      const query: any = {
        'where': {
          'and': [
            { 'Plant': this.plantSelectValue },
            { 'ModelType': this.modelTypeSelectValue },
            { 'CurrentStage': { 'neq': 'EX' } }
          ]
        },
        'fields': ['ProjectNameID']
      };
      if (!!this.queryBUSelect.value) {
        query.where.and.push({ 'BU': this.queryBUSelect.value });
      }
      const summaryDatas = await this.vProjectSummaryApi.find(query).toPromise();
      const proNameList = summaryDatas.reduce((p, t) => {
        if (!p['list'].includes(t['ProjectNameID'])) {
          p['list'].push(t['ProjectNameID']);
        }
        return p;
      }, { 'list': [] });
      return await this.dfcCommonService.getMappingModelName(proNameList['list']).toPromise();
    }
  }

  // 查詢表格數據
  _query(modelInfoArray, boardFlag?) {
    if (!this.modelTypeSelectValue && !boardFlag) {
      this.message.create('error', 'Please select the product！');
      return;
    }
    if (!this.cFlowSelectValue && !boardFlag) {
      this.message.create('error', 'Please select the C process！');
      return;
    }
    return this.dfcCommonService.getProcess(this.plantSelectValue, this.modelTypeSelectValue).pipe(
      switchMap((processArray) => {
        const modelPromises: Promise<any>[] = [];
        const queryRequests = modelInfoArray.map(
          x => {
            let promise: Promise<any>;
            let modelPromise: Promise<any>;
            if (x.type === 1) {  // basic model
              promise = this.basicModelService.GetOpTimeReport(x.modelId, boardFlag ? x.stage : this.cFlowSelectValue, true).toPromise().catch(err => console.log(err));
              modelPromise = this.basicModelService.findById(x.modelId, {
                'include': { 'projectNameProfile': { 'projectCodeProfile': 'BU' } }
              }).toPromise().catch(err => console.log(err));
            } else {
              promise = this.groupModelService.GetOpTimeReport(x.modelId, boardFlag ? x.stage : this.cFlowSelectValue).toPromise().catch(err => console.log(err));
              modelPromise = this.groupModelService.findById(x.modelId, {
                'include': { 'projectNameProfile': { 'projectCodeProfile': 'BU' } }
              }).toPromise().catch(err => console.log(err));
            }
            modelPromises.push(modelPromise);
            return promise;
          });
        return forkJoin(of(processArray), (queryRequests.length > 0 ? forkJoin(queryRequests) : of(queryRequests)), of(modelInfoArray), (modelPromises.length > 0 ? forkJoin(modelPromises) : of(modelPromises)));
      }),
      map(
        (res: any) => {
          const reportDatas = res[1];
          const dataSet: any[] = []; // 暫時保存結果
          const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === this.plantSelectValue);
          let i = -1;
          const prcessArray = res[0].length > 0 ? res[0][0].processCode.split(',') : this.process;
          this.processHeaders = [];
          prcessArray.forEach(processData => {
            this.tempProcessHeaders.forEach(data2 => {
              if (processData === data2['ProcessCode']) {
                this.processHeaders.push(data2);
              }
            });
          });
          const nzScrollRepY = (this.dfcReportWorkhour.nativeElement.offsetHeight - 240) + 'px';
          this.nzWidthConfigRep = [];
          this.nzWidthConfigRep = Object.assign(this.nzWidthConfigRep, this.nzWidthConfigRepDefault);
          for (let index = 0; index < (this.processHeaders.length + 1) * 2; index++) {
            this.nzWidthConfigRep.push('100px');
            this.nzScrollRep = {
              x: this.nzWidthConfigRep.reduce((p, t) => {
                return p + parseInt(t, 10);
              }, 0).toString() + 'px',
              y: nzScrollRepY
            };
          }
          const modelDatas = res[3];
          for (let index = 0; index < reportDatas.length; index++) {
            const data = reportDatas[index];
            const modelData = modelDatas[index];
            if (!!data && !!data.result) {
              i++;
              const item = data.result;
              const difficult = item.difficult ? item.difficult.toFixed(2) : '0';
              let boardStage;
              if (boardFlag) {
                boardStage = modelInfoArray.find(d => d.modelId === item.id)['stage'];
              }
              const rowDatas = [
                item.modelType,
                (!plantMap) ? this.plantSelectValue : plantMap['PlantName'],
                !modelData.projectNameProfile.projectCodeProfile.ProfitCenter ? ' ' : (!modelData.projectNameProfile.projectCodeProfile.BU ?
                  'ProfitCenter:' + modelData.projectNameProfile.projectCodeProfile.ProfitCenter + ', 無對應BU' : modelData.projectNameProfile.projectCodeProfile.BU.BU),
                !item.info.projectCodeProfile.Customer ? ' ' : item.info.projectCodeProfile.Customer,
                boardFlag ? (!item.info.projectCodeProfile.ModelType ? ' ' : item.info.projectCodeProfile.ModelType) : this.modelTypeSelectValue,
                item.info.ProjectCode,
                item.info.ProjectName,
                item.modelName,
                boardFlag ? boardStage : this.cFlowSelectValue,
                difficult,
              ];
              rowDatas['id'] = res[2][i].modelId;
              rowDatas['stageId'] = item.stageId;
              const operationTime = item.operationTime || {};
              for (const p of prcessArray) { // 製程可能沒有數據， process和數據庫的process對應
                const temp = {
                  Click: (operationTime[p] && operationTime[p].costTime !== null),
                  CostValue: !operationTime[p] ? (item.error === 'Unknown ProductType' ? { 'flag': false, msg: '请维护产品别' } :
                    (item.error === 'modelTypeProcessSetting missing' ? { 'flag': false, msg: '请告知IT 维护 该厂 此产品下的 制程对照表' } : { 'flag': false, msg: '' })) :
                    (operationTime[p].costTime === null ? { 'flag': false, msg: '未上傳機種工時' } : { flag: true, msg: operationTime[p].costTime }),
                  TargetValue: !operationTime[p] ? (item.error === 'Unknown ProductType' ? { 'flag': false, msg: '请维护产品别' } :
                    (item.error === 'modelTypeProcessSetting missing' ? { 'flag': false, msg: '请告知IT 维护 该厂 此产品下的 制程对照表' } : { 'flag': false, msg: '' })) :
                    (operationTime[p].targetCostTime === null ? { 'flag': false, msg: '未上傳機種工時' } : { flag: true, msg: operationTime[p].targetCostTime }),
                  Style: operationTime[p] ? (((parseFloat(operationTime[p].costTime) - parseFloat(operationTime[p].targetCostTime)) > 0) ? {
                    'color': 'red'
                  } : {
                      'color': 'rgba(80, 80, 80, 1)'
                    }) : {
                      'color': 'rgba(80, 80, 80, 1)'
                    }
                };
                rowDatas.push(temp);
              }
              // 計算所有的製程結果，result大於0，則表示實際大於目標，未達標
              const total: {} = {
                CostValue: {
                  flag: true,
                  msg: 0
                },
                TargetValue: {
                  flag: true,
                  msg: 0
                },
                Color: {
                  color: 'white'
                }
              };
              for (let j = this.PROCESS_VALUE_START_COL; j < rowDatas.length; j++) {
                total['CostValue']['msg'] += rowDatas[j].CostValue.flag ? parseFloat(rowDatas[j].CostValue.msg) : 0;
                total['TargetValue']['msg'] += rowDatas[j].TargetValue.flag ? parseFloat(rowDatas[j].TargetValue.msg) : 0;
              }
              const result = Math.abs((total['CostValue']['msg'] - total['TargetValue']['msg']) / total['TargetValue']['msg']);
              if (result <= 0.05) {
                total['Style'] = {
                  color: 'rgba(80, 80, 80, 1)'
                };
              } else {
                total['Style'] = {
                  color: 'red'
                };
              }
              rowDatas.push(total);
              rowDatas.push(item.stageId); // 添加stageID到最後一位
              // 達標與未達標篩選
              if (this.standardSelectValue === '未達標' && rowDatas[rowDatas.length - 2].Style.color === 'red') {
                dataSet.push(rowDatas);
              } else if (this.standardSelectValue === '達標' && rowDatas[rowDatas.length - 2].Style.color === 'rgba(80, 80, 80, 1)') {
                dataSet.push(rowDatas);
              } else if (!this.standardSelectValue) {
                dataSet.push(rowDatas);
              }
            }
          }
          return dataSet;

        }
      ));
  }

  /**
   * 路由跳轉補齊 未有 model的新機種
   *
   * @param {string[]} proCodeIDs
   * @returns {any[]}
   * @memberof ModelWorkhourComponent
   */
  boardDataCompletion(proCodeIDs: string[]): Observable<any[]> {
    return this.projectNameProfileServer.find({
      'where': {
        'ProjectCodeID': { 'inq': proCodeIDs }
      },
      'include': [{ 'projectCodeProfile': 'BU' }]
    }).pipe(map((proNameDatas: any[]) => {
      const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === this.plantSelectValue);
      const rowDatas = proNameDatas.map(p => {
        const rowData = [
          'basic',
          (!plantMap) ? this.plantSelectValue : plantMap['PlantName'],
          !p.projectCodeProfile.BU ? ' ' : p.projectCodeProfile.BU.BU,
          !p.projectCodeProfile.Customer ? ' ' : p.projectCodeProfile.Customer,
          !p.projectCodeProfile.ModelType ? ' ' : p.projectCodeProfile.ModelType,
          p.ProjectCode,
          p.ProjectName,
          {
            boardFlag: true,
            colSpan: this.processHeaders.length,
            proNameID: p.ProjectNameID,
            proCodeID: p.ProjectCodeID,
            Plant: p.projectCodeProfile.Plant
          }
        ];
        return rowData;
      });
      return rowDatas;
    }));
  }

  boardRoute(plant, proCodeIDs, type) {
    this.plantSelectValue = plant;
    this.modelFamilySelectValue = proCodeIDs.split(',');
    this.dataSet = [];
    this.standardSelectValue = '';
    this.vProjectSummaryApi.find({
      'fields': ['ModelId', 'CurrentStage', 'ModelType', 'ProjectCodeID'],
      'where': {
        'Plant': plant,
        'ProjectCodeID': {
          'inq': this.modelFamilySelectValue
        }
      }
    }).subscribe((summaryDatas: any) => {
      const res = summaryDatas.reduce((p, t) => {
        if (!p['temp'].includes(t['ModelId'])) {
          p['res'].push({ modelId: t['ModelId'], type: 1, stage: 'RFQ', modelType: t['ModelType'] });
          p['temp'].push(t['ModelId']);
        }
        if (!p['proCodeID'].includes(t['ProjectCodeID'])) {
          p['proCodeID'].push(t['ProjectCodeID']);
        }
        return p;
      }, { res: [], temp: [], proCodeID: [] });
      this._query(res['res'], true).pipe(
        map(x => {
          // 補齊 還未複製的 RFQ幾種  res['proCodeID']
          const proCodeID = this.modelFamilySelectValue.filter(d => !res['proCodeID'].includes(d));
          if (proCodeID.length > 0) {
            this.boardDataCompletion(proCodeID).subscribe(d => {
              this.dataSet = [...this.dataSet, ...d];
            });
          }
          this.dataSet = [...this.dataSet, ...x];
        })
      ).subscribe(
        y => {
          this.changeAll();
        }
      );
    });
  }

  boardQuery(plant, modelType, modelId, type, stage) {
    this.plantSelectValue = plant;
    this.modelTypeSelectValue = modelType;
    this.cFlowSelectValue = stage;
    this._query([{ modelId: modelId, type: type }]).pipe(
      map(x => {
        this.dataSet = x;
      })
    ).subscribe(
      y => {
        this.changeAll();
      }
    );
  }

  // 下載資料
  downloadDetail() {
    this.tablePaging = false;
    const table = document.getElementById('workHourDetailTable');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'workHourDetail');
      this.tablePaging = true;
    }, 300);
  }

  download() {
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'workHour');
      this.tablePaging = true;
    }, 300);
  }

  // 點擊報表事件 -- 彈出框
  async clickHours(process, processCode, stageId, isTarget) {
    this.isReportPopVisible = true;
    this.reportPopTitle = process;
    this.popDataSet = [];
    this.actionList = [];
    this.nzWidthConfigPop = ['100px', '120px', '120px', '80px', '100px'];
    this.nzScrollXPop = 520;
    const stages = await this.stageServer.findById(stageId, {
      include: {
        'basicModel': ['stages', { 'projectNameProfile': { 'projectCodeProfile': 'member' } }]
      }
    }).toPromise<StageInterface>();
    const rfqStageId = stages.basicModel.stages.find(x => x.Stage === 'RFQ').StageID;
    if (isTarget) {
      stageId = rfqStageId;
    }
    const queryResult = await Promise.all([this.targetOperationServer.TargetOperation(stageId, processCode, true).toPromise(), this.v_StanderOperationApi.find({ where: { ProcessCode: processCode } }).toPromise()]);
    const modelOperations = queryResult[0];
    const standard = queryResult[1];
    const modelOperaDatas = {
      data: []
    };
    // 不是target
    if (isTarget) {
      modelOperations.data.forEach(operaiton => {
        if (operaiton.TargetCount !== null) {
          operaiton.FactorDetailIDActual = operaiton.TargetFactorDetailCode;
          operaiton.Count = operaiton.TargetCount;
        }
      });
    }
    modelOperations.data.forEach(operaiton => {
      const actions = standard.filter(x => x['FactorDetailID'] === operaiton.FactorDetailIDActual && x['ModelType'] === operaiton.modeltype && x['Version'] === operaiton.Version);
      actions.forEach(action => {
        modelOperaDatas.data.push({
          action: action['ActionName'],
          costtime: action['CostTime'],
          modelOperationID: operaiton['ModelOperationID'],
          process: action['ProcessName'],
          Module: operaiton['module'],
          material: action['MaterialName'],
          factor: action['FactorName'],
          factorDetail: action['FactorDetailName'],
          count: operaiton['Count']
        });
      });
    });
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
      this.popDataSet = [...this.popDataSet, {
        modelOperationID: data.modelOperationID,
        material: data.material,
        factor: data.factor,
        factorDetail: data.factorDetail,
        count: data.count,
        action: action,
        total: (data.total * data.count)
      }];
    });
  }

  // 更新列表中的ActionList
  updateActionList(action: string) {
    if (!this.actionList.includes(action)) {
      const index = (this.nzWidthConfigPop.length - 2);
      this.actionList.push(action);
      this.nzWidthConfigPop.splice(index, 0, '80px');
      this.nzScrollXPop += 80;
      this.nzScrollPop = {
        x: this.nzScrollXPop + 'px',
        y: this.reportPopHeight + 'px'
      };
    }
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
      this.searchModel(data);
    } else {
      delete data.modelData;
    }
  }

  searchModel(data) {
    let CountData;
    this.groupModelService.getGroupModelMappings(data.id).pipe(
      switchMap(x => {
        CountData = x;
        return forkJoin(this._query(x.map(y => ({ modelId: y.modelId, type: 1 }))));
      }
      )).subscribe(
        y => {
          y[0].forEach(model => {
            model.count = CountData.find(z => z.modelId === model.id).count;

          });
          data.modelData = y[0];
        }
      );
  }

  clickCFlow(data) {
    if (data[6] === 'RFQ') {
      window.open('/dashboard/dfc/target-report/' + data['stageId'] + '/A');
    } else {
      window.open('/dashboard/dfc/workhour-report/' + data['stageId'] + '/A');
    }
  }

  clickNewModel(proCodeID, proNameID, plant) {
    window.open('/dashboard/dfc/newmodel-maintain/' + proCodeID + '/' + proNameID + '?Plant=' + plant);
  }
}
