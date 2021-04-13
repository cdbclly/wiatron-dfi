import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  forkJoin,
  of,
  Subject
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  FileService
} from '@service/file.service';
import {
  WorkhourReviewService
} from '../workhour-review.service';
import {
  StageApi,
  TargetOperationsApi,
  MemberApi,
  EmailModelApi,
  ProcessApi,
  StageInterface,
  V_ProjectSummaryApi,
} from '@service/dfc_sdk/sdk';
import {
  OperationLogApi
} from '@service/dfc_sdk/sdk/services/custom/OperationLog';
import {
  WorkhourService
} from 'app/dfc/dfc-workhour.service';
import {
  DownexcelService
} from '@service/downexcel.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-workhour-review-detail',
  templateUrl: './workhour-review-detail.component.html',
  styleUrls: ['./workhour-review-detail.component.scss']
})

export class WorkhourReviewDetailComponent implements OnInit {
  _stageID;
  @Input() set stageID(stageID: string) {
    this._stageID = stageID;
    this.displayData();
  }
  get stageID(): string {
    return this._stageID;
  }

  @Input() process;
  processName;
  @Input() projectName;
  ModifiedMOHEditCache;

  @Input() tableHeight;

  modelName;

  // Echart
  chartData;
  MAX_BAR_NUM = 10;
  MAX_SIDE_BAR_NUM = 6;
  //  ----
  tablePaging = true;
  currentPage = 1;
  showAll = false;
  factors: Array<number>;
  dataSet = []; // 表格数据暂存
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  nzNoResult = '無須改善項目';
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  dl2; // 人力成本 (秒)
  dataWindowFlag = false;
  nzScroll: {} = {
    x: '1380px',
    y: '240px'
  };
  nzWidthConfig = [];
  nzWidthConfigs: any = {};

  // 下拉框传值
  plantSelectValue;
  isTableLoading = false; // 设置细项展示按钮是否为加载状态
  defultDueDay = new Date().toLocaleDateString();
  saveFlag = false; // 存儲標記--為了讓存的時候不會再去變化現有表格, 實現表格固定
  editFlag = false; // 編輯狀態標誌 -- 編輯時顯示  是否變更項
  sendEmailLoading = false; // 設置Email發送按鈕 是否為加載狀態.  -- 點擊按鈕, 1分鐘后才可以再次點擊
  // 文件上傳下載相關
  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  // echart

  cFlow;
  dateFormat = 'yyyy/MM/dd'; // 日期格式显示
  // 表格
  listOfStatusSelectOption = [{
    Value: 0,
    Label: 'Open'
  },
  {
    Value: 1,
    Label: 'Ongoing'
  },
  {
    Value: 2,
    Label: 'Close'
  }
  ];

  // 表格中 目標設計下拉框
  targetFactorDetailSelectValue: string; // 下拉框选值
  listOfTargetFactorDetailSelectOption = {}; // 下拉框内容
  // 表格中 PIC下拉框
  memberList;
  proMemberList;
  listOfPICSelectOption = []; // 下拉框内容
  picSearchChange$ = new BehaviorSubject('');
  isPICListLoading = false;
  // 編輯后失去焦點 聯合判斷, inputBlur = true && inputClick = false 時 彈出儲存框
  inputBlur = false; // 記錄input編輯框是否 失去焦點, 默認為false
  inputClick = false; // 記錄 點擊的是否為 input框或者為 save, 默認為 false
  isEditSaveVisible = false; // 储存框是否出现
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editObject;
  dataWindow;
  editChange: string;
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['WorkhourReview'];
  allpro;

