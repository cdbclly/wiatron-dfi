import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import {
  StandardOperationTimeApi, MemberApi, WorkflowApi as WorkflowDFCApi,
  StandardOperationSignApi, StandardOperationSignContentApi, TargetOperationSignApi
} from '@service/dfc_sdk/sdk';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { FileService } from '@service/file.service';
import { NzMessageService } from 'ng-zorro-antd';
import { OperationLogApi } from '@service/dfc_sdk/sdk/services/custom/OperationLog';
import { ClsDfcQueryStyle, ClsDfcQuerySelect } from 'app/shared/dfc-common';
import { StandartDocumentService, DFCStandartOperationTimeTableData, ClsDfcStandartDocSelect } from './standart-document.service';
import {
  WorkflowApi as WorkflowDFiApi
} from '@service/dfi-sdk';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-standart-document',
  templateUrl: './standart-document.component.html',
  styleUrls: ['./standart-document.component.scss']
})
export class StandartDocumentComponent implements OnInit {
  buttonshow = false;
  allChecked = false;
  disabledDeleteButton = true;
  checkedNumber = 0;
  displayData: Array<DFCStandartOperationTimeTableData> = [];
  dataSet = []; // 表格数据暂存
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editrow = ''; // 记录编辑状态时的表格行序号, 方便失去焦点时做判断
  editIndex: number; // 记录当前编辑的表格行数
  // 編輯后失去焦點 聯合判斷, inputBlur = true && inputClick = false 時 彈出儲存框
  inputBlur = false; // 記錄input編輯框是否 失去焦點, 默認為false
  inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
  isEditSaveVisible = false; // 储存框是否出现
  dataSend = [];
  process: string;
  isDeleteVisible = false; // 刪除對話框是否出現
  isAfterDeleteVisible = false; // 刪除后對話框是否出現
  indeterminate = false;
  addFactorDetailIDs;
  // 查詢時的下拉框設定
  // 廠別相關
  plantSelectValue: string; // 下拉框选值
  listOfPlantSelectOption = []; // 下拉框内容
  // 產品相關
  modelSelectValue: string; // 下拉框选值
  listOfModelSelectOption = []; // 下拉框内容
  // 製程相關
  processSelectValue: string; // 下拉框选值
  listOfProcessSelectOption = []; // 下拉框内容

  // 查詢的其他input框內容
  OperationCode: string; // 識別碼
  Material: string; // 物料
  Factor: string; // 因素
  Action: string; // 動作

  // 新增
  isAddDataVisible = false; // 新增彈框是否出現

  addPlantList = []; // 新增厂别时, 下拉框中的数值
  addPlantSelectValue: string; // 新增厂别时, 下拉框选中的

  addProjectFlag = true; // 新增产品时, 下拉框是否禁用
  addProjectList = []; // 新增产品时, 下拉框中的数值
  addProjectSelectValue: string; // 新增产品时, 下拉框选中的值
  addProjectSearchChange$ = new BehaviorSubject('');
  isAddProjectSelectLoading = false;

  addProcessFlag = true; // 新增製程时, 下拉框是否禁用
  addProcessPlus = false; // 新增製程時, 是否 在 下拉框外新增值
  addProcessValueCache: string; // 新增製程時, 在下拉框外新增值  暫存
  addProcessList = []; // 新增製程時, 下拉框中的数值
  addProcessListCache = []; // 新增製程時, 下拉框中的数值 暫存原始下拉框
  addProcessSelectValue: string; // 新增製程時, 下拉框选中的值
  addProcessSearchChange$ = new BehaviorSubject('');
  isAddProcessSelectLoading = false;

  addModuleFlag = true; // 新增模組时, 下拉框是否禁用
  addModulePlus = false; // 新增模組时, 是否 在 下拉框外新增值
  addModuleValueCache: string; // 新增模組时, 在下拉框外新增值  暫存
  addModuleList = []; // 新增模組时, 下拉框中的数值
  addModuleListCache = []; // 新增模組时, 下拉框中的数值 暫存原始下拉框
  addModuleSelectValue: string; // 新增模組时, 下拉框选中的值
  addModuleSearchChange$ = new BehaviorSubject('');
  isAddModuleSelectLoading = false;

  addMaterialFlag = true; // 新增物料时, 下拉框是否禁用
  addMaterialPlus = false; // 新增物料时, 是否 在 下拉框外新增值
  addMaterialValueCache: string; // 新增物料时, 在下拉框外新增值  暫存
  addMaterialList = []; // 新增物料时, 下拉框中的数值
  addMaterialListCache = []; // 新增物料时, 下拉框中的数值 暫存原始下拉框
  addMaterialSelectValue: string; // 新增物料时, 下拉框选中的值
  addMaterialSearchChange$ = new BehaviorSubject('');
  isAddMaterialSelectLoading = false;

  addFactorFlag = true; // 新增因素时, 下拉框是否禁用
  addFactorPlus = false; // 新增因素时, 是否 在 下拉框外新增值
  addFactorValueCache: string; // 新增因素时, 在下拉框外新增值  暫存
  addFactorList = []; // 新增因素时, 下拉框中的数值
  addFactorListCache = []; // 新增因素时, 下拉框中的数值 暫存原始下拉框
  addFactorSelectValue: string; // 新增因素时, 下拉框选中的值
  addFactorSearchChange$ = new BehaviorSubject('');
  isAddFactorSelectLoading = false;

