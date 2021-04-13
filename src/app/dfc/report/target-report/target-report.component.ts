import { TargetOperationSignApi } from './../../../service/dfc_sdk/sdk/services/custom/TargetOperationSign';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FactorDetailApi, ProjectNameProfileApi,
  StageApi, TargetOperationsApi, MemberApi, EmailModelApi, ProjectMemberApi, ProjectNameProfile, ProcessApi, WorkflowApi
} from '@service/dfc_sdk/sdk';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { FileService } from '@service/file.service';
import { ActivatedRoute } from '@angular/router';
import { OperationLogApi } from '@service/dfc_sdk/sdk/services/custom/OperationLog';
import { DfcKpiService } from '../dfc-kpi/dfc-kpi.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DownexcelService } from '@service/downexcel.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-target-report',
  templateUrl: './target-report.component.html',
  styleUrls: ['./target-report.component.scss']
})
export class TargetReportComponent implements OnInit {
  tablePaging = true;
  description: string;   // 說明的描述
  targetOperationSignId: number;
  sendMode = {
    member: [],
    memberOption: [],
    description: '',
    value: [],
    isComplete: false,
  };
  targetHoursFlag = true; // 页面内容显示, true--第一页, false--传参之后的一页
  secondQueryDatas: Array<DFCTargetHourTableData> = []; // 第二页的数据暂存
  dataSet = []; // 表格数据暂存
  // 此處有刪除action相關
  editrow = ''; // 记录编辑状态时的表格行序号, 方便失去焦点时做判断
  editIndex: number; // 记录当前编辑的表格行数
  editChange: string;
  // 編輯后失去焦點 聯合判斷, inputBlur = true && inputClick = false 時 彈出儲存框
  inputBlur = false; // 記錄input編輯框是否 失去焦點, 默認為false
  inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
  isEditSaveVisible = false; // 储存框是否出现
  isDeleteVisible = false; // 刪除對話框是否出現
  isAfterDeleteVisible = false; // 刪除后對話框是否出現
  indeterminate = false;
  // 查詢時的下拉框設定
  // 廠別相關
  plantSelectValue: string;
  listOfPlantSelectOption = []; // 下拉框内容
  plantSearchChange$ = new BehaviorSubject('');
  isPlantListLoading = false;
  // add 客戶相關
  customerSelectValue: string;
  listOfCustomerSelectOption = []; // 下拉框内容
  isCustomerListLoading = false;
  customerSearchChange$ = new BehaviorSubject('');
  customerSelectFlag = true; // 下拉框 是否可用
  // 產品相關
  modelTypeSelectValue;
  listOfModelTypeSelectOption = []; // 下拉框内容
  modelTypeSearchChange$ = new BehaviorSubject('');
  isModelTypeListLoading = false;
  modelTypeSelectFlag = true; // 下拉框 是否可用
  // ModelFamily相關
  modelFamilySelectValue = [];
  modelFamilySelectValues: string;
  listOfModelFamilySelectOption = []; // 下拉框内容
  modelFamilySearchChange$ = new BehaviorSubject('');
  isModelFamilyListLoading = false;
  modelFamilySelectFlag = true; // 下拉框 是否可用
  // ModelName相關
  modelNameSelectValue;
  modelNameSelectValues: string;
  listOfModelNameSelectOption = []; // 下拉框内容
  modelNameSearchChange$ = new BehaviorSubject('');
  isModelNameListLoading = false;
  // C流程相關
  cFlowSelectValue = ['RFQ']; // 下拉框選中的值
  cFlowSelectValues: string;
  listOfCFlowSelectOption = ['RFQ'];  // 下拉框内容
  cFlowSelectFlag = true; // 下拉框 是否可用
  // 表格目前的頁面
  isTableLoading = false; // 设置细项展示按钮是否为加载状态
  isItemOrGap = true; // 是否为差异项/细项, false --- 细项, true --- 差异项
  gapTable: Array<DFCTargetHourTableData> = []; // 差异项的数据
  itemTable = []; // 细项的数据
  defultDueDay = new Date().toLocaleDateString();
  saveFlag = false; // 存儲標記--為了讓存的時候不會再去變化現有表格, 實現表格固定
  editFlag = false; // 編輯狀態標誌 -- 編輯時顯示  是否變更項
  // 表格中 目標設計下拉框
  targetFactorDetailSelectValue: string; // 下拉框选值
  listOfTargetFactorDetailSelectOption = {}; // 下拉框内容
  // 表格中 Status下拉框
  statusMapping = {
    0: '<div class="red-circle">',
    1: '<div class="orange-circle">',
    2: '<div class="green-circle">'
  };
  statusSelectValue: string; // 下拉框选值
  listOfStatusSelectOption = [
    { Value: 0, Label: 'Open' },
    { Value: 1, Label: 'Ongoing' },
    { Value: 2, Label: 'Close' }
  ]; // 下拉框内容
  // 表格中 PIC下拉框
  memberList;
  picSelectValue;
  picSelectValues: string;
  listOfPICSelectOption = []; // 下拉框内容
  picSearchChange$ = new BehaviorSubject('');
  isPICListLoading = false;
  // echart
  optionsFirst: {};
  optionsSecond: {};

  FirstEchartParam = {
    legendData: [],
    series: []
  };

