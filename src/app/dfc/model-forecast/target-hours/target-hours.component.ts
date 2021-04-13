import { TranslateService } from '@ngx-translate/core';
import { TargetOperationSignApi } from './../../../service/dfc_sdk/sdk/services/custom/TargetOperationSign';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {
  FactorDetailApi, ProjectNameProfileApi,
  StageApi, ModelOperationTimeApi, TargetOperationsApi, MemberApi, EmailModelApi, ProjectMemberApi, ProcessApi,
  WorkflowApi as WorkflowDFcApi, StageInterface, BasicModelApi, BasicModel
} from '@service/dfc_sdk/sdk';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { FileService } from '@service/file.service';
import { ActivatedRoute } from '@angular/router';
import { OperationLogApi } from '@service/dfc_sdk/sdk/services/custom/OperationLog';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { TargetHoursService } from './target-hours.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { WorkflowApi as WorkflowDFiApi } from '@service/dfi-sdk';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-target-hours',
  templateUrl: './target-hours.component.html',
  styleUrls: ['./target-hours.component.scss']
})
export class TargetHoursComponent implements OnInit, OnDestroy {

  // 送簽相關
  description: string;   // 說明的描述
  targetOperationSignId: number;
  sendMode = {
    member: ['', ''],
    description: '',
    value: [],
    isComplete: false,
    memberOption1: [],
    memberOption2: [],
    workflowMappingID: ''
  };
  memberSearchChange$ = new BehaviorSubject('');
  memberSearchChange2$ = new BehaviorSubject('');
  isMemberOptionLoading = false;
  isMemberOptionLoading2 = false;

  targetHoursFlag = true; // 页面内容显示, true--第一页, false--传参之后的一页

  secondQueryDatas: Array<DFCTargetHourTableData> = []; // 第二页的数据暂存
  dataSet = []; // 表格数据暂存
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
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
  plantSelectValue = [];
  listOfPlantSelectOption = []; // 下拉框内容
  plantSearchChange$ = new BehaviorSubject('');
  isPlantListLoading = false;
  // 產品相關
  modelTypeSelectValue;
  listOfModelTypeSelectOption = []; // 下拉框内容
  modelTypeSearchChange$ = new BehaviorSubject('');
  isModelTypeListLoading = false;
  modelTypeSelectFlag = true; // 下拉框 是否可用
  // ModelFamily相關
  modelFamilySelectValue;
  listOfModelFamilySelectOption = []; // 下拉框内容
  modelFamilySearchChange$ = new BehaviorSubject('');
  isModelFamilyListLoading = false;
  modelFamilySelectFlag = true; // 下拉框 是否可用
  // ModelName相關
  modelNameSelectValue = [];
  listOfModelNameSelectOption = []; // 下拉框内容
  modelNameSearchChange$ = new BehaviorSubject('');
  isModelNameListLoading = false;
  modelNameSelectFlag = true; // 下拉框 是否可用
  tempProjectNameList = [];

  groupModel = {
    groupModelAndModelValue: [],
    groupModelAndModelSelectOption: [],
    isGroupModelNameListLoading: false,

  };

  // C流程相關
  cFlowSelectValue = ['RFQ']; // 下拉框選中的值
  cFlowSelectValues: string;
  listOfCFlowSelectOption = ['RFQ'];  // 下拉框内容
  cFlowSelectFlag = true; // 下拉框 是否可用

  // 表格目前的頁面
  // currentIndex = 0;
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
  proNameID: number;

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

  // 增加製程
  ProcessMapping;
  firstEchartData = { 'xAxisData': [], 'tempData': [], 'processCode': [] };