  currentEditFlag = false; // 大於當前stage 才可以編輯
  searchFactorDetail = {
    stage: '',
    target: '',
    actual: ''
  };
  trans = {};
  constructor(
    private workhourReviewService: WorkhourReviewService,
    private message: NzMessageService,
    private fileService: FileService,
    private stageServer: StageApi,
    private vProjectSummaryApi: V_ProjectSummaryApi,
    private targetOperationsServer: TargetOperationsApi,
    private emailModelServer: EmailModelApi,
    private operationLogServer: OperationLogApi,
    private memberApi: MemberApi,
    private workhourService: WorkhourService,
    private downExcelService: DownexcelService,
    private processApi: ProcessApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfc.forecast.fill-discuss-result', 'dfc.forecast.select-pic', 'dfc.forecast.select-target-design',
      'dfc.forecast.fill-target-quantity', 'dfc.forecast.select-status', 'dfc.forecast.select-dueday']).subscribe(res => {
        this.trans['fill-discuss-result'] = res['dfc.forecast.fill-discuss-result'];
        this.trans['select-pic'] = res['dfc.forecast.select-pic'];
        this.trans['select-target-design'] = res['dfc.forecast.select-target-design'];
        this.trans['fill-target-quantity'] = res['dfc.forecast.fill-target-quantity'];
        this.trans['select-status'] = res['dfc.forecast.select-status'];
        this.trans['select-dueday'] = res['dfc.forecast.select-dueday'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dfc.forecast.fill-discuss-result', 'dfc.forecast.select-pic', 'dfc.forecast.select-target-design',
        'dfc.forecast.fill-target-quantity', 'dfc.forecast.select-status', 'dfc.forecast.select-dueday']).subscribe(res => {
          this.trans['fill-discuss-result'] = res['dfc.forecast.fill-discuss-result'];
          this.trans['select-pic'] = res['dfc.forecast.select-pic'];
          this.trans['select-target-design'] = res['dfc.forecast.select-target-design'];
          this.trans['fill-target-quantity'] = res['dfc.forecast.fill-target-quantity'];
          this.trans['select-status'] = res['dfc.forecast.select-status'];
          this.trans['select-dueday'] = res['dfc.forecast.select-dueday'];
        });
    });
    this.nzWidthConfigs = {
      edit: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '90px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px', '120px', '120px', '120px', '120px',
          '120px', '150px', '100px'
        ],
        nzScroll: {
          x: '2990px',
          y: '600px'
        }
      },
      notdo: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px', '120px', '120px', '120px',
          '120px', '150px', '100px'
        ],
        nzScroll: {
          x: '2870px',
          y: this.tableHeight
        }
      }
    };
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
    this.initTargetFactorDetailSelect();
  }

  ModifyMOHField(data) {
    return this.dataSet[data].stageData.some(x => this.editCache[x.ModelOperationID].edit === true);
  }

  // 顯示細項
  showTableItem() {
    this.saveFlag = false;
    this.showAll = !this.showAll;
    this.searchFactorDetail.stage = '';
    this.searchFactorDetail.target = '';
    this.searchFactorDetail.actual = '';
  }

  startEdit(factor: number, key: string, index: number, j: number) {
    this.editCache[key].stageData = this.dataSet[factor].stageData.find(x => x.ModelOperationID === key);
    this.editObject = this.editCache[key].stageData;
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.picSelect();
    this.editFlag = true;
    this.editChange = 'Y';
    this.nzWidthConfig = this.nzWidthConfigs.edit.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.edit.nzScroll;
    // 影響MOH 編輯時顯示
    this.ModifiedMOHEditCache = this.dataSet[factor].stageData[j] && (this.dataSet[factor].stageData[j].ModifiedMOH != null ?
      this.dataSet[factor].stageData[j].ModifiedMOH : ((this.dataSet[factor].rfqFactorTime - this.dataSet[factor].stageFactorTime) * this.dl2));
  }

  saveEdit(key: string) {
    if (!this.editCache[key].stageData['Comment']) {
      this.message.create('error', this.trans['fill-discuss-result']);
      return;
    }
    if (!this.editCache[key].stageData['PICID']) {
      this.message.create('error', this.trans['select-pic']);
      return;
    }
    let updataData = {};
    if (this.editChange === 'Y') {
      if (!this.editCache[key].stageData['TargetFactorDetailCode']) {
        this.message.create('error', this.trans['select-target-design']);
        return;
      }
      if (!this.editCache[key].stageData['TargetCount']) {
        this.message.create('error', this.trans['fill-target-quantity']);
        return;
      }
      if (this.editCache[key].stageData['Status'] === null) {
        this.message.create('error', this.trans['select-status']);
        return;
      }
      if (!this.editCache[key].stageData['DueDay']) {
        this.message.create('error', this.trans['select-dueday']);
        return;
      }
      updataData = {
        ModelOperationID: this.editCache[key].stageData['ModelOperationID'],
        Comment: this.editCache[key].stageData['Comment'],
        TargetFactorDetailCode: this.editCache[key].stageData['TargetFactorDetailCode'],
        PICID: this.editCache[key].stageData['PICID'],
        TargetCount: this.editCache[key].stageData['TargetCount'],
        Status: this.editCache[key].stageData['Status'],
        DueDay: this.editCache[key].stageData['DueDay']
      };
    } else {
      updataData = {
        ModelOperationID: this.editCache[key].stageData['ModelOperationID'],
        Comment: this.editCache[key].stageData['Comment'],
        TargetFactorDetailCode: this.editCache[key].stageData['FactorDetailIDActual'],
        PICID: this.editCache[key].stageData['PICID'],
        TargetCount: this.editCache[key].stageData['Count'],
        Status: 2,
        DueDay: this.defultDueDay

      };
    }
    const logDatas = {
      Old: this.editObject,
      New: updataData
    };
    this.cancelEdit(key);
    this.targetOperationsServer.patchOrCreate(updataData).subscribe(rs => {
      this.saveFlag = true;
      this.editObject['ModelOperationID'] = rs.ModelOperationID;
      this.editObject['Comment'] = rs.Comment;
      this.editObject['TargetFactorDetailCode'] = rs.TargetFactorDetailCode;
      if (this.listOfTargetFactorDetailSelectOption[this.editObject['FactorID']]) {
        this.listOfTargetFactorDetailSelectOption[this.editObject['FactorID']].forEach(list => {
          if (list.Value === rs.TargetFactorDetailCode) {
            this.editObject['TargetFactorDetail'] = list.Label;
          }
        });
      }
      this.editObject['PICID'] = rs.PICID;
      this.editObject['TargetCount'] = rs.TargetCount;
      this.editObject['Status'] = rs.Status;
      this.editObject['DueDay'] = (rs.DueDay === null) ? '' : new Date(rs.DueDay).toLocaleDateString();
      if (this.listOfPICSelectOption.find(d => d['EmpID'] === rs.PICID)) {
        this.editObject['PICName'] = this.listOfPICSelectOption
          .find(d => d['EmpID'] === rs.PICID)['EName'];
      }
      if (!!this.ModifiedMOHEditCache) {
        const updateMohData = this.dataSet[this.editCache[key].stageData.FactorID].stageData.map(x => {
          return {
            ModelOperationID: x.ModelOperationID,
            ModifiedMOH: this.ModifiedMOHEditCache
          };
        });
        Promise.all(updateMohData.map(x => this.targetOperationsServer.patchOrCreate(x).toPromise())).then(
          result => {
            this.ModifiedMOHEditCache = null;
            this.message.create('success', 'Modification completed！');
            this.queryDetailData();
          }
        ).catch(e => {
          this.message.create('error', e);
        });
      } else {
        this.message.create('success', 'Modification completed！');
      }
    }, error => {
      this.message.create('error', error);
    });
    // 將操作信息存入緩存
    const logMsg = 'update\t廠別: ' + this.plantSelectValue + '\t' + localStorage.getItem('$DFI$userName') +
      '\n廠別: ' + logDatas.Old.Plant + '\tModelOperationID: ' + logDatas.Old.ModelOperationID +
      '\t物料: ' + logDatas.Old.Material + '\t因素: ' + logDatas.Old.Factor +
      '\t因素細項: ' + logDatas.Old.FactorDetailActural + '\t數量: ' + logDatas.Old.Count +
      '\n變更信息, 如下:\n' +
      '\影響MOH: ' + logDatas.Old.gapCost +
      ' -> ' + logDatas.New['BOMCost'] +
      '\t討論結果: ' + logDatas.Old.Comment +
      ' -> ' + logDatas.New['Comment'] +
      '\t當前設計因素細項: ' + logDatas.Old.aimdes +
      ' -> ' + logDatas.New['aimdes'] +
      '\t當前設計數量: ' + logDatas.Old.aimnum +
      ' -> ' + logDatas.New['aimnum'] +
      '\t目標數量: ' + logDatas.Old.TargetCount + ' -> ' + logDatas.New['TargetCount'] +
      '\tPIC: ' + logDatas.Old.PICID + ' -> ' + logDatas.New['PICID'] +
      '\tStatus: ' + logDatas.Old.Status + ' -> ' + logDatas.New['Status'] +
      '\tDueDay: ' + logDatas.Old.DueDay + ' -> ' + logDatas.New['DueDay'];
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: '目標工時生成',
      data: logMsg
    }).subscribe(rs => {
      console.log(rs);
      this.displayData();
    }, error => console.log(error));
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
    this.isEditSaveVisible = false;
    this.inputClick = false;
    this.inputBlur = false;
    this.editFlag = false;
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
    this.editChange = 'Y';
  }

  CreateNumberArray(i) {
    return Array(i).fill(1, 0, i).map((x, j) => j);
  }

  download() {
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'modelReview');
      this.tablePaging = true;
    }, 300);
  }

  ListFilter(array: Array<number>) {
    if (this.showAll) {
      return array;
    } else {
      return array.filter(data => this.dataSet[data].rfqFactorTime - this.dataSet[data].stageFactorTime < 0);
    }
  }

  SetChart(data) {
    const groupedFactorData = this.workhourService.GroupByFactor(data);
    const groupedMaterialData = this.workhourService.GroupByMaterial(groupedFactorData);
    const actural = this.workhourService.Sum(data['stageOperations'].data.map(x => (x.CostTimeActural * x.Count)));
    const currentTarget = this.workhourService.Sum(data['stageOperations'].data.map(x => x.TargetCount != null ? (x.TargetCount * x.CostTimeTarget) : x.Count * x.CostTimeActural));
    const target = this.workhourService.Sum(data['rfqOperations'].data.map(x => {
      return x.TargetCount == null ? x.Count * x.CostTimeActural : x.TargetCount * x.CostTimeTarget;
    }));
    const improvesTop5 = this.workhourService.LeftTops(groupedMaterialData['improves'], this.MAX_SIDE_BAR_NUM);
    const leftCount = this.MAX_BAR_NUM - improvesTop5.length;
    const gapsTop5 = this.workhourService.LeftTops(groupedMaterialData['gaps'], leftCount);
    this.chartData = {
      data: {
        groupedMaterialData: groupedMaterialData,
        acturalName: data.stageName + '工時',
        actural: actural,
        aimsName: data.stageName + '階段目標',
        aims: currentTarget,
        targetName: 'Target',
        target: target,
        improvesTop5: improvesTop5,
        gapsTop5: gapsTop5
      }
    };
    return this.chartData;
  }

  InitEditCache(data) {
    this.editCache = {};
    Object.keys(data).forEach(element => {
      data[element].stageData.forEach(stageOperation => {
        this.editCache[stageOperation.ModelOperationID] = {
          edit: false
        };
      });
    });
  }

  async displayData() {
    const rawData = await this.queryDetailData();
    this.dataSet = this.workhourService.GroupByFactor(rawData);
    const chartData = this.SetChart(rawData);
    this.cFlow = rawData['stageName'];
    const improvesMaterialSeq: any[] = chartData.data.groupedMaterialData.improves.map(x => x.Material);
    const gapMaterialSeq = chartData.data.groupedMaterialData.gaps.map(x => x.Material);
    gapMaterialSeq.forEach(element => {
      if (improvesMaterialSeq.findIndex(x => x === element) < 0) {
        improvesMaterialSeq.push(element);
      }
    });
    this.factors = this.workhourService.CreateTableDataArray(this.dataSet, improvesMaterialSeq);
    this.InitEditCache(this.dataSet);
  }

  async queryDetailData() {
    const stages = await this.stageServer.findById(this.stageID, {
      include: {
        'basicModel': ['stages',
          {
            'projectNameProfile': {
              'projectCodeProfile': 'member'
            }
          }
        ]
      }
    }).toPromise<StageInterface>();
    const rfqStageId = stages.basicModel.stages.find(x => x.Stage === 'RFQ').StageID;
    this.proMemberList = stages.basicModel.projectNameProfile.projectCodeProfile.member.map(x => x.MemberID);
    this.picGetMemberList();
    this.dl2 = await this.workhourService.GetMOHDL(stages.basicModel.projectNameProfile.projectCodeProfile.ProjectCodeID);
    const result = await this.workhourReviewService.queryDetailDate(this.stageID, rfqStageId, this.process);
    this.processName = (await this.processApi.findById(this.process).toPromise())['Name'];
    this.projectName = stages.basicModel.projectNameProfile.ProjectName;
    this.modelName = stages.basicModel.modelName;
    result['stageName'] = stages['Stage'];
    return result;
  }

  async picGetMemberList() {
    this.memberList = await this.memberApi.find({
      'where': {
        'or': [{
          'EmpID': {
            'inq': this.proMemberList
          }
        },
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
    }).toPromise();
  }

  // PIC下拉框
  async picSelect() {
    this.listOfPICSelectOption = [];
    const getPICList = (pic: string) => {
      const datas = this.memberList.filter((data: any) => {
        if (data.EmpID.toUpperCase().includes(pic.toLocaleUpperCase()) ||
          data.Name.toUpperCase().includes(pic.toLocaleUpperCase()) ||
          data.EName.toUpperCase().includes(pic.toLocaleUpperCase())) {
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
      return list;
    };
    const picList$: Observable<any> = this.picSearchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getPICList));
    picList$.subscribe(data => {
      this.listOfPICSelectOption.push(data);
      this.isPICListLoading = false;
    });
  }

  onPICSearch(value: string): void {
    this.listOfPICSelectOption = [];
    this.isPICListLoading = true;
    this.picSearchChange$.next(value);
  }

  async initTargetFactorDetailSelect(datas?) {
    this.listOfTargetFactorDetailSelectOption = [];
    this.listOfTargetFactorDetailSelectOption = await this.workhourReviewService.getdetail();
    this.stageServer.findById(this._stageID, {
      'include': { 'basicModel': 'projectNameProfile' }
    }).pipe(map(stageData => {
      forkJoin(this.vProjectSummaryApi.find({
        'fields': ['CurrentStage'],
        'where': {
          'ProjectNameID': stageData['basicModel']['projectNameId']
        },
        'limit': 1
      }), of(stageData)).pipe(map((res: any[]) => {
        const stageList = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
        const currentIndex = stageList.findIndex(d => d === res[0][0]['CurrentStage']);
        const stageIndex = stageList.findIndex(d => d === res[1]['Stage']);
        if (currentIndex > stageIndex) {
          this.currentEditFlag = false;
        } else {
          this.currentEditFlag = true;
        }
      })).subscribe();
    })).subscribe();
  }

  updateEditCache() {
    this.editCache = {}; // 清理缓存状态
    this.dataSet.forEach(item => {
      if (!this.editCache[item.ModelOperationID]) {
        this.editCache[item.ModelOperationID] = {
          edit: false,
          data: {
            ...item
          }
        };
      }
    });
  }

  onclickEdit(key: string) {
    this.inputClick = true;
    this.inputBlur = false;
  }

  // 展示各流程討論結果
  showComments(factorId, key) {
    this.dataWindow = [];
    if (key) {
      return;
    }
    this.dataWindow = [];
    this.targetOperationsServer.GetAllFactorComment(this.stageID, factorId).subscribe(res => {
      this.dataWindow = res;
      this.dataWindow.data = this.dataWindow.data.sort((a, b) => {
        return a.Stage > b.Stage ? 1 : -1;
      });
      for (let index = 0; index < this.dataWindow.data.length; index++) {
        const data = this.dataWindow.data[index];
        if (data.Stage === 'RFQ') {
          const aaa = data;
          this.dataWindow.data.splice(index, 1);
          this.dataWindow.data.unshift(aaa);
        }
      }
      this.dataWindowFlag = true;
    });
  }

  closeComments() {
    this.dataWindowFlag = false;
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
}
