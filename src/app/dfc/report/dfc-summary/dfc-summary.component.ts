import { ProcessApi } from '@service/dfc_sdk/sdk';
import { ProjectCodeProfileApi } from '@service/dfc_sdk/sdk';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { DfcSummaryQueryStyle, DfcSummaryWorkQuerySelect, ClsDfcSummarySelect, DfcSummaryMOHQuerySelect, workOrMOH } from './dfc-summary';
import { DfcSummaryService } from './dfc-summary.service';
import { DownexcelService } from '@service/downexcel.service';
import { SummaryWorkHourComponent } from './summary-work-hour/summary-work-hour.component';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dfc-summary',
  templateUrl: './dfc-summary.component.html',
  styleUrls: ['./dfc-summary.component.scss']
})
export class DfcSummaryComponent implements OnInit {

  selectedTab = 0;
  queryLoading = {
    workhourQueryLoading: false,
    mohQueryLoading: false
  };
  @ViewChild('DFCReportSummary') dfcReportSummary: ElementRef;
  dfcReportSummaryDom: any;
  @ViewChild('summaryWorkHour') summaryWorkHour: SummaryWorkHourComponent;
  tableHeight;

  // 詳細的製程
  oldProcessHeaders: any[] = [];
  processHeaders: any[] = [];
  processSetArr: {}[] = [];

  // 工時和MOH相關
  work = true;
  moh = false;
  radioValue = this.work;
  mohDataSet = [];
  dataSet = []; // 表格数据暂存
  stageIDs: number[] = []; // 暫存StageID值

  // workHour下拉列表選中值相關
  workSelectValue: ClsDfcSummarySelect = {
    plant: [],      // 廠別
    custom: '',     // 客戶
    modelType: '',  // 產品
    proCode: '',    // Project Code
    proName: '',    // Project Name
    cFlow: [],       // 階段
    model: ''       // model Name
  };
  // 下拉框的樣式和option中的值
  workQueryStyle = DfcSummaryQueryStyle;
  workQuerySelect = DfcSummaryWorkQuerySelect;

  // MOH下拉框相關的值
  MOHSelectValue: ClsDfcSummarySelect = {
    plant: [],      // 廠別
    custom: '',     // 客戶
    modelType: '',  // 產品
    proCode: '',    // Project Code
    proName: '',    // Project Name
    cFlow: [],       // 階段
    model: ''       // Model Name
  };
  // 下拉框的樣式和option中的值
  MOHQueryStyle = DfcSummaryQueryStyle;
  MOHQuerySelect = DfcSummaryMOHQuerySelect;
  isWorkOrMOH: workOrMOH = workOrMOH.work;  // 默認是workHour