  SecondEchartParam = {
    xAxisData: [],
    seriesData1: [],
    seriesData2: []
  };
  stageID: number;
  proCodeID: number;
  process: string;
  proCode: string;
  proName: string;
  ProcessMapping;
  // 增加製成
  firstEchartData = { 'xAxisData': [], 'tempData': [], 'processCode': [] };
  gapList: {
    value: number,
    name: string
  }[] = [];
  gapValue: number[] = [];
  gapOthers = 0;
  processTarget: string; // 第二頁中 頁面上的 製程顯示
  dateFormat = 'yyyy/MM/dd'; // 日期格式显示
  // 文件上傳下載相關
  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  @ViewChild('DFCModelTarget') dfcModelTarget: ElementRef;
  nzWidthConfigs: any = {};
  nzWidthConfig = [];
  nzScroll: {} = { x: '2510px' };
  sendEmailLoading = false; // 設置Email發送按鈕 是否為加載狀態.  -- 點擊按鈕, 1分鐘后才可以再次點擊
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['TargetOperation']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
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
  queryLoading = false;
  searchFactorDetail = {
    best: '',
    target: '',
    actual: ''
  };
  trans = {};
  constructor(
    private projectNameProfileServer: ProjectNameProfileApi,
    private projectMemberServer: ProjectMemberApi,
    private stageServer: StageApi,
    private targetOperationsServer: TargetOperationsApi,
    private factorDetailServer: FactorDetailApi,
    private emailModelServer: EmailModelApi,
    private fileService: FileService,
    private memberServer: MemberApi,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private operationLogServer: OperationLogApi,
    private dfcKpiService: DfcKpiService,
    private processApi: ProcessApi,
    private workflowApi: WorkflowApi,
    private targetOperationSignApi: TargetOperationSignApi,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private downExcelService: DownexcelService,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    // 初始化i18n;
    this.translate.get(['report.select-all', 'report.workhour-improve-goal-analysis-pie']).subscribe(res => {
      this.trans['select-notice'] = res['report.select-all'];
      this.trans['bar-title'] = res['report.workhour-improve-goal-analysis-pie'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['report.select-all', 'report.workhour-improve-goal-analysis-pie']).subscribe(res => {
        this.trans['select-notice'] = res['report.select-all'];
        this.trans['bar-title'] = res['report.workhour-improve-goal-analysis-pie'];
      });
    });
    this.initPlantSelect(); // 初始化 廠別 下拉框
    this.initCustomerSelect(); // 初始化客戶別
    this.initModelTypeSelect(); // 初始化
    this.initNameSelect();
    await this.initProcess(); // 初始化製程
    this.nzWidthConfigs = {
      edit: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '90px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px',
          '120px', '150px', '100px'],
        nzScroll: { x: '2600px', y: (this.dfcModelTarget.nativeElement.offsetHeight - 240) + 'px' }
      },
      notdo: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px',
          '120px', '150px', '100px'],
        nzScroll: { x: '2510px', y: (this.dfcModelTarget.nativeElement.offsetHeight - 240) + 'px' }
      }
    };
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
    this.route.params.subscribe(r => {
      if (r.stageID && r.process) {
        this.targetHoursFlag = false;
        this.stageID = r.stageID;
        this.process = r.process;
        this.processTarget = this.ProcessMapping[r.process];
        this.querySecondData();
      } else if (r.projectNameID) {
        this.projectNameProfileServer.findById(r.projectNameID, { include: 'projectCodeProfile' }).subscribe(
          (result: ProjectNameProfile) => {
            const selectiont = { Label: result.ProjectName, Value: r.projectNameID, ProCode: result.ProjectCodeID };
            this.modelFamilySelectFlag = false;
            this.cFlowSelectFlag = false;
            this.listOfModelFamilySelectOption = [result.ProjectCode];
            this.listOfModelNameSelectOption = [selectiont];
            this.cacheProNameSearchList = [...this.listOfModelNameSelectOption];
            this.modelTypeSelectValue = result.projectCodeProfile.ModelType;
            this.modelFamilySelectValue = [result.ProjectCode];
            this.modelNameSelectValue = [selectiont];
            this.cFlowSelectValue = ['RFQ'];
            this.queryFirstEchart();
          });
      }
    });
  }

  // 初始化客戶別
  initCustomerSelect() {
    const getCustomerList = (customer: string) => {
      return this.dfcKpiService.getProCodeCustom(customer, this.plantSelectValue)
        .pipe(map((res: any) => res)).pipe(map((list: any) => {
          if (list === undefined) {
            return null;
          } else {
            return list.map(item => {
              return item['Customer'];
            });
          }
        }));
    };
    const plantList$: Observable<string[]> = this.customerSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomerList));
    plantList$.subscribe(res => {
      this.listOfCustomerSelectOption = this.deduplication(res);
      this.isCustomerListLoading = false;
    });
  }

  deduplication(arr: string[]) {   // 去重
    const temp = [{ Value: '', Label: '' }];
    arr.forEach(item => {    // 讓arr中的每個成員都和temp中的每個成員的value相比，沒有相同的則加入temp
      const flag = temp.every(data => {
        return data.Value.indexOf(item) === -1;
      });
      if (flag === true) {
        temp.push({ 'Value': item, 'Label': item });
      }
    });
    temp.splice(0, 1);
    return temp;
  }

  async initProcess() {
    this.ProcessMapping = await this.processApi.find({}).toPromise().then(datas => {
      return datas.reduce((p, t) => {
        p[t['ProcessCode']] = t['Name'];
        return p;
      }, {});
    });
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.listOfPlantSelectOption = data);
    // 对厂别自动带入本厂的标签
    this.plantSelectValue = localStorage.getItem('DFC_Plant');
    this.changePlant();
  }

  onCustomerSearch(value: string): void {
    this.isCustomerListLoading = true;
    this.customerSearchChange$.next(value);
  }

  initModelTypeSelect() {
    this.listOfModelTypeSelectOption = []; // 清空选择框中的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.listOfModelTypeSelectOption = datas;
    });
  }

  // 廠別下拉框選中改變后, 查詢出 產品
  changePlant() {
    this.customerSelectFlag = false;
    this.modelTypeSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.cFlowSelectFlag = true;
    this.customerSelectValue = '';
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.modelNameSelectValue = '';
    this.groupModel.groupModelAndModelValue = [];
    // 廠別選擇完畢，重新更新客戶別
    this.isCustomerListLoading = true;
    this.customerSearchChange$.next('');
    this.searchProjectNameList(this.plantSelectValue).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            [],
            [this.customerSelectValue],
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

  changeCustomer() {
    this.modelTypeSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.cFlowSelectFlag = true;
    this.modelTypeSelectValue = '';
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.dfcCommonService.filterProjectName(
      [],
      [this.customerSelectValue],
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
  onModelTypeSearch(value: string): void {
    this.isModelTypeListLoading = true;
    this.modelTypeSearchChange$.next(value);
  }

  // 產品 下拉框選中改變后, 查詢出 ModelFamily
  changeModelType() {
    this.modelFamilySelectFlag = false;
    this.cFlowSelectFlag = true;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.cFlowSelectValue = ['RFQ'];
    this.dfcCommonService.filterProjectName(
      [],
      [this.customerSelectValue],
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

  // 初始化 目標設計下拉框
  initTargetFactorDetailSelect(datas?) {
    this.listOfTargetFactorDetailSelectOption = [];
    this.factorDetailServer.find({
    }).subscribe(data2 => {
      this.listOfTargetFactorDetailSelectOption = data2.reduce(
        (p, t) => {
          if (p[t['FactorID']] === undefined) {
            p[t['FactorID']] = [];
          }
          p[t['FactorID']].push({ Value: t['FactorDetailID'], Label: t['Name'] });
          return p;
        }, {});
    });
  }

  // 初始化 ProName, ModelName 下拉框
  initNameSelect() {
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
    value = value.filter((filterItem) => !!filterItem);
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
            return modelName.Value === Number(item.ProjectNameID);
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
          const projectNameIds = value.map(x => x.Value);
          return this.dfcCommonService.getMappingModelName(projectNameIds);
        }
      ),
      map(
        (modelNameSelect) => {
          this.groupModel.groupModelAndModelSelectOption = modelNameSelect.filter(x => x.type === 1);
          this.cacheModelNameSearchList = [...this.groupModel.groupModelAndModelSelectOption];
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
      )).subscribe();
    this.modelFamilySelectValue = [];
    if (this.modelNameSelectValue.length === 0) {
      return;
    }
  }

  onGroupModelSearch(value) {
    this.groupModel.isGroupModelNameListLoading = true;
    this.groupModel.searchChange$.next(value);
  }

  changeroupModel(value) {
    this.groupModel.groupModelAndModelSelectOption = [...this.cacheModelNameSearchList];
  }

  // 查询出第一页的Echart
  queryFirstEchart() {
    console.log('modelNameSelectValue');
    console.log(this.modelNameSelectValue);
    if (!this.plantSelectValue
      || !this.customerSelectValue
      || !this.modelTypeSelectValue
      || this.modelNameSelectValue.length === 0
      || this.modelFamilySelectValue.length === 0) {
      this.message.create('error', this.trans['select-notice']);
      return;
    }
    if (this.groupModel.groupModelAndModelValue.length === 0) {
      this.message.create('error', 'Please select Model Name！');
      return;
    }
    this.cFlowSelectValue = ['RFQ'];
    this.firstEchartData.processCode = [];
    this.firstEchartData.tempData = [];
    this.firstEchartData.xAxisData = [];
    const tempData: {
      name: string,
      id: string,
      stageID: number,
      proCodeID: number,
      processCode: string[],
      data: number[]
    }[] = [];
    this.firstEchartData = { 'xAxisData': [], 'tempData': [], 'processCode': [] };
    this.queryLoading = true;
    this.dfcCommonService.getProcess(this.plantSelectValue, this.modelTypeSelectValue).pipe(
      map(
        async (res: any) => {
          if (res.length > 0) {
            res[0].processCode.split(',').forEach(
              item => {
                this.firstEchartData.xAxisData.push(this.ProcessMapping[item]);
                this.firstEchartData.processCode.push(item);
                this.firstEchartData.tempData.push(0);
              }
            );
          } else {
            for (const key in this.ProcessMapping) {
              if (this.ProcessMapping.hasOwnProperty(key)) {
                const process = this.ProcessMapping[key];
                this.firstEchartData.xAxisData.push(process);
                this.firstEchartData.processCode.push(key);
                this.firstEchartData.tempData.push(0);
              }
            }
          }
          this.firstEchartData.xAxisData.push('Total');
          this.firstEchartData.tempData.push(0);
          this.FirstEchartParam.legendData = [];
          this.FirstEchartParam.series = [];
          const totalList: number[] = [];
          for (let pdIndex = 0; pdIndex < this.groupModel.groupModelAndModelValue.length; pdIndex++) {
            const ProNameData = this.groupModel.groupModelAndModelSelectOption.find(d => d.modelId === this.groupModel.groupModelAndModelValue[pdIndex]);
            const queryStage = {
              'where': {
                'and': [
                  { 'ModelID': ProNameData['modelId'] },
                  { 'Stage': { 'inq': this.cFlowSelectValue } }
                ]
              },
              'include': { 'basicModel': { 'projectNameProfile': 'projectCodeProfile' } }
            };
            this.FirstEchartParam.legendData.push(ProNameData['modelName']);
            const StageDatas = await this.stageServer.find(queryStage).toPromise().then(data => data);
            let flag = false;
            for (let i = 0; i < StageDatas.length; i++) {
              const StageData = StageDatas[i];
              if (StageData['Stage'] === 'RFQ') {
                flag = true;
                tempData.push({
                  name: StageData['basicModel']['modelName'],
                  id: StageData['basicModel']['modelName'] + '-' + StageData['Stage'],
                  stageID: StageData['StageID'],
                  proCodeID: StageData['basicModel']['projectNameProfile'].ProjectCodeID,
                  processCode: this.firstEchartData.processCode,
                  data: JSON.parse(JSON.stringify(this.firstEchartData.tempData))
                });
                await this.targetOperationsServer.TargetOperationReport(StageData['StageID'], true).toPromise().then(rs => {
                  const result = [];
                  for (const key in rs.data[0]['operationTime']) {
                    if (rs.data[0]['operationTime'].hasOwnProperty(key)) {
                      const element = rs.data[0]['operationTime'][key];
                      const resultjs = {
                        StageID: rs.data[0]['stageInfo']['StageID'],
                        ProcessCode: key,
                        CostTime: (!!element['targetCostTime'] ? element['targetCostTime'] : element['costTime'])
                      };
                      result.push(resultjs);
                    }
                  }
                  let index = -1;
                  if (result.length > 0) {
                    for (let k = 0; k < tempData.length; k++) {
                      const temp = tempData[k];
                      if (temp.stageID === result[0]['StageID']) {
                        index = k;
                        break;
                      }
                    }
                  }
                  result.forEach(data => {
                    const indexOfProcess = this.firstEchartData.processCode.indexOf(data['ProcessCode']);
                    tempData[index].data[indexOfProcess] = data['CostTime'] ? parseFloat(data['CostTime'].toFixed(2)) : 0;
                  });
                  if (index > -1) {
                    let total = 0;
                    for (let tIndex = 0; tIndex < this.firstEchartData.processCode.length; tIndex++) {
                      total += tempData[index].data[tIndex];
                    }
                    totalList.push(total);
                    tempData[index].data[this.firstEchartData.processCode.length] = parseFloat(total.toFixed(2));
                  }
                });
                break;
              }
            }
            if (!flag) {
              tempData.push({
                name: ProNameData['modelName'],
                id: ProNameData['modelName'] + '-RFQ',
                stageID: -1,
                proCodeID: ProNameData['projectNameProfile']['ProjectCodeID'],
                processCode: this.firstEchartData.processCode,
                data: JSON.parse(JSON.stringify(this.firstEchartData.tempData))
              });
            }
          }
          if (totalList.length === 0) {
            totalList.push(1);
          }
          const maxTotal = Math.max(...totalList);
          this.queryLoading = false;
          this.getOptionsFirst(tempData, maxTotal);
        })).subscribe();
  }

  getOptionsFirst(tempDatas: { name: string, id: string, stageID: number, proCodeID: number, processCode: string[], data: number[] }[], maxTotal) {
    const colorList = [
      'rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgb(0, 102, 255)', 'rgb(34, 107, 218)', 'rgb(0, 69, 173)',
      'rgb(2, 50, 121)', 'rgb(44, 81, 138)', 'rgb(24, 54, 100)', 'rgb(115, 156, 218)', 'rgb(121, 124, 129)'
    ];
    tempDatas.forEach(tempData => {
      const indexOfName = this.FirstEchartParam.legendData.indexOf(tempData.name);
      const tempDataId = tempData.id.split('-');
      const indexOfCFlow = this.cFlowSelectValue.indexOf(tempDataId[(tempDataId.length - 1)]);
      const index = indexOfName + (this.FirstEchartParam.legendData.length * indexOfCFlow);
      this.FirstEchartParam.series[index] = {
        name: tempData.name,
        id: tempData.id,
        stageID: tempData.stageID,
        stack: tempData.name,
        proCodeID: tempData.proCodeID,
        processCode: tempData.processCode,
        type: 'bar',
        itemStyle: {
          normal: {
            color: colorList[indexOfName],
            label: {
              show: true,
              position: 'top',
              formatter: function (p) {
                return p.value;
              }
            }
          }
        },
        data: tempData.data
      };
    });
    tempDatas.forEach(tempData => {
      const data = tempData.data.map(t => (maxTotal - t));
      this.FirstEchartParam.series.push({
        name: tempData.name,
        id: (tempData.id + '-stack'),
        stack: tempData.name,
        stageID: tempData.stageID,
        proCodeID: tempData.proCodeID,
        processCode: tempData.processCode,
        type: 'bar',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: data
      });
    });
    this.optionsFirst = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          // for text color
          let res = '<div style="color:rgba(0, 0, 0, 0.5)">';
          res += '<strong>' + params[0].name + '</strong>';
          for (let i = 0, l = params.length; i < l; i++) {
            const series = params[i].seriesId.split('-');
            if (!series.includes('stack')) {
              res += '<br/>' + params[i].seriesId + ' : ' + (params[i].value);
            }
          }
          res += '</div>';
          return res;
        }
      },
      legend: {
        x: 'left',
        data: this.FirstEchartParam.legendData
      },
      calculable: true,
      grid: {
        y: 80,
        y2: 65,
        x2: 40
      },
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0, // 横轴信息全部显示
            rotate: -30
          },
          data: this.firstEchartData.xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0
        }
      ],
      series: this.FirstEchartParam.series
    };
  }

  onChartEvent(event: any, type: string) {
    if (event['name'] === 'Total') {
      return;
    }
    // seriesId
    const seriesIds = event['seriesId'].split('-');
    if (!seriesIds.includes('RFQ')) {
      return;
    }
    this.targetHoursFlag = false;
    this.processTarget = event['name'];
    this.stageID = this.optionsFirst['series'][event['seriesIndex']]['stageID'];
    this.proCodeID = this.optionsFirst['series'][event['seriesIndex']]['proCodeID'];
    this.process = this.optionsFirst['series'][event['seriesIndex']]['processCode'][event['dataIndex']];
    this.proName = event['seriesName'];
    this.querySecondData();
    // 判斷status是1還是0，繪製相應數據
    this.targetOperationSignApi.find({
      'where': {
        'and': [
          { 'stageID': this.stageID },
          { 'process': this.process }
        ]
      },
      'fields': ['id', 'status', 'signID']
    }).subscribe((res: { id: number, status: number, signID: number }[]) => {
      if (res.length === 0) {
        this.sendMode.isComplete = false;
      } else {
        if (res[0].status === 0) {
          this.sendMode.isComplete = false;
          this.targetOperationSignId = res[0].id;
        } else {
          this.sendMode.isComplete = true;
          this.workflowApi.findById(res[0].signID).subscribe((res: any) => {
            this.description = res.desc;
          });
        }
      }
    });
  }

  // 查詢第二頁中需要的內容
  querySecondData() {
    this.SecondEchartParam = {
      xAxisData: [],
      seriesData1: [],
      seriesData2: []
    };
    this.gapList = [];
    this.gapValue = [];
    this.gapOthers = 0;
    this.secondQueryDatas = [];
    this.stageServer.findById(this.stageID, { 'include': { 'basicModel': 'projectNameProfile' } }).subscribe(proName => {
      this.proCodeID = proName['basicModel']['projectNameProfile']['ProjectCodeID'];
      this.proCode = proName['basicModel']['projectNameProfile']['ProjectCode'];
      this.proName = proName['basicModel']['modelName'];
      // 加載當前需要的PIC名單
      this.projectMemberServer.find({
        'fields': { 'MemberID': true },
        'where': { 'ProjectCodeID': this.proCodeID }
      }).subscribe(proMembers => {
        const proMemberList = proMembers.reduce((p, t) => {
          if (!p['member']) {
            p['member'] = [];
          }
          if (!p['member'].includes(t['MemberID'])) {
            p['member'].push(t['MemberID']);
          }
          return p;
        }, {});
        this.memberServer.find({
          'where': {
            'or': [
              { 'EmpID': { 'inq': proMemberList['member'] } },
              {
                'and': [
                  { 'DFIUser': true },
                  { 'Plant': localStorage.getItem('DFC_Plant') }
                ]
              }
            ]
          }
        }).subscribe(members => {
          this.memberList = members;
          // 查詢出現在第二頁中需要的數據
          this.targetOperationsServer.TargetOperation(this.stageID, this.process, false).subscribe(rs => {
            rs['data'].forEach(rsData => {
              const BestCostTime = (!rsData['BestCostTime']) ? 0 : rsData['BestCostTime'];
              const CostTimeActural = (!rsData['CostTimeActural']) ? 0 : rsData['CostTimeActural'];
              const CostTimeTarget = (!rsData['CostTimeTarget']) ? 0 : rsData['CostTimeTarget'];
              let improve = 0;
              const gap = (CostTimeActural - BestCostTime) * rsData['Count'];
              if (rsData['CostTimeTarget']) {
                improve = CostTimeActural * rsData['Count'] - CostTimeTarget * rsData['TargetCount'];
              }
              const member = this.memberList.find(d => d['EmpID'] === rsData['PICID']);
              let PICName = '';
              if (rsData['PICID']) {
                if (!member) {
                  PICName = rsData['PICID'];
                } else {
                  PICName = (!member['EName']) ? member['EmpID'] : member['EName'];
                }
              }
              // 將資料放進去
              const plantMap = this.PlantMapping.find(plantMapData => plantMapData['Plant'] === rsData['Plant']);
              this.secondQueryDatas = [...this.secondQueryDatas, {
                Plant: (!plantMap) ? rsData['Plant'] : plantMap['PlantName'],
                ModelOperationID: rsData['ModelOperationID'],
                Material: rsData['Material'],
                FactorID: rsData['FactorID'],
                Factor: rsData['Factor'],
                BestFactorDetailID: rsData['BestFactorDetailID'],
                BestFactorDetail: rsData['BestFactorDetail'],
                FactorDetailActural: rsData['FactorDetailActural'],
                FactorDetailIDActual: rsData['FactorDetailIDActual'],
                Count: rsData['Count'],
                BestCostTime: BestCostTime,
                CostTimeActural: CostTimeActural,
                Comment: rsData['Comment'],
                improve: improve,
                gap: gap,
                gapCost: rsData['gapCost'],
                TargetFactorDetailCode: rsData['TargetFactorDetailCode'],
                TargetFactorDetail: rsData['TargetFactorDetail'],
                TargetCount: rsData['TargetCount'],
                CostTimeTarget: CostTimeTarget,
                PICID: rsData['PICID'],
                PICName: PICName,
                Status: rsData['Status'],
                DueDay: rsData['DueDay'],
                BOMCost: rsData['BOMCost']
              }];
            });
            this.getGapImprove();
          });
        });
      });
    });
  }

  // 获取gap, improve值
  getGapImprove() {
    let actural = 0;
    let target = 0;
    let best = 0;
    let improves: { Material: string, Value: number }[] = [];
    let gaps: { Material: string, Value: number }[] = [];
    this.gapTable = []; // 清空
    // 对数据进行处理, 初步分类
    this.secondQueryDatas.forEach((
      value: DFCTargetHourTableData,
      index: number,
      array: DFCTargetHourTableData[]) => {
      actural += (value.CostTimeActural * value.Count);
      best += (value.CostTimeTarget === 0) ? (value.BestCostTime * value.Count) : (value.BestCostTime * value.TargetCount);
      target += (value.CostTimeTarget === 0) ? (value.CostTimeActural * value.Count) : (value.CostTimeTarget * value.TargetCount);
      // 对improve的计算
      let improveFlag = false;
      let improveIndex = -1;
      for (let k = 0; k < improves.length; k++) {
        const improve = improves[k];
        if (improve.Material === value.Material) {
          improveFlag = true;
          improveIndex = k;
          break;
        }
      }
      if (improveFlag) {
        improves[improveIndex].Value += value.improve;
      } else {
        improves.push({ Material: value.Material, Value: value.improve });
      }
      // 对gap的计算
      let gapFlag = false;
      let gapIndex = -1;
      for (let k = 0; k < gaps.length; k++) {
        const gap = gaps[k];
        if (gap.Material === value.Material) {
          gapFlag = true;
          gapIndex = k;
          break;
        }
      }
      const gapValue = (value.CostTimeTarget === 0) ? ((value.CostTimeActural - value.BestCostTime) * value.Count) : ((value.CostTimeTarget - value.BestCostTime) * value.TargetCount);
      if (gapFlag) {
        gaps[gapIndex].Value += gapValue;
      } else {
        gaps.push({ Material: value.Material, Value: gapValue });
      }
      // 差異項存入暫存Table
      if ((value.gap || value.improve) && (value.gap !== 0 || value.improve !== 0)) {
        this.gapTable = [...this.gapTable, value];
      }
    });
    // 改善项只取前三
    improves = this.getImproveGapSort(improves);
    const improvesTop3 = this.getImproveGapList(JSON.parse(JSON.stringify(improves)), 3);
    // 与最优相比 gap项取 前5
    gaps = this.getImproveGapSort(gaps);
    const gapsTop5 = this.getImproveGapList(JSON.parse(JSON.stringify(gaps)), 5);
    // 整合需要排序的物料
    const materialList = this.integrationMaterial(improves, gaps);
    this.gapTable = this.getTableSort(this.gapTable, materialList);
    this.secondQueryDatas = this.getTableSort(this.secondQueryDatas, materialList);
    // 放入數據
    this.querySecondEchart(actural, target, best, improvesTop3, gapsTop5);
    if (this.saveFlag) {
      const data1 = this.secondQueryDatas.find(data => data.ModelOperationID === this.dataSet[this.editIndex]['ModelOperationID']);
      this.dataSet[this.editIndex]['CostTimeTarget'] = data1.CostTimeTarget * data1.TargetCount;
    } else {
      this.queryTable();
    }
  }

  // 用於排序
  getImproveGapSort(list: { Material: string, Value: number }[]): { Material: string, Value: number }[] {
    list = list.sort((a, b) => {
      return a.Value < b.Value ? 1 : -1;
    });
    list = list.filter(data => {
      return data.Value !== 0;
    });
    return list;
  }

  // 用於 improve取值
  getImproveGapList(list: { Material: string, Value: number }[], num: number): { Material: string, Value: number }[] {
    if (list.length > num) {
      let values = 0;
      for (let index = num; index < list.length; index++) {
        const data = list[index];
        values += data.Value;
      }
      list.splice(num, (list.length - num));
      list.push({ Material: 'Other', Value: values });
    }
    return list;
  }

  // 整合需要排序的物料
  integrationMaterial(improves: { Material: string, Value: number }[], gaps: { Material: string, Value: number }[]): string[] {
    const materialList: string[] = [];
    improves.forEach(improve => {
      materialList.push(improve.Material);
    });
    gaps.forEach(gap => {
      if (!materialList.includes(gap.Material)) {
        materialList.push(gap.Material);
      }
    });
    return materialList;
  }

  // 對表格中的數據進行排序
  getTableSort(lists: DFCTargetHourTableData[], materialList: string[]): DFCTargetHourTableData[] {
    // 做一個備份, 存放之前的數據信息
    const listBK = JSON.parse(JSON.stringify(lists));
    // 臨時存放 需要返回的 list
    const tempLists: Array<DFCTargetHourTableData> = [];
    // 臨時存放 Material 分類數據
    const tempMap = lists.reduce((p, t) => {
      if (!p[t.Material]) {
        p[t.Material] = [];
      }
      p[t.Material].push(t);
      return p;
    }, {});
    for (const key in tempMap) {
      if (tempMap.hasOwnProperty(key)) {
        const datas = tempMap[key];
        datas.sort((a, b) => {
          return a.gap < b.gap ? 1 : -1;
        });
        datas.sort((a, b) => {
          return a.improve <= b.improve ? 1 : -1;
        });
      }
    }
    materialList.forEach(material => {
      if (!!tempMap[material]) {
        tempMap[material].forEach(data => {
          tempLists.push(data);
        });
      }
    });
    if (Object.keys(tempMap).length > materialList.length) {
      for (const key in tempMap) {
        if (tempMap.hasOwnProperty(key) && !materialList.includes(key)) {
          const datas = tempMap[key];
          datas.forEach(data => {
            tempLists.push(data);
          });
        }
      }
    }
    return tempLists;
  }

  // 查詢出 第二頁中 echart 需要的資料
  querySecondEchart(actural: number, target: number, best: number,
    improves: { Material: string, Value: number }[], gaps: { Material: string, Value: number }[]) {
    const colorList = { // 瀑布图颜色
      Actural: 'rgba(60, 144, 247, 1)',
      Gap: 'rgba(85, 191, 192, 1)',
      Best: 'rgba(255, 195, 0, 1)',
      Target: 'rgb(0, 102, 255)'
    };
    this.SecondEchartParam.xAxisData.push('RFQ工时');
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: actural.toFixed(2),
      itemStyle: {
        normal: {
          color: colorList.Actural
        }
      }
    });
    let height: number = target;
    for (let index = (improves.length - 1); index >= 0; index--) {
      const improve = improves[index];
      this.SecondEchartParam.xAxisData.splice(1, 0, improve.Material);
      this.SecondEchartParam.seriesData1.splice(1, 0, height);
      this.SecondEchartParam.seriesData2.splice(1, 0, {
        value: improve.Value.toFixed(2),
        itemStyle: {
          normal: {
            color: colorList.Gap
          }
        }
      });
      height += improve.Value;
    }
    this.SecondEchartParam.xAxisData.push('Target');
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: target.toFixed(2),
      itemStyle: {
        normal: {
          color: colorList.Target
        }
      }
    });
    height = best;
    const length = this.SecondEchartParam.xAxisData.length;
    for (let index = (gaps.length - 1); index >= 0; index--) {
      const gap = gaps[index];
      this.SecondEchartParam.xAxisData.splice((length), 0, gap.Material);
      this.SecondEchartParam.seriesData1.splice((length), 0, height);
      this.SecondEchartParam.seriesData2.splice((length), 0, {
        value: gap.Value.toFixed(2),
        itemStyle: {
          normal: {
            color: colorList.Gap
          }
        }
      });
      height += gap.Value;
    }
    this.SecondEchartParam.xAxisData.push('Best');
    this.SecondEchartParam.seriesData1.push(0);
    this.SecondEchartParam.seriesData2.push({
      value: best.toFixed(2),
      itemStyle: {
        normal: {
          color: colorList.Best
        }
      }
    });
    this.getOptionsSecond();
  }

  // 第二頁
  getOptionsSecond() {
    console.log(this.SecondEchartParam.seriesData1);
    console.log(this.SecondEchartParam.seriesData2);
    const x = [];
    this.SecondEchartParam.xAxisData.forEach(element => {
      let ele = element.split('（')[0];
      ele = ele.split('(')[0];
      x.push(ele);
    });
    this.optionsSecond = {
      title: {
        text: this.proName + '\t\t' + this.ProcessMapping[this.process] + this.trans['bar-title'],
        x: 'center',
        textStyle: {
          color: 'rgb(0, 102, 255)',
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[1];
          return tar.name + ' : ' + tar.value;
        }
      },
      xAxis: [{
        type: 'category',
        splitLine: { show: false },
        axisLabel: {
          show: true,
          rotate: 315
        },
        data: x
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [
        {
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: this.SecondEchartParam.seriesData1
        },
        {
          type: 'bar',
          stack: '总量',
          itemStyle: { normal: { label: { show: true, position: 'top' } } },
          data: this.SecondEchartParam.seriesData2
        }
      ]
    };
  }

  // 切换 到第一页
  clickSwitch() {
    this.targetHoursFlag = true;
    this.saveFlag = false;
    this.isItemOrGap = true;
    this.isEditSaveVisible = false;
    this.editrow = '';
    this.editFlag = false;
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
  }

  // 查詢表格數據
  queryTable() {
    this.dataSet = [];
    let datas: Array<DFCTargetHourTableData> = [];
    if (this.isItemOrGap) {
      datas = this.gapTable;
      this.isItemOrGap = false;
    } else {
      datas = this.secondQueryDatas;
      this.isItemOrGap = true;
    }
    const list = datas.reduce((
      previousValue,
      currentValue: DFCTargetHourTableData,
      currentIndex: number,
      array: DFCTargetHourTableData[]) => {
      if (!previousValue[currentValue.Material]) {
        previousValue[currentValue.Material] = [];
      }
      previousValue[currentValue.Material].push(currentValue);
      return previousValue;
    }, {});
    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        const tables = list[key];
        tables.forEach((table: DFCTargetHourTableData) => {
          this.dataSet = [...this.dataSet, {
            Plant: table.Plant,
            ModelOperationID: table.ModelOperationID,
            Material: table.Material,
            FactorID: table.FactorID,
            Factor: table.Factor,
            BestFactorDetailID: table.BestFactorDetailID,
            BestFactorDetail: table.BestFactorDetail,
            FactorDetailActural: table.FactorDetailActural,
            FactorDetailIDActual: table.FactorDetailIDActual,
            Count: table.Count,
            BestCostTime: table.BestCostTime * table.Count,
            CostTimeActural: table.CostTimeActural * table.Count,
            Comment: table.Comment,
            improve: table.improve,
            gap: table.gap,
            gapCost: table.gapCost,
            TargetFactorDetailCode: table.TargetFactorDetailCode,
            TargetFactorDetail: table.TargetFactorDetail,
            TargetCount: table.TargetCount,
            CostTimeTarget: table.CostTimeTarget * table.TargetCount,
            PICID: table.PICID,
            PICName: table.PICName,
            Status: table.Status,
            DueDay: (table.DueDay === null) ? '' : new Date(table.DueDay).toLocaleDateString(),
            BOMCost: table.BOMCost
          }];
        });
      }
    }
    this.isTableLoading = false;
    this.initTargetFactorDetailSelect();
  }

  // 此處有刪除action相關
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

  // 此處有刪除action相關
  // PIC下拉框
  picSelect() {
    const getPICList = (pic: string) => {
      const datas = this.memberList.filter((data: any) => {
        if (data.EmpID.toUpperCase().includes(pic.toLocaleUpperCase())
          || data.Name.toUpperCase().includes(pic.toLocaleUpperCase())
          || data.EName.toUpperCase().includes(pic.toLocaleUpperCase())) {
          return data;
        }
      });
      const list = datas.map((data: any) => {
        return {
          EmpID: data.EmpID,
          Name: data.Name,
          EName: (!data.EName) ? data.EmpID : data.EName,
          Show: data.EmpID + '\t' + data.Name + '\t' + data.EName
        };
      });
      return of(list);
    };
    const picList$: Observable<string[]> = this.picSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getPICList));
    picList$.subscribe(data => {
      this.listOfPICSelectOption = data;
      this.isPICListLoading = false;
    });
  }

  onPICSearch(value: string): void {
    this.isPICListLoading = true;
    this.picSearchChange$.next(value);
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

  upload() {
    if (!this.cFlowSelectValue) {
      this.message.create('error', 'Must choose C process！');
    } else {
      const now = new Date();
      let fileName = now.getTime().toString();
      fileName = fileName + '.' + this.fileToUpload.name.split('.').pop();
      this.showLoading = true;
      this.fileService.postDFCFile(this.fileToUpload, 'target')
        .subscribe(datas => {
          let FailFlag = false;
          const FailMessage = [];
          for (const i in datas) {
            if (datas[i]['status'] === 'fail') {
              FailFlag = true;
              FailMessage.push(JSON.stringify({
                id: datas[i]['id'],
                reason: datas[i]['reason']
              }));
            }
          }
          if (FailFlag) {
            this.message.create('error', 'Upload fail!\n' + FailMessage.toString());
          } else {
            this.message.create('success', 'Upload successfully!');
          }
          this.showLoading = false;
          // 將操作信息存入緩存
          const logMsg = 'upload\t廠別: ' + this.plantSelectValue + '\t' + localStorage.getItem('$DFI$userName') +
            '\n上傳文件信息, 如下:\n' + JSON.stringify(datas);
          this.operationLogServer.create({
            userID: localStorage.getItem('$DFI$userID'),
            APname: '目標工時生成',
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
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'TargetReport');
      this.tablePaging = true;
    }, 300);
  }

  sendEmail() {
    // stageID
    this.sendEmailLoading = true;
    this.emailModelServer.SendOpTimeModifiedComplete(this.stageID, this.process).subscribe(rs => {
      setTimeout(() => {
        this.sendEmailLoading = false;
      }, 60000);
    }, error => {
      console.log(error);
      this.sendEmailLoading = false;
    });
    // 將操作信息存入緩存
    const logMsg = 'send Mail\t廠別: ' + this.plantSelectValue + '\t' + localStorage.getItem('$DFI$userName');
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '目標工時生成',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }

  // 展示细项 或者 显示差异项
  showTableItem() {
    this.isTableLoading = true;
    this.saveFlag = false;
    this.searchFactorDetail.best = '';
    this.searchFactorDetail.target = '';
    this.searchFactorDetail.actual = '';
    this.queryTable();
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
}

/**
 * 頁面表格資料 類
 */
export class DFCTargetHourTableData {
  Plant: string;
  ModelOperationID: number;
  Material: string;
  FactorID: number;
  Factor: string;
  BestFactorDetailID: number;
  BestFactorDetail: string;
  FactorDetailActural: string;
  FactorDetailIDActual: number;
  Count: number;
  BestCostTime: number;
  CostTimeActural: number;
  Comment: string;
  improve: number;
  gap: number;
  gapCost: number;
  TargetFactorDetailCode: number;
  TargetFactorDetail: string;
  TargetCount: number;
  CostTimeTarget: number;
  PICID: string;
  PICName: string;
  Status: number;
  DueDay: string;
  BOMCost: number;
}
