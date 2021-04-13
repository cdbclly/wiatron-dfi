import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DfcKpiQueryStyle, DfcKpiQuerySelect, ClsDfcKpiSelect } from './workhour-report';
import { WorkhourReportService, DFCTargetHourTableData } from './workhour-report.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-workhour-report',
  templateUrl: './workhour-report.component.html',
  styleUrls: ['./workhour-report.component.scss']
})
export class WorkhourReportComponent implements OnInit {
  @ViewChild('DFCWorkhourReviewReport') dfcWorkhourReviewReport: ElementRef;
  tableHeight;
  queryDetailStageID;
  queryDetailProcess;
  page = 'first';
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  loadingshow = false;
  count = 0;
  datas;
  target;
  allpro;
  rfqID;
  frist = true;
  second = false;
  value;
  nzScroll: {} = { x: '1380px' };
  queryStyle = DfcKpiQueryStyle;
  querySelect = DfcKpiQuerySelect;
  nzWidthConfig = [];
  nzWidthConfigs: any = {};
  dataSet = [];
  aaaa = [];
  dataSetwindow = [];
  datafittle = [];
  dataunfittle = [];
  // 下拉框传值
  DFCTargetHourTableData: DFCTargetHourTableData;
  plantSelectValue;
  selectValue: ClsDfcKpiSelect = {
    plant: '',
    custom: '',
    modelType: '',
    Process: '',
    proCode: [],
    modelName: [],
    proName: [],
    cFlow: [],
  };

  datatot1 = {};
  datatot2 = [];
  gapTable: Array<DFCTargetHourTableData> = []; // 差异项的数据
  isTableLoading = false; // 设置细项展示按钮是否为加载状态
  isItemOrGap = true; // 是否为差异项/细项, false --- 细项, true --- 差异项
  secondQueryDatas: Array<DFCTargetHourTableData> = []; // 第二页的数据暂存
  itemTable = []; // 细项的数据
  defultDueDay = new Date().toLocaleDateString();
  saveFlag = false; // 存儲標記--為了讓存的時候不會再去變化現有表格, 實現表格固定
  editFlag = false; // 編輯狀態標誌 -- 編輯時顯示  是否變更項
  sendEmailLoading = false; // 設置Email發送按鈕 是否為加載狀態.  -- 點擊按鈕, 1分鐘后才可以再次點擊
  // 文件上傳下載相關
  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  // echart
  optionsFirst: {};
  optionsSecond: {};
  FirstEchartParam = {
    legendData: [],
    series: []
  };
  queryDetail;
  stageID: string[];
  proCodeID: string[];
  process: string;
  proCode: string[];
  proName: string[];
  cFlow: string[];
  gapList: {
    value: number,
    name: string
  }[] = [];
  gapValue: number[] = [];
  gapOthers = 0;
  processTarget: string; // 第二頁中 頁面上的 製程顯示
  dateFormat = 'yyyy/MM/dd'; // 日期格式显示
  // 表格
  listOfStatusSelectOption = [
    { Value: 0, Label: 'Open' },
    { Value: 1, Label: 'Ongoing' },
    { Value: 2, Label: 'Close' }
  ];
  timeFlag = 'a';
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['TargetOperation'];

  // 所有的project Name
  tempProjectNameList = [];
  cacheProNameSearchList = [];
  cacheModelNameSearchList = [];