  // 工廠的value和label映射表
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  // echarts option
  RFQEchartOption: any = {};
  C0EchartOption: any = {};
  MPEchartOption: any = {};
  cacheRFQEchartOption: any = {};
  cacheC0EchartOption: any = {};
  cacheMPEchartOption: any = {};
  colorBlocks: string[] = [];   // 廠別的顏色並集
  colorMaps = {
    F130: '#f05b72',   // 薔薇色
    F136: '#f26522',   // 朱色
    F138: '#b6a2de',   // 肌色
    F139: '#905a3d',   // 灰茶
    F230: '#843900',   // 褐色
    F232: '#dea32c',   // 梔子色
    F261: '#525f42',   // 山鴆色
    F330: '#5c7a29',   // 苔色
    F710: '#bed742',   // 若草色
    F721: '#00ae9d',   // 青綠色
    F741: '#009ad6'     // 青色
  };
  colorDescriptions: any[] = [];   // 顏色的說明
  trans = {};
  constructor(
    private dfcSummaryService: DfcSummaryService,
    private projectCodeProfileApi: ProjectCodeProfileApi,
    private downExcelService: DownexcelService,
    private processApi: ProcessApi,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData']).subscribe(res => {
      this.trans['noData'] = res['mrr.mrr-noData'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData']).subscribe(res => {
        this.trans['noData'] = res['mrr.mrr-noData'];
      });
    });
    this.tableHeight = this.dfcReportSummary.nativeElement.offsetHeight - 185;
    await this.initEchartsOption(this.trans['noData']);
    // ---- start ----
    // 默認是初始化workHour的
    this.initPlantSelect(this.workQuerySelect, this.workSelectValue);
    this.initCustomSelect(this.workQuerySelect, this.workSelectValue);
    this.initModelTypeSelect(this.workQuerySelect);
    this.initProNameSelect(this.workQuerySelect, this.workSelectValue);
    this.initModelSelect(this.workQuerySelect, this.workSelectValue);
    this.initProcessDetail();
    this.dfcReportSummaryDom = this.dfcReportSummary.nativeElement;
  }

  async initProcessDetail(): Promise<any> {
    this.oldProcessHeaders = await this.processApi.find({}).toPromise();
    return '';
  }

  // 取消moh和工時的互相影響
  toggleWorkAndMOH(): void {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.isWorkOrMOH = workOrMOH.MOH;
      // 初始化MOH
      this.initPlantSelect(this.MOHQuerySelect, this.MOHSelectValue);
      this.initCustomSelect(this.MOHQuerySelect, this.MOHSelectValue);
      this.initModelTypeSelect(this.MOHQuerySelect);
      this.initProNameSelect(this.MOHQuerySelect, this.MOHSelectValue);
      this.initModelSelect(this.MOHQuerySelect, this.MOHSelectValue);
    } else {
      this.isWorkOrMOH = workOrMOH.work;
      // 初始化workHour
      this.initPlantSelect(this.workQuerySelect, this.workSelectValue);
      this.initCustomSelect(this.workQuerySelect, this.workSelectValue);
      this.initModelTypeSelect(this.workQuerySelect);
      this.initProNameSelect(this.workQuerySelect, this.workSelectValue);
      this.initModelSelect(this.workQuerySelect, this.workSelectValue);
    }
  }

  // echarts的點擊事件
  onChartEvent111(event: any, type: string) {
    if (this.queryLoading.mohQueryLoading) {
      return;
    }
    const data: {} = event.data;
    const plant: string = this.dfcSummaryService.nameToPlant(data['name'].split('(')[0]);
    const limit = data['value'];
    this.changePlant();
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.cFlow = ['RFQ'];
      this.queryLoading.workhourQueryLoading = true;
      this.queryWorkHour(this.summaryWorkHour.expandArr, { limit: limit, plant: plant });
    } else {
      this.MOHSelectValue.cFlow = ['RFQ'];
      this.queryLoading.mohQueryLoading = true;
      this.mohQuery({ limit: limit, plant: plant });
    }
  }

  onChartEvent222(event: any, type: string) {
    if (this.queryLoading.mohQueryLoading) {
      return;
    }
    const data: {} = event.data;
    const plant: string = this.dfcSummaryService.nameToPlant(data['name'].split('(')[0]);
    const limit = data['value'];
    this.changePlant();
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.cFlow = ['C3', 'C4', 'C5'];
      this.queryLoading.workhourQueryLoading = true;
      this.queryWorkHour(this.summaryWorkHour.expandArr, { limit: limit, plant: plant });
    } else {
      this.MOHSelectValue.cFlow = ['C3', 'C4', 'C5'];
      this.queryLoading.mohQueryLoading = true;
      this.mohQuery({ limit: limit, plant: plant });
    }
  }

  onChartEvent333(event: any, type: string) {
    if (this.queryLoading.mohQueryLoading) {
      return;
    }
    const data: {} = event.data;
    const plant: string = this.dfcSummaryService.nameToPlant(data['name'].split('(')[0]);
    const limit = data['value'];
    this.changePlant();
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.cFlow = ['C6'];
      this.queryLoading.workhourQueryLoading = true;
      this.queryWorkHour(this.summaryWorkHour.expandArr, { limit: limit, plant: plant });
    } else {
      this.MOHSelectValue.cFlow = ['C6'];
      this.queryLoading.mohQueryLoading = true;
      this.mohQuery({ limit: limit, plant: plant });
    }
  }

  async initEchartsOption(param) {
    const res = await this.projectCodeProfileApi.ProjectStageSummary().toPromise();
    this.cacheRFQEchartOption = this.getEchartsOption(res.RFQ, param);
    this.cacheC0EchartOption = this.getEchartsOption(res.C0, param);
    this.cacheMPEchartOption = this.getEchartsOption(res.MP, param);
  }

  getEchartsOptionTemplate(): {} {
    const option = {
      calculabel: true,
      series: [{
        name: 'ewq',
        type: 'pie',
        radius: ['50%', '80%'],
        color: [],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'inside'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '18',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      }, {
        name: '访问来源',
        type: 'pie',
        selectedMode: 'single',
        radius: ['0', '0'],
        selectedOffset: 0,
        hoverOffset: 0,
        hoverAnimation: false,
        legendHoverLink: false,
        color: 'white',
        label: {
          normal: {
            position: 'center',
            color: 'black',
            fontSize: 30
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 335, name: 'test' }
        ]
      }]
    };
    return option;
  }

  // 獲取echarts的option配置
  getEchartsOption(object: any, param): any {
    const option = this.getEchartsOptionTemplate();
    let data: any[] = [];
    let colors: any[] = [];
    let count = 0;
    for (const key in object) {   // key是plant的值
      const obj = {
        value: object[key],
        name: key,
      };
      count += object[key];
      data.push(obj);
      colors.push(this.colorMaps[key]);
    }
    if (data.length === 0) {
      data = [{ value: 1, name: param }];
      colors = ['red'];
      option['series'][0].data = data;
    } else {
      option['series'][0].data = data;
      option['series'][0].color = colors;
      option['series'][1].data[0].name = 'Total' + count;
    }
    return option;
  }

  pushPlantToEcharts(plantArr: string[], cacheEchartOption: {}): {} {
    // 整個更換，以便antd能更新數據
    const option: {} = this.getEchartsOptionTemplate();
    const data0: any[] = cacheEchartOption['series'][0].data;  // 圓環中的數據
    const colors: string[] = []; // 和圓環中的數據一一對應
    const resultDatas: any[] = [];
    let count = 0;
    for (const plant of plantArr) {
      const item: {} = data0.find(temp => temp['name'] === plant);
      if (!!item) {   // 不同階段的廠別不同，即有些產品在某個階段找不到
        const temp: {} = {};
        temp['value'] = item['value'];
        temp['name'] = this.dfcSummaryService.plantToName(item['name']) + '(' + item['value'] + ')';
        colors.push(this.colorMaps[plant]);
        resultDatas.push(temp);
        count += item['value'];
      }
    }
    option['series'][0].data = resultDatas;
    option['series'][0].color = colors;
    option['series'][1].data[0].name = 'Total' + count;
    return option;  // 整體賦值，才能讓echarts更新
  }

  getColorUnion(): void {
    const RFQColors: string[] = this.cacheRFQEchartOption['series'][0].color;
    const C0Colors: string[] = this.cacheC0EchartOption['series'][0].color;
    const MPcolors: string[] = this.cacheMPEchartOption['series'][0].color;
    // 去重
    const result: string[] = [...RFQColors, ...C0Colors, ...MPcolors];
    this.colorBlocks = Array.from(new Set(result));
  }

  addColor(plantArr: string[]): void {
    this.colorDescriptions = [];   // 每次需清空
    for (const plant of plantArr) {
      const color: string = this.colorMaps[plant];
      const plantName: string = this.dfcSummaryService.plantToName(plant);
      const item: {} = {
        style: { 'background-color': color },
        text: plantName
      };
      this.colorDescriptions.push(item);
    }
  }

  // 初始化廠別下拉框
  initPlantSelect(querySelect: any, selectValue: any) {
    querySelect.plant.selectList = [];  // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => querySelect.plant.selectList = data);
    // 对厂别自动带入本厂的标签
    selectValue.plant = [];
    selectValue.plant.push(localStorage.getItem('DFC_Plant'));
    this.RFQEchartOption = this.pushPlantToEcharts(selectValue.plant, this.cacheRFQEchartOption);
    this.C0EchartOption = this.pushPlantToEcharts(selectValue.plant, this.cacheC0EchartOption);
    this.MPEchartOption = this.pushPlantToEcharts(selectValue.plant, this.cacheMPEchartOption);
    this.addColor(selectValue.plant);
  }

  // 初始化 客戶 下拉框
  initCustomSelect(querySelect: any, selectValue: any) {
    querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!selectValue.plant) {
        return this.dfcSummaryService.getProCodeCustom(custom, selectValue.plant).pipe(map((list: any) => {
          const temp = [];
          return list.map(item => {
            if (!temp.includes(item.Customer) && !!item.Customer) {
              temp.push(item.Customer);
              return { Value: item.Customer, Label: item.Customer };
            }
          });
        }));
      }
    };
    const customList$: Observable<string[]> = querySelect.custom.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));
    customList$.subscribe(datas => {
      querySelect.custom.selectList = datas.filter(data => {
        return !(!data);
      });
      querySelect.custom.isLoading = false;
    });
  }

  // 初始化產品下拉框
  initModelTypeSelect(querySelect: any) {
    querySelect.modelType.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      querySelect.modelType.selectList = datas;
    });
  }

  // 初始化 ProjectName
  initProNameSelect(querySelect: any, selectValue: any) {
    querySelect.proName.selectList = []; // 清空選擇框的值
    const getProNameList = (proName: string) => {
      if (!!selectValue.plant) {
        return this.dfcSummaryService.getProNameSelect(selectValue, proName)
          .then(list => {
            const temp = [];
            return list.map(item => {
              if (!temp.includes(item.ProjectNameID) && !!item.ProjectNameID) {
                temp.push(item.ProjectNameID);
                return { Value: item.ProjectNameID, Label: item.ProjectName, ProjectCodeID: item.ProjectCodeID };
              }
            });
          });
      }
    };
    const proNameList$: Observable<string[]> = querySelect.proName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProNameList));
    proNameList$.subscribe(datas => {
      querySelect.proName.selectList = datas.filter(data => {
        return !(!data);
      });
      querySelect.proName.isLoading = false;
    });
  }

  // 初始化 Model
  initModelSelect(querySelect: any, selectValue: any) {
    querySelect.model.selectList = []; // 清空選擇框的值
    const getModelList = (model: string) => {
      if (!!selectValue.proName) {
        return this.dfcSelectService.getModel(selectValue.proName, model, true);
      } else {
        return of({ 'list': [] });
      }
    };
    const modelList$: Observable<string[]> = querySelect.model.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelList));
    modelList$.subscribe(datas => {
      querySelect.model.selectList = datas['list'];
      if (!!selectValue.proName) {
        selectValue.model = datas['def'];
      }
      querySelect.model.isLoading = false;
    });
  }

  // 廠別下拉框選中改變后, 清空其他选则值 -- 客户, ProjectCode, ProjectName, 并重新查詢出 客戶的列表
  changePlant() {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.custom = '';
      this.workSelectValue.modelType = '';
      this.workSelectValue.proCode = '';
      this.workSelectValue.proName = '';
      this.workQuerySelect.custom.selectList = [];
      this.workQuerySelect.proCode.selectList = [];
      this.workQuerySelect.proName.selectList = [];
      this.workSelectValue.model = '';
      this.workQuerySelect.model.selectList = [];
      if (!!this.workSelectValue.plant) {
        this.customSearch('');
        this.proNameSearch('');
        this.RFQEchartOption = this.pushPlantToEcharts(this.workSelectValue.plant, this.cacheRFQEchartOption);
        this.C0EchartOption = this.pushPlantToEcharts(this.workSelectValue.plant, this.cacheC0EchartOption);
        this.MPEchartOption = this.pushPlantToEcharts(this.workSelectValue.plant, this.cacheMPEchartOption);
        this.addColor(this.workSelectValue.plant);
      }
    } else {
      this.MOHSelectValue.model = '';
      this.MOHQuerySelect.model.selectList = [];
      this.MOHSelectValue.custom = '';
      this.MOHSelectValue.modelType = '';
      this.MOHSelectValue.proCode = '';
      this.MOHSelectValue.proName = '';
      this.MOHQuerySelect.custom.selectList = [];
      this.MOHQuerySelect.proCode.selectList = [];
      this.MOHQuerySelect.proName.selectList = [];
      if (!!this.MOHSelectValue.plant) {
        this.customSearch('');
        this.proNameSearch('');
        this.RFQEchartOption = this.pushPlantToEcharts(this.MOHSelectValue.plant, this.cacheRFQEchartOption);
        this.C0EchartOption = this.pushPlantToEcharts(this.MOHSelectValue.plant, this.cacheC0EchartOption);
        this.MPEchartOption = this.pushPlantToEcharts(this.MOHSelectValue.plant, this.cacheMPEchartOption);
        this.addColor(this.MOHSelectValue.plant);
      }
    }
  }

  // 客戶下拉框 值改變, 清空 ProjectCode, ProjectName的值
  changeCustomAndModelType() {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.proCode = '';
      this.workSelectValue.proName = '';
      this.workQuerySelect.proCode.selectList = [];
      this.workQuerySelect.proName.selectList = [];
      this.workSelectValue.model = '';
      this.workQuerySelect.model.selectList = [];
    } else {
      this.MOHSelectValue.proCode = '';
      this.MOHSelectValue.proName = '';
      this.MOHQuerySelect.proCode.selectList = [];
      this.MOHQuerySelect.proName.selectList = [];
      this.MOHSelectValue.model = '';
      this.MOHQuerySelect.model.selectList = [];
    }
    this.proNameSearch('');
  }

  // cFlow值改變
  changeCFlow() {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workSelectValue.proCode = '';
      this.workQuerySelect.proCode.selectList = [];
    } else {
      this.MOHSelectValue.proCode = '';
      this.MOHQuerySelect.proCode.selectList = [];
    }
  }

  // ProjectCode下拉框 值改變, 清空ProjectName的值
  changeProName(value) {
    let selectValue;
    let querySelect;
    if (this.isWorkOrMOH === workOrMOH.work) {
      selectValue = this.workSelectValue;
      querySelect = this.workQuerySelect;
    } else {
      selectValue = this.MOHSelectValue;
      querySelect = this.MOHQuerySelect;
    }
    if (!selectValue.proName) {
      selectValue.proCode = '';
      querySelect.proCode.selectList = [];
      selectValue.model = '';
      querySelect.model.selectList = [];
      return;
    }
    const projectCode = querySelect.proName.selectList.find(
      (item) => {
        if (item.Value === value) {
          return item;
        }
      });
    this.dfcCommonService.getProjectCodeProfile([projectCode.ProjectCodeID]).pipe(
      map(
        (projectCodeData: any) => {
          projectCodeData = projectCodeData.map(
            (item) => {
              item.Value = item.ProjectCodeID;
              item.Label = item.ProjectCode;
              return item;
            }
          );
          selectValue.proCode = projectCodeData[0].ProjectCodeID;
          querySelect.proCode.selectList = projectCodeData;

        }
      )).subscribe();
    this.modelSearch('');
  }

  // Project Name搜索功能
  proNameSearch(value: string): void {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workQuerySelect.proName.isLoading = true;
      this.workQuerySelect.proName.searchChange$.next(value);
    } else {
      this.MOHQuerySelect.proName.isLoading = true;
      this.MOHQuerySelect.proName.searchChange$.next(value);
    }
  }

  // Model Name搜索功能
  modelSearch(value: string): void {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workQuerySelect.model.isLoading = true;
      this.workQuerySelect.model.searchChange$.next(value);
    } else {
      this.MOHQuerySelect.model.isLoading = true;
      this.MOHQuerySelect.model.searchChange$.next(value);
    }
  }

  // custom搜索功能
  customSearch(value: string): void {
    if (this.isWorkOrMOH === workOrMOH.work) {
      this.workQuerySelect.custom.isLoading = true;
      this.workQuerySelect.custom.searchChange$.next(value);
    } else {
      this.MOHQuerySelect.custom.isLoading = true;
      this.MOHQuerySelect.custom.searchChange$.next(value);
    }
  }

  async queryWorkHour(expandArr: any[], limit?: { limit: number, plant: string }) {
    // 根據獲取的產品擁有的實際製程的並集，排序出製程順序
    this.queryLoading.workhourQueryLoading = true;
    this.dfcCommonService.getProcess(((!!limit && !!limit.plant) ? limit.plant : this.workSelectValue.plant), this.workSelectValue.modelType).subscribe(processSetArr => {
      this.processSetArr = processSetArr;
      const processCodeArr: string[] = this.processSetArr.map(item => item['processCode']);
      this.processHeaders = this.dfcSummaryService.filterAndSortProcess(this.oldProcessHeaders, processCodeArr);
      this.dfcSummaryService.queryTable(this.workSelectValue, limit, { type: 'workhour', expandArr: expandArr, processHeaders: this.processHeaders }).then(dataSet => {
        this.dataSet = dataSet;
        this.queryLoading.workhourQueryLoading = false;
      });
    });
  }

  async mohQuery(limit?: { limit: number, plant: string }) {
    this.queryLoading.mohQueryLoading = true;
    this.dfcSummaryService.queryTable(this.MOHSelectValue, limit, { type: 'moh' }).then(dataSet => {
      this.mohDataSet = dataSet;
      this.queryLoading.mohQueryLoading = false;
      this.MOHSelectValue.cFlow = [];
    });
  }

  // 下載資料
  download() {
    if (this.selectedTab === 0) {
      const table = document.getElementById('dfcSummaryWorkDown');
      this.downExcelService.exportTableAsExcelFile(table, 'summary-workhour');
    } else {
      const table = document.getElementById('dfcSummaryMohDown');
      this.downExcelService.exportTableAsExcelFile(table, 'summary-moh');
    }
  }
}