  queryBUSelect: {
    style: ClsDfcQueryStyle,
    value: string[],
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: { width: 'calc(100% - 125px)' },
        divStyle: { width: '100%', 'text-align': 'right' },
        red: false,
        label: 'BU',
        selectType: 'multiple'
      },
      value: [],
      select: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };
  queryCustomSelect: {
    style: ClsDfcQueryStyle,
    value: string[],
    select: ClsDfcQuerySelect
  } = {
      style: {
        type: 'select',
        style: { width: 'calc(100% - 125px)' },
        divStyle: { width: '100%', 'text-align': 'right' },
        red: false,
        label: '客戶',
        selectType: 'multiple'
      },
      value: [],
      select: {
        selectList: [],
        searchChange$: new BehaviorSubject('')
      }
    };

  isSendSignVisible = false;
  isPassFlag = false;
  maxTotal = 0;
  // isSignFlag = false;

  tablePageIndex; // 表格中 頁碼
  filterStr = '';

  queryLoading = false;

  ModifiedMOHEditCache;

  searchFactorDetail = {
    best: '',
    target: '',
    actual: ''
  };

  sendFlag = false;
  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private projectNameProfileServer: ProjectNameProfileApi,
    private projectMemberServer: ProjectMemberApi,
    private stageServer: StageApi,
    private basicServer: BasicModelApi,
    private modelOperationTimeServer: ModelOperationTimeApi,
    private targetOperationsServer: TargetOperationsApi,
    private factorDetailServer: FactorDetailApi,
    private emailModelServer: EmailModelApi,
    private fileService: FileService,
    private memberServer: MemberApi,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private operationLogServer: OperationLogApi,
    private targetHoursService: TargetHoursService,
    private processApi: ProcessApi,
    private workflowApi: WorkflowDFcApi,
    private workflowDFiApi: WorkflowDFiApi,
    private targetOperationSignApi: TargetOperationSignApi,
    private dfcSelectService: DfcSelectNewService,
    private dfcCommonService: DfcCommonService,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.dfq-customer', 'dfc.unfilled-BOM-Cost', 'dfc.confirm-mapping-RFQ-model', 'report.workhour-improve-goal-analysis-pie',
      'report.select-all', 'dfc.forecast.select-modelName', 'dfc.forecast.fill-discuss-result', 'dfc.forecast.select-pic',
      'dfc.forecast.select-target-design', 'dfc.forecast.fill-target-quantity', 'dfc.forecast.fill-positive-integer', 'dfc.forecast.select-status',
      'dfc.forecast.select-dueday', 'dfc.forecast.model-stage', 'dfc.forecast.must-select-C']).subscribe(res => {
        this.queryCustomSelect.style.label = res['dfq.dfq-customer'];
        this.trans['unfilledBOMCost'] = res['dfc.unfilled-BOM-Cost'];
        this.trans['confirmMapping'] = res['dfc.confirm-mapping-RFQ-model'];
        this.trans['analysisPie'] = res['report.workhour-improve-goal-analysis-pie'];
        this.trans['select-all'] = res['report.select-all'];
        this.trans['select-modelName'] = res['dfc.forecast.select-modelName'];
        this.trans['fill-discuss-result'] = res['dfc.forecast.fill-discuss-result'];
        this.trans['select-pic'] = res['dfc.forecast.select-pic'];
        this.trans['select-target-design'] = res['dfc.forecast.select-target-design'];
        this.trans['fill-target-quantity'] = res['dfc.forecast.fill-target-quantity'];
        this.trans['fill-positive-integer'] = res['dfc.forecast.fill-positive-integer'];
        this.trans['select-status'] = res['dfc.forecast.select-status'];
        this.trans['select-dueday'] = res['dfc.forecast.select-dueday'];
        this.trans['model-stage'] = res['dfc.forecast.model-stage'];
        this.trans['must-select-C'] = res['dfc.forecast.must-select-C'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-customer', 'dfc.unfilled-BOM-Cost', 'dfc.confirm-mapping-RFQ-model', 'report.workhour-improve-goal-analysis-pie',
        'report.select-all', 'dfc.forecast.select-modelName', 'dfc.forecast.fill-discuss-result', 'dfc.forecast.select-pic',
        'dfc.forecast.select-target-design', 'dfc.forecast.fill-target-quantity', 'dfc.forecast.fill-positive-integer', 'dfc.forecast.select-status',
        'dfc.forecast.select-dueday', 'dfc.forecast.model-stage', 'dfc.forecast.must-select-C']).subscribe(res => {
          this.queryCustomSelect.style.label = res['dfq.dfq-customer'];
          this.trans['unfilledBOMCost'] = res['dfc.unfilled-BOM-Cost'];
          this.trans['confirmMapping'] = res['dfc.confirm-mapping-RFQ-model'];
          this.trans['analysisPie'] = res['report.workhour-improve-goal-analysis-pie'];
          this.trans['select-all'] = res['report.select-all'];
          this.trans['select-modelName'] = res['dfc.forecast.select-modelName'];
          this.trans['fill-discuss-result'] = res['dfc.forecast.fill-discuss-result'];
          this.trans['select-pic'] = res['dfc.forecast.select-pic'];
          this.trans['select-target-design'] = res['dfc.forecast.select-target-design'];
          this.trans['fill-target-quantity'] = res['dfc.forecast.fill-target-quantity'];
          this.trans['fill-positive-integer'] = res['dfc.forecast.fill-positive-integer'];
          this.trans['select-status'] = res['dfc.forecast.select-status'];
          this.trans['select-dueday'] = res['dfc.forecast.select-dueday'];
          this.trans['model-stage'] = res['dfc.forecast.model-stage'];
          this.trans['must-select-C'] = res['dfc.forecast.must-select-C'];
        });
    });
    await this.initPlantSelect(); // 初始化 廠別 下拉框
    await this.initModelTypeSelect(); // 初始化
    await this.initBUSelect();
    await this.initCustomSelect();
    await this.initProcess(); // 初始化製程
    this.nzWidthConfigs = {
      edit: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '90px', '200px',
          '120px', '120px', '120px', '150px', '120px', '120px', '120px', '140px',
          '120px', '150px', '120px'],
        nzScroll: { x: '2620px', y: (this.dfcModelTarget.nativeElement.offsetHeight - 340) + 'px' }
      },
      notdo: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '200px',
          '120px', '120px', '120px', '150px', '120px', '120px', '120px', '140px',
          '120px', '150px', '120px'],
        nzScroll: { x: '2510px', y: (this.dfcModelTarget.nativeElement.offsetHeight - 340) + 'px' }
      }
    };
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
    this.route.params.subscribe(r => {
      if (r['Plant'] && r['Product'] && r['ProjectNameID']) {
        this.plantSelectValue = [r['Plant']];
        this.changePlant();
        this.modelTypeSelectValue = [r['Product']];
        this.changeModelType();
        this.projectNameProfileServer.findById(r['ProjectNameID'], { include: { relation: 'projectCodeProfile' } }).subscribe(async proName => {
          this.modelNameSelectValue.push({ Value: proName['ProjectNameID'], Label: proName['ProjectName'] });
          this.listOfModelNameSelectOption = this.modelNameSelectValue;
          this.modelFamilySelectValue.push(proName['projectCodeProfile']);
          this.basicServer.find({ where: { projectNameId: r['ProjectNameID'] } }).subscribe(model => {
            this.groupModel.groupModelAndModelValue = [model[0]['modelId']];
            this.groupModel.groupModelAndModelSelectOption.push({ modelName: model[0]['modelName'], modelId: model[0]['modelId'] });
            this.queryFirstEchart();
          });
        });
      }
    });

    this.route.params.subscribe(r => {
      if (r.stageID && r.process) {
        this.targetHoursFlag = false;
        this.stageID = r.stageID;
        this.process = r.process;
        this.processTarget = this.ProcessMapping[r.process];
        this.querySecondData();
      } else if (r.modelID) {
        this.basicServer.findById(r.modelID, { include: { 'projectNameProfile': 'projectCodeProfile' } }).subscribe(
          (result: BasicModel) => {
            const selectiont = { Label: result.projectNameProfile.ProjectName, Value: result.projectNameProfile.ProjectNameID, ProCode: result.projectNameProfile.projectCodeProfile.ProjectCodeID };
            this.modelFamilySelectFlag = false;
            this.cFlowSelectFlag = false;
            this.modelFamilySelectValue = [result.projectNameProfile.projectCodeProfile];
            this.listOfModelNameSelectOption = [selectiont];
            this.modelTypeSelectValue = result.projectNameProfile.projectCodeProfile.ModelType;
            this.modelNameSelectValue = [selectiont];
            this.groupModel.isGroupModelNameListLoading = false;
            this.groupModel.groupModelAndModelSelectOption = [result];
            this.groupModel.groupModelAndModelValue = [result.modelId];
            this.cFlowSelectValue = ['RFQ'];
            this.queryFirstEchart();
          });
      }
    });
  }

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.targetHoursService.getBU(this.plantSelectValue, bu).then(datas => {
        return datas;
      });
    };
    const buList$: Observable<string[]> = this.queryBUSelect.select.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getBUList));
    buList$.pipe(
      map(
        (datas: any) => {
          this.queryBUSelect.select.selectList = datas.filter(data => {
            return !(!data);
          });
          this.queryBUSelect.select.isLoading = false;
          return of(null);
        }
      ),
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            this.queryBUSelect.value,
            [],
            this.modelTypeSelectValue,
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData) => {
          this.listOfModelNameSelectOption = resData;
        }
      )
    ).subscribe();
  }

  buSearch(value: string) {
    this.cFlowSelectFlag = true;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.dfcCommonService.filterProjectName(
      this.queryBUSelect.value,
      [],
      this.modelTypeSelectValue,
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
        }
      )
    ).subscribe();
  }

  // 初始化 客戶
  initCustomSelect() {
    const getCustomList = (custom: string) => {
      return this.targetHoursService.getCustom(this.plantSelectValue, this.queryBUSelect.value, custom).then(datas => {
        return datas;
      });
    };
    const getCustomList$: Observable<string[]> = this.queryCustomSelect.select.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));
    getCustomList$.pipe(
      map(
        (datas: any) => {
          this.queryCustomSelect.select.selectList = datas.filter(data => {
            return !(!data);
          });
          this.queryCustomSelect.select.isLoading = false;
          return of(null);
        }
      ),
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            this.queryBUSelect.value,
            this.queryCustomSelect.value,
            this.modelTypeSelectValue,
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData) => {
          this.listOfModelNameSelectOption = resData;
        }
      )
    ).subscribe();
  }

  customSearch(value: string) {
    this.cFlowSelectFlag = true;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.dfcCommonService.filterProjectName(
      this.queryBUSelect.value,
      this.queryCustomSelect.value,
      this.modelTypeSelectValue,
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
        }
      )
    ).subscribe();
  }

  // 初始化製程
  async initProcess() {
    this.ProcessMapping = await this.processApi.find({}).toPromise().then(datas => {
      return datas.reduce((p, t) => {
        p[t['ProcessCode']] = t['Name'];
        return p;
      }, {});
    });
  }

  // 獲取member成員列表
  addProMember1() {
    this.sendMode.member = []; // 清空选择框中的值
    const getMemberList = (name: string) => {
      return this.targetHoursService.sendIEMember(name, this.proCodeID);
    };
    const optionAddMemberList$: Observable<string[]> = this.memberSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getMemberList));
    optionAddMemberList$.subscribe(data => {
      this.sendMode.memberOption1 = data;
      this.isMemberOptionLoading = false;
    });
  }

  onMemberSearch1(value: string): void {
    this.isMemberOptionLoading = true;
    this.memberSearchChange$.next(value);
  }

  changeSendMember() {
    this.targetHoursService.sendSupervisor((!!this.sendMode.member[0] ? this.sendMode.member[0] : localStorage.getItem('$DFI$userID'))).then(data => {
      if (!!data) {
        this.sendMode.member[1] = data['Value'];
        this.sendMode.memberOption2.splice(0, 0, data);
      }
    });
  }

  // 獲取member成員列表
  addProMember2() {
    this.sendMode.member = []; // 清空选择框中的值
    const getMemberList = (name: string) => {
      return this.targetHoursService.sendIEMember(name, this.proCodeID);
    };
    const optionAddMemberList$: Observable<string[]> = this.memberSearchChange2$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getMemberList));
    optionAddMemberList$.subscribe(data => {
      this.sendMode.memberOption2 = data;
      this.isMemberOptionLoading = false;
    });
  }

  onMemberSearch2(value: string): void {
    this.isMemberOptionLoading = true;
    this.memberSearchChange2$.next(value);
  }

  getSendFlag() {
    this.targetOperationSignApi.find({ where: { stageID: this.stageID, process: this.process } }).subscribe(data => {
      const signIDs = [];
      debugger;
      if (data) {
        data.forEach(r => {
          signIDs.push(r['signID']);
        });
        this.workflowApi.find({ where: { id: { inq: signIDs } } }).subscribe(res => {
          for (let index = 0; index < res.length; index++) {
            if (!res[index]['status'] || res[index]['status'] === 1) { // 当签核状态为签核中或者签核完成时，禁用送签按钮
              this.sendFlag = true;
              return;
            }
          };
        });
      } else {
        this.sendFlag = false;
      }
    });
  }

  async clickSend() {
    if (!this.targetHoursService.checkBomCost(this.secondQueryDatas)) {
      this.message.create('error', this.trans['unfilledBOMCost']);
      return;
    }
    this.isSendSignVisible = true;
  }

  async sendSelect() {
    const signDefaultMember = await this.targetHoursService.sendMember(this.process, this.proCodeID);
    if (!!signDefaultMember) { // 若有默认 的 送签人信息 则向list中添加此信息
      if (signDefaultMember['flag']) {
        this.sendMode.workflowMappingID = signDefaultMember['data'][0]['workflowFormMappingId'];
        const firstPicIDs = signDefaultMember['data'][0]['picId'].split(',');
        for (let index = 0; index < firstPicIDs.length; index++) {
          const picID = firstPicIDs[index];
          const member = await this.targetHoursService.getMember(picID);
          if (!!member) {
            this.sendMode.memberOption1.splice(0, 0, member);
          }
        }
        this.sendMode.member[0] = firstPicIDs[0];
        const secondPicIDs = signDefaultMember['data'][1]['picId'].split(',');
        for (let index = 0; index < secondPicIDs.length; index++) {
          const picID = secondPicIDs[index];
          const member = await this.targetHoursService.getMember(picID);
          if (!!member) {
            this.sendMode.memberOption2.splice(0, 0, member);
          }
        }
        this.sendMode.member[1] = secondPicIDs[0];
        this.changeSendMember();
      } else {
        this.sendMode.workflowMappingID = signDefaultMember['data']['id'];
      }
    }
  }

  async sendButton() {
    this.sendFlag = true;
    const list = [];
    list.push({ empID: this.sendMode.member[0], role: 'IE' });
    list.push({ empID: this.sendMode.member[1], role: 'SECTION' });
    const WorkflowData = await this.workflowApi.CreateNewSigningFlow(this.sendMode.description, list, this.sendMode.workflowMappingID).toPromise();
    const query = {
      stageID: this.stageID,
      process: this.process,
      signID: WorkflowData.data.id,
      sender: localStorage.getItem('$DFI$userID'),
      date: new Date()
    };
    const targetOperationSignData = await this.targetOperationSignApi.patchOrCreate(query).toPromise();
    // 修改狀態
    const routParam = '?signID=' + WorkflowData.data.id + '&formID=' + targetOperationSignData['id'] +
      '&proName=' + this.proNameID + '&stageID=' + this.stageID + '&process=' + this.processTarget + '&processCode=' + this.process;
    this.workflowDFiApi.patchAttributes(WorkflowData['data']['id'], {
      'status': 0,
      'workflowFormMappingId': this.sendMode.workflowMappingID,
      'routingParameter': routParam
    }).subscribe(data => {
      this.sendMode.isComplete = true;
      this.message.create('success', 'Successfully sent!');
      this.cancelSendSign();
    },
      error => {
        this.sendFlag = false;
      }
    );
  }

  // by Pass
  async clickPass() {
    this.sendFlag = true;
    if (!this.targetHoursService.checkBomCost(this.secondQueryDatas)) {
      this.message.create('error', this.trans['unfilledBOMCost']);
      return;
    }
    const WorkflowData = await this.workflowApi.CreateNewSigningFlow('DFC 目標工時送簽 by Pass', [{ empID: localStorage.getItem('$DFI$userID'), role: localStorage.getItem('$DFI$userRole') }], this.sendMode.workflowMappingID).toPromise();
    // 修改狀態
    this.workflowDFiApi.patchAttributes(WorkflowData['data']['id'], {
      'status': 1
    }).subscribe(data => console.log(data), error => {
      this.sendFlag = false;
    }
    );
    const query = {
      stageID: this.stageID,
      process: this.process,
      signID: WorkflowData.data.id,
      sender: localStorage.getItem('$DFI$userID'),
      date: new Date()
    };
    const targetOperationSignData = await this.targetOperationSignApi.patchOrCreate(query).toPromise();
    this.sendMode.isComplete = true;
    this.message.create('success', 'Successfully sent!');
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.listOfPlantSelectOption = data);
    // 对厂别自动带入本厂的标签
    this.plantSelectValue = [];
    this.plantSelectValue.push(localStorage.getItem('DFC_Plant'));
    this.changePlant();
  }

  initModelTypeSelect() {
    this.listOfModelTypeSelectOption = []; // 清空选择框中的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.listOfModelTypeSelectOption = datas;
    });
  }

  // 廠別下拉框選中改變后, 查詢出 產品
  changePlant() {
    this.modelNameSelectFlag = this.plantSelectValue.length === 0;
    this.modelTypeSelectFlag = false;
    this.modelFamilySelectFlag = true;
    this.cFlowSelectFlag = true;
    this.queryBUSelect.value = [];
    this.queryCustomSelect.value = [];
    this.modelTypeSelectValue = [];
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.searchProjectNameList(this.plantSelectValue).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            this.queryBUSelect.value,
            this.queryCustomSelect.value,
            this.modelTypeSelectValue,
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData) => {
          this.listOfModelNameSelectOption = resData;
          this.queryBUSelect.select.isLoading = true;
          this.queryBUSelect.select.searchChange$.next('');
          this.queryCustomSelect.select.isLoading = true;
          this.queryCustomSelect.select.searchChange$.next('');
        }
      )).subscribe();
  }

  // 產品
  onModelTypeSearch(value: string): void {
    this.isModelTypeListLoading = true;
    this.modelTypeSearchChange$.next(value);
  }

  // 產品 下拉框選中改變后, 查詢出 ModelFamily
  changeModelType() {
    this.cFlowSelectFlag = true;
    this.modelFamilySelectValue = [];
    this.modelNameSelectValue = [];
    this.groupModel.groupModelAndModelValue = [];
    this.dfcCommonService.filterProjectName(
      this.queryBUSelect.value,
      [],
      this.modelTypeSelectValue,
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.listOfModelNameSelectOption = resData;
        }
      )
    ).subscribe();
  }

  // Model Family
  onModelFamilySearch(value: string): void {
    this.isModelFamilyListLoading = true;
    this.modelFamilySearchChange$.next(value);
  }

  // Model Name
  onModelNameSearch(value: string): void {
    this.isModelNameListLoading = true;
    this.dfcCommonService.filterProjectName(
      this.queryBUSelect.value,
      this.queryCustomSelect.value,
      this.modelTypeSelectValue,
      this.tempProjectNameList
    ).subscribe(
      (resData) => {
        this.listOfModelNameSelectOption = resData.filter(
          (item) => {
            return item.Label.includes(value);
          }
        );
        this.isModelNameListLoading = false;
      }
    );
  }

  // ModelName 下拉框選中改變后, 查詢出 C流程
  changeModelName(value) {
    if (value.length === 0) {
      this.cFlowSelectFlag = false;
      this.cFlowSelectValue = null;
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
    this.modelFamilySelectValue = [];
    if (this.modelNameSelectValue.length === 0) {
      return;
    }
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

  // 查询出第一页的Echart
  queryFirstEchart() {
    if (this.plantSelectValue.length === 0
      || this.modelTypeSelectValue.length === 0
      || this.modelNameSelectValue.length === 0
      || this.modelFamilySelectValue.length === 0) {
      this.message.create('error', this.trans['select-all']);
      return;
    }
    if (this.groupModel.groupModelAndModelValue.length === 0) {
      this.message.create('error', this.trans['select-modelName']);
      return;
    }
    this.cFlowSelectValue = ['RFQ'];
    // 清楚緩存，避免二次選擇遺留數據
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
                  { 'Stage': 'RFQ' }
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
                await this.modelOperationTimeServer.GetOpTime(StageData['StageID']).toPromise().then(rs => {
                  let index = -1;
                  if (rs['result'].length > 0) {
                    for (let k = 0; k < tempData.length; k++) {
                      const temp = tempData[k];
                      if (temp.stageID === rs['result'][0]['StageID']) {
                        index = k;
                        break;
                      }
                    }
                  }
                  rs['result'].forEach(data => {
                    const indexOfProcess = this.firstEchartData.processCode.indexOf(data['ProcessCode']);
                    tempData[index].data[indexOfProcess] = parseFloat(data['CostTime'].toFixed(2));
                  });
                  if (index > -1) {
                    let total = 0;
                    for (let tIndex = 0; tIndex < this.firstEchartData.processCode.length; tIndex++) {
                      total += (tempData[index].data[tIndex]);
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
                id: ProNameData['modelName'] + '-' + 'RFQ',
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
          this.maxTotal = maxTotal;
          this.getOptionsFirst(tempData, maxTotal);
        })).subscribe();
  }

  // 第一頁的 echart 繪製
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

  async onChartEvent(event: any, type: string) {
    if (event.name === 'Total') {
      return;
    }
    // seriesId
    const seriesIds = event['seriesId'].split('-');
    if (!seriesIds.includes('RFQ')) {
      return;
    }
    this.processTarget = event['name'];
    this.stageID = this.optionsFirst['series'][event['seriesIndex']]['stageID'];
    if (this.stageID === -1) {
      this.message.create('error', this.trans['model-stage']);
      return;
    }
    this.proCodeID = this.optionsFirst['series'][event['seriesIndex']]['proCodeID'];
    this.process = this.optionsFirst['series'][event['seriesIndex']]['processCode'][event['dataIndex']];
    this.proName = event['seriesName'];
    this.targetHoursFlag = false;
    this.querySecondData();
    // by Pass条件
    this.isPassFlag = false; // 默认为 false
    if (event['value'] === 0 || event['value'] === this.maxTotal) { // 如果值为 0 或者為 maxTotal 则 显示此标签
      this.isPassFlag = true;
    }
    this.stageServer.findById(this.stageID, { 'include': { 'basicModel': 'projectNameProfile' } }).toPromise().then(stageData => {
      if (stageData['basicModel']['projectNameProfile']['IsRfq'] || !!stageData['basicModel']['projectNameProfile']['RfqProjectName']) {
        // 判斷status是1還是0，繪製相應數據
        this.targetOperationSignApi.find({
          'where': {
            'and': [
              { 'stageID': this.stageID },
              { 'process': this.process }
            ]
          },
          'fields': ['id', 'signID'],
          'order': 'id desc'
        }).subscribe((res: { id: number, status: number, signID: number }[]) => {
          if (res.length > 0) {
            this.targetOperationSignId = res[0].id;

            this.workflowApi.findById(res[0].signID).subscribe(workflowData => {
              if (workflowData['status'] === 2) {
                this.sendMode.isComplete = false;
              } else {
                this.sendMode.isComplete = true;
              }
            }, error => console.log(error));
          } else {
            this.sendMode.isComplete = false;
          }
        });
      } else {
        this.message.create('error', this.trans['confirmMapping']);
        this.sendMode.isComplete = true;
      }
    }).catch(error => {
      this.sendMode.isComplete = false;
    });
    // 送签下拉框中的值
    await this.addProMember1();
    await this.addProMember2();
    await this.getSendFlag();
    this.sendSelect();
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
    this.stageServer.findById(this.stageID, { include: 'basicModel' }).subscribe((stage: StageInterface) => {
      this.projectNameProfileServer.findById(stage.basicModel.projectNameId).subscribe(proName => {
        this.proCodeID = proName['ProjectCodeID'];
        this.proCode = proName['ProjectCode'];
        this.proName = stage.basicModel.modelName;
        this.proNameID = proName['ProjectNameID'];
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
                    {
                      'or': [
                        { 'Plant': localStorage.getItem('DFC_Plant') },
                        { 'Site': 'WHQ' }
                      ]
                    }
                  ]
                }
              ]
            }
          }).subscribe(members => {
            this.memberList = members;
            // 查詢出現在第二頁中需要的數據
            this.targetOperationsServer.TargetOperation(this.stageID, this.process, true).subscribe(rs => {
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
                  ModifiedMOH: rsData['ModifiedMOH'],
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
    const x = [];
    this.SecondEchartParam.xAxisData.forEach(element => {
      let ele = element.split('（')[0];
      ele = ele.split('(')[0];
      x.push(ele);
    });
    this.optionsSecond = {
      title: {
        text: this.proName + '\t\t' + this.ProcessMapping[this.process] + this.trans['analysisPie'],
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
    this.actionEnabled = true;
    this.isEditSaveVisible = false;
    this.editCache = {};
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
            ModifiedMOH: table.ModifiedMOH,
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
    this.updateEditCache();
    this.initTargetFactorDetailSelect();
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {}; // 清理缓存状态
    this.dataSet.forEach(item => {
      if (!this.editCache[item.ModelOperationID]) {
        this.editCache[item.ModelOperationID] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // 頁面頁碼改變時的回調函數
  tablePageIndexChange(value) {
    this.tablePageIndex = value;
  }

  // 表格编辑事件
  startEdit(key: string, index: number) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.editrow = key;
    this.picSelect();
    this.editIndex = (this.tablePageIndex - 1) * 10 + index;
    this.editFlag = true;
    this.nzWidthConfig = this.nzWidthConfigs.edit.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.edit.nzScroll;
    this.editChange = 'Y';
    // 影響MOH
    this.ModifiedMOHEditCache = (!this.editCache[key].data.ModifiedMOH ? this.editCache[key].data.gapCost : this.editCache[key].data.ModifiedMOH);
  }

  saveEdit(key: string) {
    if (!this.editCache[key].data['Comment']) {
      this.message.create('error', this.trans['fill-discuss-result']);
      return;
    }
    if (!this.editCache[key].data['PICID']) {
      this.message.create('error', this.trans['select-pic']);
      return;
    }
    let updataData = {};
    if (this.editChange === 'Y') {
      if (!this.editCache[key].data['TargetFactorDetailCode']) {
        this.message.create('error', this.trans['select-target-design']);
        return;
      }
      if (this.editCache[key].data['TargetCount'] == null) {
        this.message.create('error', this.trans['fill-target-quantity']);
        return;
      }
      if (this.editCache[key].data['TargetCount'].search(/^\d+$/) < 0) {
        this.message.create('error', this.trans['fill-positive-integer']);
        return;
      }
      if (this.editCache[key].data['Status'] === null) {
        this.message.create('error', this.trans['select-status']);
        return;
      }
      if (!this.editCache[key].data['DueDay']) {
        this.message.create('error', this.trans['select-dueday']);
        return;
      }
      updataData = {
        ModelOperationID: this.editCache[key].data['ModelOperationID'],
        Comment: this.editCache[key].data['Comment'],
        TargetFactorDetailCode: this.editCache[key].data['TargetFactorDetailCode'],
        PICID: this.editCache[key].data['PICID'],
        TargetCount: this.editCache[key].data['TargetCount'],
        Status: this.editCache[key].data['Status'],
        DueDay: this.editCache[key].data['DueDay'],
        BOMCost: this.editCache[key].data['BOMCost']
      };
    } else {
      updataData = {
        ModelOperationID: this.editCache[key].data['ModelOperationID'],
        Comment: this.editCache[key].data['Comment'],
        TargetFactorDetailCode: this.editCache[key].data['FactorDetailIDActual'],
        PICID: this.editCache[key].data['PICID'],
        TargetCount: this.editCache[key].data['Count'],
        Status: 2,
        DueDay: this.defultDueDay,
        BOMCost: this.editCache[key].data['BOMCost']
      };
    }
    const logDatas = {
      Old: this.dataSet[this.editIndex],
      New: updataData
    };
    this.cancelEdit(key);
    if (!!this.ModifiedMOHEditCache) {
      updataData['ModifiedMOH'] = this.ModifiedMOHEditCache;
    }
    this.targetOperationsServer.patchOrCreate(updataData).subscribe(rs => {
      this.saveFlag = true;
      this.querySecondData();
      this.dataSet[this.editIndex]['ModelOperationID'] = rs.ModelOperationID;
      this.dataSet[this.editIndex]['Comment'] = rs.Comment;
      this.dataSet[this.editIndex]['TargetFactorDetailCode'] = rs.TargetFactorDetailCode;
      if (this.listOfTargetFactorDetailSelectOption[this.dataSet[this.editIndex]['FactorID']]) {
        this.listOfTargetFactorDetailSelectOption[this.dataSet[this.editIndex]['FactorID']].forEach(list => {
          if (list.Value === rs.TargetFactorDetailCode) {
            this.dataSet[this.editIndex]['TargetFactorDetail'] = list.Label;
          }
        });
      }
      this.dataSet[this.editIndex]['ModifiedMOH'] = rs.ModifiedMOH;
      this.dataSet[this.editIndex]['BOMCost'] = rs.BOMCost;
      this.dataSet[this.editIndex]['PICID'] = rs.PICID;
      this.dataSet[this.editIndex]['TargetCount'] = rs.TargetCount;
      this.dataSet[this.editIndex]['Status'] = rs.Status;
      this.dataSet[this.editIndex]['DueDay'] = (rs.DueDay === null) ? '' : new Date(rs.DueDay).toLocaleDateString();
      if (this.listOfPICSelectOption.find(d => d['EmpID'] === rs.PICID)) {
        this.dataSet[this.editIndex]['PICName'] = this.listOfPICSelectOption
          .find(d => d['EmpID'] === rs.PICID)['EName'];
      }
    }, error => console.log(error));
    // 將操作信息存入緩存
    const logMsg = 'update\t廠別: ' + this.plantSelectValue + '\t' + localStorage.getItem('$DFI$userName') +
      '\n廠別: ' + logDatas.Old.Plant + '\tModelOperationID: ' + logDatas.Old.ModelOperationID +
      '\t物料: ' + logDatas.Old.Material + '\t因素: ' + logDatas.Old.Factor +
      '\t因素細項: ' + logDatas.Old.FactorDetailActural + '\t數量: ' + logDatas.Old.Count +
      '\n變更信息, 如下:\n' +
      '\t討論結果: ' + logDatas.Old.Comment +
      ' -> ' + logDatas.New['Comment'] +
      '\tBom Cost差異: ' + logDatas.Old.BOMCost +
      ' -> ' + logDatas.New['BOMCost'] +
      '\t目標設計Code: ' + logDatas.Old.TargetFactorDetailCode +
      ' -> ' + logDatas.New['TargetFactorDetailCode'] +
      '\t目標數量: ' + logDatas.Old.TargetCount + ' -> ' + logDatas.New['TargetCount'] +
      '\tPIC: ' + logDatas.Old.PICID + ' -> ' + logDatas.New['PICID'] +
      '\tStatus: ' + logDatas.Old.Status + ' -> ' + logDatas.New['Status'] +
      '\tDueDay: ' + logDatas.Old.DueDay + ' -> ' + logDatas.New['DueDay'];
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '目標工時生成',
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
    this.editFlag = false;
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
    this.editChange = 'Y';
  }

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

  upload(file) {
    if (!this.cFlowSelectValue) {
      this.message.create('error', this.trans['must-select-C']);
    } else {
      this.showLoading = true;
      this.fileService.postDFCFile(file, 'target')
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
    this.fileService.downloadTargetOperation(this.stageID, this.process);
    // 將操作信息存入緩存
    const logMsg = 'download\t廠別: ' + this.plantSelectValue + '\t' + localStorage.getItem('$DFI$userName');
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '目標工時生成',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }

  sendEmail() {
    // stageID
    this.sendEmailLoading = true;
    this.emailModelServer.SendOpTimeModifiedComplete(this.stageID, this.process).subscribe(rs => {
      setTimeout(() => {
        this.sendEmailLoading = false;
      }, 60000);
    }, error => {
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

  // 送簽相關
  cancelSendSign() {
    this.isSendSignVisible = false;
    this.sendMode.member = ['', ''];
    this.sendMode.description = '';
  }

  // 撈全部的projectName
  searchProjectNameList(plant) {
    return this.dfcCommonService.getProjectName(plant, '', '', '', '', true).pipe(
      map(
        (res) => {
          this.tempProjectNameList = res;
        }
      )
    );
  }

  // 增加 删除目标工时的 功能
  Delete(key: string) {
    this.targetOperationsServer.deleteById(this.editCache[key].data['ModelOperationID']).subscribe(d => {
      this.message.create('success', 'Successfully deleted！');
      this.saveFlag = false;
      this.cancelEdit(key);
      this.querySecondData();
    }, error => {
      this.message.create('error', 'Failed to delete, ' + error);
      this.saveFlag = false;
      this.cancelEdit(key);
      this.querySecondData();
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
  ModifiedMOH: number;
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