  constructor(
    private workhourReportService: WorkhourReportService,
    private route: ActivatedRoute,
    private dfcSelectService: DfcSelectNewService,
    private dfcCommonService: DfcCommonService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'dfq.dfq-cflow']).subscribe(res => {
      DfcKpiQueryStyle.plant.label = res['mrr.mrr-plant'];
      DfcKpiQueryStyle.custom.label = res['mrr.mrr-customer'];
      DfcKpiQueryStyle.modelType.label = res['mrr.mrr-product'];
      DfcKpiQueryStyle.cFlow.label = res['dfq.dfq-cflow'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'dfq.dfq-cflow']).subscribe(res => {
        DfcKpiQueryStyle.plant.label = res['mrr.mrr-plant'];
        DfcKpiQueryStyle.custom.label = res['mrr.mrr-customer'];
        DfcKpiQueryStyle.modelType.label = res['mrr.mrr-product'];
        DfcKpiQueryStyle.cFlow.label = res['dfq.dfq-cflow'];
      });
    });
    this.querySelect.proCode.selectDisabled = true;
    this.tableHeight = (this.dfcWorkhourReviewReport.nativeElement.offsetHeight - 240) + 'px';
    this.route.params.subscribe(r => {
      if (r.stageID && r.process) {
        this.QueryDetail(r.stageID, r.process);
      }
    });
    this.route.queryParams.subscribe(queryParams => {
      if (!!queryParams.stage && !!queryParams.modelID && queryParams.process) {
        this.workhourReportService.queryStage(queryParams.stage, queryParams.modelID).subscribe(stageData => {
          this.QueryDetail(stageData[0].StageID, queryParams.process);
        });
      }
    })
    // ---- start ----
    this.initPlantSelect();
    this.initCustomSelect();
    this.initModelTypeSelect();
    this.initProcessSelect();
    this.initProNameSelect();
    this.initModelNameSelect();
    // --- end----
    this.nzWidthConfigs = {
      nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '200px',
        '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px', '120px', '120px', '120px',
        '120px', '150px', '100px'],
      nzScroll: { x: '2870px', y: '1000px' }
    };
    this.nzWidthConfig = this.nzWidthConfigs.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.nzScroll;
  }

  QueryDetail(stageID, process) {
    this.queryDetailStageID = stageID;
    this.queryDetailProcess = process;
    this.page = 'second';
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.querySelect.plant.selectList = [];  // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => {
      this.querySelect.plant.selectList = data;
      this.getStagePlant();
    });
    // 对厂别自动带入本厂的标签
    this.selectValue.plant = localStorage.getItem('DFC_Plant');
    // 獲取初始的廠名
    this.plantSelectValue = [];
    this.plantSelectValue.push(localStorage.getItem('DFC_Plant'));
    this.changePlant();
  }

  // 廠別下拉框選中改變后, 清空其他选则值 -- 客户, ProjectCode, ProjectName, 并重新查詢出 客戶的列表
  changePlant() {
    this.selectValue.custom = null;
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.getStagePlant();
    this.searchProjectNameList(this.selectValue.plant).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            [],
            [this.selectValue.custom],
            [this.selectValue.modelType],
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData: any) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];
          this.querySelect.proName.isLoading = false;
          this.querySelect.proName.selectDisabled = false;
        }
      )).subscribe();
    if (!!this.selectValue.plant) {
      this.customSearch('');
    }
  }

  // 初始化 客戶 下拉框
  initCustomSelect() {
    this.querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!this.selectValue.plant) {
        return this.workhourReportService.getProCodeCustom(custom, this.selectValue.plant).pipe(map((list: any) => {
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
    const customList$: Observable<string[]> = this.querySelect.custom.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));
    customList$.subscribe(datas => {
      this.querySelect.custom.selectList = datas.filter(data => {
        return !(!data);
      });
      this.querySelect.custom.isLoading = false;
    });
  }

  customSearch(value: string): void {
    this.querySelect.custom.isLoading = true;
    this.querySelect.custom.searchChange$.next(value);
  }

  // 客戶下拉框 值改變, 清空 ProjectCode, ProjectName的值
  changeCustom() {
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.querySelect.modelType.selectDisabled = false;
    this.dfcCommonService.filterProjectName(
      [],
      [this.selectValue.custom],
      [this.selectValue.modelType],
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
  }

  // 產品下拉框值改變的影響
  changeModelType() {
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.dfcCommonService.filterProjectName(
      [],
      [this.selectValue.custom],
      [this.selectValue.modelType],
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];
          this.querySelect.proName.selectDisabled = false;
        }
      )
    ).subscribe();
  }

  // 初始化產品下拉框
  initModelTypeSelect() {
    this.querySelect.modelType.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.querySelect.modelType.selectList = datas;
    });
  }

  // 初始化製程下拉框
  initProcessSelect() {
    this.querySelect.Process.selectList = [];
    this.workhourReportService.getProcess().subscribe(datas => {
      datas.forEach(data => {
        this.querySelect.Process.selectList.push({ Value: data['ProcessCode'], Label: data['Name'] });
      });
    });
  }

  // 初始化 proName 下拉框
  initProNameSelect() {
    const getProNameList = (proName: string) => {
      if (!!this.selectValue.plant) {
        return of(proName);
      }
    };
    const getProNameList$: Observable<string> = this.querySelect.proName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProNameList));
    getProNameList$.subscribe(datas => {
      this.querySelect.proName.selectList = this.cacheProNameSearchList.filter(d => d.Label.includes(datas));
      this.querySelect.proName.isLoading = false;
    });
  }

  proNameSearch(value: string) {
    this.querySelect.proName.isLoading = true;
    this.querySelect.proName.searchChange$.next(value);
  }

  changeProName(value) {
    this.querySelect.proName.selectList = [...this.cacheProNameSearchList];
    if (value.length === 0) {
      this.selectValue.proCode = null;
      this.querySelect.proCode.selectList = [];
      this.selectValue.modelName = [];
      this.querySelect.modelName.selectList = [];
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
          projectCodeData = projectCodeData.map(
            (item) => {
              item.Value = item.ProjectCodeID;
              item.Label = item.ProjectCode;
              return item;
            }
          );
          this.selectValue.proCode = projectCodeData.map(item => item.ProjectCodeID);
          this.querySelect.proCode.selectList = projectCodeData;
          this.querySelect.cFlow.selectDisabled = false;
        }
      )).subscribe();
    this.dfcCommonService.getMappingModelName(value).subscribe(x => {
      const modelNames = x.filter(y => y.type === 1);
      const list = modelNames.map(y => ({ Value: y.modelId, Label: y.modelName }));
      this.querySelect.modelName.selectList = list;
      this.cacheModelNameSearchList = [...modelNames];
      const modelReduce = modelNames.reduce((p, t) => {
        if (!p['projectNameModel'][t['projectNameId']]) {
          p['projectNameModel'][t['projectNameId']] = t['modelId'];
        }
        if (!p['res'][t['modelId']]) {
          p['res'][t['modelId']] = t;
        }
        p['modelID'].push(t['modelId']);
        return p;
      }, { 'projectNameModel': {}, 'res': {}, 'modelID': [] });
      this.selectValue.modelName = this.selectValue.modelName.filter(d => modelReduce['modelID'].includes(d));
      this.selectValue.modelName.forEach(d => {
        delete modelReduce['projectNameModel'][modelReduce['res'][d]['projectNameId']];
      });
      for (const proName in modelReduce['projectNameModel']) {
        if (modelReduce['projectNameModel'].hasOwnProperty(proName)) {
          const modelId = modelReduce['projectNameModel'][proName];
          this.selectValue.modelName.push(modelId);
        }
      }
    });
    this.querySelect.modelName.selectDisabled = false;
  }

  // 初始化 modelName 下拉框
  initModelNameSelect() {
    const getModelNameList = (modelName: string) => {
      if (!!this.selectValue.proName) {
        return of(modelName);
      } else {
        return of('');
      }
    };
    const getModelNameList$: Observable<string> = this.querySelect.modelName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelNameList));
    getModelNameList$.subscribe(datas => {
      this.querySelect.modelName.selectList = this.cacheModelNameSearchList.filter(d => d.Label.includes(datas));
      this.querySelect.modelName.isLoading = false;
    });
  }

  modelNameSearch(value: string) {
    this.querySelect.modelName.isLoading = true;
    this.querySelect.modelName.searchChange$.next(value);
  }

  changeModel(value) {
    this.querySelect.modelName.selectList = [...this.cacheModelNameSearchList];
  }

  getStagePlant() {
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    const addStage = [{ Value: 'C0', Label: 'C0' }, { Value: 'C1', Label: 'C1' }];
    if (stageShowFlag) {
      if (this.querySelect.cFlow.selectList.length < 7) {
        this.querySelect.cFlow.selectList.splice(0, 0, ...addStage);
      }
    } else {
      if (this.querySelect.cFlow.selectList.length === 7) {
        this.querySelect.cFlow.selectList.splice(0, 2);
      }
    }
  }

  async query() {
    this.loadingshow = true;
    if (this.timeFlag === 'b') {
      return;
    }
    if (this.selectValue.modelName.length === 0 || this.selectValue.cFlow.length === 0) {
      return;
    }
    this.timeFlag = 'b';
    this.datas = await this.workhourReportService.getTime(this.selectValue.modelName, this.selectValue.cFlow);
    const totledatas = this.getStage();
    let target = [];
    for (const key in totledatas['target']) {
      if (totledatas['target'].hasOwnProperty(key)) {
        const a = totledatas['target'][key];
        if (a !== 0) {
          target = totledatas['target'][key];
        }
      }
    }
    totledatas['target'] = target;
    await this.getOptionsFirst(totledatas);
    // 初始化并獲取製程值
    this.timeFlag = 'a';
    this.loadingshow = false;
  }

  getStage() {
    const totledatas = this.datas.reduce((p, t) => {
      p['stageID'].push(t['stageID']);
      p['Stage'].push(t['Stage']);
      p['time'].push(t['time']);
      p['target'].push(t['target']);
      p['projectName'].push(t['projectName']);
      p['Process'].push(t['Process']);
      return p;
    }, { 'stageID': [], 'Stage': [], 'time': [], 'target': [], 'projectName': [], 'Process': [] });
    const aaa = [];
    for (let index = (totledatas['projectName'].length - 1); index >= 0; index--) {
      aaa.unshift(totledatas['Stage'][index] + ' ' + totledatas['projectName'][index]);
    }
    totledatas['Process'].forEach(element => {
      if (element.findIndex(x => x == 'Total') === -1) {
        element.push('Total');
      }
    });
    totledatas.time.forEach(data => {
      data.push(data.reduce((a, b) => a + b));
    });
    totledatas['allName'] = aaa;
    return totledatas;
  }

  getOptionsFirst(data) {
    this.dfcCommonService.getProcess(this.selectValue.plant, this.selectValue.modelType).pipe(
      map(
        (process: any) => {
          const allpro = this.querySelect.Process['selectList'];
          // X軸標籤
          const xside = [];
          if (process.length > 0) {
            process[0].processCode.split(',').forEach(
              item => {
                const includeItem = allpro.find(
                  (findItem) => {
                    return findItem.Value === item;
                  }
                );
                if (includeItem) {
                  xside.push({ Label: includeItem.Label, Value: includeItem.Value });
                }
              }
            );
          } else {
            allpro.forEach(element => {
              xside.push({ Label: element.Label, Value: element.Value });
            });
          }
          xside.push({ Label: 'Total', Value: 'Total' });
          const groupByProcess = [];
          xside.forEach(process => {
            const bbb = [];
            for (let m = 0; m < data.Process.length; m++) {
              for (let n = 0; n < data.Process[0].length; n++) {
                if (process.Value === data.Process[m][n]) {
                  bbb.push({
                    process: process.Value,
                    time: data.time[m][n]
                  });
                }
              }
            }
            groupByProcess.push(bbb);
          });
          groupByProcess.forEach(element => {
            if (element.length === 0) {
              element.push({ time: 0 }, { time: 0 }, { time: 0 }, { time: 0 },
                { time: 0 }, { time: 0 }, { time: 0 }, { time: 0 }, { time: 0 }, { time: 0 });
            }
          });
          const colorList = [
            'rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgb(0, 102, 255)', 'rgb(34, 107, 218)', 'rgb(0, 69, 173)',
            'rgb(2, 50, 121)', 'rgb(44, 81, 138)', 'rgb(24, 54, 100)', 'rgb(115, 156, 218)', 'rgb(121, 124, 129)'
          ];
          //每個製程
          for (let j = 0; j < data.Process.length; j++) {
            const newTime = [];
            groupByProcess.forEach(processTime => {
              newTime.push(processTime[j].time);
            });
            data.time[j] = newTime;
          }
          let i = 0;
          this.FirstEchartParam.legendData = [];
          this.FirstEchartParam.series = [];
          data.allName.forEach(tempData => {
            const index = i;
            this.FirstEchartParam.legendData.push(tempData);
            this.FirstEchartParam.series[index] = {
              stageID: data['stageID'][index],
              proCodeID: tempData.proCodeID,
              name: tempData,
              target: data.target[0],
              type: 'bar',
              itemStyle: {
                normal: {
                  color: colorList[index],
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value.toFixed(2);
                    }
                  }
                }
              },
              data: data.time[index]
            };
            i++;
          });
          this.optionsFirst = {
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(255,255,255,0.7)',
              textStyle: {
                color: 'black'
              },
              axisPointer: {
                type: 'shadow',
              },
              formatter: function (p) {
                return p.seriesName + ' ' + p.value.toFixed(2);
              }
            },
            legend: {
              x: 'center',
              y: 'bottom',
              data: data.allName
            },
            calculable: true,
            grid: {
              x: '3%',
              y: '10%',
              x2: '3%',
              y2: '10%',
              containLabel: true
            },
            xAxis: [
              {
                axisLabel: {
                  show: true,
                  rotate: 315
                },
                type: 'category',
                data: xside.map(item => item.Label)
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.FirstEchartParam.series
          };
        }
      )
    ).subscribe();
  }

  onChartEvent(event: any, type: string) {
    if (event['name'] === 'Total') {
      return;
    }
    let aaa = [];
    this.stageID = this.optionsFirst['series'][event['seriesIndex']]['stageID'];
    aaa = event['seriesName'].split(' ');
    this.proCodeID = this.selectValue.proCode;
    this.cFlow = aaa[0];
    this.proName = aaa[1];
    this.process = event['name'];
    this.frist = false;
    this.second = true;
    this.value = event['value'];
    this.QueryDetail(this.stageID, this.querySelect.Process.selectList.find(x => x.Label === this.process).Value);
  }

  clickSwitch() {
    this.page = 'first';
  }

  // 獲取表格數據
  queryTable() {
    this.dataSet = [];
    this.dataSetwindow = [];
    let datas: Array<DFCTargetHourTableData> = [];
    datas = this.datatot1['dataset'];
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
        tables.forEach((table) => {
          this.dataSet = [...this.dataSet, {
            Plant: table.Plant,
            ModelOperationID: table.ModelOperationID,
            Material: table.cxMaterial,
            FactorID: table.cxFactorID,
            Factor: table.cxFactor,
            Count: table.cxCount,
            Comment: table.cxComment,
            improve: table.cximprove,
            aimTime: table.rfqTargetCount * table.rfqCostTimeTarget,
            aimdes: table.rfqTargetFactorDetail,
            aimnum: table.rfqTargetCount,
            aimTime2: table.rfqCostTimeTarget,
            nowTime: table.cxTargetCount * table.cxCostTimeTarget,
            nowdes: table.cxTargetFactorDetail,
            nownum: table.cxTargetCount,
            nowTime2: table.cxCostTimeTarget,
            RFQTime: table.rfqCount * table.rfqCostTimeActural,
            RFQdes: table.rfqFactorDetailActural,
            RFQnum: table.rfqCount,
            RFQTime2: table.rfqCount * table.rfqCostTimeActural,
            gap: table.cxgap,
            gapCost: table.cxgapCost,
            TargetFactorDetailCode: table.cxTargetFactorDetailCode,
            TargetFactorDetail: table.cxTargetFactorDetail,
            TargetCount: table.cxTargetCount,
            CostTimeTarget: table.cxCostTimeTarget * table.cxTargetCount,
            PICID: table.cxPICID,
            PICName: table.cxPICName,
            Status: table.cxStatus,
            DueDay: (table.cxDueDay === null) ? '' : new Date(table.cxDueDay).toLocaleDateString(),
            BOMCost: table.cxBOMCost
          }];
        });
      }
    }
    this.isTableLoading = false;
    this.aaaa = this.dataSet.reduce((p, t) => {
      if (!p[t['Material']]) {
        p[t['Material']] = {};
      }
      if (!p[t['Material']][t['Factor']]) {
        p[t['Material']][t['Factor']] = {
          Plant: t.Plant,
          ModelOperationID: t.ModelOperationID,
          Material: t.Material,
          FactorID: t.FactorID,
          Factor: t.Factor,
          Count: t.Count,
          Comment: t.Comment,
          improve: t.improve,
          aimTime: t.aimTime,
          aimdes: t.aimdes,
          aimnum: t.aimnum,
          aimTime2: t.aimTime2,
          nowTime: t.nowTime,
          nowdes: t.nowdes,
          nownum: t.nownum,
          nowTime2: t.nowTime2,
          RFQTime: t.RFQTime,
          RFQdes: t.RFQdes,
          RFQnum: t.RFQnum,
          RFQTime2: t.RFQTime2,
          gap: t.gap,
          gapCost: t.gapCost,
          TargetFactorDetailCode: t.TargetFactorDetailCode,
          TargetFactorDetail: t.TargetFactorDetail,
          TargetCount: t.TargetCount,
          CostTimeTarget: t.CostTimeTarget,
          PICID: t.PICID,
          PICName: t.PICName,
          Status: t.Status,
          DueDay: (t.DueDay === null) ? '' : new Date(t.DueDay).toLocaleDateString(),
          BOMCost: t.BOMCost,
          RFQ: [],
          NOW: [],
          AIM: []
        };
      }
      // RFQ 工時
      if (!!t['nowdes'] || !!t['nownum'] || !!t['nowTime2']) {
        p[t['Material']][t['Factor']]['RFQ'].push({ RFQTime2: t['RFQTime2'], RFQnum: t['RFQnum'], RFQdes: t['RFQdes'] });
      }
      p[t['Material']][t['Factor']]['RFQTime'] = 0;
      for (let i = 0; i < p[t['Material']][t['Factor']]['RFQ'].length; i++) {
        p[t['Material']][t['Factor']]['RFQTime'] += p[t['Material']][t['Factor']]['RFQ'][i]['RFQTime2'] * p[t['Material']][t['Factor']]['RFQ'][i]['RFQnum'];
      }
      if (!!t['nowdes'] || !!t['nownum'] || !!t['nowTime2']) {
        p[t['Material']][t['Factor']]['NOW'].push({ nowTime2: t['nowTime2'], nownum: t['nownum'], nowdes: t['nowdes'] });
      }
      p[t['Material']][t['Factor']]['nowTime'] = 0;
      for (let i = 0; i < p[t['Material']][t['Factor']]['NOW'].length; i++) {
        p[t['Material']][t['Factor']]['nowTime'] += p[t['Material']][t['Factor']]['NOW'][i]['nowTime2'] * p[t['Material']][t['Factor']]['NOW'][i]['nownum'];
      }
      if (!!t['aimdes'] || !!t['aimnum'] || !!t['aimTime2']) {
        p[t['Material']][t['Factor']]['AIM'].push({ aimdes: t['aimdes'], aimnum: t['aimnum'], aimTime2: t['aimTime2'] });
      }
      p[t['Material']][t['Factor']]['aimTime'] = 0;
      for (let i = 0; i < p[t['Material']][t['Factor']]['AIM'].length; i++) {
        p[t['Material']][t['Factor']]['aimTime'] += p[t['Material']][t['Factor']]['AIM'][i]['aimTime2'] * p[t['Material']][t['Factor']]['AIM'][i]['aimnum'];
      }
      return p;
    }, {});
    this.dataSetwindow = [];
    for (const key in this.aaaa) {
      if (this.aaaa.hasOwnProperty(key)) {
        const dada = this.aaaa[key];
        for (const key2 in dada) {
          if (dada.hasOwnProperty(key2)) {
            const datadddd = dada[key2];
            for (let i = 0; i < datadddd.RFQ.length; i++) {
              this.count += datadddd.RFQ[i];
            }
            this.dataSetwindow.push(datadddd);
          }
        }
      }
    }
    this.datafittle = this.dataSetwindow;
    this.dataunfittle = this.dataSetwindow.filter(data => {
      if (!(data['NOW'].length > 0 || data['AIM'].length > 0)) {
        return data;
      }
    });
  }

  // 展示细项 或者 显示差异项
  showTableItem() {
    this.isItemOrGap = (this.isItemOrGap === true) ? false : true;
    this.saveFlag = false;
    this.datafittle = (this.datafittle === this.dataunfittle) ? this.dataSetwindow : this.dataunfittle;
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