  addFactorDetailFlag = true; // 新增因素細項时, 下拉框是否禁用
  addFactorDetailPlus = false; // 新增因素細項时, 是否 在 下拉框外新增值
  addFactorDetailValueCache: string; // 新增因素細項时, 在下拉框外新增值  暫存
  addFactorDetailList = []; // 新增因素細項时, 下拉框中的数值
  addFactorDetailListCache = []; // 新增因素細項时, 下拉框中的数值 暫存原始下拉框
  addFactorDetailSelectValue: string; // 新增因素細項时, 下拉框选中的值
  addFactorDetailSearchChange$ = new BehaviorSubject('');
  isAddFactorDetailSelectLoading = false;

  addActionFlag = true; // 新增動作时, 下拉框是否禁用
  addActionPlus = false; // 新增動作时, 是否 在 下拉框外新增值
  addActionValueCache: string; // 新增動作时, 在下拉框外新增值  暫存
  addActionList = []; // 新增動作时, 下拉框中的数值
  addActionListCache = []; // 新增動作时, 下拉框中的数值 暫存原始下拉框
  addActionSelectValue: string; // 新增動作时, 下拉框选中的值
  addActionSearchChange$ = new BehaviorSubject('');
  isAddActionSelectLoading = false;

  addCostTimeFlag = true; // 新增工時时, 輸入框是否禁用
  addCostTimeValue: string; // 新增動作时, 輸入框中的值

  addViewData: {}[]; // 新增时查询出来的View中的值 存入此项, 避免多次查询

  showLoading = false;

  @ViewChild('DFCModelStandart') dfcModelStandart: ElementRef;
  nzWidthConfig = ['60px', '80px', '150px', '100px', '200px', '150px', '200px', '80px', '100px', '90px'];
  nzScroll: {} = { x: '1210px' };

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['StandardOperation']; // 页面上的用户权限
  sendSignFlag = false;
  editType: string;

  // --- start 修改 ---
  // 下拉框類設定
  queryStyle: {
    operationCode: ClsDfcQueryStyle,
    modelType: ClsDfcQueryStyle,
    process: ClsDfcQueryStyle,
    material: ClsDfcQueryStyle,
    factor: ClsDfcQueryStyle,
    action: ClsDfcQueryStyle
  } = {
      operationCode: {
        type: 'input',
        style: { width: '200px' },
        red: false,
        label: '識別碼'
      },
      modelType: {
        type: 'select',
        style: { width: '80px' },
        red: true,
        label: '產品',
        selectType: 'simple'
      },
      process: {
        type: 'select',
        style: { width: '150px' },
        red: true,
        label: '製程',
        selectType: 'simple'
      },
      material: {
        type: 'input',
        style: { width: '200px' },
        red: false,
        label: '物料'
      },
      factor: {
        type: 'input',
        style: { width: '200px' },
        red: false,
        label: '因素'
      },
      action: {
        type: 'input',
        style: { width: '80px' },
        red: false,
        label: '動作'
      }
    };
  querySelect: {
    modelType: ClsDfcQuerySelect,
    process: ClsDfcQuerySelect
  } = {
      modelType: {
        selectList: []
      },
      process: {
        selectList: []
      }
    };
  queryValue: ClsDfcStandartDocSelect = { operationCode: '', modelType: '', process: '', material: '', factor: '', action: '' };

  standardOperationSignContent = []; // 購物車 {action: 'New / ChangeName / ModifyTime', key: {存的數據}, value: 改變的值}
  isSendSignVisible = false;
  sendMode = {
    description: '',
    workflowMappingID: '',
    memberList: {}
  };
  isSignConfigFlag = false;
  DFiLeaderFlag = false;
  titleText = '新增項目';
  holderProductText = '選擇產品';
  holderProcessText = '選擇製程';
  holderProcessTextAdd = '新增製程';
  holderModuleText = '選擇製程';
  holderModuleTextAdd = '新增製程';
  holderMaterialText = '選擇物料';
  holderMaterialTextAdd = '新增物料';
  holderFactorText = '選擇因素';
  holderFactorTextAdd = '新增因素';
  holderFactorDetailsText = '選擇因素細項';
  holderFactorDetailsTextAdd = '新增因素細項';
  holderActionText = '選擇動作';
  holderActionTextAdd = '新增動作';
  holderWorkhourText = '工时';
  sendSign = '送簽';
  isSendFlag = false; // 默认可以送签

  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  // I18N
  destroy$ = new Subject();
  trans = {};
  constructor(
    private standardOperationTimeServer: StandardOperationTimeApi,
    private message: NzMessageService,
    private fileService: FileService,
    private operationLogServer: OperationLogApi,
    private standartDocumentService: StandartDocumentService,
    private workflowApi: WorkflowDFCApi,
    private workflowDFiApi: WorkflowDFiApi,
    private standardOperationSignApi: StandardOperationSignApi,
    private standardOperationSignContentApi: StandardOperationSignContentApi,
    private memberServer: MemberApi,
    private dfcSelectService: DfcSelectNewService,
    private targetOperationSignApi: TargetOperationSignApi,
    private translate: TranslateService
  ) {
    this.translate.get(['dfc.forecast.identification-code', 'dfq.dfq-product', 'mrr.nudd-process',
      'dfq.dfq-material', 'dfc.forecast.factor', 'dfc.forecast.action', 'dfc.forecast.createItem',
      'dfc.forecast.select-product', 'dfc.forecast.select-process', 'dfc.forecast.create-process',
      'dfc.forecast.select-module', 'dfc.forecast.create-module', 'dfc.forecast.select-material',
      'dfc.forecast.create-material', 'dfc.forecast.select-factor', 'dfc.forecast.create-factor',
      'dfc.forecast.select-factor-details', 'dfc.forecast.create-factor-details', 'dfc.forecast.select-action',
      'dfc.forecast.create-action', 'dfc.forecast.workhour', 'dfq.dfq-send-sign', 'dfc.forecast.query-param', 'dfc.forecast.must-fill-workhour']).subscribe(res => {
        this.queryStyle.operationCode.label = res['dfc.forecast.identification-code'];
        this.queryStyle.modelType.label = res['dfq.dfq-product'];
        this.queryStyle.process.label = res['mrr.nudd-process'];
        this.queryStyle.material.label = res['dfq.dfq-material'];
        this.queryStyle.factor.label = res['dfc.forecast.factor'];
        this.queryStyle.action.label = res['dfc.forecast.action'];
        this.titleText = res['dfc.forecast.createItem'];
        this.holderProductText = res['dfc.forecast.select-product'];
        this.holderProcessText = res['dfc.forecast.select-process'];
        this.holderProcessTextAdd = res['dfc.forecast.create-process'];
        this.holderModuleText = res['dfc.forecast.select-module'];
        this.holderModuleTextAdd = res['dfc.forecast.create-module'];
        this.holderMaterialText = res['dfc.forecast.select-material'];
        this.holderMaterialTextAdd = res['dfc.forecast.create-material'];
        this.holderFactorText = res['dfc.forecast.select-factor'];
        this.holderFactorTextAdd = res['dfc.forecast.create-factor'];
        this.holderFactorDetailsText = res['dfc.forecast.select-factor-details'];
        this.holderFactorDetailsTextAdd = res['dfc.forecast.create-factor-details'];
        this.holderActionText = res['dfc.forecast.select-action'];
        this.holderActionTextAdd = res['dfc.forecast.create-action'];
        this.holderWorkhourText = res['dfc.forecast.workhour'];
        this.sendSign = res['dfq.dfq-send-sign'];
        this.trans['query-param'] = res['dfc.forecast.query-param'];
        this.trans['must-fill-workhour'] = res['dfc.forecast.must-fill-workhour'];
      });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.forecast.identification-code', 'dfq.dfq-product', 'mrr.nudd-process',
        'dfq.dfq-material', 'dfc.forecast.factor', 'dfc.forecast.action', 'dfc.forecast.createItem',
        'dfc.forecast.select-product', 'dfc.forecast.select-process', 'dfc.forecast.create-process',
        'dfc.forecast.select-module', 'dfc.forecast.create-module', 'dfc.forecast.select-material',
        'dfc.forecast.create-material', 'dfc.forecast.select-factor', 'dfc.forecast.create-factor',
        'dfc.forecast.select-factor-details', 'dfc.forecast.select-action', 'dfc.forecast.create-action',
        'dfc.forecast.workhour', 'dfq.dfq-send-sign', 'dfc.forecast.query-param', 'dfc.forecast.must-fill-workhour']).subscribe(res => {
          this.queryStyle.operationCode.label = res['dfc.forecast.identification-code'];
          this.queryStyle.modelType.label = res['dfq.dfq-product'];
          this.queryStyle.process.label = res['mrr.nudd-process'];
          this.queryStyle.material.label = res['dfq.dfq-material'];
          this.queryStyle.factor.label = res['dfc.forecast.factor'];
          this.queryStyle.action.label = res['dfc.forecast.action'];
          this.titleText = res['dfc.forecast.createItem'];
          this.holderProductText = res['dfc.forecast.select-product'];
          this.holderProcessText = res['dfc.forecast.select-process'];
          this.holderProcessTextAdd = res['dfc.forecast.create-process'];
          this.holderModuleText = res['dfc.forecast.select-module'];
          this.holderModuleTextAdd = res['dfc.forecast.create-module'];
          this.holderMaterialText = res['dfc.forecast.select-material'];
          this.holderMaterialTextAdd = res['dfc.forecast.create-material'];
          this.holderFactorText = res['dfc.forecast.select-factor'];
          this.holderFactorTextAdd = res['dfc.forecast.create-factor'];
          this.holderFactorDetailsText = res['dfc.forecast.select-factor-details'];
          this.holderFactorDetailsTextAdd = res['dfc.forecast.create-factor-details'];
          this.holderActionText = res['dfc.forecast.select-action'];
          this.holderActionTextAdd = res['dfc.forecast.create-action'];
          this.holderWorkhourText = res['dfc.forecast.workhour'];
          this.sendSign = res['dfq.dfq-send-sign'];
          this.trans['query-param'] = res['dfc.forecast.query-param'];
          this.trans['must-fill-workhour'] = res['dfc.forecast.must-fill-workhour'];
        });
    });
  }

  ngOnInit() {
    this.initModelSelect(); // 初始化 產品 下拉框
    this.initProcessSelect(); // 初始化 製程 下拉框
    this.DFILeader();
    this.nzScroll = { x: '1210px', y: (this.dfcModelStandart.nativeElement.offsetHeight - 130) + 'px' };
  }

  modelTypeChange() {
    this.initProcessSelect();
  }

  // 初始化產品下拉框
  initModelSelect() {
    this.querySelect.modelType.selectList = []; // 清空选择框中的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.querySelect.modelType.selectList = datas;
    });
  }

  // 初始化 製程 下拉框
  initProcessSelect() {
    this.querySelect.process.selectList = []; // 清空选择框中的值
    this.standartDocumentService.getProcessSelect().subscribe(processMap => {
      this.standartDocumentService.getModelTypeProcessSetting(this.queryValue.modelType).subscribe(
        result => {
          const seq = ['D', 'DT', 'DP', 'LA', 'LT', 'LP', 'A', 'T', 'P'];
          const processArr = [];
          result.forEach(processes => {
            processes.processCode.split(',').forEach(process => {
              const index = seq.findIndex(x => x === process);
              if (processArr.indexOf(index) < 0) {
                processArr.push(index);
              }
            });
          });
          const sortedProcessArr = processArr.sort();
          sortedProcessArr.forEach(
            processIndex => {
              const processCode = seq[processIndex];
              const p = processMap.find(x => x.ProcessCode === processCode);
              this.querySelect.process.selectList.push({ Value: p['ProcessCode'], Label: p['Name'] });
            }
          );
        }
      );
    });
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.memberServer.findById(localStorage.getItem('$DFI$userID')).subscribe(data => {
      this.DFiLeaderFlag = data['DFILeader'];
    });
  }

  // 查詢表格數據
  query() {
    this.buttonshow = true;
    if ((!this.queryValue.modelType) && (!this.queryValue.process)) {
      this.message.create('error', this.trans['query-param']);
      return;
    }
    this.dataSet = [];
    this.standartDocumentService.queryData(this.queryValue).then(datas => {
      this.dataSet = datas;
      this.updateEditCache();
      this.refreshStatus();
    });
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {}; // 清理缓存状态
    this.dataSet.forEach(item => {
      if (!this.editCache[item.No]) {
        this.editCache[item.No] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // nzCurrentPageDataChange -- 當前頁面展示的回調函數
  currentPageDataChange($event: Array<DFCStandartOperationTimeTableData>) {
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
    this.displayData.forEach(data => data.Checked = value);
    this.refreshStatus();
  }

  // 表格编辑事件
  startEdit(key: string, index: number, type: string) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.editrow = key;
    this.editIndex = index;
    this.editType = type;
  }

  saveEdit(key: string) {
    this.inputClick = false;
    this.inputBlur = false;
    const updataID = this.editCache[key].data['OperationCode'];
    const updataData = {
      CostTime: this.editCache[key].data['CostTime']
    };
    const logData = {
      Old: this.dataSet[this.editIndex]['CostTime'],
      New: this.editCache[key].data['CostTime']
    };
    // 將操作信息存入緩存
    const tableData = this.dataSet.find(data => data['OperationCode'] === this.editCache[key].data['OperationCode']);
    if (this.editType === 'name') {
      this.standardOperationSignContent.push({
        'action': 'ChangeName',
        'key': {
          'FactorID': this.editCache[key].data['FactorID']
        },
        'value': this.editCache[key].data['FactorName'],
        'msg': '將識別碼[' + this.editCache[key].data['OperationCode'] + '] 的 因素: ' + tableData['FactorName'] + ', 修改為：' + this.editCache[key].data['FactorName']
      });
      this.dataSet[this.editIndex]['FactorName'] = this.editCache[key].data['FactorName'];
    } else {
      this.standardOperationSignContent.push({
        'action': 'ModifyTime',
        'key': {
          'operationCode': this.editCache[key].data['OperationCode']
        },
        'value': this.editCache[key].data['CostTime'],
        'msg': '將識別碼[' + this.editCache[key].data['OperationCode'] + '] 的工時: ' + tableData['CostTime'] + ', 修改為：' + this.editCache[key].data['CostTime']
      });
      this.dataSet[this.editIndex]['CostTime'] = this.editCache[key].data['CostTime'];
    }
    this.sendSignFlag = true;
    this.getSendFlag();
    this.cancelEdit(key);
  }

  // 失去焦点时, 弹出是否储存对话框
  onblurEdit(key: string) {
    this.inputBlur = true; // 記錄input編輯框是否 失去焦點, 默認為false
    this.inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
    setTimeout(() => {
      if ((!this.inputClick) && this.inputBlur) {
      }
    }, 500);
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
    this.isEditSaveVisible = false;
    this.editrow = '';
  }

  // 刪除相關事件
  operateDelete() {
    this.isDeleteVisible = true;
  }

  cancelDelete(event: EventEmitter<boolean>) {
    if (event) {
      this.dataSet.forEach(data => data.Checked = false);
      this.isDeleteVisible = false;
      this.refreshStatus();
    }
  }

  Delete(event: EventEmitter<boolean>) {
    const deleteIDs: string[] = [];
    this.dataSet.forEach(data => {
      if (data.Checked) {
        deleteIDs.push(data.OperationCode);
      }
    });
    if (event) {
      for (let i = 0; i < deleteIDs.length; i++) {
        if (i === (deleteIDs.length - 1)) {
          this.standardOperationTimeServer.deleteById(deleteIDs[i]).subscribe(rs => {
            this.initModelSelect(); // 初始化 產品 下拉框
            this.initProcessSelect(); // 初始化 製程 下拉框
            this.query();
            this.isDeleteVisible = false;
            this.isAfterDeleteVisible = true;
            setTimeout(() => {
              this.isAfterDeleteVisible = false;
            }, 1000);
          }, error => console.log('error:\n' + error));
        } else {
          this.standardOperationTimeServer.deleteById(deleteIDs[i]).subscribe(rs => { }, error => console.log('error:\n' + error));
        }
      }
      // 將操作信息存入緩存
      const logMsg = 'delete\t廠別: ' + localStorage.getItem('DFC_Plant') + '\t' + localStorage.getItem('$DFI$userName') +
        '\n刪除如下 OperationCode:\n' + deleteIDs.toString();
      this.operationLogServer.create({
        userID: localStorage.getItem('$DFI$userID'),
        APname: '工時標準文件維護',
        data: logMsg
      }).subscribe(rs => console.log(rs), error => console.log(error));
    }
  }

  OperationCodeChange() {
    this.modelSelectValue = this.OperationCode.substr(0, 2);
    this.processSelectValue = this.OperationCode.substr(2, 1);
  }

  // 新增相關事件
  operateAdd() {
    this.isAddDataVisible = true;
    this.addPlantSelectValue = 'test';
    // 清空下拉列表
    this.addProjectList = this.querySelect.modelType.selectList;
    this.addProcessList = this.querySelect.process.selectList;
    this.addProjectSelectValue = this.queryValue.modelType;
    this.addProcessSelectValue = this.queryValue.process;
    this.addModuleList = [];
    this.addMaterialList = [];
    this.addFactorList = [];
    this.addFactorDetailList = [];
    this.addActionList = [];
    this.standartDocumentService.addFile().subscribe(datas => {
      this.addViewData = datas;
      this.changeProcess();
    });
  }

  handleAddCancel() {
    this.isAddDataVisible = false;
    this.clearAdd();
  }

  handleAddSave() {
    if (!this.addCostTimeValue) {
      this.message.create('error', this.trans['must-fill-workhour']);
    }
    // 由簽核部分新增 {'modelType':'NB','process':'Ass'y','material':'mm','factor':'ff','factorDetail':'dd','module':'mmodule','action':'aa'}
    this.standardOperationSignContent.push({
      'action': 'New',
      'key': {
        'modelType': this.addProjectSelectValue,
        'process': this.addProcessSelectValue,
        'material': this.addMaterialSelectValue,
        'factor': this.addFactorSelectValue,
        'factorDetail': this.addFactorDetailSelectValue,
        'module': this.addModuleSelectValue,
        'action': this.addActionSelectValue
      },
      'value': this.addCostTimeValue,
      'msg': '新增標準工時[ 產品: ' + this.addProjectSelectValue +
        '製程: ' + this.addProcessSelectValue +
        '模組: ' + this.addModuleSelectValue +
        '物料: ' + this.addMaterialSelectValue +
        '因素: ' + this.addFactorSelectValue +
        '因素細項: ' + this.addFactorDetailSelectValue +
        '動作: ' + this.addActionSelectValue +
        '工時: ' + this.addCostTimeValue
    });
    this.sendSignFlag = true;
    this.handleAddCancel();
  }

  // 獲取MaterialCode編碼
  getMaterialCode(count: number): string {
    const Decade = count / 36;
    const TheUnit = count % 36;
    let decade: string;
    if ((Decade - 10) < 0) {
      decade = Decade + '';
    } else {
      decade = String.fromCharCode(65 + (Decade - 10));
    }
    let theUnit: string;
    if ((TheUnit - 10) < 0) {
      theUnit = TheUnit + '';
    } else {
      theUnit = String.fromCharCode(65 + (TheUnit - 10));
    }
    return decade + theUnit;
  }

  // 獲取ActionCode的編碼
  getActionCode(count: number): string {
    const Decade = count / 26;
    const TheUnit = count % 26;
    let rs: string;
    rs = String.fromCharCode(65 + Decade) + String.fromCharCode(65 + TheUnit);
    return rs;
  }

  // 獲取Factior或者FactorDetail的編碼
  getFactorCode(count: number): string {
    let rs: string;
    if (count < 10) {
      rs = '0' + count;
    } else {
      rs = count + '';
    }
    return rs;
  }

  clearAdd() {
    this.addProjectFlag = true;
    this.addProcessFlag = true;
    this.addModuleFlag = true;
    this.addMaterialFlag = true;
    this.addFactorFlag = true;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addProjectSelectValue = undefined;
    this.addProcessSelectValue = undefined;
    this.addModuleSelectValue = undefined;
    this.addMaterialSelectValue = undefined;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
  }

  addLog(logData: any) {
    // 將操作信息存入緩存
    const logMsg = 'add\t廠別: ' + localStorage.getItem('DFC_Plant') + '\t' + localStorage.getItem('$DFI$userName') +
      '\n新增信息如下:' +
      '\nOperationCode: ' + logData.OperationCode +
      '\n產品: ' + logData.ModelType +
      '\n製程: ' + logData.Process +
      '\n模組: ' + logData.Module +
      '\n物料: ' + logData.Material +
      '\n因素: ' + logData.Factor +
      '\n因素細項: ' + logData.FactorDetail +
      '\n動作: ' + logData.Action +
      '\n工時: ' + logData.CostTime;
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '工時標準文件維護',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }

  // 廠別 下拉框值改變
  changePlant() {
    this.addProjectFlag = false;
    this.addProcessFlag = true;
    this.addModuleFlag = true;
    this.addMaterialFlag = true;
    this.addFactorFlag = true;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addProjectSelectValue = undefined;
    this.addProcessSelectValue = undefined;
    this.addModuleSelectValue = undefined;
    this.addMaterialSelectValue = undefined;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
  }

  // 產品 下拉框值改變
  changeProject() {
    this.addProcessFlag = false;
    this.addModuleFlag = true;
    this.addMaterialFlag = true;
    this.addFactorFlag = true;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addProcessSelectValue = undefined;
    this.addModuleSelectValue = undefined;
    this.addMaterialSelectValue = undefined;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
  }

  // 製程 下拉框值改變
  changeProcess() {
    this.addProcessPlus = false;
    this.addModuleFlag = false;
    this.addMaterialFlag = true;
    this.addFactorFlag = true;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addModuleSelectValue = undefined;
    this.addMaterialSelectValue = undefined;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
    this.addModuleList = []; // 清空选择框中的值
    const getAddModuleList = async (module: string) => {
      return this.standartDocumentService.addModuleSelect(this.addProjectSelectValue, this.addProcessSelectValue);
    };
    const addModuleSearchChange$: Observable<any> = this.addModuleSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getAddModuleList));
    addModuleSearchChange$.subscribe(datas => {
      this.addModuleList = datas.filter(data => {
        return !(!data);
      });
      this.addModuleListCache = JSON.parse(JSON.stringify(this.addModuleList));
      this.isAddModuleSelectLoading = false;
    });
  }

  // 模組
  onAddModuleSearch(value: string): void {
    this.isAddModuleSelectLoading = true;
    this.addModuleSearchChange$.next(value);
  }

  clickAddProcessPlus() {
    this.addProcessPlus = true;
  }

  clickSaveProcessPlus() {
    this.addProcessPlus = false;
    if (this.addProcessList.length === this.addProcessListCache.length) {
      this.addProcessList.push({ Value: this.addProcessValueCache, Label: this.addProcessValueCache });
      this.addProcessSelectValue = this.addProcessValueCache;
    } else {
      this.addProcessList = this.addProcessListCache;
      this.addProcessList.push({ Value: this.addProcessValueCache, Label: this.addProcessValueCache });
      this.addProcessSelectValue = this.addProcessValueCache;
    }
    this.addModuleFlag = false;
  }

  // 模組 下拉框值改變
  changeModule() {
    this.addModulePlus = false;
    this.addMaterialFlag = false;
    this.addFactorFlag = true;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addMaterialSelectValue = undefined;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
    this.addMaterialListSelect();
  }

  addMaterialListSelect() {
    // 物料下拉框
    this.addMaterialList = []; // 清空选择框中的值
    const getAddMaterialist = (material: string) => {
      let flag = false;
      // 查看模組是否有新增, 有則Query不同
      const datas = this.addViewData.filter((data: any) => {
        this.addModuleListCache.filter(moduleList => {
          if (moduleList['Value'] === this.addModuleSelectValue) {
            flag = true;
          }
        });
        if (data.ModelType === this.addProjectSelectValue
          && data.ProcessCode === this.addProcessSelectValue
          && data.MaterialName.toUpperCase().includes(material.toUpperCase())) {
          return data;
        }
      });
      let indexOf = 0;
      const addMaterialList = [];
      const list = datas.map((data: any) => {
        indexOf = addMaterialList.indexOf(data.MaterialName);
        if (indexOf < 0) {
          addMaterialList.push(data.MaterialName);
          return data.MaterialName; // 暫時先用這個, 以後用上面的來保存Code
        }
      });
      return of(list);
    };
    const addMaterialSearchChange$: Observable<any[]> = this.addMaterialSearchChange$.asObservable()
      .pipe(debounceTime(100)).pipe(switchMap(getAddMaterialist));
    addMaterialSearchChange$.subscribe(datas => {
      this.addMaterialList = datas.filter(data => {
        return !(!data);
      });
      this.addMaterialListCache = JSON.parse(JSON.stringify(this.addMaterialList));
      this.isAddMaterialSelectLoading = false;
    });
  }

  // 物料
  onAddMaterialSearch(value: string): void {
    this.isAddMaterialSelectLoading = true;
    this.addMaterialSearchChange$.next(value);
  }

  clickAddModulePlus() {
    this.addModulePlus = true;
  }

  clickSaveModulePlus() {
    this.addModulePlus = false;
    this.addModuleList.push({ Value: this.addModuleValueCache, Label: this.addModuleValueCache });
    this.addModuleSelectValue = this.addModuleValueCache;
    this.addMaterialFlag = false;
    this.addMaterialListSelect();
  }

  // 物料 下拉框值改變
  changeMaterial() {
    this.addMaterialPlus = false;
    this.addFactorFlag = false;
    this.addFactorDetailFlag = true;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addFactorSelectValue = undefined;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
    this.addFactorListSelect();
  }

  addFactorListSelect() {
    // 因素下拉框
    this.addFactorList = []; // 清空选择框中的值
    const getAddFactorList = (factor: string) => {
      // 模組是否有新增, 物料是否有新增
      const addFactorList = [];
      let indexOf = 0;
      const datas = this.addViewData.filter((data: any) => {
        let ModuleFlag = false;
        this.addModuleListCache.filter(moduleList => {
          if (moduleList['Value'] === this.addModuleSelectValue) {
            ModuleFlag = true;
          }
        });
        if (data.ModelType === this.addProjectSelectValue
          && data.ProcessCode === this.addProcessSelectValue
          && data.FactorName.toUpperCase().includes(factor.toUpperCase())) {
          if (ModuleFlag) {
            if (this.addMaterialListCache.includes(this.addMaterialSelectValue)) {
              if (data.MaterialName === this.addMaterialSelectValue) {
                return data;
              }
            } else {
              return data;
            }
          } else {
            return data;
          }
        }
      });
      const list = datas.map((data: any) => {
        indexOf = addFactorList.indexOf(data.FactorName);
        if (indexOf < 0) {
          addFactorList.push(data.FactorName);
          return data.FactorName;
        }
      });
      return of(list);
    };
    const addFactorSearchChange$: Observable<any[]> = this.addFactorSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getAddFactorList));
    addFactorSearchChange$.subscribe(datas => {
      this.addFactorList = datas.filter(data => {
        return !(!data);
      });
      this.addFactorListCache = JSON.parse(JSON.stringify(this.addMaterialList));
      this.isAddFactorSelectLoading = false;
    });
  }

  // 因素
  onAddFactorSearch(value: string): void {
    this.isAddFactorSelectLoading = true;
    this.addFactorSearchChange$.next(value);
  }

  clickAddMaterialPlus() {
    this.addMaterialPlus = true;
  }

  clickSaveMaterialPlus() {
    this.addMaterialPlus = false;
    this.addMaterialList.push(this.addMaterialValueCache);
    this.addMaterialSelectValue = this.addMaterialValueCache;
    this.addFactorFlag = false;
    this.addFactorListSelect();
  }

  // 因素 下拉框值改變
  changeFactor() {
    this.addFactorPlus = false;
    this.addFactorDetailFlag = false;
    this.addActionFlag = true;
    this.addCostTimeFlag = true;
    this.addFactorDetailSelectValue = undefined;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
    this.addFactorDetailListSelect();
  }

  addFactorDetailListSelect() {
    // 因素細項下拉框
    this.addFactorDetailList = []; // 清空选择框中的值
    const getAddFactorDetailList = (factorDetail: string) => {
      let ModuleFlag = false;
      // 模組是否有新增, 物料是否有新增, 因素是否有新增
      const addFactorDetailList = [];
      let indexOf = 0;
      const datas = this.addViewData.filter((data: any) => {
        this.addModuleListCache.filter(moduleList => {
          if (moduleList['Value'] === this.addModuleSelectValue) {
            ModuleFlag = true;
          }
        });
        if (data.ModelType === this.addProjectSelectValue
          && data.ProcessCode === this.addProcessSelectValue
          && data.FactorDetailName.toUpperCase().includes(factorDetail.toUpperCase())) {
          if (ModuleFlag) {
            if (this.addMaterialListCache.includes(this.addMaterialSelectValue)) {
              if (this.addFactorListCache.includes(this.addFactorSelectValue)) {
                if (data.MaterialName === this.addMaterialSelectValue
                  && data.FactorName === this.addFactorSelectValue) {
                  return data;
                }
              } else {
                if (data.MaterialName === this.addMaterialSelectValue) {
                  return data;
                }
              }
            } else {
              return data;
            }
          } else {
            return data;
          }
        }
      });
      const list = datas.map((data: any) => {
        indexOf = addFactorDetailList.indexOf(data.FactorDetailName);
        if (indexOf < 0) {
          addFactorDetailList.push(data.FactorDetailName);
          return data.FactorDetailName;
        }
      });
      return of(list);
    };
    const addFactorDetailSearchChange$: Observable<any[]> = this.addFactorDetailSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getAddFactorDetailList));
    addFactorDetailSearchChange$.subscribe(datas => {
      this.addFactorDetailList = datas.filter(data => {
        return !(!data);
      });
      this.addFactorDetailListCache = JSON.parse(JSON.stringify(this.addMaterialList));
      this.isAddFactorDetailSelectLoading = false;
    });
  }

  // 因素細項
  onAddFactorDetailSearch(value: string): void {
    this.isAddFactorDetailSelectLoading = true;
    this.addFactorDetailSearchChange$.next(value);
  }

  clickAddFactorPlus() {
    this.addFactorPlus = true;
  }

  clickSaveFactorPlus() {
    this.addFactorPlus = false;
    if (this.addFactorList.length === this.addFactorListCache.length) {
      this.addFactorList.push(this.addFactorValueCache);
      this.addFactorSelectValue = this.addFactorValueCache;
    } else {
      this.addFactorList = this.addFactorListCache;
      this.addFactorList.push(this.addFactorValueCache);
      this.addFactorSelectValue = this.addFactorValueCache;
    }
    this.addFactorDetailFlag = false;
    this.addFactorDetailListSelect();
  }

  // 因素細項 下拉框值改變
  changeFactorDetail() {
    this.addFactorDetailPlus = false;
    this.addActionFlag = false;
    this.addCostTimeFlag = true;
    this.addActionSelectValue = undefined;
    this.addCostTimeValue = undefined;
    this.addActionList = this.addActionListCache;
    this.addActionListSelect();
  }

  addActionListSelect() {
    // 動作下拉框
    this.addActionList = []; // 清空选择框中的值
    const getAddActionList = (action: string) => {
      const addActionList = [];
      let indexOf = 0;
      const datas = this.addViewData.filter((data: any) => {
        if (data.ModelType === this.addProjectSelectValue
          && data.ActionName.toUpperCase().includes(action.toUpperCase())) {
          return data;
        }
      });
      const list = datas.map((data: any) => {
        indexOf = addActionList.indexOf(data.ActionName);
        if (indexOf < 0) {
          addActionList.push(data.ActionName);
          return data.ActionName;
        }
      });
      return of(list);
    };
    const addActionSearchChange$: Observable<any[]> = this.addActionSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getAddActionList));
    addActionSearchChange$.subscribe(datas => {
      this.addActionList = datas.filter(data => {
        return !(!data);
      });
      this.addActionListCache = JSON.parse(JSON.stringify(this.addMaterialList));
      this.isAddActionSelectLoading = false;
    });
  }

  // 動作
  onAddActionSearch(value: string): void {
    this.isAddActionSelectLoading = true;
    this.addActionSearchChange$.next(value);
  }

  clickAddFactorDetailPlus() {
    this.addFactorDetailPlus = true;
  }

  clickSaveFactorDetailPlus() {
    this.addFactorDetailPlus = false;
    if (this.addFactorDetailList.length === this.addFactorDetailListCache.length) {
      this.addFactorDetailList.push(this.addFactorDetailValueCache);
      this.addFactorDetailSelectValue = this.addFactorDetailValueCache;
    } else {
      this.addFactorDetailList = this.addFactorDetailListCache;
      this.addFactorDetailList.push(this.addFactorDetailValueCache);
      this.addFactorDetailSelectValue = this.addFactorDetailValueCache;
    }
    this.addActionFlag = false;
    this.addActionListSelect();
  }

  // 動作 下拉框值改變
  changeAction() {
    this.addActionPlus = false;
    this.addCostTimeFlag = false;
    this.addCostTimeValue = undefined;
  }

  clickAddActionPlus() {
    this.addActionPlus = true;
  }

  clickSaveActionPlus() {
    this.addActionPlus = false;
    if (this.addActionList.length === this.addActionListCache.length) {
      this.addActionList.push(this.addActionValueCache);
      this.addActionSelectValue = this.addActionValueCache;
    } else {
      this.addActionList = this.addActionListCache;
      this.addActionList.push(this.addActionValueCache);
      this.addActionSelectValue = this.addActionValueCache;
    }
    this.addCostTimeFlag = false;
  }

  upload(file) {
    this.fileService.postDFCFile(file, 'standard')
      .subscribe(data => {
        this.message.create('success', 'Upload successfully!');
        this.showLoading = false;
        // 將操作信息存入緩存
        const logMsg = 'upload\t廠別: ' + localStorage.getItem('DFC_Plant') + '\t' + localStorage.getItem('$DFI$userName') +
          '\n上傳文件信息, 如下:\n' + JSON.stringify(data);
        this.operationLogServer.create({
          userID: localStorage.getItem('$DFI$userID'),
          APname: '工時標準文件維護',
          data: logMsg
        }).subscribe(rs => console.log(rs), error => console.log(error));
      }, error => {
        const err = 'Upload failed: ' + JSON.stringify(error.error.error.message);
        this.message.create('error', err);
        this.showLoading = false;
      });
  }

  download() {
    if (!this.queryValue.modelType || !this.queryValue.process) {
      this.message.create('error', this.trans['query-param']);
    } else {
      this.fileService.downloadStandart(
        this.queryValue.process,
        this.queryValue.modelType,
        this.queryValue.material,
        this.queryValue.factor,
        this.queryValue.action);
    }
  }

  cancelSendSign() {
    this.isSendSignVisible = false;
    this.sendMode.memberList = {};
    this.sendMode.description = '';
  }

  send() {
    this.standartDocumentService.sendMember(this.queryValue.modelType, this.queryValue.process).then(datas => {
      if (!!datas) {
        if (datas['flag']) {
          this.sendMode.memberList = datas['data'].reduce((p, t) => {
            if (!p[t['stage']]) {
              p[t['stage']] = {};
            }
            p[t['stage']]['Role'] = t['stageDesc'];
            p[t['stage']]['Value'] = t['picId'];
            this.standartDocumentService.getSignMemberSelect(t['picId']).subscribe(memberList => {
              p[t['stage']]['List'] = memberList;
            });
            return p;
          }, {});
          this.sendMode.workflowMappingID = datas['data'][0]['workflowFormMappingId'];
        } else {
          this.sendMode.workflowMappingID = datas['data']['id'];
        }
      }
      this.isSendSignVisible = true;
    });
  }


  async sendButton() {
    const list = [];
    for (const key in this.sendMode.memberList) {
      if (this.sendMode.memberList.hasOwnProperty(key)) {
        const item = this.sendMode.memberList[key];
        list.push({ empID: item['Value'], role: item['Label'] });
      }
    }
    const workflowData = await this.workflowApi.CreateNewSigningFlow(this.sendMode.description, list, this.sendMode.workflowMappingID).toPromise();
    const date = new Date();
    const standardOperationSignData = await this.standardOperationSignApi.patchOrCreate({
      'signID': workflowData['data']['id'],
      'sender': localStorage.getItem('$DFI$userID'),
      'status': 1,
      'date': date,
      'modelType': this.queryValue.modelType,
      'process': this.queryValue.process,
    }).toPromise();
    this.standardOperationSignContent.forEach(sData => {
      this.standardOperationSignContentApi.patchOrCreate({
        'action': sData['action'],
        'key': sData['key'],
        'value': sData['value'],
        'done': false,
        'operationId': standardOperationSignData['id']
      }).toPromise();
    });
    // 修改狀態
    const routParam = '?signID=' + workflowData['data']['id'] + '&formID=' + standardOperationSignData['id'] +
      '&senderID=' + localStorage.getItem('$DFI$userID');
    this.workflowDFiApi.patchAttributes(workflowData['data']['id'], {
      'status': 0,
      'workflowFormMappingId': this.sendMode.workflowMappingID,
      'routingParameter': routParam
    }).subscribe(data => console.log(data), error => console.log(error));
    this.standardOperationSignContent = [];
    this.sendSignFlag = false;
    this.cancelSendSign();
    this.message.create('success', 'Successfully sent！');
  }

  async getSendFlag() {
    this.standartDocumentService.sendMember(this.queryValue.modelType, this.queryValue.process).then(datas => {
      this.workflowDFiApi.find({ where: { workflowFormMappingId: datas.data[0].workflowFormMappingId } }).subscribe(data => {
        const workflowIds = [];
        data.forEach(r => {
          workflowIds.push(r['id']);
        });
        this.targetOperationSignApi.find({
          where: {
            'and': [
              { 'process': this.queryValue.process },
              { 'signID': { 'inq': workflowIds } }
            ]
          }
        }).subscribe();
      });
    });
  }
}



